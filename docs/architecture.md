<p align="center">
  <img src="assets/logo.jpg" alt="NP-LANG Logo" width="130" style="border-radius: 20px;" />
</p>

# NP-LANG Architecture

NP-LANG decouples human syntax from the language's core representation and execution model. Rather than treating source text as the immutable program, NP-LANG treats human text as a **projection** and the **Canonical Abstract Semantic Tree (AST)** as the universal truth.

---

## 1. System Overview Flowchart

```mermaid
flowchart TD
    subgraph Projections ["1. Source Projections (Human Input & Rendering)"]
        direction LR
        P_EN["🇬🇧 Natural English\n'If score is greater than 10, show win'"]
        P_CC["⚡ Concise Code\n'if score > 10: show win'"]
        P_ES["🇪🇸 Spanish Dialect\n'Si score es mayor que 10, mostrar win'"]
        P_YO["🇳🇬 Yoruba Dialect\n'Bí score bá ju 10 lọ, fi win hàn'"]
        P_AI["🤖 AI Agents\nDirect JSON AST Generation"]
    end

    subgraph Frontend ["2. Multi-Dialect Frontend Pipeline"]
        Lexer["Universal Lexer & Tokenizer\n- Multi-word keyword matching\n- Punctuation & sentence normalization"]
        Parser["AST Tree Builder\n- Syntactic validation\n- Structural pattern matching"]
        Checker["Semantic Scope & Type Checker\n- Variable resolution\n- Division by zero detection"]
    end

    subgraph Core ["3. Canonical Semantic Core (NP-IR)"]
        AST["🌲 Canonical AST (JSON Schema)\n- Unambiguous mathematical nodes\n- Zero-loss bidirectional projection\n- AI-safe structured representation"]
    end

    subgraph Backends ["4. Dual Execution & Compilation Backends"]
        direction LR
        subgraph WebTarget ["🌐 Browser Evaluator Engine (TypeScript)"]
            Eval["Deterministic AST Evaluator"]
            Trace["Step-by-Step 'What Happened?' Trace"]
            MemUI["Live Memory State Inspector"]
        end

        subgraph NativeTarget ["⚙️ Native AOT Compiler (Rust / nplc)"]
            RustAST["Rust Internal AST"]
            CCodegen["Optimized C Intermediate Codegen"]
            GCC["GCC / Clang (-O2 Optimization)"]
            ELF["Standalone 64-bit ELF Linux Binary"]
        end
    end

    P_EN --> Lexer
    P_CC --> Lexer
    P_ES --> Lexer
    P_YO --> Lexer
    P_AI --> AST

    Lexer --> Parser --> Checker --> AST
    AST --> Eval
    Eval --> Trace
    Eval --> MemUI

    AST --> RustAST --> CCodegen --> GCC --> ELF

    style Projections fill:#0f172a,stroke:#334155,stroke-width:1px,color:#f8fafc
    style Frontend fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    style Core fill:#064e3b,stroke:#10b981,stroke-width:3px,color:#ecfdf5
    style WebTarget fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#e0e7ff
    style NativeTarget fill:#451a03,stroke:#f59e0b,stroke-width:2px,color:#fef3c7
```

---

## 2. Native Compilation Pipeline (`nplc`)

The native compiler backend is built in pure Rust. It transforms NP-LANG programs into bare-metal machine code with zero runtime overhead:

```mermaid
flowchart TD
    Src["📄 Source File (e.g., examples/score.np)"] --> R_Lex["🦀 Rust Multi-Dialect Lexer\n(compiler/src/lexer.rs)"]
    R_Lex --> R_Tok["Token Stream [Token, ...]"]
    R_Tok --> R_Parse["🦀 Rust AST Parser\n(compiler/src/parser.rs)"]
    R_Parse --> R_AST["🌲 Rust AST (Program Node)\nVec<Statement>"]
    R_AST --> R_Gen["🦀 C Intermediate Codegen\n(compiler/src/codegen.rs)"]
    R_Gen --> C_Src["Generated C Source Code\n(main(), stdio.h, types)"]
    C_Src --> GCC_Opt["⚡ GCC Optimizer (-O2 / -O3)\nStandard C Library Linkage"]
    GCC_Opt --> Bin["🚀 Standalone 64-bit Linux ELF Binary\n(e.g., ./score_binary)"]

    style Src fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    style R_AST fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#ecfdf5
    style Bin fill:#831843,stroke:#f43f5e,stroke-width:3px,color:#fff1f2
```

