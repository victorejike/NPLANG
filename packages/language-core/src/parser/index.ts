import {
  Program,
  Statement,
  Expression,
  VariableDeclaration,
  AssignmentStatement,
  PrintStatement,
  IfStatement,
  RepeatStatement,
  BinaryExpression,
  NumberLiteral,
  StringLiteral,
  BooleanLiteral,
  Identifier,
  Operator,
  Diagnostic,
} from '../types.js';

/**
 * Normalizes punctuation and cleans up trailing periods in sentences
 */
function cleanLine(line: string): string {
  let cleaned = line.trim();
  // Strip trailing period if any
  if (cleaned.endsWith('.')) {
    cleaned = cleaned.replace(/\.+$/, '').trim();
  }
  return cleaned;
}

/**
 * Parse an expression string into an AST Expression node.
 */
export function parseExpression(raw: string, line: number = 1): Expression {
  let s = raw.trim();

  // Strip trailing period if any
  if (s.endsWith('.')) {
    s = s.replace(/\.+$/, '').trim();
  }

  // Check for string literal
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return {
      type: 'StringLiteral',
      value: s.slice(1, -1),
      raw: s,
      line,
    } as StringLiteral;
  }

  // Check for boolean literal
  if (s.toLowerCase() === 'true' || s.toLowerCase() === 'false') {
    return {
      type: 'BooleanLiteral',
      value: s.toLowerCase() === 'true',
      raw: s,
      line,
    } as BooleanLiteral;
  }

  // Check for Yoruba comparisons: e.g., "score bá ju 10 lọ" or "score ju 10 lọ"
  const yoGtMatch = s.match(/^(.+?)\s+(?:bá\s+)?ju\s+(.+?)\s+lọ$/i);
  if (yoGtMatch) {
    return {
      type: 'BinaryExpression',
      operator: '>',
      left: parseExpression(yoGtMatch[1], line),
      right: parseExpression(yoGtMatch[2], line),
      line,
    } as BinaryExpression;
  }

  const yoLtMatch = s.match(/^(.+?)\s+(?:bá\s+)?kere\s+ju\s+(.+?)\s+lọ$/i);
  if (yoLtMatch) {
    return {
      type: 'BinaryExpression',
      operator: '<',
      left: parseExpression(yoLtMatch[1], line),
      right: parseExpression(yoLtMatch[2], line),
      line,
    } as BinaryExpression;
  }

  const yoEqMatch = s.match(/^(.+?)\s+dọ́gba\s+pẹ̀lú\s+(.+)$/i);
  if (yoEqMatch) {
    return {
      type: 'BinaryExpression',
      operator: '==',
      left: parseExpression(yoEqMatch[1], line),
      right: parseExpression(yoEqMatch[2], line),
      line,
    } as BinaryExpression;
  }

  // Check for English and Spanish natural language comparisons
  const naturalComparisonMap: Array<{ pattern: RegExp; op: Operator }> = [
    { pattern: /\s+(?:is\s+greater\s+than|is\s+more\s+than|es\s+mayor\s+que|es\s+más\s+que)\s+/i, op: '>' },
    { pattern: /\s+(?:is\s+less\s+than|is\s+smaller\s+than|es\s+menor\s+que|es\s+más\s+pequeño\s+que)\s+/i, op: '<' },
    { pattern: /\s+(?:is\s+greater\s+than\s+or\s+equal\s+to|is\s+at\s+least|es\s+mayor\s+o\s+igual\s+que|es\s+al\s+menos)\s+/i, op: '>=' },
    { pattern: /\s+(?:is\s+less\s+than\s+or\s+equal\s+to|is\s+at\s+most|es\s+menor\s+o\s+igual\s+que)\s+/i, op: '<=' },
    { pattern: /\s+(?:is\s+not\s+equal\s+to|is\s+not|no\s+es\s+igual\s+a|no\s+es)\s+/i, op: '!=' },
    { pattern: /\s+(?:is\s+equal\s+to|equals|is|es\s+igual\s+a)\s+/i, op: '==' },
    // Standard comparison operators
    { pattern: /\s*(>=)\s*/, op: '>=' },
    { pattern: /\s*(<=)\s*/, op: '<=' },
    { pattern: /\s*(==)\s*/, op: '==' },
    { pattern: /\s*(!=)\s*/, op: '!=' },
    { pattern: /\s*(>)\s*/, op: '>' },
    { pattern: /\s*(<)\s*/, op: '<' },
  ];

  for (const { pattern, op } of naturalComparisonMap) {
    const match = s.match(pattern);
    if (match && match.index !== undefined) {
      const leftPart = s.substring(0, match.index).trim();
      const rightPart = s.substring(match.index + match[0].length).trim();
      if (leftPart && rightPart) {
        return {
          type: 'BinaryExpression',
          operator: op,
          left: parseExpression(leftPart, line),
          right: parseExpression(rightPart, line),
          line,
        };
      }
    }
  }

  // Arithmetic natural language and symbols
  const arithmeticOps: Array<{ pattern: RegExp; op: Operator }> = [
    { pattern: /\s+(?:plus|más)\s+/i, op: '+' },
    { pattern: /\s+(?:minus|menos)\s+/i, op: '-' },
    { pattern: /\s+(?:times|multiplied\s+by|multiplicado\s+por)\s+/i, op: '*' },
    { pattern: /\s+(?:divided\s+by|dividido\s+entre|dividido\s+por)\s+/i, op: '/' },
    // Standard arithmetic operators (note: match +/- outside quotes)
    { pattern: /\s*(\+)\s*/, op: '+' },
    { pattern: /\s*(-)\s*/, op: '-' },
    { pattern: /\s*(\*)\s*/, op: '*' },
    { pattern: /\s*(\/)\s*/, op: '/' },
  ];

  for (const { pattern, op } of arithmeticOps) {
    const match = s.match(pattern);
    if (match && match.index !== undefined) {
      const leftPart = s.substring(0, match.index).trim();
      const rightPart = s.substring(match.index + match[0].length).trim();
      // Ensure left part is not empty (to avoid capturing unary minus here if at start)
      if (leftPart && rightPart) {
        return {
          type: 'BinaryExpression',
          operator: op,
          left: parseExpression(leftPart, line),
          right: parseExpression(rightPart, line),
          line,
        };
      }
    }
  }

  // Check for number literal
  if (/^-?\d+(\.\d+)?$/.test(s)) {
    return {
      type: 'NumberLiteral',
      value: Number(s),
      raw: s,
      line,
    } as NumberLiteral;
  }

  // Otherwise, identifier
  return {
    type: 'Identifier',
    name: s,
    line,
  } as Identifier;
}

