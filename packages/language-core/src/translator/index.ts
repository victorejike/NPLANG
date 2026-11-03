import {
  Program,
  Statement,
  Expression,
  BinaryExpression,
  Dialect,
} from '../types.js';
import { parseProgram } from '../parser/index.js';

export type OutputTarget = Dialect | 'ai-ast';

function renderExprConcise(expr: Expression): string {
  switch (expr.type) {
    case 'NumberLiteral':
      return String(expr.value);
    case 'StringLiteral':
      return `"${expr.value}"`;
    case 'BooleanLiteral':
      return String(expr.value);
    case 'Identifier':
      return expr.name;
    case 'BinaryExpression':
      return `${renderExprConcise(expr.left)} ${expr.operator} ${renderExprConcise(expr.right)}`;
  }
}

function renderExprNaturalEn(expr: Expression): string {
  switch (expr.type) {
    case 'NumberLiteral':
      return String(expr.value);
    case 'StringLiteral':
      return `"${expr.value}"`;
    case 'BooleanLiteral':
      return String(expr.value);
    case 'Identifier':
      return expr.name;
    case 'BinaryExpression': {
      const left = renderExprNaturalEn(expr.left);
      const right = renderExprNaturalEn(expr.right);
      switch (expr.operator) {
        case '>':
          return `${left} is greater than ${right}`;
        case '<':
          return `${left} is less than ${right}`;
        case '>=':
          return `${left} is at least ${right}`;
        case '<=':
          return `${left} is at most ${right}`;
        case '==':
          return `${left} is equal to ${right}`;
        case '!=':
          return `${left} is not equal to ${right}`;
        case '+':
          return `${left} plus ${right}`;
        case '-':
          return `${left} minus ${right}`;
        case '*':
          return `${left} times ${right}`;
        case '/':
          return `${left} divided by ${right}`;
      }
    }
  }
}

function renderExprNaturalYo(expr: Expression): string {
  switch (expr.type) {
    case 'NumberLiteral':
      return String(expr.value);
    case 'StringLiteral':
      return `"${expr.value}"`;
    case 'BooleanLiteral':
      return String(expr.value);
    case 'Identifier':
      return expr.name;
    case 'BinaryExpression': {
      const left = renderExprNaturalYo(expr.left);
      const right = renderExprNaturalYo(expr.right);
      switch (expr.operator) {
        case '>':
          return `${left} bá ju ${right} lọ`;
        case '<':
          return `${left} kere ju ${right} lọ`;
        case '==':
          return `${left} dọ́gba pẹ̀lú ${right}`;
        case '!=':
          return `${left} kò dọ́gba pẹ̀lú ${right}`;
        case '+':
          return `${left} àti ${right}`;
        case '-':
          return `${left} yọ ${right}`;
        default:
          return `${left} ${expr.operator} ${right}`;
      }
    }
  }
}

function renderExprNaturalEs(expr: Expression): string {
  switch (expr.type) {
    case 'NumberLiteral':
      return String(expr.value);
    case 'StringLiteral':
      return `"${expr.value}"`;
    case 'BooleanLiteral':
      return String(expr.value);
    case 'Identifier':
      return expr.name;
    case 'BinaryExpression': {
      const left = renderExprNaturalEs(expr.left);
      const right = renderExprNaturalEs(expr.right);
      switch (expr.operator) {
        case '>':
          return `${left} es mayor que ${right}`;
        case '<':
          return `${left} es menor que ${right}`;
        case '>=':
          return `${left} es mayor o igual que ${right}`;
        case '<=':
          return `${left} es menor o igual que ${right}`;
        case '==':
          return `${left} es igual a ${right}`;
        case '!=':
          return `${left} no es igual a ${right}`;
        case '+':
          return `${left} más ${right}`;
        case '-':
          return `${left} menos ${right}`;
        case '*':
          return `${left} por ${right}`;
        case '/':
          return `${left} dividido entre ${right}`;
      }
    }
  }
}

