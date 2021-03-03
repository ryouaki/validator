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
    for (let j = 0; j < ruleNum; j++) {
      const rule = rules[j]
      let err = null
      
      const {
        type = 'String',
        message = undefined,
        messageFormat = undefined,
        execFunc = undefined,
        fields = [],
        ...tags
      } = rule

      if (type === "Object") {
        err = doValidate(rule.fields, value)
      } else if (type === "Array") {

      } else {
        const tagNames = Object.keys(tags)
        if (tagNames.length > 1) {
          console.error(`[Error:Plugin] ${field} had more than one tag in one rule!`)
        }

        const tagName = tagNames[0]
        let plugin = plugins[tagName]
        if (!plugin) {
          console.warn(`[Warn:Plugin] ${tagName} on ${field} is not existed!`)
          plugin = {}
        }
        const ef = execFunc || plugin.execFunc || defaultExecFunc
        const tag = {
          tagName,
          tagValue: tags[tagName]
        }
        if (ef(field, value, tag) === false) {
          const msg = messageFormat && messageFormat(field, value, tag) || message || defaultMessageFunc(field, value, tag)
          err = {
            message: msg,
            ...tag
          }
        }
      }

      if ((err != null && isArray(err) === false ) || (isArray(err) === true && err.length > 0)) {
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
  /**
   * @name constructor
   * @param {Object} schema The schema for rules. default {}
   */
  constructor(schema = {}) {
    this.schema = schema
  }

  /**
   * @name validate
   * @param {Object} target The Object we want to validate
   */
  validate(target = {}) {
    if (!isObject(target)) {
      throw new Error("[Error:Validator] Parameter error! The first parmeter must be a object!")
    }

    return doValidate(this.schema, target)
  }
}

function defaultMessageFunc(field, value, opts) {
  return `Default message for [${field}] about value with ${value} from [${opts.tagName}]`
}

function defaultExecFunc(field, value, opts) {
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
    message = `Default message from plugin [${plugin.tagName}]`,
    messageFormat = defaultMessageFunc,
    execFunc = defaultExecFunc
  } = plugin

  if (
    isString(tagName) &&
    tagName.length > 0 &&
    isFunction(execFunc) &&
    (replace === true || plugins[tagName] === undefined)) {
    plugins[tagName] != undefined && console.warn(`[Warn:Plugin] ${tagName} is existed and will be replaced!`)
    plugins[tagName] = {
      message,
      messageFormat,
      execFunc
    }
    return true
  }

  return false  
}

Validator.DefaultPlugins = {}

Validator.DefaultPlugins.required = {
  tagName: "required",
  execFunc: function (field, value, opts) {
    if (opts.tagValue === true && (value === undefined || value === null)) {
      return false
    }
    return true
  }
}

module.exports = Validator
