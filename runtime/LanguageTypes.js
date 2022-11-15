export class LanguageType {
    get type() {
        return this.constructor.name.slice(0, -4).toLowerCase()
    }
}


export class NumberType extends LanguageType {
    constructor(value) {
        super()
        this.memory = new ArrayBuffer(8)
        this.view = new Float64Array(this.memory)
        this.view[0] = value
    }
    get value() {
        return this.view[0]
    }
    toNumber() {
        return this
    }
    toString() {
        let sign = this.value > 0 ? '' : '-'
        let value = Math.abs(this.value)
        let result = ''
        while (value > 0) {
            result = String(value % 10) + result
            value = Math.floor(value / 10)
        }
        return new StringType(sign + result)
    }
    toBoolean() {
        if (this.value !== 0) {
            return new BooleanType(true)
        } else {
            return new BooleanType(false)
        }
    }
}


export class StringType extends LanguageType {
    constructor(value) {
        super()
        value = value.slice(1, -1)
        this.memory = new ArrayBuffer(value.length * 2)
        this.view = new Uint16Array(this.memory)
        for (let i = 0; i < value.length; i++) {
            this.view[i] = value[i].codePointAt()
        }
    }
    get value() {
        let result = ''
        for (let code of this.view) {
            result += String.fromCodePoint(code)
        }
        return result
    }
    toNumber() {
        let value = node.value
        let result = 0
        for (let i = 0; i < value.length; i++) {
            result = result * 10 + (value[i].charCodeAt() - '0'.charCodeAt())
        }
        return new NumberType(result)
    }
    toString() {
        return this
    }
    toBoolean() {
        if (this.memory.byteLength > 0) {
            return new BooleanType(true)
        } else {
            return new BooleanType(false)
        }
    }
}


export class BooleanType extends LanguageType {
    constructor(value) {
        super()
        this.value = value || false
    }
    toNumber() {
        if (this.value) {
            return new NumberType(1)
        } else {
            return new NumberType(0)
        }
    }
    toString() {
        if (this.value) {
            return new StringType('true')
        } else {
            return new StringType('false')
        }
    }
    toBoolean() {
        return this
    }
}


export class ObjectType extends LanguageType {
    constructor(prototype = new NullType()) {
        super()
        this.properties = {}
        this.prototype = prototype  // [[prototype]]
    }
    get(name) {
        return this.getProperty(name)
    }
    set(name, value) {
        this.setProperty(name, {
            value: value,
            writable: true,
            enumerable: true,
            configurable: true,
        })
    }
    getProperty(name) {
        if (name in this.properties) {
            return this.properties[name]
        } else {
            return this.prototype?.getProperty(name)
        }
    }
    setProperty(name, attributes) {
        this.properties[name] = attributes
    }
    getPrototype() {
        return this.prototype
    }
    setPrototype(prototype) {
        this.prototype = prototype
    }
}


export class UndefinedType extends LanguageType {
    toNumber() {
        return new NumberType(NaN)
    }
    toString() {
        return new StringType('undefined')
    }
    toBoolean() {
        return new BooleanType(false)
    }
}


export class NullType extends LanguageType {
    toNumber() {
        return new NumberType(0)
    }
    toString() {
        return new StringType('null')
    }
    toBoolean() {
        return new BooleanType(false)
    }
}
