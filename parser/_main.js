import { Program } from './Program.js'


function flatSpecialTokens(tokens) {
    return tokens.map((token) => {
        if (token.type === 'Keyword' || token.type === 'Punctuator') {
            token.type = token.value
        }
        return token
    })
}

function parser(tokens) {
    let source = flatSpecialTokens(tokens)
    Program(source)
    return source[0]
}


export { parser }
