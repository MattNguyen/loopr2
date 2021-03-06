import React from 'react';
import {connect} from 'dva';
import { Form,InputNumber,Button,Icon,Modal,Input,Radio,Select,Checkbox,Slider,Collapse} from 'antd';
import * as fm from '../../../common/Loopring/common/formatter'
import {accMul, accDiv} from '../../../common/Loopring/common/math'
import {configs} from '../../../common/config/data'

class TradeForm extends React.Component {
  state = {
    address: "0x4919776519F2B290E0E98AA8d9f5751b5321876C",
    exchangeRate: 812, //TODO eth-usd
    estimatePriceWorth: 0,
    availableAmount: 0
  }

  componentDidMount() {

  }

  render() {
    const {form, side = 'sell', pair = 'LRC-WETH', dispatch} = this.props
    const tokenL = pair.split('-')[0].toUpperCase()
    const tokenR = pair.split('-')[1].toUpperCase()
    //TODO mock data
    const tokenLBalance = {...window.CONFIG.getTokenBySymbol(tokenL), balance: 100.00, allowance: 0}
    const tokenRBalance = {...window.CONFIG.getTokenBySymbol(tokenR), balance: 321.00, allowance: 0}
    const marketConfig = window.CONFIG.getMarketBySymbol(tokenL, tokenR)

    const integerReg = new RegExp("^[0-9]*$")
    const amountReg = new RegExp("^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$")

    const showTradeModal = (tradeInfo) => {
      dispatch({
        type: 'modals/modalChange',
        payload: {
          id: 'trade/confirm',
          visible: true,
          side,
          pair,
          ...tradeInfo
        }
      })
    }

    function handleSubmit() {
      form.validateFields((err, values) => {
        if (!err) {
          const tradeInfo = {}
          tradeInfo.amount = Number(values.amount)
          tradeInfo.price = Number(values.price)
          tradeInfo.total = tradeInfo.amount * tradeInfo.price
          if (values.timeToLive) {
            let timeToLive = Number(values.timeToLive)
            if (values.timeToLiveUnit === 'second') {
              timeToLive = timeToLive
            } else if (values.timeToLiveUnit === 'minute') {
              timeToLive = timeToLive * 60
            } else if (values.timeToLiveUnit === 'hour') {
              timeToLive = timeToLive * 3600
            } else if (values.timeToLiveUnit === 'day') {
              timeToLive = timeToLive * 86400
            } else {
              console.error("invalid timeToLiveUnit:", values.timeToLiveUnit)
              return
            }
            tradeInfo.timeToLive = timeToLive
          }
          if (values.lrcFee) {
            tradeInfo.lrcFee = Number(values.lrcFee)
          }
          if (values.marginSplit) {
            tradeInfo.marginSplit = Number(values.marginSplit)
          }
          showTradeModal(tradeInfo)
        }
      });
    }

    function handleCancle() {
    }

    function handleReset() {
      form.resetFields()
    }

    function validateAmount(value) {
      const amount = Number(value)
      const price = Number(form.getFieldValue("price"))
      if (amount <= 0) return false
      if (side === 'sell') {
        return amount <= tokenLBalance.balance
      } else {
        if (price > 0) {
          return accMul(price, amount) <= tokenRBalance.balance
        } else {
          return true
        }
      }
    }

    function validatePirce(value) {
      const result = form.validateFields(["amount"], {force:true})
      return Number(value) > 0
    }

    function validateLrcFee(value) {
      if (value) {
        const v = Number(value)
        return v > 0 && v <= 50
      } else {
        return true
      }
    }

    function validateMarginSplit(value) {
      if (value) {
        const v = Number(value)
        return v >= 0 && v <= 100
      } else {
        return true
      }
    }

    function validateOptionInteger(value) {
      if (value) {
        return integerReg.test(value)
      } else {
        return true
      }
    }

    function inputChange(type, e) {
      let price = 0, amount = 0
      if (type === 'price') {
        price = e.target.value.toString()
        if (!amountReg.test(price)) return false
        const priceArr = price.split(".")
        if (priceArr[1] && priceArr[1].length > marketConfig.pricePrecision) {
          try {
            price = Number(priceArr[0] + "." + priceArr[1].substring(0, marketConfig.pricePrecision))
          } catch (e) {
            console.error(e)
            price = 0
          }
          e.target.value = price
        }
        this.setState({estimatePriceWorth: accMul(price, this.state.exchangeRate).toFixed(2)})
        amount = Number(form.getFieldValue("amount"))
        if(side === 'buy'){
          const precision = Math.max(0,tokenRBalance.precision - marketConfig.pricePrecision)
          const availableAmount = Math.floor(tokenRBalance.balance / Number(price) * ("1e"+precision)) / ("1e"+precision)
          this.setState({availableAmount: availableAmount})
        } else {
          const availableAmount = Math.floor(tokenLBalance.balance * ("1e"+tokenRBalance.precision)) / ("1e"+tokenRBalance.precision)
          this.setState({availableAmount: availableAmount})
        }
      } else if (type === 'amount') {
        amount = e.target.value.toString()
        if (!amountReg.test(amount)) return false
        const amountPrecision = tokenRBalance.precision - marketConfig.pricePrecision
        if (amountPrecision > 0) {
          const amountArr = amount.split(".")
          if (amountArr[1] && amountArr[1].length > amountPrecision) {
            try {
              amount = Number(amountArr[0] + "." + amountArr[1].substring(0, amountPrecision))
            } catch (e) {
              console.error(e)
              amount = 0
            }
          }
        } else {
          amount = Math.floor(amount)
        }
        e.target.value = amount
        price = Number(form.getFieldValue("price"))
      }
      const total = accMul(price, amount)
      form.setFieldsValue({"total": total})
    }

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 18},
      },
    };
    const Option = Select.Option;
    const timeToLiveSelectAfter = form.getFieldDecorator('timeToLiveUnit', {
      initialValue: "second",
      rules: []
    })(
      <Select style={{width: 90}}>
        <Option value="second">Second</Option>
        <Option value="minute">Minute</Option>
        <Option value="hour">Hour</Option>
        <Option value="day">Day</Option>
      </Select>
    )

    return (
      <div>
        <Form layout="horizontal">
          <Form.Item>
            <div className="row">
              <div className="col fs18 color-grey-900 text-capitalize">{side} {tokenL}</div>
              <div className="col-auto">
                {
                  side === 'buy' ? `${tokenR} Balance: ${tokenRBalance.balance}` : `${tokenL} Balance: ${tokenLBalance.balance}`
                }
              </div>
            </div>
          </Form.Item>
          <Form.Item label="Price" {...formItemLayout} colon={false} extra={
            <div className="row">
              <div className="col fs10">{`≈USD ${this.state.estimatePriceWorth}`}</div>
            </div>
          }>
            {form.getFieldDecorator('price', {
              initialValue: 0,
              rules: [{
                message: 'Please input valid price',
                validator: (rule, value, cb) => validatePirce(value) ? cb() : cb(true)
              }]
            })(
              <Input className="d-block w-100" placeholder="" size="large" suffix={tokenR}
                     onChange={inputChange.bind(this, 'price')}
                     onFocus={() => {
                       const amount = form.getFieldValue("price")
                       if (amount === 0) {
                         form.setFieldsValue({"price": ''})
                       }
                     }}
                     onBlur={() => {
                       const amount = form.getFieldValue("price")
                       if (amount === '') {
                         form.setFieldsValue({"price": 0})
                       }
                     }}/>
            )}
          </Form.Item>
          <Form.Item label="Amount" {...formItemLayout} colon={false} extra={
            <div className="row">
              <div className="col fs10">{`Max Amount ${this.state.availableAmount}`}</div>
            </div>
          }>
            {form.getFieldDecorator('amount', {
              initialValue: 0,
              rules: [{
                message: 'Please input valid amount',
                validator: (rule, value, cb) => validateAmount(value) ? cb() : cb(true)
              }]
            })(
              <Input placeholder="" size="large" suffix={tokenL} onChange={inputChange.bind(this, 'amount')}
                     onFocus={() => {
                       const amount = Number(form.getFieldValue("amount"))
                       if (amount === 0) {
                         form.setFieldsValue({"amount": ''})
                       }
                     }}
                     onBlur={() => {
                       const amount = form.getFieldValue("amount")
                       if (amount === '') {
                         form.setFieldsValue({"amount": 0})
                       }
                     }}/>
            )}
          </Form.Item>
          <Form.Item className="mb5" label="Total" {...formItemLayout} colon={false}>
            {form.getFieldDecorator('total', {
              initialValue: 0,
              rules: []
            })(
              <Input disabled className="d-block w-100" placeholder="" size="large" suffix={tokenR}/>
            )}
          </Form.Item>
          <Collapse bordered={false} defaultActiveKey={[]}>
            <Collapse.Panel className="" style={{border: 'none', margin: '0px -15px', padding: '0px -15px'}}
                            header={<div style={{}}>Advanced</div>} key="1">
              <div className="row">
                <div className="col-12">
                  <Form.Item className="mb5" label="Time to live">
                    {form.getFieldDecorator('timeToLive', {
                      rules: [{
                        message: "Please input integer value",
                        validator: (rule, value, cb) => validateOptionInteger(value) ? cb() : cb(true)
                      }]
                    })(
                      <Input className="d-block w-100" placeholder="" size="large" addonAfter={timeToLiveSelectAfter}/>
                    )}
                  </Form.Item>
                </div>
                <div className="col">
                  <Form.Item className="mb5" label="Lrc Fee">
                    {form.getFieldDecorator('lrcFee', {
                      rules: [{
                        message: "Please input valid integer value(1~50)",
                        validator: (rule, value, cb) => validateLrcFee(value) ? cb() : cb(true)
                      }]
                    })(
                      <Input className="d-block w-100" placeholder="" size="large" suffix='‰'/>
                    )}
                  </Form.Item>
                </div>
                <div className="col">
                  <Form.Item className="mb5" label="MarginSplit">
                    {form.getFieldDecorator('marginSplit', {
                      rules: [{
                        message: "Please input valid integer value(0~100)",
                        validator: (rule, value, cb) => validateMarginSplit(value) ? cb() : cb(true)
                      }]
                    })(
                      <Input className="d-block w-100" placeholder="" size="large" suffix='％'/>
                    )}
                  </Form.Item>
                </div>
              </div>
            </Collapse.Panel>
          </Collapse>
          <Form.Item>
            {
              side == 'buy' &&
              <Button onClick={handleSubmit.bind(this)} type="" className="d-block w-100 bg-green-500 border-none color-white"
                      size="large">
                Place Order
              </Button>
            }
            {
              side == 'sell' &&
              <Button onClick={handleSubmit.bind(this)} type="" className="d-block w-100 bg-red-500 border-none color-white"
                      size="large">
                Place Order
              </Button>
            }
          </Form.Item>
        </Form>
      </div>
    );
  };
}

export default Form.create()(connect()(TradeForm));
