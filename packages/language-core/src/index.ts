export * from './types.js';
export { parseProgram, parseStatement, parseExpression } from './parser/index.js';
export { checkProgram } from './checker/index.js';
export { evaluateProgram } from './evaluator/index.js';
export {
  renderStatement,
  renderProgram,
  translateSource,
  type OutputTarget,
} from './translator/index.js';

import { parseProgram } from './parser/index.js';
import { checkProgram } from './checker/index.js';
import { evaluateProgram } from './evaluator/index.js';
import { ExecutionResult } from './types.js';

/**
 * High-level one-step execution of NP-LANG source code:
 * Runs parse -> semantic check -> evaluator
 */
export function runNplang(source: string): ExecutionResult {
  const { program, errors: parseErrors } = parseProgram(source);
  if (parseErrors.length > 0) {
    return {
      success: false,
      output: [],
      trace: [],
      variables: {},
      errors: parseErrors,
    };
  }

  const checkErrors = checkProgram(program);
  if (checkErrors.length > 0) {
    return {
      success: false,
      output: [],
      trace: [],
      variables: {},
      errors: checkErrors,
    };
  }

  return evaluateProgram(program);
}
