import {
  Program,
  Statement,
  Expression,
  ExecutionResult,
  ExecutionStep,
  Diagnostic,
} from '../types.js';

export function evaluateProgram(program: Program): ExecutionResult {
  const output: string[] = [];
  const trace: ExecutionStep[] = [];
  const variables: Record<string, any> = {};
  const errors: Diagnostic[] = [];

  let stepCount = 0;
  const MAX_REPEAT_LIMIT = 500;

  function evaluateExpression(expr: Expression): any {
    switch (expr.type) {
      case 'NumberLiteral':
        return expr.value;
      case 'StringLiteral':
        return expr.value;
      case 'BooleanLiteral':
        return expr.value;
      case 'Identifier':
        if (!(expr.name in variables)) {
          throw new Error(`Runtime error: variable '${expr.name}' is undefined.`);
        }
        return variables[expr.name];
      case 'BinaryExpression': {
        const left = evaluateExpression(expr.left);
        const right = evaluateExpression(expr.right);
        switch (expr.operator) {
          case '+':
            return left + right;
          case '-':
            return left - right;
          case '*':
            return left * right;
          case '/':
            if (right === 0) throw new Error('Runtime error: division by zero');
            return left / right;
          case '>':
            return left > right;
          case '<':
            return left < right;
          case '>=':
            return left >= right;
          case '<=':
            return left <= right;
          case '==':
            return left === right;
          case '!=':
            return left !== right;
          default:
            throw new Error(`Unknown operator: ${expr.operator}`);
        }
      }
      default:
        throw new Error(`Unknown expression type: ${(expr as any).type}`);
    }
  }

  function formatExpr(expr: Expression): string {
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
        return `${formatExpr(expr.left)} ${expr.operator} ${formatExpr(expr.right)}`;
      default:
        return '';
    }
  }

  function executeStatement(stmt: Statement) {
    stepCount++;

    switch (stmt.type) {
      case 'VariableDeclaration': {
        const val = evaluateExpression(stmt.value);
        variables[stmt.id] = val;
        trace.push({
          stepNumber: stepCount,
          description: `Created variable '${stmt.id}' with value ${JSON.stringify(val)}.`,
          codeSnippet: `let ${stmt.id} = ${formatExpr(stmt.value)}`,
          line: stmt.line,
          variables: { ...variables },
        });
        break;
      }

      case 'AssignmentStatement': {
        const oldVal = variables[stmt.id];
        const val = evaluateExpression(stmt.value);
        variables[stmt.id] = val;
        trace.push({
          stepNumber: stepCount,
          description: `Changed '${stmt.id}' from ${JSON.stringify(oldVal)} to ${JSON.stringify(val)}.`,
          codeSnippet: `${stmt.id} = ${formatExpr(stmt.value)}`,
          line: stmt.line,
          variables: { ...variables },
        });
        break;
      }

      case 'PrintStatement': {
        const val = evaluateExpression(stmt.expression);
        const displayVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
        output.push(displayVal);
        trace.push({
          stepNumber: stepCount,
          description: `Displayed: ${displayVal}`,
          codeSnippet: `show ${formatExpr(stmt.expression)}`,
          line: stmt.line,
          variables: { ...variables },
        });
        break;
      }

      case 'IfStatement': {
        const condResult = Boolean(evaluateExpression(stmt.condition));
        trace.push({
          stepNumber: stepCount,
          description: `Evaluated condition (${formatExpr(stmt.condition)}) as ${condResult}.`,
          codeSnippet: `if ${formatExpr(stmt.condition)}:`,
          line: stmt.line,
          variables: { ...variables },
        });
        if (condResult) {
          for (const s of stmt.thenBranch) {
            executeStatement(s);
          }
        } else if (stmt.elseBranch) {
          for (const s of stmt.elseBranch) {
            executeStatement(s);
          }
        }
        break;
      }

      case 'RepeatStatement': {
        const count = Math.min(Number(evaluateExpression(stmt.count)) || 0, MAX_REPEAT_LIMIT);
        trace.push({
          stepNumber: stepCount,
          description: `Starting loop to repeat ${count} time(s).`,
          codeSnippet: `repeat ${count}:`,
          line: stmt.line,
          variables: { ...variables },
        });
        for (let i = 0; i < count; i++) {
          for (const s of stmt.body) {
            executeStatement(s);
          }
        }
        break;
      }
    }
  }

  try {
    for (const stmt of program.body) {
      executeStatement(stmt);
    }
    return {
      success: true,
      output,
      trace,
      variables,
      errors: [],
    };
  } catch (err: any) {
    errors.push({
      line: 1,
      column: 1,
      message: err.message || 'Execution error',
      severity: 'error',
    });
    return {
      success: false,
      output,
      trace,
      variables,
      errors,
    };
  }
}
