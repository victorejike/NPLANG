use crate::ast::{Expression, Program, Statement};

fn clean_line(raw: &str) -> String {
    let mut s = raw.trim();
    if s.ends_with('.') {
        s = &s[..s.len() - 1];
    }
    s.trim().to_string()
}

pub fn parse_expression(raw: &str) -> Result<Expression, String> {
    let mut s = raw.trim();
    if s.ends_with('.') {
        s = &s[..s.len() - 1];
    }
    let s = s.trim();

    // String literal
    if (s.starts_with('"') && s.ends_with('"')) || (s.starts_with('\'') && s.ends_with('\'')) {
        let inner = &s[1..s.len() - 1];
        return Ok(Expression::StringLiteral {
            value: inner.to_string(),
            raw: s.to_string(),
        });
    }

    // Boolean literal
    if s.eq_ignore_ascii_case("true") {
        return Ok(Expression::BooleanLiteral {
            value: true,
            raw: s.to_string(),
        });
    }
    if s.eq_ignore_ascii_case("false") {
        return Ok(Expression::BooleanLiteral {
            value: false,
            raw: s.to_string(),
        });
    }

    // Natural & symbolic comparisons
    let comparison_ops = [
        (" is greater than or equal to ", ">="),
        (" is less than or equal to ", "<="),
        (" es mayor o igual que ", ">="),
        (" es menor o igual que ", "<="),
        (" is greater than ", ">"),
        (" is more than ", ">"),
        (" es mayor que ", ">"),
        (" is less than ", "<"),
        (" is smaller than ", "<"),
        (" es menor que ", "<"),
        (" is not equal to ", "!="),
        (" no es igual a ", "!="),
        (" is equal to ", "=="),
        (" es igual a ", "=="),
        (" >= ", ">="),
        (" <= ", "<="),
        (" == ", "=="),
        (" != ", "!="),
        (" > ", ">"),
        (" < ", "<"),
    ];

    for (pat, op) in comparison_ops {
        if let Some(pos) = s.find(pat) {
            let left_str = &s[..pos];
            let right_str = &s[pos + pat.len()..];
            return Ok(Expression::BinaryExpression {
                operator: op.to_string(),
                left: Box::new(parse_expression(left_str)?),
                right: Box::new(parse_expression(right_str)?),
            });
        }
    }

    // Arithmetic
    let arithmetic_ops = [
        (" plus ", "+"),
        (" más ", "+"),
        (" minus ", "-"),
        (" menos ", "-"),
        (" times ", "*"),
        (" por ", "*"),
        (" divided by ", "/"),
        (" dividido entre ", "/"),
        (" + ", "+"),
        (" - ", "-"),
        (" * ", "*"),
        (" / ", "/"),
    ];

    for (pat, op) in arithmetic_ops {
        if let Some(pos) = s.find(pat) {
            let left_str = &s[..pos];
            let right_str = &s[pos + pat.len()..];
            return Ok(Expression::BinaryExpression {
                operator: op.to_string(),
                left: Box::new(parse_expression(left_str)?),
                right: Box::new(parse_expression(right_str)?),
            });
        }
    }

    // Number
    if let Ok(num) = s.parse::<f64>() {
        return Ok(Expression::NumberLiteral {
            value: num,
            raw: s.to_string(),
        });
    }

    // Identifier
    Ok(Expression::Identifier {
        name: s.to_string(),
    })
}

