import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const message = exception.message.replace(/\n/g, '');

        switch (exception.code) {
            case 'P2002': {
                const status = HttpStatus.CONFLICT;
                response.status(status).json({
                    statusCode: status,
                    message: `Unique constraint failed on the fields: ${(exception.meta as any)?.target}`,
                    error: 'Conflict',
                });
                break;
            }
            case 'P2025': {
                const status = HttpStatus.NOT_FOUND;
                response.status(status).json({
                    statusCode: status,
                    message: message,
                    error: 'Not Found',
                });
                break;
            }
            default:
                super.catch(exception, host);
                break;
        }
    }
}
