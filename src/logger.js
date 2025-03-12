import { createLogger, format, transports } from "winston";
const { combine, timestamp, json, printf } = format;

const consoleLogFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf(({ level, message, timestamp }) => {
    const logLevel = level.toUpperCase();
    const paddedLevel = logLevel.padEnd(5);
    return `${timestamp} ${paddedLevel} ${message}`;
  })
);

const logger = createLogger({
  level: "info",
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
    // new transports.File({
    //   filename: "app.log",
    //   format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), json()),
    // }),
  ],
});

export default logger;