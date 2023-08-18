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

export class SubRegionMasterModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'regionCode',
      valueKey: 'regionCode',
      selectedKey: 'selected'
    },
    label: 'pw.subRegion.parentRegion'
  })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'Parent Region' }
      }
    ]
  })
  @Class({ className: ['col-12'] })
  private parentRegionCode: { regionCode: string; description: string }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.subRegion.subRegion'
    // validationErrorMessages: [{ errorType: 'pattern',
    //                            errorMessage: 'pw.corporateTown.townNamelengthError' }]
  })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.subRegion.subRegion' }
      }
    ]
  })
  @Class({ className: ['col-12'] })
  private regionCode: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.subRegion.description'
    // validationErrorMessages: [{ errorType: 'pattern',
    //                            errorMessage: 'pw.corporateTown.townNamelengthError' }]
  })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.descriptionField,
        options: { fieldKey: 'pw.subRegion.description' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.subRegion.description' }
      }
    ],
    inputConstraint: PossWebFieldValidators.descriptionField
  })
  @Class({ className: ['col-12'] })
  private description: string;

  constructor(
    id: number,
    parentRegionCode: {
      regionCode: string;
      description: string;
      selected?: boolean;
    }[],
    regionCode: string,
    description: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.parentRegionCode = parentRegionCode;
    this.regionCode = regionCode;
    this.description = description;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
