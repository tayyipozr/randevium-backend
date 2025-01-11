import { Catch, ExceptionFilter, ArgumentsHost, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { formatMessage } from './common-exception-functions';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    // Default status code and message
    let status = 500;
    let message = exception.message;

    // Custom error handling based on Prisma error code
    switch (exception.code) {
      case 'P2025':  // Record Not Found
        status = 404;
        message = 'Record not found';
        break;
      case 'P2002':  // Unique Constraint Violation
        status = 400;
        message = `Unique constraint violation on field: ${exception.meta.target}`;
        break;
      case 'P2003':  // Foreign Key Constraint Violation
        status = 400;
        message = 'Foreign key constraint violation: cannot delete or update a record that is being referenced';
        break;
      case 'P1000':  // Query Engine Error: Database Connection
        status = 500;
        message = 'Database connection error';
        break;
      case 'P1001':  // Query Engine Error: Authentication Failure
        status = 401;
        message = 'Authentication failed while connecting to the database';
        break;
      case 'P2004':  // Validation Error (Schema Mismatch)
        status = 422;
        message = 'Validation error: The data does not match the required schema';
        break;
      case 'P1006':  // Timeout Error
        status = 503;
        message = 'Service unavailable: Database query timed out';
        break;
      default:  // For other errors
        status = 500;
        message = 'Internal server error';
        break;
    }

    // Construct error response
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: formatMessage(message),
      //errorCode: exception.code,
    };

    // Log the error using AppLogger
    this.logger.error(
      `HTTP Status: ${status} Error Message: ${formatMessage(message)}`,
      exception instanceof Error ? exception.stack : '',
    );

    response.status(status).json(errorResponse);
  }
}
