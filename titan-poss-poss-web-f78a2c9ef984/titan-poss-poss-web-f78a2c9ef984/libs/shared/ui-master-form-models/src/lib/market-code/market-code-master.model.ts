import { Validators } from '@angular/forms';
import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Class,
  Validation
} from '@poss-web/shared/components/ui-dynamic-form';
import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

export class MarketCodeMaster extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.marketCode.marketCodeText'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.marketCodeField,
        options: { fieldKey: 'pw.marketCode.marketCodeFieldLabel' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.marketCode.marketCodeFieldLabel' }
      }
    ],
    inputConstraint: PossWebFieldValidators.marketCodeField
  })
  @Class({ className: ['col-12'] })
  private marketCode: string;
  @FormField({
    fieldType: FormFieldType.TEXT_AREA,
    label: 'pw.marketCode.description'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.descriptionField,
        options: { fieldKey: 'pw.marketCode.description' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.marketCode.description' }
      }
    ],
    inputConstraint: PossWebFieldValidators.descriptionField
  })
  @Class({ className: ['col-12'] })
  private description: string;

  // @FormField({
  //   fieldType: FormFieldType.CHECKBOX,
  //   selectOptionKeys: {
  //     labelKey: 'name',
  //     valueKey: 'id',
  //     selectedKey: 'checked'
  //   },
  //   label: ''
  // })
  // @Class({ className: ['col-4', 'pl-0'] })
  // private isActive: {
  //   id: string;
  //   name: string;
  //   checked?: boolean;
  // }[];

  constructor(
    id: number,
    marketCode: string,
    description: string,
    //isActive: { id: string; name: string; checked?: boolean }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.marketCode = marketCode;
    this.description = description;
    //this.isActive = isActive;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
