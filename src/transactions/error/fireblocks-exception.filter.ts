import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { FireblocksException } from './fireblocks.exception';
import { Request, Response } from 'express';
@Catch(FireblocksException)
export class FireblocksExceptionFilter implements ExceptionFilter {
    catch(exception: FireblocksException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        response
            .status(status)
            .json(exception.transactionErrorResponse);
    }
}