/*
√ Expression
    √ RightHandSideExpression
    √ LeftHandSideExpression = RightHandSideExpression

√ RightHandSideExpression
    √ LogicalORExpression

√ LogicalORExpression
    √ LogicalANDExpression
    √ LogicalORExpression || LogicalANDExpression

√ LogicalANDExpression
    √ EqualityExpression
    √ LogicalANDExpression && EqualityExpression

√ EqualityExpression
    √ RelationalExpression
    √ EqualityExpression === RelationalExpression
    √ EqualityExpression !== RelationalExpression

√ RelationalExpression
    √ AdditiveExpression
    √ RelationalExpression < AdditiveExpression
    √ RelationalExpression > AdditiveExpression
    √ RelationalExpression <= AdditiveExpression
    √ RelationalExpression >= AdditiveExpression

√ AdditiveExpression
    √ MultiplicativeExpression
    √ AdditiveExpression + MultiplicativeExpression
    √ AdditiveExpression - MultiplicativeExpression

√ MultiplicativeExpression
    √ LeftHandSideExpression
    √ MultiplicativeExpression * LeftHandSideExpression
    √ MultiplicativeExpression / LeftHandSideExpression

√ LeftHandSideExpression
    √ MemberExpression
    √ MemberExpression Arguments

√ MemberExpression
    √ PrimaryExpression
    √ MemberExpression . Identifier
    √ MemberExpression [ Expression ]

√ Arguments
    √ ( )
    √ ( ArgumentList )

√ ArgumentList
    √ Expression
    √ ArgumentList , Expression

√ PrimaryExpression
    √ Identifier
    √ Literal
    √ ( Expression )

√ Literal
    √ NumericLiteral
    √ StringLiteral
    √ BooleanLiteral
    √ NullLiteral
    √ ObjectLiteral

√ ObjectLiteral
    √ { }
    √ { PropertyList }

√ PropertyList
    √ Property
    √ PropertyList , Property

√ Property
    √ Identifier : RightHandSideExpression
    √ StringLiteral : RightHandSideExpression
*/


export function Expression(source) {
    LeftHandSideExpression(source)
    if (source[0].type === 'LeftHandSideExpression' && source[1].type === '=') {
        let node = {
            type: 'Expression',
            children: [source.shift(), source.shift()]
        }
        RightHandSideExpression(source)
        if (source[0].type === 'RightHandSideExpression') {
            node.children.push(source.shift())
        }
        source.unshift(node)
        return
    }
    RightHandSideExpression(source)
    if (source[0].type === 'RightHandSideExpression') {
        let node = {
            type: 'Expression',
            children: [source.shift()]
        }
        source.unshift(node)
        return
    }
}


export function RightHandSideExpression(source) {
    LogicalORExpression(source)
    if (source[0].type === 'LogicalORExpression') {
        let node = {
            type: 'RightHandSideExpression',
            children: [source.shift()]
        }
        source.unshift(node)
    }
}


export function LogicalORExpression(source) {
    LogicalANDExpression(source)
    if (source[0].type === 'LogicalANDExpression') {
        let node = {
            type: 'LogicalORExpression',
            children: [source.shift()]
        }
        source.unshift(node)
        LogicalORExpression(source)
        return
    }
    if (source[0].type === 'LogicalORExpression' && source[1].type === '||') {
        let node = {
            type: 'LogicalORExpression',
            children: [source.shift(), source.shift()]
        }
        LogicalANDExpression(source)
        if (source[0].type === 'LogicalANDExpression') {
            node.children.push(source.shift())
        }
        source.unshift(node)
        LogicalORExpression(source)
        return
    }
}


export function LogicalANDExpression(source) {
    EqualityExpression(source)
    if (source[0].type === 'EqualityExpression') {
        let node = {
            type: 'LogicalANDExpression',
            children: [source.shift()]
        }
        source.unshift(node)
        LogicalANDExpression(source)
        return
    }
    if (source[0].type === 'LogicalANDExpression' && source[1].type === '&&') {
        let node = {
            type: 'LogicalANDExpression',
            children: [source.shift(), source.shift()]
        }
        EqualityExpression(source)
        if (source[0].type === 'EqualityExpression') {
            node.children.push(source.shift())
        }
        source.unshift(node)
        LogicalANDExpression(source)
        return
    }
}


