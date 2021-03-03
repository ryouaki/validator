const fs = require('fs')
const Validator = require("./../index")

Validator.addPlugin(Validator.DefaultPlugins.required)
Validator.addPlugin({
  tagName: "minSize",
  message: "field4 with minSize 1",
  execFunc: function (field, value, opts) {
    return false
  }
})

const v = new Validator({
  field1: [{
    required: true,
    message: "field1 is required"
  },
  {
    Required: true,
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
      console.log(...arguments)
      return false
    }
  }],
  field4: [
    {
      required: true,
      message: "field4 is required",
    },
    {
      minSize: 1
    }
  ],
  field5: [
    {
      type: "Object",
      fields: {
        field1: [{required: true}, {minSize: 1}]
      }
    },
    {
      required: true,
      message: "field5 is required",
    }
  ],
  field6: [
    {
      type: "Array",
      fields: {
        field1: [{required: true}, {minSize: 1}],
        field2: [{required: true}, {minSize: 1}]
      }
    },
    {
      required: true,
      message: "field6 is required",
    }
  ]
})

console.log(JSON.stringify(v.validate({
  field1: "test",
  field2: "test",
  field5: {
  },
  field6: [{field1: ""}]
})))

fs.readSync(process.stdin.fd, 1000, 0, 'utf8')