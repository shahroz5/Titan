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
export class GrnIbtInventoryWalkIns extends DynamicFormFieldsBuilder {
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
  @Validation({ validators: [] })
  @Class({ className: ['col-12 pl-0'] })
  private isWalkinsDetailsMandatory: {
    id: string;
    name: string;
    checked?: boolean;
  }[];
  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.numbersOfDays'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.noOFDaysGRNAllowed_pattern' }]
  })
  // @Validation({
  //   validators: [Validators.pattern('^[0-9]*')]
  // })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.numbersOfDays' }
      }
    ],
    inputConstraint: PossWebFieldValidators.daysField
  })
  private numbersOfDays: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.numbersOfDatesToDisplay'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.noOFDaysGRNAllowed_pattern' }]
  })
  // @Validation({
  //   validators: [Validators.pattern('^[0-9]*')]
  // })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.numbersField,
        options: { fieldKey: 'pw.locationMaster.numbersOfDatesToDisplay' }
      }
    ],
    inputConstraint: PossWebFieldValidators.numbersField
  })
  private numbersOfDatesToDisplay: string;
  constructor(
    id: number,
    isWalkinsDetailsMandatory: {
      id: string;
      name: string;
      checked?: boolean;
    }[],
    numbersOfDays: string,
    numbersOfDatesToDisplay: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.isWalkinsDetailsMandatory = isWalkinsDetailsMandatory;
    this.numbersOfDays = numbersOfDays;
    this.numbersOfDatesToDisplay = numbersOfDatesToDisplay;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
