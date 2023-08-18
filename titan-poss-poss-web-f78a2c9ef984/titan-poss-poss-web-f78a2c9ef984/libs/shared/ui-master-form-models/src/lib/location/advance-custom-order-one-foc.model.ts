import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';

import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Class,
  Validation
} from '@poss-web/shared/components/ui-dynamic-form';
import { TranslateService } from '@ngx-translate/core';

export class Foc extends DynamicFormFieldsBuilder {
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
  @Class({ className: ['col-12 pl-0'] })
  private advanceCustomOrderTabOneFoccheckBoxes: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.maxWeightforFOC(gms)'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.weightField,
        options: { fieldKey: 'pw.locationMaster.maxWeightforFOC(gms)' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.maxWeightforFOC(gms)' }
      }
    ],
    inputConstraint: PossWebFieldValidators.weightField
  })
  private maxWeightforFOC: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.maxValueforFOC(gms)'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.weightField,
        options: { fieldKey: 'pw.locationMaster.maxWeightforFOC(gms)' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.maxValueforFOC(gms)' }
      }
    ],
    inputConstraint: PossWebFieldValidators.weightField
  })
  private maxValueforFOC: string;

  constructor(
    id: number,
    checkBoxes: { id: string; name: string; checked?: boolean }[],
    maxWeightforFOC: string,
    maxValueforFOC: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.advanceCustomOrderTabOneFoccheckBoxes = checkBoxes;
    this.maxWeightforFOC = maxWeightforFOC;
    this.maxValueforFOC = maxValueforFOC;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
