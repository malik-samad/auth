


/**
 * @ALERT : action must be taken immediately.
 * @CRITICAL : critical conditions.
 * @ERROR : error conditions.
 * @WARNING : warning conditions.
 * @NOTICE : normal but significant condition.
 * @INFO : informational messages.
 * @DEBUG : debug-level messages.
 */
export const LOG_LEVEL = {
    ALERT: 1,
    CRITICAL: 2,
    ERROR: 3,
    WARNING: 4,
    NOTICE: 5,
    INFO: 6,
    DEBUG: 7,
}

export function log(message: string, level: keyof typeof LOG_LEVEL = "DEBUG", details: any = "") {
    console.log(`${level}: ${message}`, details)
}


export function logAlert(message: string, details: any = "") {
    log(message, "ALERT", details)
}

export function logCritical(message: string, details: any = "") {
    log(message, "CRITICAL", details)
}

export function logError(message: string, details: any = "") {
    log(message, "ERROR", details)
}

export function logWarning(message: string, details: any = "") {
    log(message, "WARNING", details)
}

export function logNotice(message: string, details: any = "") {
    log(message, "NOTICE", details)
}

export function logInfo(message: string, details: any = "") {
    log(message, "INFO", details)
}

export function logDebug(message: string, details: any = "") {
    log(message, "DEBUG", details)
}