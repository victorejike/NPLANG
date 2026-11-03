<p align="center">
  <img src="assets/logo.jpg" alt="NP-LANG Logo" width="130" style="border-radius: 20px;" />
</p>

# NP-LANG Language Design Principles

## 1. The Core Idea: Multi-Projection Semantics

In conventional languages (like C, Python, or Rust), the text source code **is** the language. If you change a semicolon, a bracket, or an indentation level, the compiler rejects the program.

In NP-LANG, **the program is a Canonical Semantic Tree (AST)**. The text you write is simply a **projection** or lens:

```mermaid
flowchart TD
    subgraph HumanProjections ["👥 Human Text Projections (Read & Write)"]
        direction LR
        NE["🇬🇧 Natural English\n'I have a number called score. It is 10.'"]
        CC["⚡ Concise Code\n'let score = 10'"]
        ES["🇪🇸 Spanish Dialect\n'Tengo un número llamado score. Es 10.'"]
        YO["🇳🇬 Yoruba Dialect\n'Jẹ ki score jẹ 10.'"]
    end

    subgraph CoreEngine ["🌲 The Universal Anchor (NP-IR)"]
        AST["Canonical Abstract Semantic Tree (AST)\n{\n  type: 'VariableDeclaration',\n  identifier: 'score',\n  value: { type: 'NumberLiteral', value: 10 }\n}"]
    end

    subgraph Targets ["🚀 Execution Backends"]
        direction LR
        Browser["🌐 Interactive Browser Evaluator\n(TypeScript)"]
        Native["⚙️ Ahead-of-Time Native Compiler\n(Rust -> 64-bit ELF)"]
    end

    NE <-->|Bidirectional| AST
    CC <-->|Bidirectional| AST
    ES <-->|Bidirectional| AST
    YO <-->|Bidirectional| AST

    AST --> Browser
    AST --> Native

    style HumanProjections fill:#0f172a,stroke:#334155,stroke-width:1px,color:#f8fafc
    style CoreEngine fill:#064e3b,stroke:#10b981,stroke-width:3px,color:#ecfdf5
    style Targets fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#e0e7ff
```

Because all projections compile into the exact same mathematical AST:
- You can write in conversational English.
- An experienced colleague can read it in Concise syntax (`if score > 10: show "win"`).
- A native Spanish or Yoruba speaker can inspect it in their mother tongue.
- An AI coding agent can generate the AST directly in structured JSON with **zero syntax errors**.

---

## 2. Comparing Traditional Compilers vs. NP-LANG

```mermaid
flowchart LR
    subgraph TraditionalCompilers ["❌ Traditional Languages (Rigid Syntax Wall)"]
        direction TB
        T_Src["Brittle Text\n(Missing semicolon -> Syntax Error!)"]
        T_Lex["Rigid Lexer"]
        T_Par["Rigid Grammar"]
        T_Bin["Target Binary"]
        T_Src --> T_Lex --> T_Par --> T_Bin
    end

    subgraph NPLangModel ["✅ NP-LANG Multi-Projection Architecture"]
        direction TB
        NP_Any["Any Projection\n(English / Concise / Dialect / AI)"]
        NP_Norm["Resilient Multi-Lexer"]
        NP_AST["Universal Canonical AST"]
        NP_Multi["Dual Targets\n(Browser Evaluator / Native ELF)"]
        NP_Any --> NP_Norm --> NP_AST --> NP_Multi
    end

    style TraditionalCompilers fill:#450a0a,stroke:#ef4444,stroke-width:1px,color:#fee2e2
    style NPLangModel fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#ecfdf5
```

---

## 3. The Dual-Syntax Parse Tree: How Natural & Concise Produce Identical Trees

Consider this program:
- **Natural**: `I have a number called score. It is 10. Add 5 to score. If score is greater than 10, show "Winner".`
- **Concise**: `let score = 10; score = score + 5; if score > 10: show "Winner"`

Both surface forms resolve to the identical AST nodes:

