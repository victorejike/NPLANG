<p align="center">
  <img src="../../docs/assets/logo.jpg" alt="NP-LANG Logo" width="130" style="border-radius: 20px;" />
</p>

# NP-LANG Specification v0.1

This document specifies the initial instruction set supported by the NP-LANG Core Engine and Interactive Playground. Every human surface syntax projects down to the formal Abstract Semantic Tree (AST) node structures detailed below.

---

## 1. Value Creation (Variable Declaration)

### Canonical AST Node Tree
```mermaid
graph TD
    Node["Node: VariableDeclaration"]
    Node --> Id["identifier: 'score'"]
    Node --> Type["dataType: 'number' | 'string' (inferred)"]
    Node --> Init["initializer: Expression"]
    Init --> Lit["NumberLiteral: 10"]

    style Node fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#ecfdf5
    style Id fill:#0f172a,stroke:#38bdf8,stroke-width:1px,color:#f8fafc
    style Init fill:#1e1b4b,stroke:#818cf8,stroke-width:1px,color:#e0e7ff
```

### Concise Syntax
```
let <id> = <expr>
<id> = <expr>
```
*Example*: `let score = 10`

### Natural English
```
I have a number called <id>. It is <expr>.
Create <id> with value <expr>.
Let <id> be <expr>.
```
*Example*: `I have a number called score. It is 10.`

### Yoruba Dialect
```
Mo ní nọ́mbà kan tí à ń pè ní <id>. Ó jẹ́ <expr>.
Jẹ ki <id> jẹ <expr>.
Ṣẹ̀dá <id> pẹ̀lú iye <expr>.
```
*Example*: `Jẹ ki score jẹ 10.`

---

## 2. Value Mutation (Assignment & Arithmetic)

### Canonical AST Node Tree
```mermaid
graph TD
    Node["Node: AssignmentStatement"]
    Node --> Target["target: 'score'"]
    Node --> Expr["expression: BinaryExpression (+)"]
    Expr --> Left["left: Identifier ('score')"]
    Expr --> Right["right: NumberLiteral (5)"]

    style Node fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#ecfdf5
    style Target fill:#0f172a,stroke:#38bdf8,stroke-width:1px,color:#f8fafc
    style Expr fill:#1e1b4b,stroke:#818cf8,stroke-width:1px,color:#e0e7ff
```

### Concise Syntax
```
<id> = <expr>
add <expr> to <id>
subtract <expr> from <id>
multiply <id> by <expr>
divide <id> by <expr>
```
*Example*: `score = score + 5` or `add 5 to score`

### Natural English
```
Add <expr> to <id>.
Subtract <expr> from <id>.
Multiply <id> by <expr>.
Divide <id> by <expr>.
Set <id> to <expr>.
Change <id> to <expr>.
```
*Example*: `Add 5 to score.`

### Yoruba Dialect
```
Fi <expr> kún <id>.
Yọ <expr> kúrò nínú <id>.
Sọ <id> di <expr>.
```
*Example*: `Fi 5 kún score.`

---

## 3. Display / Output

### Canonical AST Node Tree
```mermaid
graph TD
    Node["Node: PrintStatement"]
    Node --> Expr["expression: Expression"]
    Expr --> Lit["StringLiteral: 'You won!'"]
    Expr -.-> Alt["Identifier: score"]

    style Node fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#ecfdf5
    style Expr fill:#1e1b4b,stroke:#818cf8,stroke-width:1px,color:#e0e7ff
    style Lit fill:#831843,stroke:#f43f5e,stroke-width:1px,color:#fff1f2
```

### Concise Syntax
```
show <expr>
print <expr>
```
*Example*: `show score`

### Natural English
```
Show <expr>.
Display <expr>.
Tell me <expr>.
Print <expr>.
```
*Example*: `Show score.` or `Tell me "You won".`

### Yoruba Dialect
```
Fi <expr> hàn.
Sọ fún mi <expr>.
Sọ <expr>.
```
*Example*: `Fi score hàn.` or `Sọ fún mi "O ti borí".`

---

## 4. Conditional Branching

### Canonical AST Node Tree
```mermaid
graph TD
    Node["Node: IfStatement"]
    Node --> Cond["condition: BinaryExpression (>)"]
    Cond --> C_Left["left: Identifier ('score')"]
    Cond --> C_Right["right: NumberLiteral (10)"]
    Node --> Then["thenBranch: StatementList"]
    Then --> Stmt["PrintStatement ('Winner')"]

    style Node fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#ecfdf5
    style Cond fill:#1e1b4b,stroke:#818cf8,stroke-width:1px,color:#e0e7ff
    style Then fill:#0f172a,stroke:#38bdf8,stroke-width:1px,color:#f8fafc
```

### Concise Syntax
```
if <condition>: <statement>
if <condition>:
    <statement...>
```
*Example*: `if score > 10: show "Winner"`

