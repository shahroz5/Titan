import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Class
} from '@poss-web/shared/components/ui-dynamic-form';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

export class TcsConfigGrnConfigModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['row', 'pw-form-card__checkbox-container'] })
  private tcsReverseInCaseOfGRN_checkBox: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.RADIO,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: [''] })
  private tcsReverseForGRnDate_radio: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['row', 'pw-form-card__checkbox-container'] })
  private tcsReverseForInterboutiqueGRN_checkBox: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  constructor(
    id: number,
    tcsReverseInCaseOfGRN_checkBox: {
      id: string;
      name: string;
      checked?: boolean;
    }[],
    tcsReverseForGRnDate_radio: {
      id: string;
      name: string;
      checked?: boolean;
    }[],
    tcsReverseForInterboutiqueGRN_checkBox: {
      id: string;
      name: string;
      checked?: boolean;
    }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.tcsReverseForInterboutiqueGRN_checkBox = tcsReverseForInterboutiqueGRN_checkBox;
    this.tcsReverseForGRnDate_radio = tcsReverseForGRnDate_radio;
    this.tcsReverseInCaseOfGRN_checkBox = tcsReverseInCaseOfGRN_checkBox;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
