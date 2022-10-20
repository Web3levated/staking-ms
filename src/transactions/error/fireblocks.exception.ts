import { HttpStatus, HttpException } from "@nestjs/common";
import { TransactionErrorResponse } from "../model/response/TransactionErrorResponse"


export class FireblocksException extends HttpException {
    transactionErrorResponse: TransactionErrorResponse
    constructor(requestId: string, fireblocksTxId: string) {
        super('Internal Server Error while calling fireblocks', HttpStatus.INTERNAL_SERVER_ERROR);
        this.transactionErrorResponse = {
            requestId: requestId,
            fireblocksTxId: fireblocksTxId,
            error: 'Internal Server Error while calling fireblocks'
        }
    }
}