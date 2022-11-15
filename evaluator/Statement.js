import { ExecutionContext } from '../runtime/ExecutionContext.js'
import { LexicalEnvironment, Reference, CompletionRecord } from '../runtime/SpecificationTypes.js'


export function StatementList(node) {
    if (node.children.length === 1) {
        return this.evaluate(node.children[0])
    } else {
        let record = this.evaluate(node.children[0])
        if (record.type === 'normal') {
            return this.evaluate(node.children[1])
        } else {
            return record
        }
    }
}


export function Statement(node) {
    let result = this.evaluate(node.children[0])
    return result
}


export function Block(node) {
    let runningEC = this.ECStack[this.ECStack.length - 1]
    let newEC = new ExecutionContext(runningEC.realm, new LexicalEnvironment(runningEC.lexicalEnvironment))
    this.ECStack.push(newEC)
    let result = this.evaluate(node.children[1])
    this.ECStack.pop()
    return result
}


export function Declaration(node) {
    return this.evaluate(node.children[0])
}


export function IfStatement(node) {
    let condition = this.evaluate(node.children[2])
    if (condition instanceof Reference) {
        condition = condition.get()
    }
    if (condition.toBoolean().value) {
        return this.evaluate(node.children[4])
    } else if (node.children[6]) {
        return this.evaluate(node.children[6])
    } else {
        return new CompletionRecord('normal')
    }
}


export function WhileStatement(node) {
    while (true) {
        let condition = this.evaluate(node.children[2])
        if (condition instanceof Reference) {
            condition = condition.get()
        }
        if (condition.toBoolean().value) {
            let record = this.evaluate(node.children[4])
            if (record.type === 'continue') {
                continue
            }
            if (record.type === 'break') {
                // 当 while 把 break 消费掉的时候, 最终要把 while 语句的 CompletionRecord 置为 normal
                // 不然, 一个 break 就能 break 多层循环了
                return new CompletionRecord('normal')
            }
        } else {
            return new CompletionRecord('normal')
        }
    }
}


export function BreakStatement(node) {
    return new CompletionRecord('break')
}


export function ContinueStatement(node) {
    return new CompletionRecord('continue')
}


export function ReturnStatement(node) {
    if (node.children.length === 2) {
        return new CompletionRecord('return')
    }
    let result = this.evaluate(node.children[1])
    return new CompletionRecord('return', result)
}


export function ExpressionStatement(node) {
    let result = this.evaluate(node.children[0])
    if (result instanceof Reference) {
        result = result.get()
    }
    return new CompletionRecord('normal', result)
}
