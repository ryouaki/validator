/**
 * name: @ryou/validator 
 * desc: A validate framework for js both node.js and browser
 * author: ryouaki
 * email: 46517115@qq.com
 */

 /**
  * @name isArray
  * @param {Array} arr 需要判断的参数 
  */
function isArray(arr) {
  return Array.isArray(arr)
}

function isObject(o) {
  return Object.prototype.toString.call(o) == "[object Object]"
}

function isString(s) {
  return Object.prototype.toString.call(s) == "[object String]"
}

function isPromise(p) {
  return Object.prototype.toString.call(p) == "[object Promise]"
}

function isAsyncFunction(f) {
  return Object.prototype.toString.call(f) == "[object AsyncFunction]"
}

function isFunction(f) {
  return Object.prototype.toString.call(f) == "[object Function]"
}

const plugins = {}

function doValidate(schema = {}, target = {}) {
  const fields = Object.keys(schema)
  const fieldNum = fields.length
  const errors = {}

  for (let i = 0; i < fieldNum; i++) {
    const field = fields[i]
    const rules = schema[field]
    const value = target[field]
    if (field === undefined) {
      continue
    }

    const ruleNum = rules.length
    let hasError = false
    for (let j = 0; j < ruleNum && !hasError; j++) {
      const rule = rules[j]
      let err = null

      const {
        type = 'String',
        message = undefined,
        validate = undefined,
        fields = [],
        ...tags
      } = rule

      if (type === "Object") {
        err = isObject(value) ? doValidate(rule.fields, value) : []
      } else if (type === "Array") {
        err = isArray(value) ? value.map((item) => {
          return doValidate(rule.fields, item)
        }) : []
      } else {
        const tagNames = Object.keys(tags)
        if (tagNames.length > 1) {
          console.error(`[Validator:Error] ${field} had more than one tag in one rule [${tagNames.join(',')}]!`)
          continue
        }

        const tagName = tagNames[0]
        let plugin = plugins[tagName]
        if (!plugin) {
          console.warn(`[Validator:Warn] ${tagName} on ${field} is not existed!`)
          plugin = {}
        }
        const ef = validate || plugin.validate || defaultValidate
        const tag = {
          tagName,
          tagValue: tags[tagName]
        }
        if (ef(field, value, tag) === false) {
          const msg = message && isFunction(message) && message(field, value, tag) || message || defaultMessage(field, value, tag)
          err = {
            message: msg,
            ...tag
          }
        }
      }

      if ((err != null && isArray(err) === false ) || (isArray(err) === true && err.length > 0)) {
        hasError = true
        errors[field] === undefined ? 
          errors[field] = {
            field,
            error: [err]
          } : errors[field].error.push(err)
      }
    }
  }

  const keys = Object.keys(errors)

  return keys.map((key) => {
    return errors[key]
  })
}

/**
 * 
 */
class Validator {
  constructor(schema = {}) {
    this.schema = schema
  }

  validate(target = {}) {
    if (!isObject(target)) {
      throw new Error("[Error:Validator.validate] Parameter error! The first parmeter must be a object!")
    }

    return doValidate(this.schema, target)
  }
}

function defaultMessage(field, value, opts) {
  return `[${opts.tagName}] failed:[${field}] = ${value}`
}

function defaultValidate(field, value, opts) {
  return true
}

/**
 * @name addPlugin
 * @param {Object} plugin 
 * @param {Boolean} replace 
 */
Validator.addPlugin = function (plugin, replace = false) {
  const {
    tagName = "",
    message = defaultMessage,
    validate = defaultValidate
  } = plugin

  if (
    isString(tagName) &&
    tagName.length > 0 &&
    isFunction(validate) &&
    (replace === true || plugins[tagName] === undefined)) {
    plugins[tagName] != undefined && console.warn(`[Warn:Plugin] ${tagName} is existed and will be replaced!`)
    plugins[tagName] = {
      message,
      validate
    }
    return true
  }

  return false  
}

module.exports = Validator
