const Validator = require("./../index")

Validator.addPlugin({
  tagName: "required",
  execFunc(field, value, opts) {
    if (opts.tagValue === true && (value == undefined || value == null || value == "")) {
      return false
    }
    return true
  }
})

const v = new Validator({
  field: [{
    required: true,
    message: "field is required"
  }]
})

console.log(JSON.stringify(v.validate({
  field: "test"
})))