# validator
A validate framework for js both node.js and browser

## 一个不带校验功能的校验库，以此来纪念我迷茫的这几天。
[文档](/doc/document.md)

```js
const fs = require('fs')
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
  }
})

console.log(JSON.stringify(v.validate({
  field1: ""
})))
```
输出
```json
[{
	"field": "field",
	"error": [{
		"message": "field is required",
		"tagName": "required",
		"tagValue": true
	}]
}]
```