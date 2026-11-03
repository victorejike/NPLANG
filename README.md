# NP-LANG: Natural Programming Language

> **"Code at the speed of thought, in the language of your mind."**

NP-LANG is a modern programming language designed to eliminate the artificial friction between human intent and executable software.

Instead of forcing creators to memorize arcane symbols or master multiple languages just to build an idea, NP-LANG provides a **multi-projection language system**:
- **Natural English** for beginners, conversational ideation, and vibe coders.
- **Concise Mode** for experienced engineers who want maximum brevity.
- **Native Dialects** (e.g. Yoruba, Spanish) to enable software creation in local mother tongues.
- **AI-Native Canonical AST** (JSON) so AI agents can write and refactor programs with 100% syntactic precision.

---

## 🚀 Quickstart

### 1. Install & Test
```bash
# Clone the repository
git clone https://github.com/victorejike/NPLANG.git
cd NPLANG

# Install all dependencies across the monorepo
npm install

# Run the automated test suite
npm test
```

### 2. Launch the Interactive Browser Playground
```bash
npm run dev
```
Open **[http://localhost:5180](http://localhost:5180)** in your browser to test NP-LANG live with zero installation!

### 3. Compile to Native Machine Binaries with the Rust Compiler (`nplc`)
```bash
# Build the native Rust compiler
cargo build --release --manifest-path compiler/Cargo.toml

# Compile an NP-LANG source file directly to a native Linux ELF binary
./compiler/target/release/nplc compile examples/score.np -o my_game

# Run the native binary! (Zero VM, zero node, raw CPU execution)
./my_game

# Or run on-the-fly:
./compiler/target/release/nplc run examples/spanish.np
```

---

## ⚡ The Same Program in Three Styles

Every style compiles down to the identical **Canonical AST**:

### 1. Natural English
```text
I have a number called score. It is 10.
Add 5 to score.
If score is greater than 10, show "You won!".
```

### 2. Concise Syntax
```text
let score = 10
score = score + 5
if score > 10: show "You won!"
```

### 3. Yoruba Dialect
```text
Mo ní nọ́mbà kan tí à ń pè ní score. Ó jẹ́ 10.
Fi 5 kún score.
Bí score bá ju 10 lọ, fi "You won!" hàn.
```

In the playground, you can write in any style and click the style switcher to automatically **bidirectionally project** your code into any other style in real time!

---

## 🏗️ Architecture

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
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                      Parser & Checker                       |
|  - Semantic verification & variable resolution              |
|  - Actionable, polite diagnostics                           |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                  Canonical AST (NP-IR)                      |
|  - JSON-serializable, AI-native structured schema           |
+-------------------------------------------------------------+
               |                               |
               v                               v
+-----------------------------+ +-----------------------------+
|   Interactive Evaluator     | |   Native Compiler (AOT)     |
|   (Browser / TypeScript)    | |   (Rust / LLVM / C backend) |
|  - Step-by-step trace       | |  - High-performance binary |
|  - Instant playground UI    | |  - Systems-level execution  |
+-----------------------------+ +-----------------------------+
```

---

## 📁 Repository Structure

```
NPLANG/
├── docs/
│   ├── vision.md              # Philosophy, principles, and target users
│   └── architecture.md        # Compiler pipeline and multi-projection design
├── spec/
│   └── v0.1/
│       └── grammar.md         # Formal grammar across all 3 styles
├── locales/
│   ├── en/dictionary.json     # English keyword and grammar mappings
│   └── yo/dictionary.json     # Yoruba keyword and grammar mappings
├── packages/
│   └── language-core/         # Standalone core engine
│       ├── src/types.ts       # Canonical AST, diagnostics, and trace types
│       ├── src/parser/        # Multi-style parser (Concise, English, Yoruba)
│       ├── src/checker/       # Semantic analysis and friendly error tips
│       ├── src/evaluator/     # Deterministic execution and step explanation
│       ├── src/translator/    # Bidirectional transpiler between styles
│       └── src/tests/         # Unit test suite
└── playground/                # Interactive web testing interface
    ├── src/App.tsx            # Editor, live trace, state inspector, and survey
    └── package.json           # Vite + React + Tailwind setup
```

---

## 📄 License
MIT © 2026 VICTOR EJIKE
