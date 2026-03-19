import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Check if the response is already an error object from the exception filter
        // or if it's null/undefined.
        if (
          data &&
          typeof data === 'object' &&
          (data.success === false || data.error) // Check if it's an error response
        ) {
          return data; // Return as-is if it's already an error response
        }

        // Wrap successful response in the desired format
        return {
          success: true,
          data: data,
        };
      }),
    );
  }
}
