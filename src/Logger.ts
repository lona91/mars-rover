import {join} from "path";
import {createLogger, format, transports} from "winston";
import {config as loadEnv} from "dotenv";

if (process.env.NODE_ENV !== "production") {
  loadEnv();
}

export default createLogger({
  level: process.env.NODE_ENV === "test" ? "fatal" : process.env.LOG_LEVEL || "info" ,
  format: format.combine(
    format.timestamp(),
    format.json(),
    format.prettyPrint(),
    format.colorize()
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      level: "error",
      filename: join(process.cwd(), "error.log")
    })
  ]
});
