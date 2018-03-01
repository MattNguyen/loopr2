import moment from 'moment'
import {toNumber, toBig} from "Loopring/common/formatter";

export function getShortAddress(address) {
  if (typeof address == 'string') {
    return address.slice(0, 4) + '...' + address.slice(-4)
  } else {
    throw new Error('address must be string')
  }
}

export function getFormatTime(seconds, style) {
  style = style || 'YYYY/MM/DD HH:mm:ss';
  return moment(seconds * 1000).format(style);
}

export function getSeconds(value, unit) {
  value = Number(value);
  switch (unit) {
    case 'second':
      return value;
    case 'minute':
      return value * 60;
    case 'hour':
      return value * 3600;
    case 'day':
      return value * 3600 * 24;
    default:
      return value;
  }
}


export function formatAmount({amount, digits, precision}) {

  amount = toBig(amount);
  if(digits){
    amount = amount.dividedBy('1e'+digits)
  }
  if(precision){
    amount = amount.toFixed(precision)
  }
  return (typeof amount) !== 'string' ? amount.toString() : amount
}

export default {
  getShortAddress,
  getFormatTime,
  getSeconds,
  formatAmount
}
