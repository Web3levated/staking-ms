export class TransactionError extends Error {
    requestId: string
    fireblocksTxId: string
    constructor(message: string, requestId: string, fireblocksTxId: string){
        super(message);
        Object.setPrototypeOf(this, TransactionError.prototype);
        this.requestId = requestId;
        this.fireblocksTxId = fireblocksTxId;
    }
}