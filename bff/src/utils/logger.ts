import * as winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const transport: DailyRotateFile = new DailyRotateFile({
  dirname: "../data/log/",
  filename: "app-%DATE%.log",
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: false,
  maxSize: "20m",
  maxFiles: "5d",
});

transport.on("rotate", function (oldFilename, newFilename) {
  // do something fun
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    winston.format.printf(
      (info) => `${info.level}: ${[info.timestamp]} : ${info.message}`
    )
  ),
  transports: [transport, new winston.transports.Console()],
});

export default logger;
