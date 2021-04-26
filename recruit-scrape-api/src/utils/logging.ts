type LogImportance = 'INFO' | 'DEBUG' | 'ERROR'


/**
 * Type guard for debug level logging
 * 
 * @param importance importance of log ("INFO", "DEBUG", "ERROR")
 * @returns 
 */
const isDebug = (importance: LogImportance): importance is 'DEBUG' => {
  if ((importance as 'DEBUG')) {
    return true
  } else {
    return false
  }
}

/**
 * 
 * @param importance importance of log ("INFO", "DEBUG", "ERROR")
 * @param message 
 * @param date 
 */
export function log(importance?: LogImportance, message?: string, date: Date = new Date()) {
  if (isDebug(importance)) {
    console.debug(`[${date.toLocaleString(`en-US`, { timeZone: `America/Denver` })}] [${importance}] ${message}`)
  } else {
    console.log(`[${date.toLocaleString(`en-US`, { timeZone: `America/Denver` })}] [${importance}] ${message}`)
  }
}