import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
} from '@poss-web/shared/components/ui-dynamic-form';
import { AdvanceCustomOrderConfigurationStepThree } from './advance-custom-order-three-configuration.model';
import { AdvanceCustomOrderConfigurationStepThreeCheckBox } from './advance-custom-order-three-configuration-checkboxes.model';
import { TranslateService } from '@ngx-translate/core';
import {
  FieldValidatorsService,
} from '@poss-web/shared/util-field-validators';

export class AdvanceCustomOrderConfigurationMainStepThree extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.advanceCustomOrderConfiguration',
    hide: false
  })
  private advanceCustomOrderConfiguration: AdvanceCustomOrderConfigurationStepThree;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.advanceCustomOrderConfigurationCheckBox',
    hide: false
  })
  private advanceCustomOrderConfigurationCheckBox: AdvanceCustomOrderConfigurationStepThreeCheckBox;

  constructor(
    id: number,
    advanceCustomOrderConfiguration: AdvanceCustomOrderConfigurationStepThree,
    advanceCustomOrderConfigurationCheckBox: AdvanceCustomOrderConfigurationStepThreeCheckBox,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.advanceCustomOrderConfiguration = advanceCustomOrderConfiguration;
    this.advanceCustomOrderConfigurationCheckBox = advanceCustomOrderConfigurationCheckBox;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
