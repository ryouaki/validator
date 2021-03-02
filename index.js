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

function doValidate(schema, target) {
  const fields = Object.keys(schema)
  const fieldNum = fields.length
  const errors = []

  for (let i = 0; i < fieldNum; i++) {
    const field = fields[i]
    const rules = schema[field]
    const data = target[field]
    if (field === undefined) {
      continue
    }

    if (isArray(data)) {

    } else if (isObject(data)) {

    } else {
      rules.forEach((rule) => {
        const {
          type = 'String',
          message = undefined,
          messageFormat = undefined,
          execFunc = undefined,
          fields = [],
          ...tags
        } = rule

        console.log(tags)
      })
    }

  }

  return errors
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
      throw new Error("Parameter error! The first parmeter must be a object!")
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
    plugins[tag] != undefined && console.warn(`[Warn:Plugin] ${tag} is existed and will be replaced!`)
    plugins[tag] = {
      message,
      messageFormat,
      execFunc
    }
    return true
  }

  return false  
}

Validator.addPlugin({
  tag: "required",
  ruleFunc: function (field, value, opts) {
    if (opts.value === true && (value === undefined || value === null)) {
      return false
    }
    return true
  }
})

module.exports = Validator
