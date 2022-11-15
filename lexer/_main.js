import { LexicalBNF } from './LexicalBNF.js'


function lexer(sourceCode) {
    let lexicalReg = LexicalBNF.filter(item => item[1])
    let index = 0
    let line = 1
    let column = 1
    let tokens = []
    scan: while (index < sourceCode.length) {
        let code = sourceCode.slice(index)
        for (let [type, regexp] of lexicalReg) {
            let result = regexp.exec(code)
            if (result?.index === 0) {
                let value = result[0]
                tokens.push({
                    type: type,
                    value: value,
                    position: { line, column }
                })
                index += value.length
                if (type !== 'LineTerminator') {
                    column += value.length
                } else {
                    line += 1
                    column = 1
                }
                continue scan
            }
        }
        throw new Error(`Unexpected token '${sourceCode[index]}' at line ${line} column ${column}.`)
    }
    tokens.push({ type: 'EOF' })
    return tokens.filter(item => !['WhiteSpace', 'LineTerminator', 'Comment'].includes(item.type))
}


export { lexer }