pub fn parse_statement(raw: &str) -> Result<Option<Statement>, String> {
    let s = clean_line(raw);
    if s.is_empty() || s.starts_with('#') || s.starts_with("//") {
        return Ok(None);
    }

    // 1. Declarations
    // English: "I have a number called score. It is 10" or "Create score with value 10"
    if let Some(rest) = s.strip_prefix("I have a number called ") {
        let parts: Vec<&str> = rest.split(". It is ").collect();
        if parts.len() == 2 {
            let id = parts[0].trim();
            let val = parse_expression(parts[1])?;
            return Ok(Some(Statement::VariableDeclaration {
                id: id.to_string(),
                value: val,
                inferred_type: "number".to_string(),
            }));
        }
    }

    if let Some(rest) = s.strip_prefix("Create ") {
        if let Some(pos) = rest.find(" with value ") {
            let id = rest[..pos].trim();
            let val = parse_expression(&rest[pos + 12..])?;
            return Ok(Some(Statement::VariableDeclaration {
                id: id.to_string(),
                value: val,
                inferred_type: "number".to_string(),
            }));
        }
    }

    // Spanish: "Tengo un número llamado score. Es 10"
    if let Some(rest) = s.strip_prefix("Tengo un número llamado ") {
        let parts: Vec<&str> = rest.split(". Es ").collect();
        if parts.len() == 2 {
            let id = parts[0].trim();
            let val = parse_expression(parts[1])?;
            return Ok(Some(Statement::VariableDeclaration {
                id: id.to_string(),
                value: val,
                inferred_type: "number".to_string(),
            }));
        }
    }

    // Yoruba: "Jẹ ki score jẹ 10"
    if let Some(rest) = s.strip_prefix("Jẹ ki ") {
        if let Some(pos) = rest.find(" jẹ ") {
            let id = rest[..pos].trim();
            let val = parse_expression(&rest[pos + 5..])?;
            return Ok(Some(Statement::VariableDeclaration {
                id: id.to_string(),
                value: val,
                inferred_type: "number".to_string(),
            }));
        }
    }

    // Concise: "let score = 10"
    if let Some(rest) = s.strip_prefix("let ") {
        if let Some(pos) = rest.find('=') {
            let id = rest[..pos].trim();
            let val = parse_expression(&rest[pos + 1..])?;
            return Ok(Some(Statement::VariableDeclaration {
                id: id.to_string(),
                value: val,
                inferred_type: "number".to_string(),
            }));
        }
    }

    // 2. Mutations
    // English: "Add 5 to score"
    if let Some(rest) = s.strip_prefix("Add ") {
        if let Some(pos) = rest.find(" to ") {
            let val_str = &rest[..pos];
            let id = rest[pos + 4..].trim();
            let add_val = parse_expression(val_str)?;
            return Ok(Some(Statement::AssignmentStatement {
                id: id.to_string(),
                value: Expression::BinaryExpression {
                    operator: "+".to_string(),
                    left: Box::new(Expression::Identifier {
                        name: id.to_string(),
                    }),
                    right: Box::new(add_val),
                },
            }));
        }
    }

    // Spanish: "Sumar 5 a score"
    if let Some(rest) = s.strip_prefix("Sumar ") {
        if let Some(pos) = rest.find(" a ") {
            let val_str = &rest[..pos];
            let id = rest[pos + 3..].trim();
            let add_val = parse_expression(val_str)?;
            return Ok(Some(Statement::AssignmentStatement {
                id: id.to_string(),
                value: Expression::BinaryExpression {
                    operator: "+".to_string(),
                    left: Box::new(Expression::Identifier {
                        name: id.to_string(),
                    }),
                    right: Box::new(add_val),
                },
            }));
        }
    }

    // Yoruba: "Fi 5 kún score"
    if let Some(rest) = s.strip_prefix("Fi ") {
        if let Some(pos) = rest.find(" kún ") {
            let val_str = &rest[..pos];
            let id = rest[pos + 5..].trim();
            let add_val = parse_expression(val_str)?;
            return Ok(Some(Statement::AssignmentStatement {
                id: id.to_string(),
                value: Expression::BinaryExpression {
                    operator: "+".to_string(),
                    left: Box::new(Expression::Identifier {
                        name: id.to_string(),
                    }),
                    right: Box::new(add_val),
                },
            }));
        }
    }

    // 3. Output
    // English/Concise: "show ...", "print ...", "display ..."
    for prefix in &["show me ", "show ", "print ", "display ", "tell me "] {
        if let Some(rest) = s.to_lowercase().strip_prefix(prefix) {
            let orig_len = prefix.len();
            let val_str = &s[orig_len..];
            return Ok(Some(Statement::PrintStatement {
                expression: parse_expression(val_str)?,
            }));
        }
    }

    // Spanish: "mostrar ...", "imprimir ..."
    for prefix in &["mostrar ", "imprimir "] {
        if let Some(rest) = s.to_lowercase().strip_prefix(prefix) {
            let orig_len = prefix.len();
            let val_str = &s[orig_len..];
            return Ok(Some(Statement::PrintStatement {
                expression: parse_expression(val_str)?,
            }));
        }
    }

    // Yoruba: "Fi ... hàn"
    if let Some(rest) = s.strip_prefix("Fi ") {
        if let Some(val_str) = rest.strip_suffix(" hàn") {
            return Ok(Some(Statement::PrintStatement {
                expression: parse_expression(val_str)?,
            }));
        }
    }

    // 4. Conditions
    // English: "If score is greater than 10, show "Winner"" or "if score > 10: show "Winner""
    for if_kw in &["if ", "when ", "si ", "cuando ", "bí "] {
        if let Some(rest) = s.to_lowercase().strip_prefix(if_kw) {
            let orig_len = if_kw.len();
            let content = &s[orig_len..];

            let split_pos = content.find(':').or_else(|| content.find(','));
            if let Some(pos) = split_pos {
                let cond_str = &content[..pos];
                let mut then_str = content[pos + 1..].trim();
                if let Some(stripped) = then_str.strip_prefix("then ") {
                    then_str = stripped.trim();
                }
                if let Some(stripped) = then_str.strip_prefix("entonces ") {
                    then_str = stripped.trim();
                }

                let cond_expr = parse_expression(cond_str)?;
                if let Some(then_stmt) = parse_statement(then_str)? {
                    return Ok(Some(Statement::IfStatement {
                        condition: cond_expr,
                        then_branch: vec![then_stmt],
                    }));
                }
            }
        }
    }

    // 5. Repetition
    // "repeat 5: show "Hello"" or "Do this 5 times: show "Hello"" or "Repetir 5 veces: mostrar "Hola""
    for rep_kw in &["repeat ", "do this ", "repetir ", "hacer esto ", "ṣe èyí ní ẹ̀mẹwàá "] {
        if let Some(rest) = s.to_lowercase().strip_prefix(rep_kw) {
            let orig_len = rep_kw.len();
            let content = &s[orig_len..];

            let split_pos = content.find(':').or_else(|| content.find(','));
            if let Some(pos) = split_pos {
                let mut count_str = content[..pos].trim();
                if let Some(stripped) = count_str.strip_suffix(" times") {
                    count_str = stripped.trim();
                }
                if let Some(stripped) = count_str.strip_suffix(" veces") {
                    count_str = stripped.trim();
                }

                let body_str = content[pos + 1..].trim();
                let count_expr = parse_expression(count_str)?;
                if let Some(body_stmt) = parse_statement(body_str)? {
                    return Ok(Some(Statement::RepeatStatement {
                        count: count_expr,
                        body: vec![body_stmt],
                    }));
                }
            }
        }
    }

    // 6. Assignment fallback: "score = score + 5"
    if let Some(pos) = s.find('=') {
        let id = s[..pos].trim();
        let val_str = s[pos + 1..].trim();
        if !id.contains(' ') {
            let val = parse_expression(val_str)?;
            return Ok(Some(Statement::AssignmentStatement {
                id: id.to_string(),
                value: val,
            }));
        }
    }

    Err(format!("Could not compile instruction: \"{}\"", raw))
}

pub fn parse_program(source: &str) -> Result<Program, String> {
    let mut statements = Vec::new();
    for line in source.lines() {
        if let Some(stmt) = parse_statement(line)? {
            statements.push(stmt);
        }
    }
    Ok(Program {
        node_type: "Program".to_string(),
        body: statements,
    })
}