### Why Emit C as an Intermediate Target?
1. **Universal Portability**: C runs on virtually every CPU architecture in existence (x86, ARM, RISC-V, WebAssembly).
2. **Industrial-Grade Optimization**: We leverage 35+ years of GCC and LLVM compiler optimizations (`-O2`, auto-vectorization, dead code elimination) without reinventing backend assembly generation from day one.
3. **Transparent Debugging**: Developers can inspect the intermediate C code with `--emit-c` to see exactly what instructions are executed.

---

## 3. Browser Evaluation Pipeline (`packages/language-core`)

For instant, zero-install testing in the web playground, the language core executes entirely inside the browser:

```mermaid
flowchart TD
    Input["Input Source Text\n(Web Monaco / Textarea)"] --> T_Norm["Text Normalizer\n- Trim periods, sanitize spaces\n- Lowercase keyword detection"]
    T_Norm --> T_Parse["Recursive Descent Parser\n(packages/language-core/src/parser.ts)"]
    T_Parse --> T_AST["Canonical AST JSON"]
    T_AST --> T_Check["Semantic Scope Safety Checker\n- Undeclared identifier check\n- Division by zero validation"]
    T_Check --> T_Env["Initialize Environment Frame\nMap<string, number | string>"]
    T_Env --> T_Eval["AST Evaluator Loop\n(packages/language-core/src/evaluator.ts)"]
    T_Eval --> T_Trace["Execution Steps Trace\n[Line 1: Set score to 10,\nLine 2: Added 5 to score...]"]
    T_Eval --> T_Out["Standard Output Stream\n['score: 15']"]

    style T_AST fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#ecfdf5
    style T_Trace fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#e0e7ff
```

---

## 4. Scoping & Memory Environment Model

Variable bindings exist inside a hierarchical scope chain:

```mermaid
graph TD
    subgraph GlobalScope ["🌍 Global Environment Frame"]
        G_Score["score: 15 (number)"]
        G_Name["player: 'Victor' (string)"]
    end

    subgraph BranchScope ["🔀 Block Scope: IfStatement (score > 10)"]
        B_Bonus["bonus: 50 (number)"]
        B_Flag["is_winner: true"]
    end

    subgraph LoopScope ["🔁 Iteration Scope: RepeatStatement (3 times)"]
        L_Iter["_index: 0, 1, 2"]
    end

    GlobalScope --> BranchScope
    GlobalScope --> LoopScope

    style GlobalScope fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    style BranchScope fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#ecfdf5
    style LoopScope fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#e0e7ff
```

---

## 5. Bidirectional Projections

Because every projection compiles into the same Canonical AST, NP-LANG provides a **lossless Bidirectional Transpiler**:

```mermaid
stateDiagram-v2
    [*] --> CanonicalAST: Parse Input (Any Style)
    
    state CanonicalAST {
        direction LR
        Node1: VariableDeclaration
        Node2: BinaryExpression
        Node3: IfStatement
    }

    CanonicalAST --> NaturalEnglish: Transpile (en)
    CanonicalAST --> ConciseCode: Transpile (concise)
    CanonicalAST --> Spanish: Transpile (es)
    CanonicalAST --> Yoruba: Transpile (yo)
    CanonicalAST --> JSON: Export Schema (ai)

    NaturalEnglish --> CanonicalAST: Invert / Re-parse
    ConciseCode --> CanonicalAST: Invert / Re-parse
    Spanish --> CanonicalAST: Invert / Re-parse
    Yoruba --> CanonicalAST: Invert / Re-parse
```

- Any valid Natural English program can be translated into Concise Syntax.
- Any Concise program can be projected into Natural English, Spanish, or Yoruba.
- An AI coding agent can generate the Canonical AST directly as JSON, and a human developer can read and edit it in Natural English.

