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

export class PancardConfigModel extends DynamicFormFieldsBuilder {
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
  @Class({ className: ['row', 'pw-form-card__box-container'] })
  private panConfig_checkBox: { id: string; name: string; checked?: boolean }[];

  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.brandMaster.configurationAmountForCashMemo'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.brandMaster.configurationAmountForCashMemo' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.configurationAmountForCashMemo' }
      }
    ],
    inputConstraint: PossWebFieldValidators.localeField
  })
  private configurationAmountForCashMemo: string;

  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.brandMaster.configurationAmountForAdvance'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.configurationAmountForAdvance' }
      }
    ],
    inputConstraint: PossWebFieldValidators.localeField
  })
  private configurationAmountForAdvance: string;

  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.brandMaster.configurationAmountForGHS'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.brandMaster.configurationAmountForGHS' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.configurationAmountForGHS' }
      }
    ],
    inputConstraint: PossWebFieldValidators.localeField
  })
  private configurationAmountForGHS: string;

  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.brandMaster.configurationAmountForGEP'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.brandMaster.configurationAmountForGEP' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.configurationAmountForGEP' }
      }
    ],
    inputConstraint: PossWebFieldValidators.localeField
  })

  private configurationAmountForGEP: string;

  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.brandMaster.configurationAmountForCO'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.brandMaster.configurationAmountForCO' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.configurationAmountForCO' }
      }
    ],
    inputConstraint: PossWebFieldValidators.localeField
  })

  private configurationAmountForCO: string;

  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.brandMaster.configurationAmountForTEP'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.brandMaster.configurationAmountForTEP' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.configurationAmountForTEP' }
      }
    ],
    inputConstraint: PossWebFieldValidators.localeField
  })

  private configurationAmountForTEP: string;

  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.brandMaster.configurationAmountForAcceptAdvance'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.brandMaster.configurationAmountForAcceptAdvance' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.configurationAmountForAcceptAdvance' }
      }
    ],
    inputConstraint: PossWebFieldValidators.localeField
  })

  private configurationAmountForAcceptAdvance: string;

  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.brandMaster.configurationAmountForGiftCard'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.brandMaster.configurationAmountForGiftCard' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.configurationAmountForGiftCard' }
      }
    ],
    inputConstraint: PossWebFieldValidators.localeField
  })

  private configurationAmountForGiftCard: string;

  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.brandMaster.configurationAmountForGRF'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.brandMaster.configurationAmountForGRF' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.configurationAmountForGRF' }
      }
    ],
    inputConstraint: PossWebFieldValidators.localeField
  })
  private configurationAmountForGRF: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.numberOfTimesaCustomerCanChangePanDetails'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.numbersField,
        options: {
          fieldKey: 'pw.brandMaster.numberOfTimesaCustomerCanChangePanDetails'
        }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: {
          fieldKey: 'pw.brandMaster.numberOfTimesaCustomerCanChangePanDetails'
        }
      }
    ],
    inputConstraint: PossWebFieldValidators.localeField
  })
  private numberOfTimesCustomerCanChangePanDetails: string;
  @FormField({
    fieldType: FormFieldType.RADIO,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: 'pw.brandMaster.isPancardonSingleCumulativeInvoice'
  })
  @Class({ className: ['pw-form-card__radio-container'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.isPancardonSingleCumulativeInvoice' }
      }
    ]
  })
  private ispanCardOnSingleInvoiceOrCumulativeInvoiceRadio: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  constructor(
    id: number,
    panConfig_checkBox: { id: string; name: string; checked?: boolean }[],
    ispanCardOnSingleInvoiceOrCumulativeInvoiceRadio: { id: string; name: string; checked?: boolean; }[],
    configurationAmountForCashMemo: string,
    configurationAmountForAdvance: string,
    configurationAmountForGHS: string,
    configurationAmountForGEP: string,
    configurationAmountForCO: string,
    configurationAmountForTEP: string,
    configurationAmountForAcceptAdvance: string,
    configurationAmountForGiftCard: string,
    configurationAmountForGRF: string,
    numberOfTimesCustomerCanChangePanDetails: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.panConfig_checkBox = panConfig_checkBox;
    this.ispanCardOnSingleInvoiceOrCumulativeInvoiceRadio = ispanCardOnSingleInvoiceOrCumulativeInvoiceRadio;
    this.configurationAmountForCashMemo = configurationAmountForCashMemo;
    this.configurationAmountForAdvance = configurationAmountForAdvance;
    this.configurationAmountForGHS = configurationAmountForGHS;
    this.configurationAmountForGEP = configurationAmountForGEP;

    this.configurationAmountForCO = configurationAmountForCO;
    this.configurationAmountForTEP = configurationAmountForTEP;
    this.configurationAmountForAcceptAdvance = configurationAmountForAcceptAdvance;
    this.configurationAmountForGiftCard = configurationAmountForGiftCard;
    this.configurationAmountForGRF = configurationAmountForGRF;

    this.numberOfTimesCustomerCanChangePanDetails = numberOfTimesCustomerCanChangePanDetails;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
