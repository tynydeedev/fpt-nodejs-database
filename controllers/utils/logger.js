const { createLogger, format, transports } = require('winston');
const { combine, printf, timestamp, colorize } = format;

const logger = createLogger({
  format: combine(
    timestamp({
      format: '[on] MM-DD-YYYY [at] HH:mm',
    }),
    printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console({
      level: 'infor',
      format: combine(
        timestamp({
          format: '[on] MM-DD-YYYY [at] HH:mm',
        }),
        colorize(),
        format.simple(),
        printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
      ),
    }),
    new transports.File({ filename: './logs/info.log', level: 'info' }),
    new transports.File({ filename: './logs/warn.log', level: 'warn' }),
    new transports.File({ filename: './logs/error.log', level: 'error' }),
  ],
});

module.exports = logger;
