use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Expression {
    NumberLiteral {
        value: f64,
        raw: String,
    },
    StringLiteral {
        value: String,
        raw: String,
    },
    BooleanLiteral {
        value: bool,
        raw: String,
    },
    Identifier {
        name: String,
    },
    BinaryExpression {
        operator: String,
        left: Box<Expression>,
        right: Box<Expression>,
    },
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Statement {
    VariableDeclaration {
        id: String,
        value: Expression,
        #[serde(rename = "inferredType")]
        inferred_type: String,
    },
    AssignmentStatement {
        id: String,
        value: Expression,
    },
    PrintStatement {
        expression: Expression,
    },
    IfStatement {
        condition: Expression,
        #[serde(rename = "thenBranch")]
        then_branch: Vec<Statement>,
    },
    RepeatStatement {
        count: Expression,
        body: Vec<Statement>,
    },
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Program {
    #[serde(rename = "type")]
    pub node_type: String,
    pub body: Vec<Statement>,
}
