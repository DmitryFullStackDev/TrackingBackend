import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from 'src/exceptions/validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const obj = plainToClass(metadata.metatype, value);
    const error = await validate(obj);

    if (error.length) {
      const messages = error.map(
        (err) =>
          `${err.property} - ${Object.values(err.constraints).join(', ')}`,
      );

      throw new ValidationException(messages);
    }

    return value;
  }
}
