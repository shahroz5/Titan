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

export class CashPaymentConfigurationModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.cashPaymentConfiguration.cashAmountMaxCap'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.cashPaymentConfiguration.cashAmountMaxCap' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.cashPaymentConfiguration.cashAmountMaxCap' }
      }
    ],
    inputConstraint: PossWebFieldValidators.amountField
  })
  @Class({ className: ['col-8'] })
  private cashAmountMaxCap: string;

  @FormField({
    fieldType: FormFieldType.DATE,
    label: 'pw.cashPaymentConfiguration.validFrom'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.cashPaymentConfiguration.validFrom' }
      }
    ]
  })
  @Class({ className: ['col-4'] })
  private validForm: Date;

  @FormField({
    fieldType: FormFieldType.TEXT_LABEL,
    label: 'pw.cashPaymentConfiguration.applicableDays_Label'
  })
  @Class({ className: ['col-12 pw-fourth-color'] })
  private applicableDays: string;

  @FormField({
    fieldType: FormFieldType.RADIO,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['col-12 w100'] })
  private applicableDaysRadio: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.TEXT_LABEL,
    label: 'pw.cashPaymentConfiguration.applicablePaymentTypes_Label'
  })
  @Class({ className: ['col-12 pw-fourth-color mt-3'] })
  private applicablePaymentTypes: string;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: 'Credit Notes'
  })
  @Class({ className: ['col-4'] })
  private creditNotesCheckbox: {
    id: string;
    name: string;
    checked?: boolean;
    disabled?: boolean;
  }[];

  // New
  @FormField({
    fieldType: FormFieldType.TEXT_LABEL,
    label: 'Applicable Stores'
  })
  @Class({ className: ['col-12 pw-fourth-color mt-3'] })
  private applicableStores: string;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['d-block pl-3 mb-n2'] })
  private applicableStoresUptoL1L2Checkbox: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.RADIO,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['col-12 ml-5 w100'] })
  private applicableStoresUptoL1L2Radio: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['d-block pl-3 mb-n2'] })
  private applicableStoresUptoL3Checkbox: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.RADIO,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['col-12 ml-5 w100'] })
  private applicableStoresUptoL3Radio: {
    id: string;
    name: string;
    checked?: boolean;
  }[];
  // New ends

  @FormField({
    fieldType: FormFieldType.TEXT_LABEL,
    label: 'pw.cashPaymentConfiguration.applicableTransactions_Label'
  })
  @Class({ className: ['col-12 pw-fourth-color'] })
  private applicableTransactions: string;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['d-block pl-3 mb-n1 pw-w-100'] })
  //@Class({ className: ['col-12 mt-4'] })
  private applicableCummulativeCashValueCheckbox: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['d-block pl-4 mb-n2'] })
  private applicableTransactionsCheckbox: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.TEXT_LABEL,
    label: 'pw.cashPaymentConfiguration.note_Label'
  })
  @Class({ className: ['pw-fourth-color pl-3  mt-3'] })
  private cummulativeCashValueNote: string;

  @FormField({
    fieldType: FormFieldType.TEXT_LABEL,
    label: 'pw.cashPaymentConfiguration.cashRefundSetting_Label'
  })
  @Class({ className: ['col-12 pw-fourth-color mt-3'] })
  private cashRefundSettingLabel: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.cashPaymentConfiguration.cashLimit_Label'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.cashPaymentConfiguration.cashLimit_Label' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.cashPaymentConfiguration.cashLimit_Label' }
      }
    ]
    // inputConstraint: PossWebFieldValidators.amountField
  })
  @Class({ className: ['col-8 mt-22'] })
  private refundCashLimit: string;
  
  @FormField({
    fieldType: FormFieldType.TEXT_LABEL,
    label: 'pw.cashPaymentConfiguration.pmla_Label'
  })
  @Class({ className: ['col-12 pw-fourth-color mt-3'] })
  private pmlaLabel: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.cashPaymentConfiguration.cashAmountMaxCap'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.cashPaymentConfiguration.cashAmountMaxCap' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.cashPaymentConfiguration.cashAmountMaxCap' }
      }
    ]
    // inputConstraint: PossWebFieldValidators.amountField
  })
  @Class({ className: ['col-8 mt-22'] })
  private pmlaCashAmountMaxCap: string;

  // New
  @FormField({
    fieldType: FormFieldType.TEXT_LABEL,
    label: 'Applicable Stores for PMLA'
  })
  @Class({ className: ['col-12 pw-fourth-color'] })
  private pmlaApplicableStores: string;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['d-block pl-3 mb-n2'] })
  private pmlaApplicableStoresUptoL1L2Checkbox: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.RADIO,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['col-12 ml-5 w100'] })
  private pmlaApplicableStoresUptoL1L2Radio: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['d-block pl-3 mb-n2'] })
  private pmlaApplicableStoresUptoL3Checkbox: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.RADIO,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['col-12 ml-5 w100'] })
  private pmlaApplicableStoresUptoL3Radio: {
    id: string;
    name: string;
    checked?: boolean;
  }[];
  // New ends

  constructor(
    id: number,
    cashAmountMaxCap: string,
    validForm: Date,
    applicableDaysRadio: {
      id: string;
      name: string;
      checked?: boolean;
    }[],
    creditNotesCheckbox: {
      id: string;
      name: string;
      checked?: boolean;
      disabled?: boolean;
    }[],
    applicableStoresUptoL1L2Checkbox: {
      id: string;
      name: string;
      checked?: boolean;
    }[],
    applicableStoresUptoL1L2Radio: {
      id: string;
      name: string;
      checked?: boolean;
    }[],
    applicableStoresUptoL3Checkbox: {
      id: string;
      name: string;
      checked?: boolean;
    }[],
    applicableStoresUptoL3Radio: {
      id: string;
      name: string;
      checked?: boolean;
    }[],
    applicableCummulativeCashValueCheckbox: {
      id: string;
      name: string;
      checked?: boolean;
    }[],
    applicableTransactionsCheckbox: {
      id: string;
      name: string;
      checked?: boolean;
    }[],
    refundCashLimit: string,
    pmlaCashAmountMaxCap: string,
    pmlaApplicableStoresUptoL1L2Checkbox: {
      id: string;
      name: string;
      checked?: boolean;
    }[],
    pmlaApplicableStoresUptoL1L2Radio: {
      id: string;
      name: string;
      checked?: boolean;
    }[],
    pmlaApplicableStoresUptoL3Checkbox: {
      id: string;
      name: string;
      checked?: boolean;
    }[],
    pmlaApplicableStoresUptoL3Radio: {
      id: string;
      name: string;
      checked?: boolean;
    }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.cashAmountMaxCap = cashAmountMaxCap;
    this.validForm = validForm;
    this.applicableDays = '';
    this.applicableDaysRadio = applicableDaysRadio;
    this.applicablePaymentTypes = '';
    this.creditNotesCheckbox = creditNotesCheckbox;
    this.applicableStores = '';
    this.applicableStoresUptoL1L2Checkbox = applicableStoresUptoL1L2Checkbox;
    this.applicableStoresUptoL1L2Radio = applicableStoresUptoL1L2Radio;
    this.applicableStoresUptoL3Checkbox = applicableStoresUptoL3Checkbox;
    this.applicableStoresUptoL3Radio = applicableStoresUptoL3Radio;
    this.applicableTransactions = '';
    this.applicableCummulativeCashValueCheckbox = applicableCummulativeCashValueCheckbox;
    this.applicableTransactionsCheckbox = applicableTransactionsCheckbox;
    this.cummulativeCashValueNote = '';
    this.cashRefundSettingLabel = '';
    this.refundCashLimit = refundCashLimit;
    this.pmlaLabel = '';
    this.pmlaCashAmountMaxCap = pmlaCashAmountMaxCap;
    this.pmlaApplicableStores = '';
    this.pmlaApplicableStoresUptoL1L2Checkbox = pmlaApplicableStoresUptoL1L2Checkbox;
    this.pmlaApplicableStoresUptoL1L2Radio = pmlaApplicableStoresUptoL1L2Radio;
    this.pmlaApplicableStoresUptoL3Checkbox = pmlaApplicableStoresUptoL3Checkbox;
    this.pmlaApplicableStoresUptoL3Radio = pmlaApplicableStoresUptoL3Radio;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
