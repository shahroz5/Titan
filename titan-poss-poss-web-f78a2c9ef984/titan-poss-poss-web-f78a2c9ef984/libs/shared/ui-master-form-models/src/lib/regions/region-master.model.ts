// import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
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

export class RegionMasterModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'Region'
  })
  //   validationErrorMessages: [{ errorType: 'pattern',
  //                              errorMessage: 'pw.corporateTown.binCodelengthError' }]
  //
  // @Validation({ validators: [Validators.required,
  //                            Validators.pattern('^[a-zA-Z_ ]{3,20}$')] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.regionCodeField,
        options: { fieldKey: 'Region' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'Region' }
      }
    ],
    inputConstraint: PossWebFieldValidators.regionCodeField
  })
  @Class({ className: ['col-12'] })
  private regionCode: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'Description'
  })
  //   validationErrorMessages: [{ errorType: 'pattern',
  //                              errorMessage: 'pw.corporateTown.townNamelengthError' }]
  //
  // @Validation({ validators: [Validators.required,
  //                            Validators.pattern('^[a-zA-Z_ ]{3,100}$') ] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.descriptionField,
        options: { fieldKey: 'Decription' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'Decription' }
      }
    ],
    inputConstraint: PossWebFieldValidators.descriptionField
  })
  @Class({ className: ['col-12'] })
  private description: string;

  constructor(
    id: number,
    regionCode: string,
    description: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.regionCode = regionCode;
    this.description = description;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
