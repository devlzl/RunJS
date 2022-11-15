import { Reference } from '../runtime/SpecificationTypes.js'
import { BooleanType, NumberType, NullType, ObjectType, StringType } from '../runtime/LanguageTypes.js'


export function Expression(node) {
    if (node.children.length === 1) {
        return this.evaluate(node.children[0])
    }
    let left = this.evaluate(node.children[0])
    let right = this.evaluate(node.children[2])
    left.set(right)
}


export function RightHandSideExpression(node) {
    return this.evaluate(node.children[0])
}


export function LogicalORExpression(node) {
    if (node.children.length === 1) {
        return this.evaluate(node.children[0])
    }
    let result = this.evaluate(node.children[0])
    if (result.toBoolean().value) {
        // 短路判断
        return
    } else {
        return this.evaluate(node.children[2])
    }
}


export function LogicalANDExpression(node) {
    if (node.children.length === 1) {
        return this.evaluate(node.children[0])
    }
    let result = this.evaluate(node.children[0])
    if (!result.toBoolean().value) {
        // 短路判断
        return result
    } else {
        return this.evaluate(node.children[2])
    }
}


export function EqualityExpression(node) {
    if (node.children.length === 1) {
        return this.evaluate(node.children[0])
    }
    let left = this.evaluate(node.children[0])
    let right = this.evaluate(node.children[2])
    if (left instanceof Reference) {
        left = left.get()
    }
    if (right instanceof Reference) {
        right = right.get()
    }
    if (node.children[1].type === '===') {
        return new BooleanType(left.value === right.value)
    } else if (node.children[1].type === '!==') {
        return new BooleanType(left.value !== right.value)
    }
}


export function RelationalExpression(node) {
    if (node.children.length === 1) {
        return this.evaluate(node.children[0])
    }
    let left = this.evaluate(node.children[0])
    let right = this.evaluate(node.children[2])
    if (left instanceof Reference) {
        left = left.get()
    }
    if (right instanceof Reference) {
        right = right.get()
    }
    if (node.children[1].type === '<') {
        return new BooleanType(left.value < right.value)
    } else if (node.children[1].type === '>') {
        return new BooleanType(left.value > right.value)
    } else if (node.children[1].type === '<=') {
        return new BooleanType(left.value <= right.value)
    } else if (node.children[1].type === '>=') {
        return new BooleanType(left.value >= right.value)
    }
}


export function AdditiveExpression(node) {
    if (node.children.length === 1) {
        return this.evaluate(node.children[0])
    }
    let left = this.evaluate(node.children[0])
    let right = this.evaluate(node.children[2])
    if (left instanceof Reference) {
        left = left.get()
    }
    if (right instanceof Reference) {
        right = right.get()
    }
    if (node.children[1].type === '+') {
        return new NumberType(left.value + right.value)
    } else if (node.children[1].type === '-') {
        return new NumberType(left.value - right.value)
    }
}


export function MultiplicativeExpression(node) {
    if (node.children.length === 1) {
        return this.evaluate(node.children[0])
    }
    let left = this.evaluate(node.children[0])
    let right = this.evaluate(node.children[2])
    if (left instanceof Reference) {
        left = left.get()
    }
    if (right instanceof Reference) {
        right = right.get()
    }
    if (node.children[1].type === '*') {
        return new NumberType(left.value * right.value)
    } else if (node.children[1].type === '/') {
        return new NumberType(left.value / right.value)
    }
}


export function LeftHandSideExpression(node) {
    if (node.children.length === 1) {
        return this.evaluate(node.children[0])
    }
    let func = this.evaluate(node.children[0])
    let args = this.evaluate(node.children[1])
    if (func instanceof Reference) {
        func = func.get()
    }
    return func.call(...args)
}


export function MemberExpression(node) {
    if (node.children.length === 1) {
        return this.evaluate(node.children[0])
    }
    if (node.children.length === 3) {
        let obj = this.evaluate(node.children[0]).get()
        let key = node.children[2].value
        return obj.get(key)
    }
    if (node.children.length === 4) {
        let obj = this.evaluate(node.children[0]).get()
        let key = this.evaluate(node.children[2]).get().value
        return obj.get(key)
    }
}


export function Identifier(node) {
    let runningEC = this.ECStack[this.ECStack.length - 1]
    return new Reference(runningEC.lexicalEnvironment, node.value)
}


export function Arguments(node) {
    if (node.children.length === 2) {
        return []
    }
    return this.evaluate(node.children[1])
}


export function ArgumentList(node) {
    if (node.children.length === 1) {
        let result = this.evaluate(node.children[0])
        if (result instanceof Reference) {
            result = result.get()
        }
        return [result]
    }
    let result = this.evaluate(node.children[2])
    if (result instanceof Reference) {
        result = result.get()
    }
    return [...this.evaluate(node.children[0]), result]
}


export function PrimaryExpression(node) {
    if (node.children.length === 1) {
        return this.evaluate(node.children[0])
    }
    return this.evaluate(node.children[1])
}


export function Literal(node) {
    return this.evaluate(node.children[0])
}


export function NumericLiteral(node) {
    let value = node.value
    let result = 0
    for (let i = 0; i < value.length; i++) {
        result = result * 10 + (value[i].charCodeAt() - '0'.charCodeAt())
    }
    return new NumberType(result)
}


export function StringLiteral(node) {
    return new StringType(node.value)
}


export function BooleanLiteral(node) {
    if (node.value === 'true') {
        return new BooleanType(true)
    } else {
        return new BooleanType(false)
    }
}


export function NullLiteral(node) {
    return new NullType()
}


export function ObjectLiteral(node) {
    if (node.children.length === 2) {
        return new ObjectType()
    }
    let object = new ObjectType()
    let properties = this.evaluate(node.children[1])
    for (let property of properties) {
        let { key, value } = property
        object.set(key, value)
    }
    return object
}


export function PropertyList(node) {
    let properties = []
    if (node.children.length === 1) {
        properties.push(this.evaluate(node.children[0]))
        return properties
    }
    properties.push(...this.evaluate(node.children[0]), this.evaluate(node.children[2]))
    return properties
}


export function Property(node) {
    let key = ''
    if (node.children[0].type === 'Identifier') {
        key = node.children[0].value
    } else if (node.children[0].type === 'StringLiteral') {
        key = this.evaluate(node.children[0]).value
    }
    let value = this.evaluate(node.children[2])
    return { key, value }
}