export function EqualityExpression(source) {
    RelationalExpression(source)
    if (source[0].type === 'RelationalExpression') {
        let node = {
            type: 'EqualityExpression',
            children: [source.shift()]
        }
        source.unshift(node)
        EqualityExpression(source)
        return
    }
    if (source[0].type === 'EqualityExpression' && source[1].type === '===') {
        let node = {
            type: 'EqualityExpression',
            operator: '===',
            children: [source.shift(), source.shift()]
        }
        RelationalExpression(source)
        if (source[0].type === 'RelationalExpression') {
            node.children.push(source.shift())
        }
        source.unshift(node)
        return
    }
    if (source[0].type === 'EqualityExpression' && source[1].type === '!==') {
        let node = {
            type: 'EqualityExpression',
            operator: '!==',
            children: [source.shift(), source.shift()]
        }
        RelationalExpression(source)
        if (source[0].type === 'RelationalExpression') {
            node.children.push(source.shift())
        }
        source.unshift(node)
        return
    }
}


export function RelationalExpression(source) {
    AdditiveExpression(source)
    if (source[0].type === 'AdditiveExpression') {
        let node = {
            type: 'RelationalExpression',
            children: [source.shift()]
        }
        source.unshift(node)
        RelationalExpression(source)
        return
    }
    if (source[0].type === 'RelationalExpression' && ['<', '>', '<=', '>='].includes(source[1].type)) {
        let node = {
            type: 'RelationalExpression',
            children: [source.shift(), source.shift()]
        }
        AdditiveExpression(source)
        if (source[0].type === 'AdditiveExpression') {
            node.children.push(source.shift())
        }
        source.unshift(node)
        return
    }
}


export function AdditiveExpression(source) {
    MultiplicativeExpression(source)
    if (source[0].type === 'MultiplicativeExpression') {
        let node = {
            type: 'AdditiveExpression',
            children: [source.shift()]
        }
        source.unshift(node)
        AdditiveExpression(source)
        return
    }
    if (source[0].type === 'AdditiveExpression' && source[1].type === '+') {
        let node = {
            type: 'AdditiveExpression',
            operator: '+',
            children: [source.shift(), source.shift()]
        }
        MultiplicativeExpression(source)
        node.children.push(source.shift())
        source.unshift(node)
        AdditiveExpression(source)
        return
    }
    if (source[0].type === 'AdditiveExpression' && source[1].type === '-') {
        let node = {
            type: 'AdditiveExpression',
            operator: '-',
            children: [source.shift(), source.shift()]
        }
        MultiplicativeExpression(source)
        node.children.push(source.shift())
        source.unshift(node)
        AdditiveExpression(source)
        return
    }
}


export function MultiplicativeExpression(source) {
    LeftHandSideExpression(source)
    if (source[0].type === 'LeftHandSideExpression') {
        let node = {
            type: 'MultiplicativeExpression',
            children: [source.shift()]
        }
        source.unshift(node)
        MultiplicativeExpression(source)
        return
    }
    if (source[0].type === 'MultiplicativeExpression' && source[1].type === '*') {
        let node = {
            type: 'MultiplicativeExpression',
            operator: '*',
            children: [source.shift(), source.shift()]
        }
        LeftHandSideExpression(source)
        if (source[0].type === 'LeftHandSideExpression') {
            node.children.push(source.shift())
            source.unshift(node)
        }
        MultiplicativeExpression(source)
        return
    }
    if (source[0].type === 'MultiplicativeExpression' && source[1].type === '/') {
        let node = {
            type: 'MultiplicativeExpression',
            operator: '/',
            children: [source.shift(), source.shift()]
        }
        LeftHandSideExpression(source)
        if (source[0].type === 'LeftHandSideExpression') {
            node.children.push(source.shift())
            source.unshift(node)
        }
        MultiplicativeExpression(source)
        return
    }
}


export function LeftHandSideExpression(source) {
    MemberExpression(source)
    if (source[0].type === 'MemberExpression') {
        let node = {
            type: 'LeftHandSideExpression',
            children: [source.shift()]
        }
        Arguments(source)
        if (source[0].type === 'Arguments') {
            node.children.push(source.shift())
        }
        source.unshift(node)
    }
}


