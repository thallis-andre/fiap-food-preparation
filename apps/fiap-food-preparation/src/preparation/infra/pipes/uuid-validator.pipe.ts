import { BadRequestException, PipeTransform } from '@nestjs/common';
import { isUUID } from 'class-validator';

export class UUIDValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!this.isValid(value)) {
      throw new BadRequestException(
        `Provided ${value} is not a valid ObjectId hex string`,
      );
    }
    return value;
  }

  private isValid(value: string) {
    return isUUID(value);
  }
}
