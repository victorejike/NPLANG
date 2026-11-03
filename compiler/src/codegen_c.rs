use crate::ast::{Expression, Program, Statement};
use std::collections::HashSet;
use std::fs;
use std::process::Command;

fn generate_expression(expr: &Expression) -> String {
    match expr {
        Expression::NumberLiteral { value, .. } => {
            if value.fract() == 0.0 {
                format!("{:.0}", value)
            } else {
                format!("{}", value)
            }
        }
        Expression::StringLiteral { value, .. } => {
            format!("\"{}\"", value.replace('"', "\\\""))
        }
        Expression::BooleanLiteral { value, .. } => {
            if *value {
                "1".to_string()
            } else {
                "0".to_string()
            }
        }
        Expression::Identifier { name } => name.clone(),
        Expression::BinaryExpression {
            operator,
            left,
            right,
        } => {
            format!(
                "({} {} {})",
                generate_expression(left),
                operator,
                generate_expression(right)
            )
        }
    }
}

fn generate_statement(stmt: &Statement, declared_vars: &mut HashSet<String>, indent: usize) -> String {
    let pad = "    ".repeat(indent);
    match stmt {
        Statement::VariableDeclaration { id, value, .. } => {
            let expr_str = generate_expression(value);
            if !declared_vars.contains(id) {
                declared_vars.insert(id.clone());
                format!("{}double {} = {};\n", pad, id, expr_str)
            } else {
                format!("{}{} = {};\n", pad, id, expr_str)
            }
        }
        Statement::AssignmentStatement { id, value } => {
            let expr_str = generate_expression(value);
            if !declared_vars.contains(id) {
                declared_vars.insert(id.clone());
                format!("{}double {} = {};\n", pad, id, expr_str)
            } else {
                format!("{}{} = {};\n", pad, id, expr_str)
            }
        }
        Statement::PrintStatement { expression } => match expression {
            Expression::StringLiteral { value, .. } => {
                format!("{}printf(\"{}\\n\");\n", pad, value.replace('"', "\\\""))
            }
            Expression::NumberLiteral { .. }
            | Expression::Identifier { .. }
            | Expression::BinaryExpression { .. } => {
                let expr_str = generate_expression(expression);
                format!(
                    "{}if ((long long)({}) == ({})) {{\n{}    printf(\"%.0f\\n\", (double)({}));\n{}}} else {{\n{}    printf(\"%g\\n\", (double)({}));\n{}}}\n",
                    pad, expr_str, expr_str,
                    pad, expr_str,
                    pad,
                    pad, expr_str,
                    pad
                )
            }
            Expression::BooleanLiteral { value, .. } => {
                if *value {
                    format!("{}printf(\"true\\n\");\n", pad)
                } else {
                    format!("{}printf(\"false\\n\");\n", pad)
                }
            }
        },
        Statement::IfStatement {
            condition,
            then_branch,
        } => {
            let cond_str = generate_expression(condition);
            let mut out = format!("{}if ({}) {{\n", pad, cond_str);
            for s in then_branch {
                out.push_str(&generate_statement(s, declared_vars, indent + 1));
            }
            out.push_str(&format!("{}}}\n", pad));
            out
        }
        Statement::RepeatStatement { count, body } => {
            let count_str = generate_expression(count);
            let loop_var = format!("_loop_idx_{}", indent);
            let mut out = format!(
                "{}for (long long {} = 0; {} < (long long)({}); {}++) {{\n",
                pad, loop_var, loop_var, count_str, loop_var
            );
            for s in body {
                out.push_str(&generate_statement(s, declared_vars, indent + 1));
            }
            out.push_str(&format!("{}}}\n", pad));
            out
        }
    }
}

pub fn generate_c_code(program: &Program) -> String {
    let mut out = String::new();
    out.push_str("/* Generated automatically by nplc (NP-LANG Native Compiler) */\n");
    out.push_str("#include <stdio.h>\n");
    out.push_str("#include <stdbool.h>\n");
    out.push_str("#include <math.h>\n\n");
    out.push_str("int main(void) {\n");

    let mut declared_vars = HashSet::new();
    for stmt in &program.body {
        out.push_str(&generate_statement(stmt, &mut declared_vars, 1));
    }

    out.push_str("    return 0;\n");
    out.push_str("}\n");
    out
}

pub fn compile_to_native_binary(program: &Program, output_path: &str) -> Result<(), String> {
    let c_code = generate_c_code(program);
    let tmp_c_path = format!("{}.tmp.c", output_path);

    fs::write(&tmp_c_path, c_code)
        .map_err(|e| format!("Failed to write temporary C file: {}", e))?;

    // Invoke gcc to compile native executable with -O2 optimization
    let status = Command::new("gcc")
        .args(&["-O2", &tmp_c_path, "-o", output_path, "-lm"])
        .status()
        .map_err(|e| format!("Failed to run gcc: {}", e))?;

    // Clean up temporary C file
    let _ = fs::remove_file(&tmp_c_path);

    if status.success() {
        Ok(())
    } else {
        Err(format!("gcc compilation failed with exit code: {:?}", status.code()))
    }
}
