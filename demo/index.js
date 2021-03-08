const Validator = require("./../index")

Validator.addPlugin({
  tagName: "required",
  validate(field, value, opts) {
    if (opts.tagValue === true && (value == undefined || value == null || value == "")) {
      return false
    }
    return true
  }
})

Validator.addPlugin({
  tagName: "max",
  validate(field, value, opts) {
    return false
  }
})

const v = new Validator({
  field: [{ max: 1},{
    required: true,
    message() {
      return "Test"
    }
  }]
})

console.log(JSON.stringify(v.validate({
})))