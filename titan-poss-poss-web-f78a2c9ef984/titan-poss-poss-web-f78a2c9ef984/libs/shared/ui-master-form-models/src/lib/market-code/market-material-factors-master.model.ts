import { Validators } from '@angular/forms';
import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Class,
  Validation
} from '@poss-web/shared/components/ui-dynamic-form';
import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
export class MarketMaterialFactorsMaster extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.TEXT_LABEL,
    label: 'pw.marketCode.gold'
  })
  @Class({ className: ['col-12'] })
  private goldLabel: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.marketCode.factor'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.factorField,
        options: { fieldKey: 'pw.marketCode.factor' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.marketCode.factor' }
      }
    ],
    inputConstraint: PossWebFieldValidators.factorField
  })
  @Class({ className: ['col-4', 'align-self-center'] })
  private goldMarkupFactor: string;

  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.marketCode.amountToBeAdded'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.marketCode.addAmountLabel' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.marketCode.addAmountLabel' }
      }
    ],
    inputConstraint: PossWebFieldValidators.amountField
  })
  @Class({ className: ['col-4', 'pl-0', 'align-self-center'] })
  private goldAddAmount: string;
  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.marketCode.amountToBeDeducted'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.marketCode.deductAmountLabel' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.marketCode.deductAmountLabel' }
      }
    ],
    inputConstraint: PossWebFieldValidators.amountField
  })
  @Class({ className: ['col-4', 'pl-0', 'align-self-center'] })
  private goldDeductAmount: string;
  @FormField({
    fieldType: FormFieldType.TEXT_LABEL,
    label: 'pw.marketCode.platinum'
  })
  @Class({ className: ['col-12'] })
  private platinumLabel: string;
  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.marketCode.factor'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.factorField,
        options: { fieldKey: 'pw.marketCode.factor' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.marketCode.factor' }
      }
    ],
    inputConstraint: PossWebFieldValidators.factorField
  })
  @Class({ className: ['col-4', 'align-self-center'] })
  private platinumMarkupFactor: string;
  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.marketCode.amountToBeAdded'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.marketCode.addAmountLabel' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.marketCode.addAmountLabel' }
      }
    ],
    inputConstraint: PossWebFieldValidators.amountField
  })
  @Class({ className: ['col-4', 'pl-0', 'align-self-center'] })
  private platinumAddAmount: string;
  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.marketCode.amountToBeDeducted'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.marketCode.deductAmountLabel' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.marketCode.deductAmountLabel' }
      }
    ],
    inputConstraint: PossWebFieldValidators.amountField
  })
  @Class({ className: ['col-4', 'pl-0', 'align-self-center'] })
  private platinumDeductAmount: string;
  @FormField({
    fieldType: FormFieldType.TEXT_LABEL,
    label: 'pw.marketCode.silver'
  })
  @Class({ className: ['col-12'] })
  private silverLabel: string;
  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.marketCode.factor'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.factorField,
        options: { fieldKey: 'pw.marketCode.factor' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.marketCode.factor' }
      }
    ],
    inputConstraint: PossWebFieldValidators.factorField
  })
  @Class({ className: ['col-4', 'align-self-center'] })
  private silverMarkupFactor: string;
  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.marketCode.amountToBeAdded'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.marketCode.addAmountLabel' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.marketCode.addAmountLabel' }
      }
    ],
    inputConstraint: PossWebFieldValidators.amountField
  })
  @Class({ className: ['col-4', 'pl-0', 'align-self-center'] })
  private silverAddAmount: string;
  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.marketCode.amountToBeDeducted'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.marketCode.deductAmountLabel' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.marketCode.deductAmountLabel' }
      }
    ],
    inputConstraint: PossWebFieldValidators.amountField
  })
  @Class({ className: ['col-4', 'pl-0', 'align-self-center'] })
  private silverDeductAmount: string;

  @FormField({
    fieldType: FormFieldType.TEXT_LABEL,
    label: 'pw.marketCode.f1Label'
  })
  @Class({ className: ['col-12'] })
  private f1Label: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.marketCode.factor'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.factorField,
        options: { fieldKey: 'pw.marketCode.factor' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.marketCode.factor' }
      }
    ],
    inputConstraint: PossWebFieldValidators.factorField
  })
  @Class({ className: ['col-12'] })
  private f1MarkupFactor: string;

  @FormField({
    fieldType: FormFieldType.TEXT_LABEL,
    label: 'pw.marketCode.f2Label'
  })
  @Class({ className: ['col-12'] })
  private f2Label: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.marketCode.factor'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.factorField,
        options: { fieldKey: 'pw.marketCode.factor' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.marketCode.factor' }
      }
    ],
    inputConstraint: PossWebFieldValidators.factorField
  })
  @Class({ className: ['col-12'] })
  private f2MarkupFactor: string;
  constructor(
    id: number,
    goldMarkupFactor: string,
    goldAddAmount: string,
    goldDeductAmount: string,
    silverMarkupFactor: string,
    silverAddAmount: string,
    silverDeductAmount: string,
    platinumMarkupFactor: string,
    platinumAddAmount: string,
    platinumDeductAmount: string,
    f1MarkupFactor: string,
    f2MarkupFactor: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.goldLabel = '';
    this.goldMarkupFactor = goldMarkupFactor;
    this.goldAddAmount = goldAddAmount;
    this.goldDeductAmount = goldDeductAmount;
    this.platinumLabel = '';
    this.platinumMarkupFactor = platinumMarkupFactor;
    this.platinumAddAmount = platinumAddAmount;
    this.platinumDeductAmount = platinumDeductAmount;
    this.silverLabel = '';
    this.silverMarkupFactor = silverMarkupFactor;
    this.silverAddAmount = silverAddAmount;
    this.silverDeductAmount = silverDeductAmount;
    this.f1Label = '';
    this.f1MarkupFactor = f1MarkupFactor;
    this.f2Label = '';
    this.f2MarkupFactor = f2MarkupFactor;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
