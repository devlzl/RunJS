# RunJS JavaScript Engine

## 1. Introduction
RunJS is a small JavaScript engine written in JavaScript,  no external dependency.

It includes a set of classic JavaScript features in reference to the ECMA-262 Language Specification.

[Online Demo](https://devlzl.github.io/RunJS/)  


##  2. Usage
`main.js` provides a `run` function that accepts JavaScript source code as an argument.

You can import `run` anywhere and execute it.


## 3. Specifications
### 3.1 Language support
- Primitive data types and object
- Arithmetic and logical operations
- Conditional and iteration statements
- Function and scope

### 3.2 Standard library
```JavaScript
// Similar to console.log()
log(...args);
```


## 4. Internals
### 4.1 Lexer
Implemented lexical analysis using regular expressions.

### 4.2 Parser
Implemented syntax analysis from scratch according to LL algorithm, and construct AST.

### 4.3 Runtime
Implemented a set of runtime infrastructure:
- LanguageTypes
    - NumberType (represented as Float64Array)
    - StringType (represented as Uint16Array)
    - BooleanType
    - ObjectType
    - UndefinedType
    - NullType
- Realm
    - The `log` function is registered here
- SpecificationTypes
    - CompletionRecord
    - LexicalEnvironment
    - Reference
- ExecutionContext

### 4.4 Evaluator
When a new instance of the JavaScript engine is created, Realm will be created, ExecutionContextStack will be initialized, AST will be traversed and interpreted.
