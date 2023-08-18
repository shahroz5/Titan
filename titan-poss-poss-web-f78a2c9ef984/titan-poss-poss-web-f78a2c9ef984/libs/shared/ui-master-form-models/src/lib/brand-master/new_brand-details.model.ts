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

export class BrandDetailsModel extends DynamicFormFieldsBuilder {
  private id: number;

  // @FormField({
  //     fieldType: FormFieldType.CHECKBOX,
  //     selectOptionKeys: {
  //         labelKey: 'name',
  //         valueKey: 'id',
  //         selectedKey: 'checked'
  //     },
  //     label: ''
  // })
  // @Class({ className: ['isActive'] })
  // private isActive: { id: string; name: string; checked?: boolean }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.brandCode'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.brandCodeField,
        options: { fieldKey: 'pw.brandMaster.brandCode' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.brandCode' }
      }
    ],
    inputConstraint: PossWebFieldValidators.locationCodeField
  })
  private brandCode: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.brandName'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.nameWithSpaceField,
        options: { fieldKey: 'pw.brandMaster.brandName' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.brandName' }
      }
    ]
  })
  private brandName: string;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['row', 'pw-form-card__checkbox-container'] })
  private isInterBrandTEPAllowed: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.minUtilizationPerForGRN'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.percentageField,
        options: { fieldKey: 'pw.brandMaster.minUtilizationPerForGRN' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.minUtilizationPerForGRN' }
      }
    ]
  })
  private minUtilizationForGRN: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.minUtilizationPerForGRF'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.percentageField,
        options: { fieldKey: 'pw.brandMaster.minUtilizationPerForGRF' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.minUtilizationPerForGRF' }
      }
    ]
  })
  private minUtilizationForGRF: string;

  // @FormField({
  //   fieldType: FormFieldType.TEXT,
  //   label: 'pw.brandMaster.dummyMobNo'
  // })
  // @Class({ className: [] })
  // @Validation({
  //   customValidators: [
  //     {
  //       name: PossWebFieldValidators.mobileField,
  //       options: { fieldKey: 'pw.brandMaster.dummyMobNo' }
  //     },
  //     {
  //       name: PossWebFieldValidators.requiredField,
  //       options: { fieldKey: 'pw.brandMaster.dummyMobNo' }
  //     }
  //   ],
  //   inputConstraint: PossWebFieldValidators.mobileField
  // })
  // private dummyMobNo: string;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['row', 'pw-form-card__checkbox-container'] })
  private referCashPaymentConfig: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.numberOfPrintsAllowed'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.numberOfPrintsAllowed' }
      },
      {
        name: PossWebFieldValidators.numberOfPrintsAllowedField,
        options: { fieldKey: 'pw.brandMaster.numberOfPrintsAllowed' }
      }
    ],
    inputConstraint: PossWebFieldValidators.numberOfPrintsAllowedField
  })
  private numberOfPrintsAllowed: string;

  @FormField({
    fieldType: FormFieldType.AMOUNT,
    label: 'pw.brandMaster.passwordConfigForCashDeposit'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.passwordConfigForCashDeposit' }
      },
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.brandMaster.passwordConfigForCashDeposit' }
      }
    ],
    inputConstraint: PossWebFieldValidators.amountField
  })
  private passwordConfigForCashDeposit: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.airpayPaymentExpiry'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.airpayPaymentExpiry' }
      },
      {
        name: PossWebFieldValidators.numberGreaterThanZeroPattern,
        options: { fieldKey: 'pw.brandMaster.airpayPaymentExpiry' }
      }
    ],
    inputConstraint: PossWebFieldValidators.numbersField
  })
  private airpayPaymentExpiry: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.razorpayPaymentExpiry'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.razorpayPaymentExpiry' }
      },
      {
        name: PossWebFieldValidators.noOfDaysForRazorPayPaymentExpiry,
        options: { fieldKey: 'pw.brandMaster.razorpayPaymentExpiry' }
      }
    ],
    inputConstraint: PossWebFieldValidators.noOfDaysForRazorPayPaymentExpiry
  })
  private razorpayPaymentExpiry: string;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['row', 'pw-form-card__checkbox-container'] })
  private isCustomerMandatoryForDigiGold: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  constructor(
    id: number,
    // isActive: { id: string; name: string; checked?: boolean }[],
    brandCode: string,
    brandName: string,
    isInterBrandTEPAllowed: { id: string; name: string; checked?: boolean }[],
    minUtilizationForGRN: string,
    minUtilizationForGRF: string,
    // dummyMobNo: string,
    referCashPaymentConfig: { id: string; name: string; checked?: boolean }[],
    numberOfPrintsAllowed: string,
    passwordConfigForCashDeposit: string,
    airpayPaymentExpiry: string,
    razorpayPaymentExpiry: string,
    isCustomerMandatoryForDigiGold: {
      id: string;
      name: string;
      checked?: boolean;
    }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    // this.isActive = isActive;
    this.brandCode = brandCode;
    this.brandName = brandName;
    this.isInterBrandTEPAllowed = isInterBrandTEPAllowed;
    this.minUtilizationForGRN = minUtilizationForGRN;
    this.minUtilizationForGRF = minUtilizationForGRF;
    // this.dummyMobNo = dummyMobNo;
    this.referCashPaymentConfig = referCashPaymentConfig;
    this.numberOfPrintsAllowed = numberOfPrintsAllowed;
    this.passwordConfigForCashDeposit = passwordConfigForCashDeposit;
    this.airpayPaymentExpiry = airpayPaymentExpiry;
    this.razorpayPaymentExpiry = razorpayPaymentExpiry;
    this.isCustomerMandatoryForDigiGold = isCustomerMandatoryForDigiGold;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
