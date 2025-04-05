import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { MongoError } from 'mongodb'; // Import MongoDB error type
// import { Prisma } from '@prisma/client'; // If using Prisma (optional)

@Injectable()
export class DatabaseErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof MongoError) {
          // Handle MongoDB-specific errors
          if (error.code === 11000) {
            return throwError(() => ({
              statusCode: 400,
              message:
                'Duplicate key error: A record with this ID already exists.',
              error: 'Bad Request',
            }));
          }
          return throwError(() => ({
            statusCode: 500,
            message: 'Database error occurred.',
            error: 'Internal Server Error',
          }));
        }

        // Handle Prisma-related errors (if using Prisma)
        return throwError(() => ({
          statusCode: 400,
          message: error.message,
          error: 'Database Error',
        }));

        return throwError(() => error); // Pass other errors unchanged
      }),
    );
  }
}
