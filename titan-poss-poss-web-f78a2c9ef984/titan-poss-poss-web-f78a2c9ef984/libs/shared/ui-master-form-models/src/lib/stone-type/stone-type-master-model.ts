// import { Validators } from '@angular/forms';
import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Validation,
  Class
} from '@poss-web/shared/components/ui-dynamic-form';
import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

export class StoneTypeMaster extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.stoneType.stoneTypeCode'
  })
  // @Validation({
  // validators: [Validators.required, Validators.pattern('^[A-Za-z0-9.]*$')]
  // })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.stoneTypeCodeField,
        options: { fieldKey: 'pw.stoneType.stoneTypeCode' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.stoneType.stoneTypeCode' }
      }
    ],
    inputConstraint: PossWebFieldValidators.stoneTypeCodeField
  })
  @Class({ className: ['col'] })
  private stoneTypeCode: string;

  @FormField({
    fieldType: FormFieldType.TEXT_AREA,
    label: 'pw.stoneType.description'
  })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.descriptionField,
        options: { fieldKey: 'pw.stoneType.description' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.stoneType.description' }
      }
    ],
    inputConstraint: PossWebFieldValidators.descriptionField
  })
  @Class({ className: ['col-12'] })
  private description: string;

  @FormField({
    fieldType: FormFieldType.RADIO,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: 'pw.stoneType.karatageWeightPrint'
  })
  @Class({ className: ['col-6', 'pl-3'] })
  private karatageWeightPrint: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  constructor(
    id: number,
    stoneTypeCode: string,
    description: string,
    karatageWeightPrint: {
      id: string;
      name: string;
      checked?: boolean;
    }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.stoneTypeCode = stoneTypeCode;
    this.description = description;
    this.karatageWeightPrint = karatageWeightPrint;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
