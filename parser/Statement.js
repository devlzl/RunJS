/*
√ StatementList
    √ Statement
    √ StatementList Statement

√ Statement
    √ Block
    √ Declaration
    √ IfStatement
    √ WhileStatement
    √ BreakStatement
    √ ContinueStatement
    √ ReturnStatement
    √ ExpressionStatement

√ Block
    √ { StatementList }

√ IfStatement
    √ if ( Expression ) Block
    √ if ( Expression ) Block else Block

√ WhileStatement
    √ while ( Expression ) Block

√ BreakStatement
    √ break ;

√ ContinueStatement
    √ continue ;

√ ReturnStatement
    √ return ;
    √ return Expression ;

√ ExpressionStatement
    √ Expression ;
*/


import { Declaration } from './Declaration.js'
import { Expression } from './Expression.js'


export function StatementList(source) {
    if (source[0].type === 'StatementList' && source[1].type !== 'EOF') {
        let node = {
            type: 'StatementList',
            children: [source.shift()]
        }
        Statement(source)
        if (source[0].type === 'Statement') {
            node.children.push(source.shift())
            source.unshift(node)
            StatementList(source)
        } else {
            // 如果后续不是 Statement, 则不再进一步生成 StatementList
            source.unshift(node.children[0])
        }
        return
    }
    Statement(source)
    if (source[0].type === 'Statement') {
        let node = {
            type: 'StatementList',
            children: [source.shift()]
        }
        source.unshift(node)
        StatementList(source)
    }
}


export function Statement(source) {
    Block(source)
    Declaration(source)
    IfStatement(source)
    WhileStatement(source)
    BreakStatement(source)
    ContinueStatement(source)
    ReturnStatement(source)
    ExpressionStatement(source)
    if ([
        'Block',
        'Declaration',
        'IfStatement',
        'WhileStatement',
        'BreakStatement',
        'ContinueStatement',
        'ReturnStatement',
        'ExpressionStatement'
    ].includes(source[0].type)) {
        let node = {
            type: 'Statement',
            children: [source.shift()]
        }
        source.unshift(node)
        return
    }
}


export function Block(source) {
    if (source[0].type === '{') {
        let node = {
            type: 'Block',
            children: [source.shift()]
        }
        StatementList(source)
        if (source[0].type === 'StatementList' && source[1].type === '}') {
            node.children.push(source.shift(), source.shift())
            source.unshift(node)
        }
    }
}


export function IfStatement(source) {
    if (source[0].type === 'if' && source[1].type === '(') {
        let node = {
            type: 'IfStatement',
            children: [source.shift(), source.shift()]
        }
        Expression(source)
        if (source[0].type === 'Expression' && source[1].type === ')') {
            node.children.push(source.shift(), source.shift())
        }
        Block(source)
        if (source[0].type === 'Block') {
            node.children.push(source.shift())
        }
        if (source[0].type === 'else') {
            node.children.push(source.shift())
            Block(source)
            if (source[0].type === 'Block') {
                node.children.push(source.shift())
            }
        }
        source.unshift(node)
    }
}


export function WhileStatement(source) {
    if (source[0].type === 'while' && source[1].type === '(') {
        let node = {
            type: 'WhileStatement',
            children: [source.shift(), source.shift()]
        }
        Expression(source)
        if (source[0].type === 'Expression' && source[1].type === ')') {
            node.children.push(source.shift(), source.shift())
        }
        Block(source)
        if (source[0].type === 'Block') {
            node.children.push(source.shift())
        }
        source.unshift(node)
    }
}


export function BreakStatement(source) {
    if (source[0].type === 'break' && source[1].type === ';') {
        let node = {
            type: 'BreakStatement',
            children: [source.shift(), source.shift()]
        }
        source.unshift(node)
    }
}


export function ContinueStatement(source) {
    if (source[0].type === 'continue' && source[1].type === ';') {
        let node = {
            type: 'ContinueStatement',
            children: [source.shift(), source.shift()]
        }
        source.unshift(node)
    }
}


export function ReturnStatement(source) {
    if (source[0].type === 'return') {
        let node = {
            type: 'ReturnStatement',
            children: [source.shift()]
        }
        if (source[0].type === ';') {
            node.children.push(source.shift())
            source.unshift(node)
            return
        }
        Expression(source)
        if (source[0].type === 'Expression' && source[1].type === ';') {
            node.children.push(source.shift(), source.shift())
            source.unshift(node)
            return
        }
    }
}


export function ExpressionStatement(source) {
    Expression(source)
    if (source[0].type === 'Expression' && source[1].type === ';') {
        let node = {
            type: 'ExpressionStatement',
            children: [source.shift(), source.shift()]
        }
        source.unshift(node)
        return
    }
}
