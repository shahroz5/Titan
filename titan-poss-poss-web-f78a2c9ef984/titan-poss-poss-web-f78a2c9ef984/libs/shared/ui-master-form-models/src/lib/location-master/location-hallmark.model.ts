import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Validation,
  Class
} from '@poss-web/shared/components/ui-dynamic-form';
// import { Validators } from '@angular/forms';
import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

export class LocationHallmarkModel extends DynamicFormFieldsBuilder {
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
  @Class({ className: ['rm-padding-left', 'pw-form-card__checkbox-container'] })
  @Validation({
    customValidators: []
  })
  private isHallmarkingEnabled: {
    id: string;
    name: string;
    selected?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.hallmarkRegistrationNumber'
  })
  @Class({ className: [] })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.descriptionField,
        options: { fieldKey: 'pw.locationMaster.hallmarkRegistrationNumber' }
      }
    ],
    inputConstraint: PossWebFieldValidators.descriptionField
  })
  private hallmarkRegistrationNumber: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.hallmarkGSTPercentage'
  })
  @Class({ className: [] })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.percentageField,
        options: { fieldKey: 'pw.locationMaster.hallmarkGSTPercentage' }
      }
    ],
    inputConstraint: PossWebFieldValidators.locationCodeField
  })
  private hallmarkGSTPercentage: string;

  constructor(
    id: number,
    isHallmarkingEnabled: { id: string; name: string; checked?: boolean }[],
    hallmarkRegistrationNumber: string,
    hallmarkGSTPercentage: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.isHallmarkingEnabled = isHallmarkingEnabled;
    this.hallmarkRegistrationNumber = hallmarkRegistrationNumber;
    this.hallmarkGSTPercentage = hallmarkGSTPercentage;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
