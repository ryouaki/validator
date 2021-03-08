const Validator = require("./../index")

Validator.addPlugin({
  tagName: "required",
  message() {
    return "Test"
  },
  validate(field, value, opts) {
    if (opts.tagValue === true && (value == undefined || value == null || value == "")) {
      return false
    }
    return true
  }
})

const v = new Validator({
  field: [{
    required: true,
    message() {
      return "Test"
    }
  }]
})

console.log(JSON.stringify(v.validate({
})))