/**
 * Main parser converting text source into the Canonical AST
 */
export function parseProgram(source: string): { program: Program; errors: Diagnostic[] } {
  const errors: Diagnostic[] = [];
  const statements: Statement[] = [];

  const rawLines = source.split('\n');

  for (let idx = 0; idx < rawLines.length; idx++) {
    const lineNum = idx + 1;
    const line = cleanLine(rawLines[idx]);

    // Skip blank lines or comments
    if (!line || line.startsWith('#') || line.startsWith('//')) {
      continue;
    }

    try {
      const stmt = parseStatement(line, lineNum);
      if (stmt) {
        statements.push(stmt);
      } else {
        errors.push({
          line: lineNum,
          column: 1,
          message: `Could not understand instruction: "${line}"`,
          severity: 'error',
          suggestion: 'Check the syntax: try "let score = 10", "show score", or "I have a number called score. It is 10."',
        });
      }
    } catch (err: any) {
      errors.push({
        line: lineNum,
        column: 1,
        message: err.message || `Syntax error on line ${lineNum}`,
        severity: 'error',
      });
    }
  }

  return {
    program: {
      type: 'Program',
      body: statements,
      line: 1,
    },
    errors,
  };
}

/**
 * Parses a single statement line in any supported syntax style
 */
export function parseStatement(raw: string, line: number): Statement | null {
  const s = cleanLine(raw);

  // -------------------------------------------------------------
  // 1. Variable Declarations
  // -------------------------------------------------------------

  // English: "I have a number called score. It is 10" or "I have a variable called score with value 10"
  const natDeclMatch1 = s.match(/^I\s+have\s+a\s+(?:number|variable|value)\s+called\s+([a-zA-Z_]\w*)\.?\s*(?:It\s+is|with\s+value)\s+(.+)$/i);
  if (natDeclMatch1) {
    const id = natDeclMatch1[1];
    const valExpr = parseExpression(natDeclMatch1[2], line);
    return {
      type: 'VariableDeclaration',
      id,
      value: valExpr,
      inferredType: valExpr.type === 'NumberLiteral' ? 'number' : valExpr.type === 'StringLiteral' ? 'string' : 'boolean',
      line,
    };
  }

  // English: "Create score with value 10" or "Create a variable called score with value 10"
  const natDeclMatch2 = s.match(/^Create\s+(?:a\s+variable\s+called\s+)?([a-zA-Z_]\w*)\s+(?:with\s+value|set\s+to|as)\s+(.+)$/i);
  if (natDeclMatch2) {
    const id = natDeclMatch2[1];
    const valExpr = parseExpression(natDeclMatch2[2], line);
    return {
      type: 'VariableDeclaration',
      id,
      value: valExpr,
      inferredType: valExpr.type === 'NumberLiteral' ? 'number' : valExpr.type === 'StringLiteral' ? 'string' : 'boolean',
      line,
    };
  }

  // English: "Let score be 10"
  const natDeclMatch3 = s.match(/^Let\s+([a-zA-Z_]\w*)\s+be\s+(.+)$/i);
  if (natDeclMatch3) {
    const id = natDeclMatch3[1];
    const valExpr = parseExpression(natDeclMatch3[2], line);
    return {
      type: 'VariableDeclaration',
      id,
      value: valExpr,
      inferredType: valExpr.type === 'NumberLiteral' ? 'number' : valExpr.type === 'StringLiteral' ? 'string' : 'boolean',
      line,
    };
  }

  // Yoruba: "Mo ní nọ́mbà kan tí à ń pè ní score. Ó jẹ́ 10"
  const yoDeclMatch1 = s.match(/^Mo\s+ní\s+nọ́mbà\s+kan\s+tí\s+à\s+ń\s+pè\s+ní\s+([a-zA-Z_]\w*)\.?\s*Ó\s+jẹ́\s+(.+)$/i);
  if (yoDeclMatch1) {
    const id = yoDeclMatch1[1];
    const valExpr = parseExpression(yoDeclMatch1[2], line);
    return {
      type: 'VariableDeclaration',
      id,
      value: valExpr,
      inferredType: 'number',
      line,
    };
  }

  // Yoruba: "Jẹ ki score jẹ 10" or "Ṣẹ̀dá score pẹ̀lú iye 10"
  const yoDeclMatch2 = s.match(/^(?:Jẹ\s+ki|Ṣẹ̀dá)\s+([a-zA-Z_]\w*)\s+(?:jẹ|pẹ̀lú\s+iye)\s+(.+)$/i);
  if (yoDeclMatch2) {
    const id = yoDeclMatch2[1];
    const valExpr = parseExpression(yoDeclMatch2[2], line);
    return {
      type: 'VariableDeclaration',
      id,
      value: valExpr,
      inferredType: valExpr.type === 'NumberLiteral' ? 'number' : valExpr.type === 'StringLiteral' ? 'string' : 'boolean',
      line,
    };
  }

  // Spanish: "Tengo un número llamado score. Es 10" or "Tengo una variable llamada score con valor 10"
  const esDeclMatch1 = s.match(/^Tengo\s+un[a]?\s+(?:número|variable|valor)\s+llamad[oa]\s+([a-zA-Z_]\w*)\.?\s*(?:Es|con\s+valor)\s+(.+)$/i);
  if (esDeclMatch1) {
    const id = esDeclMatch1[1];
    const valExpr = parseExpression(esDeclMatch1[2], line);
    return {
      type: 'VariableDeclaration',
      id,
      value: valExpr,
      inferredType: valExpr.type === 'NumberLiteral' ? 'number' : valExpr.type === 'StringLiteral' ? 'string' : 'boolean',
      line,
    };
  }

  // Spanish: "Crear score con valor 10" or "Sea score 10"
  const esDeclMatch2 = s.match(/^(?:Crear\s+(?:una\s+variable\s+llamada\s+)?([a-zA-Z_]\w*)\s+(?:con\s+valor|igual\s+a)\s+|Sea\s+([a-zA-Z_]\w*)\s+)(.+)$/i);
  if (esDeclMatch2) {
    const id = esDeclMatch2[1] || esDeclMatch2[2];
    const valExpr = parseExpression(esDeclMatch2[3], line);
    return {
      type: 'VariableDeclaration',
      id,
      value: valExpr,
      inferredType: valExpr.type === 'NumberLiteral' ? 'number' : valExpr.type === 'StringLiteral' ? 'string' : 'boolean',
      line,
    };
  }

  // Concise: "let score = 10"
  const conciseLetMatch = s.match(/^let\s+([a-zA-Z_]\w*)\s*=\s*(.+)$/i);
  if (conciseLetMatch) {
    const id = conciseLetMatch[1];
    const valExpr = parseExpression(conciseLetMatch[2], line);
    return {
      type: 'VariableDeclaration',
      id,
      value: valExpr,
      inferredType: valExpr.type === 'NumberLiteral' ? 'number' : valExpr.type === 'StringLiteral' ? 'string' : 'boolean',
      line,
    };
  }

  // -------------------------------------------------------------
  // 2. Mutations (Assignments & Arithmetic Instructions)
  // -------------------------------------------------------------

  // English & Spanish: "Add 5 to score" / "Sumar 5 a score" / "Agregar 5 a score"
  const natAddMatch = s.match(/^(?:Add|Sumar|Agregar)\s+(.+?)\s+a\s+([a-zA-Z_]\w*)$/i) || s.match(/^Add\s+(.+?)\s+to\s+([a-zA-Z_]\w*)$/i);
  if (natAddMatch) {
    const addVal = parseExpression(natAddMatch[1], line);
    const id = natAddMatch[2];
    return {
      type: 'AssignmentStatement',
      id,
      value: {
        type: 'BinaryExpression',
        operator: '+',
        left: { type: 'Identifier', name: id, line },
        right: addVal,
        line,
      },
      line,
    };
  }

  const natIncMatch = s.match(/^(?:Increase|Increment|Aumentar|Incrementar)\s+([a-zA-Z_]\w*)\s+(?:by|en)\s+(.+)$/i);
  if (natIncMatch) {
    const id = natIncMatch[1];
    const addVal = parseExpression(natIncMatch[2], line);
    return {
      type: 'AssignmentStatement',
      id,
      value: {
        type: 'BinaryExpression',
        operator: '+',
        left: { type: 'Identifier', name: id, line },
        right: addVal,
        line,
      },
      line,
    };
  }

  // English & Spanish: "Subtract 3 from score" / "Restar 3 de score"
  const natSubMatch = s.match(/^(?:Subtract\s+(.+?)\s+from|Restar\s+(.+?)\s+de)\s+([a-zA-Z_]\w*)$/i);
  if (natSubMatch) {
    const subVal = parseExpression(natSubMatch[1] || natSubMatch[2], line);
    const id = natSubMatch[3];
    return {
      type: 'AssignmentStatement',
      id,
      value: {
        type: 'BinaryExpression',
        operator: '-',
        left: { type: 'Identifier', name: id, line },
        right: subVal,
        line,
      },
      line,
    };
  }

  // English & Spanish: "Multiply score by 2" / "Multiplicar score por 2"
  const natMulMatch = s.match(/^(?:Multiply\s+([a-zA-Z_]\w*)\s+by|Multiplicar\s+([a-zA-Z_]\w*)\s+por)\s+(.+)$/i);
  if (natMulMatch) {
    const id = natMulMatch[1] || natMulMatch[2];
    const mulVal = parseExpression(natMulMatch[3], line);
    return {
      type: 'AssignmentStatement',
      id,
      value: {
        type: 'BinaryExpression',
        operator: '*',
        left: { type: 'Identifier', name: id, line },
        right: mulVal,
        line,
      },
      line,
    };
  }

  // English & Spanish: "Divide score by 2" / "Dividir score entre 2"
  const natDivMatch = s.match(/^(?:Divide\s+([a-zA-Z_]\w*)\s+by|Dividir\s+([a-zA-Z_]\w*)\s+(?:entre|por))\s+(.+)$/i);
  if (natDivMatch) {
    const id = natDivMatch[1] || natDivMatch[2];
    const divVal = parseExpression(natDivMatch[3], line);
    return {
      type: 'AssignmentStatement',
      id,
      value: {
        type: 'BinaryExpression',
        operator: '/',
        left: { type: 'Identifier', name: id, line },
        right: divVal,
        line,
      },
      line,
    };
  }

  // English & Spanish: "Set score to 20" / "Poner score en 20" / "Cambiar score a 20"
  const natSetMatch = s.match(/^(?:Set|Change)\s+([a-zA-Z_]\w*)\s+to\s+(.+)$/i) || s.match(/^(?:Poner|Cambiar)\s+([a-zA-Z_]\w*)\s+(?:en|a)\s+(.+)$/i);
  if (natSetMatch) {
    const id = natSetMatch[1];
    return {
      type: 'AssignmentStatement',
      id,
      value: parseExpression(natSetMatch[2], line),
      line,
    };
  }

  // Yoruba: "Fi 5 kún score"
  const yoAddMatch = s.match(/^Fi\s+(.+?)\s+kún\s+([a-zA-Z_]\w*)$/i);
  if (yoAddMatch) {
    const addVal = parseExpression(yoAddMatch[1], line);
    const id = yoAddMatch[2];
    return {
      type: 'AssignmentStatement',
      id,
      value: {
        type: 'BinaryExpression',
        operator: '+',
        left: { type: 'Identifier', name: id, line },
        right: addVal,
        line,
      },
      line,
    };
  }

  // Yoruba: "Yọ 3 kúrò nínú score"
  const yoSubMatch = s.match(/^Yọ\s+(.+?)\s+kúrò\s+nínú\s+([a-zA-Z_]\w*)$/i);
  if (yoSubMatch) {
    const subVal = parseExpression(yoSubMatch[1], line);
    const id = yoSubMatch[2];
    return {
      type: 'AssignmentStatement',
      id,
      value: {
        type: 'BinaryExpression',
        operator: '-',
        left: { type: 'Identifier', name: id, line },
        right: subVal,
        line,
      },
      line,
    };
  }

  // Yoruba: "Sọ score di 20"
  const yoSetMatch = s.match(/^Sọ\s+([a-zA-Z_]\w*)\s+di\s+(.+)$/i);
  if (yoSetMatch) {
    const id = yoSetMatch[1];
    return {
      type: 'AssignmentStatement',
      id,
      value: parseExpression(yoSetMatch[2], line),
      line,
    };
  }

  // -------------------------------------------------------------
  // 3. Output (show, display, tell me, print)
  // -------------------------------------------------------------

  // Yoruba: "Fi score hàn" / "Fi "Winner" hàn"
  const yoShowMatch = s.match(/^Fi\s+(.+?)\s+hàn$/i);
  if (yoShowMatch) {
    return {
      type: 'PrintStatement',
      expression: parseExpression(yoShowMatch[1], line),
      line,
    };
  }

  // Yoruba: "Sọ fún mi score" or "Sọ fún mi pé score"
  const yoTellMatch = s.match(/^Sọ\s+fún\s+mi\s+(?:pé\s+)?(.+)$/i);
  if (yoTellMatch) {
    return {
      type: 'PrintStatement',
      expression: parseExpression(yoTellMatch[1], line),
      line,
    };
  }

  // English, Spanish, & Concise: "Show score", "Display score", "Mostrar score", "Imprimir score"
  const showMatch = s.match(/^(?:show\s+me|show|display|tell\s+me|print|mostrar|imprimir)\s+(.+)$/i);
  if (showMatch) {
    return {
      type: 'PrintStatement',
      expression: parseExpression(showMatch[1], line),
      line,
    };
  }

  // -------------------------------------------------------------
  // 4. Conditions (if, when, si, cuando, bí)
  // -------------------------------------------------------------

  // Yoruba: "Bí score bá ju 10 lọ, fi "Winner" hàn" or "Bí score bá rí bẹ́ẹ̀, ..."
  const yoIfMatch = s.match(/^Bí\s+(.+?)(?:,\s*|\s+bá\s+rí\s+bẹ́ẹ̀,\s*)(.+)$/i);
  if (yoIfMatch) {
    const condExpr = parseExpression(yoIfMatch[1], line);
    const bodyStmt = parseStatement(yoIfMatch[2], line);
    if (bodyStmt) {
      return {
        type: 'IfStatement',
        condition: condExpr,
        thenBranch: [bodyStmt],
        line,
      };
    }
  }

  // English / Spanish / Concise:
  // "If score is greater than 10, show "You won""
  // "Si score es mayor que 10, mostrar "Ganaste""
  // "if score > 10: show "You won""
  // "When score is more than 10, tell me "You won""
  const ifMatch = s.match(/^(?:if|when|si|cuando)\s+(.+?)(?::|\s*,\s*(?:then|entonces)?|\s+(?:then|entonces)\s+)(.+)$/i);
  if (ifMatch) {
    const condExpr = parseExpression(ifMatch[1], line);
    const bodyStmt = parseStatement(ifMatch[2], line);
    if (bodyStmt) {
      return {
        type: 'IfStatement',
        condition: condExpr,
        thenBranch: [bodyStmt],
        line,
      };
    }
  }

  // -------------------------------------------------------------
  // 5. Repetition / Loops
  // -------------------------------------------------------------

  // Yoruba: "Ṣe èyí ní ẹ̀mẹwàá 5: fi "Hello" hàn"
  const yoRepeatMatch = s.match(/^(?:Ṣe\s+èyí\s+ní\s+ẹ̀mẹwàá|Tún\s+ṣe\s+ní\s+ẹ̀mẹwàá)\s+(.+?)(?::|\s*,\s*)(.+)$/i);
  if (yoRepeatMatch) {
    const countExpr = parseExpression(yoRepeatMatch[1], line);
    const bodyStmt = parseStatement(yoRepeatMatch[2], line);
    if (bodyStmt) {
      return {
        type: 'RepeatStatement',
        count: countExpr,
        body: [bodyStmt],
        line,
      };
    }
  }

  // English / Spanish / Concise:
  // "repeat 5: show "Hello""
  // "Do this 5 times: show "Hello""
  // "Repetir 5 veces: mostrar "Hola""
  // "Hacer esto 5 veces: mostrar "Hola""
  const repeatMatch = s.match(/^(?:repeat|do\s+this|repetir|hacer\s+esto)\s+(.+?)(?:\s+(?:times|veces))?(?::|\s*,\s*)(.+)$/i);
  if (repeatMatch) {
    const countExpr = parseExpression(repeatMatch[1], line);
    const bodyStmt = parseStatement(repeatMatch[2], line);
    if (bodyStmt) {
      return {
        type: 'RepeatStatement',
        count: countExpr,
        body: [bodyStmt],
        line,
      };
    }
  }

  // -------------------------------------------------------------
  // 6. Concise assignment: "score = score + 5" or "score = 10"
  // -------------------------------------------------------------
  const conciseAssignMatch = s.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
  if (conciseAssignMatch) {
    const id = conciseAssignMatch[1];
    return {
      type: 'AssignmentStatement',
      id,
      value: parseExpression(conciseAssignMatch[2], line),
      line,
    };
  }

  return null;
}
