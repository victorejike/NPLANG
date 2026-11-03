# NP-LANG Architecture

## System Overview

NP-LANG decouples human syntax from the language's core representation and execution model:

```
+-------------------------------------------------------------+
|                     Source Projections                      |
|                                                             |
|  [Natural English]      [Concise Syntax]    [Yoruba/Dialect]|
|  "If score is greater   "if score > 10:     "Bí score bá    |
|   than 10, show win"     show 'win'"         ju 10 lọ..."   |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|             Universal Tokenizer & Lexer                     |
|  - Multi-dialect phrase matching                            |
|  - Fuzzy punctuation & case normalization                   |
|  - Exact token stream creation                              |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                      Parser & Checker                       |
|  - AST builder for each supported syntax projection         |
|  - Semantic verification & variable resolution              |
|  - Actionable, polite diagnostics                           |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                  Canonical AST (NP-IR)                      |
|  - JSON-serializable, AI-native structured schema           |
|  - Unambiguous abstract representation                      |
+-------------------------------------------------------------+
               |                               |
               v                               v
+-----------------------------+ +-----------------------------+
|   Interactive Evaluator     | |   Native Compiler (AOT)     |
|   (Browser / TypeScript)    | |   (Rust / LLVM / C backend) |
|  - Step-by-step trace       | |  - High-performance binary |
|  - Instant playground UI    | |  - Zero-runtime overhead    |
|  - Immediate user testing   | |  - Direct OS integration    |
+-----------------------------+ +-----------------------------+
```

## Bidirectional Projections
Because every projection compiles into the same Canonical AST, NP-LANG includes a **Bidirectional Transpiler**:
- Any valid Natural English program can be translated into Concise Syntax.
- Any Concise program can be projected into Natural English or Yoruba.
- An AI can generate the Canonical AST directly as JSON, and the developer can read it in Natural English.
