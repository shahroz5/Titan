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

export class InventoryASSMModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.wttoleranceforstock'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.weightField,
        options: { fieldKey: 'pw.locationMaster.wttoleranceforstock' }
      }
    ]
  })
  private spareWtTolerance: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.servicewttoleranceforstock'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.weightField,
        options: { fieldKey: 'pw.locationMaster.servicewttoleranceforstock' }
      }
    ]
  })
  private serviceWtTolerance: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.conversionwtToleranceforBangle'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.weightField,
        options: {
          fieldKey: 'pw.locationMaster.conversionwtToleranceforBangle'
        }
      }
    ]
  })
  private conversionwtToleranceforBangle: string;

  constructor(
    id: number,
    spareWtTolerance: string,
    serviceWtTolerance: string,
    conversionwtToleranceforBangle: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.spareWtTolerance = spareWtTolerance;
    this.serviceWtTolerance = serviceWtTolerance;
    this.conversionwtToleranceforBangle = conversionwtToleranceforBangle;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
