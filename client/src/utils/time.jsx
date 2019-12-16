import moment from 'moment-timezone';

export const formatLocalTime = timestamp => timestamp && moment(parseInt(timestamp)).format('MMM DD, YYYY - hh:mm:ss a')

export const startOfDay = () => moment(new Date()).startOf('day')
