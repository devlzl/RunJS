let LexicalBNF = [
    ['WhiteSpace', / /],
    ['LineTerminator', /\n/],
    ['Comment', /\/\/[^\n]*|\/\*(?:[^\*]|\*[^\/])*\*\//],
    ['Token'],
        ['Literal'],
            ['NumericLiteral', /(?:[1-9][0-9]*|0)(?:\.[0-9]*)?/],
            ['StringLiteral', /\'[^']*\'|\"[^"]*\"/],
            ['BooleanLiteral', /true|false/],
            ['NullLiteral', /null/],
        ['Keyword', /let|if|else|for|while|continue|break|function|return/],
        ['Identifier', /[_$a-zA-Z][_$a-zA-Z0-9]*/],
        ['Punctuator', /{|}|\[|\]|\(|\)|\.|;|,|<|>|<=|>=|===|!==|\+|\-|\*|\/|=|!|&&|\|\||\:/],
]


export { LexicalBNF }
