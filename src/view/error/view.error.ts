export class ViewError extends Error {
    requestId: string
    constructor(message: string, requestId: string){
        super(message);
        Object.setPrototypeOf(this, ViewError.prototype);
        this.requestId = requestId;
    }
}