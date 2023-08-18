import 'reflect-metadata';
import { LabelValueKeysNotDefinedException } from '../exceptions/LabelValueKeysNotDefinedException';
import { FormFieldType } from '../FormFieldType';
import { FormFieldOptions } from './FormFieldOptions';
import { FormMetadataKeys } from './FormMetadataKeys';

export function FormField(
  options: FormFieldOptions
): (target: any, propertyKey: string) => void {
  if (hasNoRequiredFields(options)) {
    throw new LabelValueKeysNotDefinedException();
  }

  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata(
      FormMetadataKeys.FORM_FIELD,
      options,
      target,
      propertyKey
    );
  };
}

function hasNoRequiredFields(options: FormFieldOptions) {
  return (
    (options.fieldType === FormFieldType.SELECT && !options.selectOptionKeys) ||
    (options.fieldType === FormFieldType.MULTISELECT &&
      !options.selectOptionKeys) ||
    (options.fieldType === FormFieldType.RADIO && !options.selectOptionKeys)
  );
}
