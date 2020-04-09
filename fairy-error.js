module.exports = class FairyError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }

    toObject() {
        return {
            message: this.message,
            status: this.status
        };
    }
}