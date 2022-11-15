import { Realm } from '../runtime/Realm.js'
import { ExecutionContext } from '../runtime/ExecutionContext.js'
import { LexicalEnvironment } from '../runtime/SpecificationTypes.js'
import * as Program from './Program.js'
import * as Statement from './Statement.js'
import * as Declaration from './Declaration.js'
import * as Expression from './Expression.js'


class Evaluator {
    constructor() {
        // 在 JavaScript 引擎的一个新实例被建立的时候
        this.realm = new Realm()
        this.ECStack = [
            new ExecutionContext(this.realm, new LexicalEnvironment(this.realm))
        ]
    }
    evaluate(node) {
        if (this[node.type]) {
            return this[node.type](node)
        }
    }
}
Object.assign(Evaluator.prototype, Program, Statement, Declaration, Expression)


export function evaluator(ast) {
    return (new Evaluator()).evaluate(ast)
}
