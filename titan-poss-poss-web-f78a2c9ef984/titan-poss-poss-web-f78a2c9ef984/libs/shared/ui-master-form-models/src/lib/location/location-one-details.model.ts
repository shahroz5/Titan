import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Validation,
  Class
} from '@poss-web/shared/components/ui-dynamic-form';
// import { Validators } from '@angular/forms';
import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

export class LocationModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.locationCode'
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.locationCodeField,
        options: { fieldKey: 'pw.locationMaster.locationCode' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.locationCode' }
      }
    ],
    inputConstraint: PossWebFieldValidators.locationCodeField
  })
  private locationCode: string;

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.locationMaster.locationType'
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.locationType' }
      }
    ]
  })
  private locationType: { id: string; name: string }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.factoryCode'
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.factoryCode' }
      }
    ]
  })
  private factoryCode: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.locationShortName'
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.nameWithSpaceField,
        options: { fieldKey: 'pw.locationMaster.locationShortName' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.locationShortName' }
      }
    ],
    inputConstraint: PossWebFieldValidators.nameWithSpaceField
  })
  private locationShortName: string;

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'id',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.locationMaster.brandName'
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.nameWithSpaceField,
        options: { fieldKey: 'pw.locationMaster.brandName' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.brandName' }
      }
    ]
  })
  private brandName: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'id',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.locationMaster.subBrandName'
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.nameWithSpaceField,
        options: { fieldKey: 'pw.locationMaster.subBrandName' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.subBrandName' }
      }
    ]
  })
  private subBrandCode: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.registrationNo'
    // validationErrorMessages: [
    //   {
    //     errorType: 'pattern',
    //     errorMessage: 'pw.inventoryMasterValidation.registrationNo_pattern'
    //   }
    // ]
  })
  // @Validation({
  //   validators: [
  //     Validators.pattern(
  //       '^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9]{1}Z[0-9]{1})$'
  //     )
  //   ]
  // })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.gstNumberField,
        options: { fieldKey: 'pw.locationMaster.registrationNo' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.registrationNo' }
      }
    ],
    inputConstraint: PossWebFieldValidators.gstNumberField
  })
  private registrationNo: string;

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.locationMaster.locationFormat'
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.locationFormat' }
      }
    ]
  })
  private locationFormat: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.fax'
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.fax' }
      }
    ]
  })
  private fax: string;

  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.ownerinfo' }
      }
    ]
  })
  @Class({ className: ['col-12'] })
  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.locationMaster.ownerinfo'
  })
  private ownerInfo: { id: string; name: string; selected?: boolean }[];

  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.baseCurrency' }
      }
    ]
  })
  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.locationMaster.baseCurrency'
  })
  @Class({ className: ['col-12'] })
  private baseCurrency: { id: string; name: string; selected?: boolean }[];
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.masterCurrency' }
      }
    ]
  })
  @Class({ className: ['col-12'] })
  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.locationMaster.masterCurrency'
  })
  private masterCurrency: { id: string; name: string; selected?: boolean }[];
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.paymentCurrency' }
      }
    ]
  })
  @Class({ className: ['col-12'] })
  @FormField({
    fieldType: FormFieldType.MULTISELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.locationMaster.paymentCurrency'
  })
  private paymentCurrency: { id: string; name: string; selected?: boolean }[];
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.stockCurrency' }
      }
    ]
  })
  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.locationMaster.stockCurrency'
  })
  @Class({ className: ['col-12'] })
  private stockCurrency: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.locationMaster.marketCode'
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.marketCode' }
      }
    ]
  })
  private marketCode: { id: string; name: string }[];

  constructor(
    id: number,
    locationCode: string,
    locationType: { id: string; name: string; selected?: boolean }[],
    locationShortName: string,
    brandName: { id: string; name: string; selected?: boolean }[],
    subBrandCode: { id: string; name: string; selected?: boolean }[],
    factoryCode: string,
    registrationNo: string,
    ownerInfo: { id: string; name: string; selected?: boolean }[],
    locationFormat: { id: string; name: string; selected?: boolean }[],
    fax: string,
    baseCurrency: { id: string; name: string; selected?: boolean }[],
    masterCurrency: { id: string; name: string; selected?: boolean }[],
    paymentCurrency: { id: string; name: string; selected?: boolean }[],
    stockCurrency: { id: string; name: string; selected?: boolean }[],
    marketCode: { id: string; name: string }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.locationCode = locationCode;
    this.locationType = locationType;
    this.locationShortName = locationShortName;
    this.brandName = brandName;
    this.subBrandCode = subBrandCode;
    this.factoryCode = factoryCode;
    this.registrationNo = registrationNo;
    this.ownerInfo = ownerInfo;
    this.locationFormat = locationFormat;
    this.fax = fax;
    this.baseCurrency = baseCurrency;
    this.masterCurrency = masterCurrency;
    this.paymentCurrency = paymentCurrency;
    this.stockCurrency = stockCurrency;
    this.marketCode = marketCode;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
