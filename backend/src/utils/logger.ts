type LogMessage = string | number | object;

const logger = {
  info: (message: LogMessage): void => {
    console.log(`[INFO]: ${message}`);
  },
  warn: (message: LogMessage): void => {
    console.warn(`[WARN]: ${message}`);
  },
  error: (message: LogMessage): void => {
    console.error(`[ERROR]: ${message}`);
  },
};

export default logger;
