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

export class StateMasterModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'description',
      valueKey: 'countryCode',
      selectedKey: 'selected'
    },
    label: 'pw.states.country'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.states.country' }
      }
    ]
  })
  @Class({ className: ['col-12'] })
  private country: { countryCode: string; description: string }[];

  @FormField({
    fieldType: FormFieldType.RADIO,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: 'pw.states.selectType'
  })
  @Class({ className: ['col-12'] })
  private isUnionTerritory: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.states.stateCode'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.stateCodeField,
        options: { fieldKey: 'pw.states.stateCode' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.states.stateCode' }
      }
    ],
    inputConstraint: PossWebFieldValidators.stateCodeField
  })
  @Class({ className: ['col-12'] })
  private stateCode: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.states.stateDescription'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.stateField,
        options: { fieldKey: 'pw.states.stateDescription' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.states.stateDescription' }
      }
    ],
    inputConstraint: PossWebFieldValidators.stateField
  })
  @Class({ className: ['col-12'] })
  private description: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.states.eghsStateId'
  })
  /* @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.numbersField,
        options: { fieldKey: 'pw.states.eghsStateId' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.states.eghsStateId' }
      }
    ],
    inputConstraint: PossWebFieldValidators.numbersField
  }) */
  @Class({ className: ['col-12'] })
  private eghsRefStateId: number;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['auto'] })
  private isActive: { id: string; name: string; checked?: boolean }[];

  constructor(
    id: number,
    country: { countryCode: string; description: string; selected?: boolean }[],
    isUnionTerritory: { id: string; name: string; checked?: boolean }[],
    stateCode: string,
    description: string,
    eghsRefStateId: number,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.country = country;
    this.isUnionTerritory = isUnionTerritory;
    this.stateCode = stateCode;
    this.eghsRefStateId = eghsRefStateId;
    this.description = description;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
