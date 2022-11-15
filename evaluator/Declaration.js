import { ObjectType, UndefinedType } from '../runtime/LanguageTypes.js'
import { ExecutionContext } from '../runtime/ExecutionContext.js'
import { LexicalEnvironment, CompletionRecord } from '../runtime/SpecificationTypes.js'


export function Declaration(node) {
    return this.evaluate(node.children[0])
}


export function VariableDeclaration(node) {
    let name = node.children[1].value
    let value = new UndefinedType()
    let runningEC = this.ECStack[this.ECStack.length - 1]
    runningEC.lexicalEnvironment.add(name)
    if (node.children[3]) {
        value = this.evaluate(node.children[3])
        runningEC.lexicalEnvironment.set(name, value)
    }
    return new CompletionRecord('normal', value)
}


export function FunctionDeclaration(node) {
    let name = node.children[1].value
    let parameters = node.children.length === 5 ? [] : this.evaluate(node.children[3])
    let code = node.children[node.children.length - 1]
    let func = new ObjectType()
    // 函数是一种特种的对象, 具有内部方法 [[call]]
    func.call = (...args) => {
        for (let i = 0; i < args.length; i++) {
            func.environment.variables[parameters[i]] = args[i]
        }
        // 将 ExecutionContext 切换为定义函数时的
        let newEC = new ExecutionContext(this.realm, new LexicalEnvironment(func.environment))
        this.ECStack.push(newEC)
        let result = this.evaluate(code)
        this.ECStack.pop()
        return result.value
    }
    let runningEC = this.ECStack[this.ECStack.length - 1]
    runningEC.lexicalEnvironment.add(name)
    runningEC.lexicalEnvironment.set(name, func)
    // 函数中访问的外部变量, 和定义时强相关, 和调用时无关
    func.environment = runningEC.lexicalEnvironment
    return new CompletionRecord('normal', func)
}


export function ParameterList(node) {
    let parameters = []
    if (node.children.length === 1) {
        parameters.push(node.children[0].value)
    } else {
        parameters.push(...this.evaluate(node.children[0]), node.children[2].value)
    }
    return parameters
}