```mermaid
graph TD
    Root["🌲 Program (Canonical AST Root)"]

    %% Variable Declaration
    Root --> Decl["1: VariableDeclaration"]
    Decl --> D_Type["dataType: 'number'"]
    Decl --> D_Id["identifier: 'score'"]
    Decl --> D_Init["initializer: NumberLiteral (10)"]

    %% Assignment / Mutation
    Root --> Mut["2: AssignmentStatement"]
    Mut --> M_Target["target: 'score'"]
    Mut --> M_Expr["expression: BinaryExpression (+)"]
    M_Expr --> M_Left["left: Identifier ('score')"]
    M_Expr --> M_Right["right: NumberLiteral (5)"]

    %% If Branch
    Root --> IfNode["3: IfStatement"]
    IfNode --> Cond["condition: BinaryExpression (>)"]
    Cond --> C_Left["left: Identifier ('score')"]
    Cond --> C_Right["right: NumberLiteral (10)"]
    IfNode --> ThenB["thenBranch: StatementList"]
    ThenB --> PrintNode["PrintStatement"]
    PrintNode --> P_Val["expression: StringLiteral ('Winner')"]

    %% Styling
    style Root fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    style Decl fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#ecfdf5
    style Mut fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#ecfdf5
    style IfNode fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#ecfdf5
    style M_Expr fill:#1e1b4b,stroke:#818cf8,stroke-width:1px,color:#e0e7ff
    style Cond fill:#1e1b4b,stroke:#818cf8,stroke-width:1px,color:#e0e7ff
    style PrintNode fill:#831843,stroke:#f43f5e,stroke-width:1px,color:#fff1f2
```

---

## 4. Why Both Concise and Natural Styles Exist

A common criticism of English-like programming is:
> *"Why would an experienced programmer type 'If score is greater than 10, show You won' when they can just write 'if score > 10: print("You won")'?"*

This objection is completely valid. If a language forces everyone to type long sentences, veteran programmers will reject it as too slow and verbose.

NP-LANG solves this by refusing to force a single style:

| Style | Purpose | Example |
| :--- | :--- | :--- |
| **Concise Mode** | Rapid writing for experienced coders | `let score = 10`<br>`score = score + 5`<br>`show score` |
| **Natural English** | Intuitive ideation for beginners & vibe coders | `I have a number called score. It is 10.`<br>`Add 5 to score.`<br>`Show score.` |
| **Multilingual Dialect** | Accessible coding in native tongues | `Tengo un número llamado score. Es 10.`<br>`Sumar 5 a score.`<br>`Mostrar score.` |

Both styles compile down to the same instructions and execute with identical results.

---

## 5. Learning from the Failures of COBOL and AppleScript

Past attempts at natural-language programming (such as COBOL, SQL, and AppleScript) struggled with a fundamental design flaw:
1. **The Illusion of English**: They looked like conversational English, but strictly enforced arcane, rigid grammar rules.
2. **Cryptic Failure**: If a user wrote a slightly different, perfectly valid English sentence, the compiler failed with incomprehensible errors.
3. **No Short Form**: Experienced developers had no way to write concise code, leading to frustrating verbosity.

### How NP-LANG Avoids These Traps
1. **Explicit Equivalences**: Rather than pretending any arbitrary English sentence is valid code, NP-LANG defines deliberate sets of equivalent phrase patterns.
2. **Clear Diagnostics**: When a sentence cannot be parsed, the engine explains exactly what it was expecting and suggests working alternatives.
3. **Canonical AST as the Anchor**: The meaning is tied to a formal schema, not an ambiguous natural language parser guessing user intent.

---

## 6. The AI-Native Advantage

Large Language Models (LLMs) are revolutionary at generating ideas, but brittle at writing rigid source code across dozens of languages. A missing brace or misremembered library import can crash a build.

NP-LANG is AI-native because:
1. **Structured AST Interface**: An AI can output the program directly as structured JSON nodes (`VariableDeclaration`, `AssignmentStatement`, `IfStatement`).
2. **Zero Hallucinated Syntax**: By targeting the Canonical AST directly, an AI agent achieves 100% syntactically correct code generation.
3. **Instant Human Legibility**: The human developer can view that AI-generated AST projected into clean Natural English or Concise syntax instantly.

```mermaid
sequenceDiagram
    autonumber
    actor Dev as 🧑‍💻 Creator
    participant AI as 🤖 AI Assistant
    participant AST as 🌲 Canonical AST
    participant Transpiler as 🔄 NP-LANG Transpiler

    Dev->>AI: "Create an inventory tracker that checks if stock is low."
    AI->>AST: Generates structured JSON AST (Zero Syntax Hallucinations!)
    AST->>Transpiler: Transpile AST to Natural English
    Transpiler-->>Dev: Displays clean, readable instructions
    Dev->>Transpiler: Switches to Concise Mode (`stock < 5: show 'reorder'`)
    Dev->>AST: Changes 5 to 10
    AST-->>AI: Feeds back updated AST for next feature
```

