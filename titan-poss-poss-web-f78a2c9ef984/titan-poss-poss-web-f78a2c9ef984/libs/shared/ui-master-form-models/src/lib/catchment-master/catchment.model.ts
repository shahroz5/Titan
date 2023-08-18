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

export class CatchmentModel extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.catchment.catchmentCode'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.taxClassCodeField,
        options: { fieldKey: 'pw.catchment.catchmentCode' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.catchment.catchmentCode' }
      }
    ],
    inputConstraint: PossWebFieldValidators.taxClassCodeField
  })
  @Class({ className: ['col'] })
  private catchmentCode: string;

  @FormField({
    fieldType: FormFieldType.TEXT_AREA,
    label: 'pw.catchment.description'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.descriptionField,
        options: { fieldKey: 'pw.catchment.description' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.catchment.description' }
      }
    ],
    inputConstraint: PossWebFieldValidators.descriptionField
  })
  @Class({ className: ['col-12'] })
  private desctiption: string;

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
  // private IsActive: { id: string; name: string; checked?: boolean }[];

  constructor(
    id: number,
    catchmentCode: string,
    desctiption: string,
    // IsActive: { id: string; name: string; checked?: boolean }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.catchmentCode = catchmentCode;
    this.desctiption = desctiption;
    // this.IsActive = IsActive;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
