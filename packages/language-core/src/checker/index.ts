import {
  Program,
  Statement,
  Expression,
  BinaryExpression,
  Diagnostic,
} from '../types.js';

export function checkProgram(program: Program): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const declaredVariables = new Set<string>();

  function checkExpression(expr: Expression) {
    if (expr.type === 'Identifier') {
      if (!declaredVariables.has(expr.name)) {
        diagnostics.push({
          line: expr.line || 1,
          column: 1,
          message: `Variable '${expr.name}' has not been created yet.`,
          severity: 'error',
          suggestion: `Did you forget to declare it? Try: "let ${expr.name} = 10" or "I have a number called ${expr.name}. It is 10."`,
        });
      }
    } else if (expr.type === 'BinaryExpression') {
      checkExpression(expr.left);
      checkExpression(expr.right);

      // Check division by zero
      if (expr.operator === '/' && expr.right.type === 'NumberLiteral' && expr.right.value === 0) {
        diagnostics.push({
          line: expr.line || 1,
          column: 1,
          message: 'Cannot divide by zero.',
          severity: 'error',
          suggestion: 'Change the divisor to a non-zero number.',
        });
      }
    }
  }

  function checkStatement(stmt: Statement) {
    switch (stmt.type) {
      case 'VariableDeclaration':
        checkExpression(stmt.value);
        declaredVariables.add(stmt.id);
        break;

      case 'AssignmentStatement':
        if (!declaredVariables.has(stmt.id)) {
          diagnostics.push({
            line: stmt.line || 1,
            column: 1,
            message: `Cannot assign to '${stmt.id}' because it has not been created yet.`,
            severity: 'error',
            suggestion: `Create it first using: "let ${stmt.id} = 0" or "I have a number called ${stmt.id}."`,
          });
        }
        checkExpression(stmt.value);
        break;

      case 'PrintStatement':
        checkExpression(stmt.expression);
        break;

      case 'IfStatement':
        checkExpression(stmt.condition);
        for (const s of stmt.thenBranch) {
          checkStatement(s);
        }
        if (stmt.elseBranch) {
          for (const s of stmt.elseBranch) {
            checkStatement(s);
          }
        }
        break;

      case 'RepeatStatement':
        checkExpression(stmt.count);
        for (const s of stmt.body) {
          checkStatement(s);
        }
        break;
    }
  }

  for (const stmt of program.body) {
    checkStatement(stmt);
  }

  return diagnostics;
}
