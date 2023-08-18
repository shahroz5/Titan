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

export class BinGroupMaster extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'Bin Group Code'
    // validationErrorMessages: [{ errorType: 'pattern',
    // errorMessage: 'pw.corporateTown.binCodelengthError'}]
  })
  // @Validation({ validators: [Validators.required,
  //                            Validators.pattern('^[a-zA-Z_ ]{3,20}$')] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.binGroupCodeField,
        options: { fieldKey: 'Bin group Code' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'Bin group Code' }
      }
    ],
    inputConstraint: PossWebFieldValidators.binGroupCodeField
  })
  @Class({ className: ['col-12'] })
  private BinGroupCode: string;

  @FormField({
    fieldType: FormFieldType.TEXT_AREA,
    label: 'Description'
    // validationErrorMessages: [{ errorType: 'pattern',
    // errorMessage: 'pw.corporateTown.binGrouplengthError' }]
  })
  // @Validation({ validators: [Validators.required,
  //                            Validators.pattern('^[a-zA-Z\-\_/(/)_ ]{3,250}$')] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.descriptionField,
        options: { fieldKey: 'Description' }
      },
      { name: PossWebFieldValidators.requiredField, options: { fieldKey: 'Description' } }
    ],
    inputConstraint: PossWebFieldValidators.descriptionField
  })
  @Class({ className: ['col-12'] })
  private desctiption: string;

  constructor(
    id: number,
    BinGroupCode: string,
    desctiption: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService

  ) {
    super();
    this.id = id;
    this.BinGroupCode = BinGroupCode;
    this.desctiption = desctiption;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;

  }
}
