const validator = require(__dirname+"/../helper/validator.helper")

/**
 * CHECK USER INPUT BY CHECKING KEYS AND VALIDATE VALUE BY VALIDATOR
 * RETURN ERROR
 **/
const checkUserInput = function (inputs, properties) {
    if (inputs instanceof Object) {
        for(const key in inputs) if (properties.indexOf(key) === -1) return `Error unsupported key ${key}`
        for (const key of properties) {
            if (Object.keys(inputs).indexOf(key) === -1) return "Error missing some inputs"
            if (!validator(key, inputs[key])) return `Incorrect ${key}`
        }
        return ""
    }
    return "Incorrect Input"
}

module.exports = {
    checkUserInput,
}
