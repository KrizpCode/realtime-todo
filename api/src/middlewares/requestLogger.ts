import morgan from 'morgan'
import logger from '../config/logger'

const requestLoggerMiddleware = morgan(
  (tokens, req, res) => {
    return `HTTP ${tokens.method(req, res)} ${tokens.url(req, res)} ${tokens.status(req, res)} - ${tokens['response-time'](req, res)} ms`
  },
  {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }
)

export default requestLoggerMiddleware
