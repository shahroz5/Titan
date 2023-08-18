import 'reflect-metadata';
import { FormMetadataKeys } from './FormMetadataKeys';
import { ValidationOptions } from './ValidationOptions';

export function Validation(
  options: ValidationOptions
): (target: any, propertyKey: string) => void {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata(
      FormMetadataKeys.VALIDATION,
      options,
      target,
      propertyKey
    );
  };
}
