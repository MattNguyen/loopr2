import moment from 'moment'

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
  switch(unit){
    case 'second':
      return value;
    case 'minute':
      return value * 60;
    case 'hour':
      return value * 3600;
    case 'day':
      return value * 3600 *24;
    default:
      return value;
  }
}

export default {
  getShortAddress,
  getFormatTime,
  getSeconds
}
