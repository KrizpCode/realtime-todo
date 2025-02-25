import winston from 'winston'

const { combine, timestamp, printf } = winston.format

const logFormat = printf(({ level, message, timestamp, ...meta }) => {
  const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : ''
  return `${timestamp} [${level.toUpperCase()}] ${message}${metaString}`
})

const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
  transports: [new winston.transports.Console()]
})

export default logger
