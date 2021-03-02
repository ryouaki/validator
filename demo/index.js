const Validator = require("./../index")

const v = new Validator({
  field1: [{
    required: true,
    message: "field1 is required"
  }],
  field2: [{
    required: true,
    message: "field2 is required",
    messageFormat: function (field, value, opts) {
      return `Message for [${field}] about value with ${value} from [${opts.tagName}]`
    }
  }],
  field3: [{
    required: true,
    message: "field3 is required",
    execFunc: function (field, value, opts) {
      return false
    }
  }],
  field4: [
    {
      required: true,
      message: "field4 is required",
    },
    {
      minSize: 1,
      message: "field4 with minSize 1",
    }
  ],
  field5: [
    {

    }
  ]
})

v.validate({
  field1: "test"
})