// here appError class extend JS error
class AppError extends Error {
    public statusCode: number;

    constructor(statusCode: number, message: string, stack= '') {
        super(message) //throw new Error("Something went wrong")
        this.statusCode = statusCode

        if (stack) {
            this.stack = stack //this this custom stack
        } else {
            Error.captureStackTrace(this, this.constructor) //this default stack
        }
    }
}
export default AppError;