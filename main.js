import { lexer } from './lexer/_main.js'
import { parser } from './parser/_main.js'
import { evaluator } from './evaluator/_main.js'


function run(sourceCode) {
    let tokens = lexer(sourceCode)
    // console.log('tokens', tokens)
    
    let ast = parser(tokens)
    // console.log('ast', ast)
    
    let result = evaluator(ast)
    // console.log('result', result)
}


export { run }
