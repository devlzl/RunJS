/*
ExecutionContext (执行上下文)
    realm (基础库和内置对象实例)
    lexicalEnvironment (词法环境, 即函数"定义"时的上下文)
        variables (局部变量)
        outer (对外层 lexicalEnvironment 的引用)

当一个函数执行时, 会创建一条新的 ExecutionContext, 并压入 Execution Context Stack, 栈顶元素称为 RunningExecutionContext
*/
export class ExecutionContext {
    constructor(realm, lexicalEnvironment) {
        this.realm = realm
        this.lexicalEnvironment = lexicalEnvironment
    }
}
