/*
√ Declaration
    √ VariableDeclaration
    √ FunctionDeclaration

√ VariableDeclaration
    √ let Identifier ;
    √ let Identifier = RightHandSideExpression ;

√ FunctionDeclaration
    √ function Identifier ( ) Block
    √ function Identifier ( ParameterList ) Block

√ ParameterList
    √ Identifier
    √ ParameterList , Identifier
*/


import { RightHandSideExpression } from './Expression.js'
import { Block } from './Statement.js'


export function Declaration(source) {
    VariableDeclaration(source)
    FunctionDeclaration(source)
    if (source[0].type === 'VariableDeclaration' || source[0].type === 'FunctionDeclaration') {
        let node = {
            type: 'Declaration',
            children: [source.shift()]
        }
        source.unshift(node)
        return
    }
}


export function VariableDeclaration(source) {
    if (source[0].type === 'let' && source[1].type === 'Identifier') {
        let node = {
            type: 'VariableDeclaration',
            children: [source.shift(), source.shift()]
        }
        if (source[0].type === ';') {
            node.children.push(source.shift())
        } else if (source[0].type === '=') {
            node.children.push(source.shift())
            RightHandSideExpression(source)
            if (source[0].type === 'RightHandSideExpression' && source[1].type === ';') {
                node.children.push(source.shift(), source.shift())
            }
        }
        source.unshift(node)
    }
}


export function FunctionDeclaration(source) {
    if (source[0].type === 'function' && source[1].type === 'Identifier' && source[2].type === '(') {
        let node = {
            type: 'FunctionDeclaration',
            children: [source.shift(), source.shift(), source.shift()]
        }
        ParameterList(source)
        if (source[0].type === 'ParameterList') {
            node.children.push(source.shift())
        }
        if (source[0].type === ')') {
            node.children.push(source.shift())
            Block(source)
            if (source[0].type === 'Block') {
                node.children.push(source.shift())                
            }
        }
        source.unshift(node)
    }
}


export function ParameterList(source) {
    if (source[0].type === 'Identifier') {
        let node = {
            type: 'ParameterList',
            children: [source.shift()]
        }
        source.unshift(node)
        ParameterList(source)
    } else if (source[0].type === 'ParameterList' && source[1].type === ',' && source[2].type === 'Identifier') {
        let node = {
            type: 'ParameterList',
            children: [source.shift(), source.shift(), source.shift()]
        }
        source.unshift(node)
        ParameterList(source)
    }
}
