mod ast;
mod codegen_c;
mod parser;

use std::env;
use std::fs;
use std::process::{exit, Command};

fn print_usage() {
    println!("nplc: NP-LANG Native Ahead-Of-Time (AOT) Compiler");
    println!("Usage:");
    println!("  nplc compile <source.np> -o <binary_name>   Compile source directly to native executable");
    println!("  nplc run <source.np>                        Compile and immediately run the program");
    println!("  nplc emit-c <source.np>                     Emit optimized C code");
    println!("  nplc emit-ast <source.np>                   Emit Canonical AST JSON");
}

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        print_usage();
        exit(1);
    }

    let command = &args[1];

    match command.as_str() {
        "compile" => {
            if args.len() < 3 {
                eprintln!("Error: Missing input source file. Usage: nplc compile <file.np> [-o <out>]");
                exit(1);
            }
            let source_path = &args[2];
            let mut out_path = "a.out".to_string();

            let mut i = 3;
            while i < args.len() {
                if args[i] == "-o" && i + 1 < args.len() {
                    out_path = args[i + 1].clone();
                    i += 2;
                } else {
                    i += 1;
                }
            }

            let source = fs::read_to_string(source_path).unwrap_or_else(|e| {
                eprintln!("Error reading file '{}': {}", source_path, e);
                exit(1);
            });

            let program = parser::parse_program(&source).unwrap_or_else(|e| {
                eprintln!("Syntax Error: {}", e);
                exit(1);
            });

            match codegen_c::compile_to_native_binary(&program, &out_path) {
                Ok(_) => {
                    println!("Successfully compiled '{}' to native executable '{}'", source_path, out_path);
                }
                Err(e) => {
                    eprintln!("Compilation failed: {}", e);
                    exit(1);
                }
            }
        }

        "run" => {
            if args.len() < 3 {
                eprintln!("Error: Missing input source file. Usage: nplc run <file.np>");
                exit(1);
            }
            let source_path = &args[2];
            let source = fs::read_to_string(source_path).unwrap_or_else(|e| {
                eprintln!("Error reading file '{}': {}", source_path, e);
                exit(1);
            });

            let program = parser::parse_program(&source).unwrap_or_else(|e| {
                eprintln!("Syntax Error: {}", e);
                exit(1);
            });

            let tmp_bin = "./.nplc_tmp_binary";
            if let Err(e) = codegen_c::compile_to_native_binary(&program, tmp_bin) {
                eprintln!("Compilation failed: {}", e);
                exit(1);
            }

            let status = Command::new(tmp_bin).status();
            let _ = fs::remove_file(tmp_bin);

            if let Ok(st) = status {
                exit(st.code().unwrap_or(0));
            } else {
                eprintln!("Failed to execute binary");
                exit(1);
            }
        }

        "emit-c" => {
            if args.len() < 3 {
                eprintln!("Error: Missing input source file. Usage: nplc emit-c <file.np>");
                exit(1);
            }
            let source_path = &args[2];
            let source = fs::read_to_string(source_path).unwrap_or_else(|e| {
                eprintln!("Error reading file '{}': {}", source_path, e);
                exit(1);
            });

            let program = parser::parse_program(&source).unwrap_or_else(|e| {
                eprintln!("Syntax Error: {}", e);
                exit(1);
            });

            let c_code = codegen_c::generate_c_code(&program);
            println!("{}", c_code);
        }

        "emit-ast" => {
            if args.len() < 3 {
                eprintln!("Error: Missing input source file. Usage: nplc emit-ast <file.np>");
                exit(1);
            }
            let source_path = &args[2];
            let source = fs::read_to_string(source_path).unwrap_or_else(|e| {
                eprintln!("Error reading file '{}': {}", source_path, e);
                exit(1);
            });

            let program = parser::parse_program(&source).unwrap_or_else(|e| {
                eprintln!("Syntax Error: {}", e);
                exit(1);
            });

            let json = serde_json::to_string_pretty(&program).unwrap();
            println!("{}", json);
        }

        _ => {
            eprintln!("Unknown command: '{}'", command);
            print_usage();
            exit(1);
        }
    }
}
