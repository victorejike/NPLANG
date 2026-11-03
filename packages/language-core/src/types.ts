/**
 * Core type definitions for NP-LANG AST, Execution, and Diagnostics
 */

export type Dialect = 'concise' | 'natural-en' | 'natural-es' | 'natural-yo';

export type Operator = '+' | '-' | '*' | '/' | '>' | '<' | '>=' | '<=' | '==' | '!=';

export interface BaseNode {
  type: string;
  line?: number;
  column?: number;
}

export interface NumberLiteral extends BaseNode {
  type: 'NumberLiteral';
  value: number;
  raw: string;
}

export interface StringLiteral extends BaseNode {
  type: 'StringLiteral';
  value: string;
  raw: string;
}

export interface BooleanLiteral extends BaseNode {
  type: 'BooleanLiteral';
  value: boolean;
  raw: string;
}

export interface Identifier extends BaseNode {
  type: 'Identifier';
  name: string;
}

export interface BinaryExpression extends BaseNode {
  type: 'BinaryExpression';
  operator: Operator;
  left: Expression;
  right: Expression;
}

export type Expression =
  | NumberLiteral
  | StringLiteral
  | BooleanLiteral
  | Identifier
  | BinaryExpression;

export interface VariableDeclaration extends BaseNode {
  type: 'VariableDeclaration';
  id: string;
  value: Expression;
  inferredType: 'number' | 'string' | 'boolean';
}

export interface AssignmentStatement extends BaseNode {
  type: 'AssignmentStatement';
  id: string;
  value: Expression;
}

export interface PrintStatement extends BaseNode {
  type: 'PrintStatement';
  expression: Expression;
}

export interface IfStatement extends BaseNode {
  type: 'IfStatement';
  condition: Expression;
  thenBranch: Statement[];
  elseBranch?: Statement[];
}

export interface RepeatStatement extends BaseNode {
  type: 'RepeatStatement';
  count: Expression;
  body: Statement[];
}

export type Statement =
  | VariableDeclaration
  | AssignmentStatement
  | PrintStatement
  | IfStatement
  | RepeatStatement;

export interface Program extends BaseNode {
  type: 'Program';
  body: Statement[];
}

export interface Diagnostic {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  suggestion?: string;
}

export interface ExecutionStep {
  stepNumber: number;
  description: string;
  codeSnippet: string;
  line?: number;
  variables: Record<string, any>;
}

export interface ExecutionResult {
  success: boolean;
  output: string[];
  trace: ExecutionStep[];
  variables: Record<string, any>;
  errors: Diagnostic[];
}
