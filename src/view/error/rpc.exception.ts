import { HttpStatus, HttpException } from "@nestjs/common";
import { RpcErrorResponse } from "../model/response/RpcErrorResponse"


export class RpcException extends HttpException {
    rpcErrorResponse: RpcErrorResponse
    constructor(message: string, requestId: string) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
        this.rpcErrorResponse = {
            requestId: requestId,
            error: message
        }
    }
}