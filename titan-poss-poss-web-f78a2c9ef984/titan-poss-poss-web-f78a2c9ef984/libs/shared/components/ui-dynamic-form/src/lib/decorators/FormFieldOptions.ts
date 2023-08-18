import { FormFieldType } from '../FormFieldType';

export interface FormFieldOptions {
  fieldType: FormFieldType;
  label: string;
  fieldName?: string;
  selectOptionKeys?: {
    labelKey: string;
    valueKey: string;
    foreignKey?: string;
    selectedKey?: string;
  };
  dependsOn?: string;
  subForm?: string[];
  show?: string[];
  hide?: boolean;
  validationErrorMessages?: { errorType: string; errorMessage: string }[];
  min?: boolean | string;
}
