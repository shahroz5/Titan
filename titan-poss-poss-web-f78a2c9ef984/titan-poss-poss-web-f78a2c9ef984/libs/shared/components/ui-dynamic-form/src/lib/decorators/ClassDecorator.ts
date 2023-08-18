import 'reflect-metadata';
import { ClassOptions } from './ClassOptions';
import { FormMetadataKeys } from './FormMetadataKeys';

export function Class(
  options: ClassOptions
): (target: any, propertyKey: string) => void {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata(
      FormMetadataKeys.CLASS_NAME,
      options,
      target,
      propertyKey
    );
  };
}
