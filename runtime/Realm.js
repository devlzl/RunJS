import { UndefinedType } from './LanguageTypes.js'


export class Realm {
    constructor() {
        this.global = {
            log: {
                call: (...args) => {
                    args = args.map(arg => arg ? arg : new UndefinedType())
                    console.log('RunJS log:', ...args)
                }
            }
        }
    }
    get(name) {
        return this.global[name]
    }
}