export function MemberExpression(source) {
    PrimaryExpression(source)
    if (source[0].type === 'PrimaryExpression') {
        let node = {
            type: 'MemberExpression',
            children: [source.shift()]
        }
        source.unshift(node)
        MemberExpression(source)
        return
    }
    if (source[0].type === 'MemberExpression' && source[1].type === '.' && source[2].type === 'Identifier') {
        let node = {
            type: 'MemberExpression',
            children: [source.shift(), source.shift(), source.shift()]
        }
        source.unshift(node)
        MemberExpression(source)
        return
    }
    if (source[0].type === 'MemberExpression' && source[1].type === '[') {
        let node = {
            type: 'MemberExpression',
            children: [source.shift(), source.shift()]
        }
        Expression(source)
        if (source[0].type === 'Expression' && source[1].type === ']') {
            node.children.push(source.shift(), source.shift())
        }
        source.unshift(node)
    }
}


export function Arguments(source) {
    if (source[0].type === '(') {
        let node = {
            type: 'Arguments',
            children: [source.shift()]
        }
        ArgumentList(source)
        if (source[0].type === 'ArgumentList') {
            node.children.push(source.shift())
        }
        if (source[0].type === ')') {
            node.children.push(source.shift())
        }
        source.unshift(node)
    }
}


export function ArgumentList(source) {
    Expression(source)
    if (source[0].type === 'Expression') {
        let node = {
            type: 'ArgumentList',
            children: [source.shift()]
        }
        source.unshift(node)
        ArgumentList(source)
        return
    }
    if (source[0].type === 'ArgumentList' && source[1].type === ',') {
        let node = {
            type: 'ArgumentList',
            children: [source.shift(), source.shift()]
        }
        Expression(source)
        if (source[0].type === 'Expression') {
            node.children.push(source.shift())
        }
        source.unshift(node)
        ArgumentList(source)
        return
    }
}


export function PrimaryExpression(source) {
    if (source[0].type === 'Identifier') {
        let node = {
            type: 'PrimaryExpression',
            children: [source.shift()]
        }
        source.unshift(node)
        return
    }
    Literal(source)
    if (source[0].type === 'Literal') {
        let node = {
            type: 'PrimaryExpression',
            children: [source.shift()]
        }
        source.unshift(node)
        return
    }
    if (source[0].type === '(') {
        let node = {
            type: 'PrimaryExpression',
            children: [source.shift()]
        }
        Expression(source)
        if (source[0].type === 'Expression' && source[1].type === ')') {
            node.children.push(source.shift(), source.shift())
        }
        source.unshift(node)
        return
    }
}


export function Literal(source) {
    ObjectLiteral(source)
    if (['NumericLiteral', 'StringLiteral', 'BooleanLiteral', 'NullLiteral', 'ObjectLiteral'].includes(source[0].type)) {
        let node = {
            type: 'Literal',
            children: [source.shift()]
        }
        source.unshift(node)
        return
    }
}


export function ObjectLiteral(source) {
    if (source[0].type === '{') {
        let node = {
            type: 'ObjectLiteral',
            children: [source.shift()]
        }
        PropertyList(source)
        if (source[0].type === 'PropertyList') {
            node.children.push(source.shift())
        }
        if (source[0].type === '}') {
            node.children.push(source.shift())
        }
        source.unshift(node)
    }
}


export function PropertyList(source) {
    Property(source)
    if (source[0].type === 'Property') {
        let node = {
            type: 'PropertyList',
            children: [source.shift()]
        }
        source.unshift(node)
        PropertyList(source)
        return
    }
    if (source[0].type === 'PropertyList' && source[1].type === ',') {
        let node = {
            type: 'PropertyList',
            children: [source.shift(), source.shift()]
        }
        Property(source)
        node.children.push(source.shift())
        source.unshift(node)
        PropertyList(source)
        return
    }
}


export function Property(source) {
    if (['Identifier', 'StringLiteral'].includes(source[0].type) && source[1].type === ':') {
        let node = {
            type: 'Property',
            children: [source.shift(), source.shift()]
        }
        RightHandSideExpression(source)
        if (source[0].type === 'RightHandSideExpression') {
            node.children.push(source.shift())
        }
        source.unshift(node)
    }
}
