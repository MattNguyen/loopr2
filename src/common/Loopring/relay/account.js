import request from '../common/request'
import validator from '../common/validator'
import Response from '../common/response'
import code from "../common/code"

let headers = {
  'Content-Type': 'application/json'
}

export async function getBalance(filter) {
  try {
    await validator.validate({value: filter.contractVersion, type: 'STRING'})
    await validator.validate({value: filter.owner, type: 'STRING'})
  } catch (e) {
    console.error(e)
    return new Response(code.PARAM_VALID.code, code.PARAM_VALID.msg)
  }
  let body = {}
  body.method = 'loopring_getBalance'
  body.params = [filter]
  return request({
    method: 'post',
    headers,
    body,
  })
}