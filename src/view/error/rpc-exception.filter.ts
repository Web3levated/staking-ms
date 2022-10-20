import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { RpcException } from './rpc.exception';
import { Response } from 'express';
@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
    catch(exception: RpcException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        response
            .status(status)
            .json(exception.rpcErrorResponse);
    }
}