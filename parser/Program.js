/*
√ Program
    √ StatementList EOF
*/


import { StatementList } from './Statement.js'


export function Program(source) {
    StatementList(source)
    if (source[0].type === 'StatementList' && source[1].type === 'EOF') {
        let node = {
            type: 'Program',
            children: [source.shift(), source.shift()]
        }
        source.unshift(node)
        return
    }
}
