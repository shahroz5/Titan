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

export class UcpMarketCodeFactorMaster extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.ucpMarketFactor.marketCode'
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.ucpMarketFactor.marketCode' }
      }
    ]
  })
  private marketCode: { id: string; name: string; selected?: boolean }[];

  // @FormField({
  //   fieldType: FormFieldType.SELECTION_INPUT,
  //   selectOptionKeys: {
  //     labelKey: 'name',
  //     valueKey: 'id',
  //     selectedKey: 'selected'
  //   },
  //   label: 'pw.locationMaster.marketCode'
  // })
  // @Class({ className: ['col-12'] })
  // @Validation({
  //   customValidators: [
  //     {
  //       name: PossWebFieldValidators.requiredField,
  //       options: { fieldKey: 'pw.locationMaster.marketCode' }
  //     }
  //   ]
  // })
  // private marketCode: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.ucpMarketFactor.ucpProductGroup'
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.ucpMarketFactor.ucpProductGroup' }
      }
    ]
  })
  private ucpCfa: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.ucpMarketFactor.ucpFactor'
  })
  // @Validation({ validators: [Validators.pattern("^[0-9.]*$")] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.factorField,
        options: {
          fieldKey: 'pw.ucpMarketFactor.ucpFactor'
        }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.ucpMarketFactor.ucpFactor' }
      }
    ],
    inputConstraint: PossWebFieldValidators.factorField
  })
  @Class({ className: ['col-12'] })
  private ucpFactor: string;

  constructor(
    id: number,
    marketCode: { id: string; name: string; selected?: boolean }[],
    ucpCfa: { id: string; name: string; selected?: boolean }[],
    ucpFcator: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.marketCode = marketCode;
    this.ucpCfa = ucpCfa;
    this.ucpFactor = ucpFcator;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
