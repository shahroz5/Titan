import { Validators } from '@angular/forms';

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
export class LocationPricegroupmapping extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.priceGroupTypeCode'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.priceGroupTypeCodeField,
        options: { fieldKey: 'pw.locationMaster.priceGroupTypeCode' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.priceGroupTypeCode' }
      }
    ],
    inputConstraint: PossWebFieldValidators.priceGroupTypeCodeField
  })
  private priceGroupTypeCode: string;

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.locationMaster.priceGroupCode'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.priceGroupCodeField,
        options: { fieldKey: 'pw.locationMaster.priceGroupCode' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.priceGroupCode' }
      }
    ],
    inputConstraint: PossWebFieldValidators.priceGroupCodeField
  })
  private priceGroupCode: { id: string; name: string; selected?: boolean }[];

  constructor(
    id: number,
    priceGroupTypeCode: string,
    priceGroupCode: { id: string; name: string; selected?: boolean }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.priceGroupTypeCode = priceGroupTypeCode;
    this.priceGroupCode = priceGroupCode;
    this.TranslateService = translateService;
    this.FieldValidatorsService = fieldValidatorsService;
  }
}
