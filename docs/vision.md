<p align="center">
  <img src="assets/logo.jpg" alt="NP-LANG Logo" width="130" style="border-radius: 20px;" />
</p>

# NP-LANG: Natural Programming Language

> **"Code at the speed of thought, in the language of your mind."**

---

## 💡 The Core Vision

```mermaid
flowchart TD
    Mind["💭 Human Idea / Mental Model\n('I want to calculate user bonus based on score')"]

    subgraph Projections ["🗣️ Express It Your Way"]
        direction LR
        P_EN["Natural English\n'If score > 10, add 5'"]
        P_CC["Concise Code\n'score > 10: score += 5'"]
        P_ES["Spanish Dialect\n'Si score > 10, sumar 5'"]
        P_AI["AI Agent\nJSON AST Schema"]
    end

    subgraph Anchor ["🌲 The Universal Anchor (NP-IR)"]
        AST["Canonical Abstract Semantic Tree\nUnambiguous, Mathematical Meaning"]
    end

    subgraph Power ["⚡ The Twin Execution Powers"]
        Web["🌐 Web Playground\nInstant Testing & Human Tracing"]
        Native["🚀 Bare-Metal AOT Binary\nHigh-Performance Native Machine Code"]
    end

    Mind --> Projections
    Projections --> Anchor
    Anchor --> Power

    style Mind fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    style Projections fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#e0e7ff
    style Anchor fill:#064e3b,stroke:#10b981,stroke-width:3px,color:#ecfdf5
    style Power fill:#831843,stroke:#f43f5e,stroke-width:2px,color:#fff1f2
```

---

## 1. The Core Problem

For over fifty years, writing software has required humans to adapt to computers rather than computers adapting to humans. 

A creator with a clear vision—whether for a mobile app, web platform, or embedded device—must overcome artificial barriers:
1. **The Syntax Tax**: Missing semicolons, obscure brackets, mismatched indentation, and cryptic compiler errors.
2. **Language Fragmentation**: Needing C/Rust for system performance, Python for machine learning, JavaScript for user interfaces, and SQL for databases.
3. **The Verbosity vs. Simplicity Trap**: Beginners are intimidated by complex ceremony; experienced engineers are alienated by verbose pseudo-English (the historic failure of COBOL and AppleScript).
4. **AI Hallucinations**: Modern AI models struggle with brittle text syntax across different languages, causing subtle bugs and compilation failures.

---

## 2. The NP-LANG Philosophy

NP-LANG is built on five foundational tenets:

### Tenet 1: Multi-Projection Semantics
A program's truth lives in a **Canonical Semantic AST (Abstract Semantic Tree)**. Source text is simply a lens or projection:
- **Natural English**: For beginners, vibe coders, and conversational ideation.
- **Concise Code**: For experienced developers who want compact, rapid syntax (`if score > 10: show "win"`).
- **Native Dialects**: For multilingual empowerment (e.g., Yoruba, Spanish).
- **AI Structured JSON**: For zero-syntax-error agentic generation and automated refactoring.

A developer can write in Natural English, switch the view to Concise code or Yoruba, and the program's behavior remains identical.

### Tenet 2: Learning from C and Rust
- **From C**: We inherit bare-metal simplicity, predictable memory layout, direct ABI compatibility, and zero-cost abstraction.
- **From Rust**: We inherit disciplined memory safety, expressive type systems, and compiler diagnostics that teach and guide rather than merely complain.
- **Beyond Both**: We remove the cognitive barrier of arcane syntax and lifelong language obsolescence.

### Tenet 3: Grounded Execution (Two-Phase Engineering)
We avoid the vaporware trap:
- **Phase 1 (Playground & Usability Validation)**: Instant, zero-installation browser engine with step-by-step execution traces and user feedback.
- **Phase 2 (Native Compiler Backend)**: Ahead-of-Time (AOT) compiler emitting native machine code (via LLVM and C intermediate targets) for production workloads.

---

## 3. Supported Audience

| Audience | How NP-LANG Serves Them |
| :--- | :--- |
| **Vibe Coders & Beginners** | Express ideas in plain sentences without learning esoteric syntax rules. |
| **Experienced Developers** | Concise mode provides maximum brevity with systems-level performance. |
| **Multilingual Creators** | Code in their native language (e.g., Yoruba) without English being a barrier. |
| **AI Agents & Assistants** | Manipulate ASTs directly as structured data without parsing text hallucinations. |