export function renderStatement(stmt: Statement, target: Dialect): string {
  switch (target) {
    case 'concise':
      switch (stmt.type) {
        case 'VariableDeclaration':
          return `let ${stmt.id} = ${renderExprConcise(stmt.value)}`;
        case 'AssignmentStatement':
          return `${stmt.id} = ${renderExprConcise(stmt.value)}`;
        case 'PrintStatement':
          return `show ${renderExprConcise(stmt.expression)}`;
        case 'IfStatement': {
          const body = stmt.thenBranch.map((s) => renderStatement(s, 'concise')).join('; ');
          return `if ${renderExprConcise(stmt.condition)}: ${body}`;
        }
        case 'RepeatStatement': {
          const body = stmt.body.map((s) => renderStatement(s, 'concise')).join('; ');
          return `repeat ${renderExprConcise(stmt.count)}: ${body}`;
        }
      }

    case 'natural-en':
      switch (stmt.type) {
        case 'VariableDeclaration':
          if (stmt.value.type === 'NumberLiteral') {
            return `I have a number called ${stmt.id}. It is ${renderExprNaturalEn(stmt.value)}.`;
          }
          return `Create ${stmt.id} with value ${renderExprNaturalEn(stmt.value)}.`;

        case 'AssignmentStatement':
          // Check if it's an increment like: score = score + 5
          if (
            stmt.value.type === 'BinaryExpression' &&
            stmt.value.operator === '+' &&
            stmt.value.left.type === 'Identifier' &&
            stmt.value.left.name === stmt.id
          ) {
            return `Add ${renderExprNaturalEn(stmt.value.right)} to ${stmt.id}.`;
          }
          // Decrement like: score = score - 3
          if (
            stmt.value.type === 'BinaryExpression' &&
            stmt.value.operator === '-' &&
            stmt.value.left.type === 'Identifier' &&
            stmt.value.left.name === stmt.id
          ) {
            return `Subtract ${renderExprNaturalEn(stmt.value.right)} from ${stmt.id}.`;
          }
          return `Set ${stmt.id} to ${renderExprNaturalEn(stmt.value)}.`;

        case 'PrintStatement':
          return `Show ${renderExprNaturalEn(stmt.expression)}.`;

        case 'IfStatement': {
          const body = stmt.thenBranch.map((s) => renderStatement(s, 'natural-en')).join(' ');
          return `If ${renderExprNaturalEn(stmt.condition)}, ${body}`;
        }

        case 'RepeatStatement': {
          const body = stmt.body.map((s) => renderStatement(s, 'natural-en')).join(' ');
          return `Do this ${renderExprNaturalEn(stmt.count)} times: ${body}`;
        }
      }

    case 'natural-es':
      switch (stmt.type) {
        case 'VariableDeclaration':
          if (stmt.value.type === 'NumberLiteral') {
            return `Tengo un número llamado ${stmt.id}. Es ${renderExprNaturalEs(stmt.value)}.`;
          }
          return `Crear ${stmt.id} con valor ${renderExprNaturalEs(stmt.value)}.`;

        case 'AssignmentStatement':
          if (
            stmt.value.type === 'BinaryExpression' &&
            stmt.value.operator === '+' &&
            stmt.value.left.type === 'Identifier' &&
            stmt.value.left.name === stmt.id
          ) {
            return `Sumar ${renderExprNaturalEs(stmt.value.right)} a ${stmt.id}.`;
          }
          if (
            stmt.value.type === 'BinaryExpression' &&
            stmt.value.operator === '-' &&
            stmt.value.left.type === 'Identifier' &&
            stmt.value.left.name === stmt.id
          ) {
            return `Restar ${renderExprNaturalEs(stmt.value.right)} de ${stmt.id}.`;
          }
          return `Poner ${stmt.id} en ${renderExprNaturalEs(stmt.value)}.`;

        case 'PrintStatement':
          return `Mostrar ${renderExprNaturalEs(stmt.expression)}.`;

        case 'IfStatement': {
          const body = stmt.thenBranch.map((s) => renderStatement(s, 'natural-es')).join(' ');
          return `Si ${renderExprNaturalEs(stmt.condition)}, ${body}`;
        }

        case 'RepeatStatement': {
          const body = stmt.body.map((s) => renderStatement(s, 'natural-es')).join(' ');
          return `Repetir ${renderExprNaturalEs(stmt.count)} veces: ${body}`;
        }
      }

    case 'natural-yo':
      switch (stmt.type) {
        case 'VariableDeclaration':
          if (stmt.value.type === 'NumberLiteral') {
            return `Mo ní nọ́mbà kan tí à ń pè ní ${stmt.id}. Ó jẹ́ ${renderExprNaturalYo(stmt.value)}.`;
          }
          return `Jẹ ki ${stmt.id} jẹ ${renderExprNaturalYo(stmt.value)}.`;

        case 'AssignmentStatement':
          if (
            stmt.value.type === 'BinaryExpression' &&
            stmt.value.operator === '+' &&
            stmt.value.left.type === 'Identifier' &&
            stmt.value.left.name === stmt.id
          ) {
            return `Fi ${renderExprNaturalYo(stmt.value.right)} kún ${stmt.id}.`;
          }
          if (
            stmt.value.type === 'BinaryExpression' &&
            stmt.value.operator === '-' &&
            stmt.value.left.type === 'Identifier' &&
            stmt.value.left.name === stmt.id
          ) {
            return `Yọ ${renderExprNaturalYo(stmt.value.right)} kúrò nínú ${stmt.id}.`;
          }
          return `Sọ ${stmt.id} di ${renderExprNaturalYo(stmt.value)}.`;

        case 'PrintStatement':
          return `Fi ${renderExprNaturalYo(stmt.expression)} hàn.`;

        case 'IfStatement': {
          const body = stmt.thenBranch.map((s) => renderStatement(s, 'natural-yo')).join(' ');
          return `Bí ${renderExprNaturalYo(stmt.condition)}, ${body}`;
        }

        case 'RepeatStatement': {
          const body = stmt.body.map((s) => renderStatement(s, 'natural-yo')).join(' ');
          return `Ṣe èyí ní ẹ̀mẹwàá ${renderExprNaturalYo(stmt.count)}: ${body}`;
        }
      }
  }
}

export function renderProgram(program: Program, target: OutputTarget): string {
  if (target === 'ai-ast') {
    return JSON.stringify(program, null, 2);
  }
  return program.body.map((stmt) => renderStatement(stmt, target)).join('\n');
}

export function translateSource(source: string, target: OutputTarget): string {
  const { program, errors } = parseProgram(source);
  if (errors.length > 0) {
    throw new Error(`Cannot translate due to syntax errors:\n${errors.map((e) => e.message).join('\n')}`);
  }
  return renderProgram(program, target);
}