### Natural English
```
If <condition>, show <expr>.
If <condition>, then <statement>.
When <condition>, <statement>.
```
*Example*: `If score is greater than 10, show "Winner".`

### Yoruba Dialect
```
Bí <condition> bá rí bẹ́ẹ̀, <statement>.
Bí <condition> bá ju <expr> lọ, <statement>.
Nígbà tí <condition>, <statement>.
```
*Example*: `Bí score bá ju 10 lọ, fi "Winner" hàn.`

---

## 5. Repetition / Loops

### Canonical AST Node Tree
```mermaid
graph TD
    Node["Node: RepeatStatement"]
    Node --> Count["count: Expression"]
    Count --> Lit["NumberLiteral: 3"]
    Node --> Body["body: StatementList"]
    Body --> Stmt["PrintStatement ('Hello')"]

    style Node fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#ecfdf5
    style Count fill:#1e1b4b,stroke:#818cf8,stroke-width:1px,color:#e0e7ff
    style Body fill:#0f172a,stroke:#38bdf8,stroke-width:1px,color:#f8fafc
```

### Concise Syntax
```
repeat <n>: <statement>
repeat <n> times:
    <statement...>
```
*Example*: `repeat 5: show "Hello"`

### Natural English
```
Repeat <n> times: <statement>.
Do this <n> times: <statement>.
```
*Example*: `Do this 5 times: show "Hello".`

### Yoruba Dialect
```
Ṣe èyí ní ẹ̀mẹwàá <n>: <statement>.
Tún ṣe ní ẹ̀mẹwàá <n>: <statement>.
```
*Example*: `Ṣe èyí ní ẹ̀mẹwàá 5: fi "Hello" hàn.`

---

## 6. Expressions and Comparisons

### Canonical AST Node Tree (BinaryExpression)
```mermaid
graph TD
    Node["Node: BinaryExpression"]
    Node --> Left["left: Expression (Identifier: 'score')"]
    Node --> Op["operator: '+' | '-' | '*' | '/' | '>' | '<' | '==' | '!='"]
    Node --> Right["right: Expression (NumberLiteral: 5)"]

    style Node fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#e0e7ff
    style Op fill:#831843,stroke:#f43f5e,stroke-width:1px,color:#fff1f2
```

| Concept | Concise | Natural English | Yoruba |
| :--- | :--- | :--- | :--- |
| Greater than | `a > b` | `a is greater than b`, `a is more than b` | `a ju b lọ` |
| Less than | `a < b` | `a is less than b`, `a is smaller than b` | `a kere ju b lọ` |
| Equal to | `a == b` | `a is equal to b`, `a is b` | `a dọ́gba pẹ̀lú b` |
| Not equal to | `a != b` | `a is not equal to b`, `a is not b` | `a kò dọ́gba pẹ̀lú b` |
| Addition | `a + b` | `a plus b`, `add a and b` | `a àti b`, `fi a kún b` |
| Subtraction | `a - b` | `a minus b` | `a yọ b` |
| Multiplication | `a * b` | `a times b`, `a multiplied by b` | `a sọ di b` |
| Division | `a / b` | `a divided by b` | `a pín sí b` |

---

## 7. Complete Program Compound AST Tree

When multiple statements are written together, they assemble into an ordered `StatementList` within the root `Program` node:

```mermaid
graph TD
    Root["🌲 Program (Root)"]

    %% Child 1
    Root --> N1["1: VariableDeclaration ('score' = 10)"]
    N1 --> N1_Id["id: 'score'"]
    N1 --> N1_Val["value: 10"]

    %% Child 2
    Root --> N2["2: AssignmentStatement ('score' += 5)"]
    N2 --> N2_Id["target: 'score'"]
    N2 --> N2_Expr["BinaryExpression (+)"]
    N2_Expr --> N2_L["score"]
    N2_Expr --> N2_R["5"]

    %% Child 3
    Root --> N3["3: IfStatement ('score' > 10)"]
    N3 --> N3_Cond["BinaryExpression (>)"]
    N3 --> N3_Body["StatementList"]
    N3_Body --> N3_Print["PrintStatement ('You won!')"]

    %% Child 4
    Root --> N4["4: RepeatStatement (3 times)"]
    N4 --> N4_Count["count: 3"]
    N4 --> N4_Body["StatementList"]
    N4_Body --> N4_Print["PrintStatement ('Bravo!')"]

    %% Styling
    style Root fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    style N1 fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#ecfdf5
    style N2 fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#ecfdf5
    style N3 fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#ecfdf5
    style N4 fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#ecfdf5
    style N2_Expr fill:#1e1b4b,stroke:#818cf8,stroke-width:1px,color:#e0e7ff
    style N3_Cond fill:#1e1b4b,stroke:#818cf8,stroke-width:1px,color:#e0e7ff
```

