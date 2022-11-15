import { UndefinedType } from './LanguageTypes.js'


// 语句执行完, 产生一个记录
export class CompletionRecord {
    constructor(type, value, target) {
        this.type = type ?? 'normal'    // normal | break | continue | return | throw
        this.value = value ?? new UndefinedType()
        this.target = target ?? null
    }
}


// 词法环境, 即函数"定义"时的上下文
export class LexicalEnvironment {
    constructor(outer) {
        this.variables = {}
        this.outer = outer
    }
    add(name) {
        this.variables[name] = new UndefinedType()
    }
    get(name) {
        if (this.variables[name]) {
            return this.variables[name]
        } else if (this.outer) {
            return this.outer.get(name)
        } else {
            return new UndefinedType()
        }
    }
    set(name, value = new UndefinedType()) {
        if (this.variables[name]) {
            this.variables[name] = value
            return value
        } else if (this.outer) {
            return this.outer.set(name, value)
        } else {
            this.variables[name] = value
            return value
        }
    }
}


// Identifier 被存为一个 Reference
export class Reference {
    // object 一般是一个 lexicalEnvironment, 暴露了 set / get 方法
    constructor(object, property) {
        this.object = object
        this.property = property
    }
    set(value) {
        return this.object.set(this.property, value)
    }
    get() {
        return this.object.get(this.property)
    }
}
