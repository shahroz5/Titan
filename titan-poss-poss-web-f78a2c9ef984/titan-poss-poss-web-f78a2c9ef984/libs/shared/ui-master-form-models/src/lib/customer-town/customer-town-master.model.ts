import {
  DynamicFormFieldsBuilder,
  Class,
  FormField,
  FormFieldType,
  Validation
} from '@poss-web/shared/components/ui-dynamic-form';
import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
export class CustomerTownModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'description',
      valueKey: 'stateId',
      selectedKey: 'selected'
    },
    label: 'pw.corporateTown.selectState'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.corporateTown.selectState' }
      }
    ]
  })
  @Class({ className: ['col-12'] })
  private state: {
    stateId: number;
    description: string;
  }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.corporateTown.townName'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.cityField,
        options: { fieldKey: 'pw.corporateTown.townName' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.corporateTown.townName' }
      }
    ],
    inputConstraint: PossWebFieldValidators.cityField
  })
  @Class({ className: ['col-12'] })
  private townName: string;

  constructor(
    id: number,
    state: { stateId: number; description: string; selected?: boolean }[],
    townName: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.state = state;
    this.townName = townName;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
