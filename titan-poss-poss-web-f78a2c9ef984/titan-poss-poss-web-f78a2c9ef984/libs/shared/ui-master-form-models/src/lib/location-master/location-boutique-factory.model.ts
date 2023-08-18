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

export class LocationBoutiqueFactoryModel extends DynamicFormFieldsBuilder {
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
    label: 'pw.locationMaster.locationCode'
  })
  @Class({ className: [] })
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
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.locationType' }
      }
    ]
  })
  private locationType: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.locationMaster.locationSize'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.locationSize' }
      }
    ]
  })
  private locationSize: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.locationShortName'
  })
  // @Class({ className: [] })
  // @Validation({
  //   customValidators: [
  //     {
  //       name: PossWebFieldValidators.depreciationCodeField,
  //       options: { fieldKey: 'pw.locationMaster.locationShortName' }
  //     }
  //   ]
  // })
  private locationShortName: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.locationName'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.nameWithSpaceField,
        options: { fieldKey: 'pw.locationMaster.locationName' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.locationName' }
      }
    ]
  })
  private locationName: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.addressOne'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      // {
      //   name: PossWebFieldValidators.addressField,
      //   options: { fieldKey: 'pw.locationMaster.addressOne' }
      // },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.addressOne' }
      }
    ]
    // inputConstraint: PossWebFieldValidators.addressField
  })
  private address1: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.addressTwo'
  })
  @Class({ className: [] })
  // @Validation({
  //   customValidators: [
  //     {
  //       name: PossWebFieldValidators.addressField,
  //       options: { fieldKey: 'pw.locationMaster.addressTwo' }
  //     }
  //   ],
  //   inputConstraint: PossWebFieldValidators.addressField
  // })
  private address2: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.addressThree'
  })
  @Class({ className: [] })
  // @Validation({
  //   customValidators: [
  //     {
  //       name: PossWebFieldValidators.addressField,
  //       options: { fieldKey: 'pw.locationMaster.addressThree' }
  //     }
  //   ],
  //   inputConstraint: PossWebFieldValidators.addressField
  // })
  private address3: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.phoneNumberOne'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.contactNoField,
        options: { fieldKey: 'pw.locationMaster.phoneNumberOne' }
      }
    ],
    inputConstraint: PossWebFieldValidators.contactNoField
  })
  private phoneNumber1: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.phoneNumberTwo'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.contactNoField,
        options: { fieldKey: 'pw.locationMaster.phoneNumberTwo' }
      }
    ],
    inputConstraint: PossWebFieldValidators.contactNoField
  })
  private phoneNumber2: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.mobileNumber'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.mobileField,
        options: { fieldKey: 'pw.locationMaster.mobileNumber' }
      }
    ],
    inputConstraint: PossWebFieldValidators.mobileField
  })
  private mobileNumber: string;

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.locationMaster.state'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.state' }
      }
    ]
  })
  private state: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.locationMaster.country'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.country' }
      }
    ]
  })
  private country: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.locationMaster.City/Town'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.City/Town' }
      }
    ]
  })
  private cityTown: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.pinCode'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.pincodeField,
        options: { fieldKey: 'pw.locationMaster.pinCode' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.pinCode' }
      }
    ],
    inputConstraint: PossWebFieldValidators.pincodeField
  })
  private pinCode: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.reviewLinkURL'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.urlField,
        options: { fieldKey: 'pw.locationMaster.reviewLinkURL' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.reviewLinkURL' }
      }
    ],
    inputConstraint: PossWebFieldValidators.urlField
  })
  private reviewLinkURL: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.boutiqueEmailId'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.emailField,
        options: { fieldKey: 'pw.locationMaster.boutiqueEmailId' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.boutiqueEmailId' }
      }
    ],
    inputConstraint: PossWebFieldValidators.emailField
  })
  private boutiqueEmailId: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.factoryCode'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.locationCodeField,
        options: { fieldKey: 'pw.locationMaster.factoryCode' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.factoryCode' }
      }
    ],
    inputConstraint: PossWebFieldValidators.locationCodeField
  })
  private factoryCode: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.regdOffice'
  })
  @Class({ className: [] })
  // @Validation({
  //   customValidators: [
  //     {
  //       name: PossWebFieldValidators.depreciationCodeField,
  //       options: { fieldKey: 'pw.locationMaster.regdOffice' }
  //     }
  //   ]
  // })
  private registeredOffice: string;

  // @FormField({
  //   fieldType: FormFieldType.TEXT,
  //   label: 'pw.locationMaster.cfaCode'
  // })
  // @Class({ className: [] })
  // @Validation({
  //   customValidators: [
  //     {
  //       name: PossWebFieldValidators.locationCodeField,
  //       options: { fieldKey: 'pw.locationMaster.cfaCode' }
  //     }
  //   ]
  // })
  // private cfaCode: string;

  @FormField({
    fieldType: FormFieldType.SELECTION_INPUT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.locationMaster.cfaCode'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.cfaCode' }
      }
    ]
  })
  private cfaCode: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.locationMaster.ownerinfo'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.ownerinfo' }
      }
    ]
  })
  private ownerInfo: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.locationMaster.region'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.region' }
      }
    ]
  })
  private region: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.locationMaster.subRegion'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.subRegion' }
      }
    ]
  })
  private subRegion: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.locationMaster.brand'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.brand' }
      }
    ]
  })
  private brand: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.locationMaster.subBrand'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.subBrand' }
      }
    ]
  })
  private subBrand: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.SELECTION_INPUT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.locationMaster.marketCode'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.marketCode' }
      }
    ]
  })
  private marketCode: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.CINNumber'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.cinNumberField,
        options: { fieldKey: 'CIN Number' }
      }
    ],
    inputConstraint: PossWebFieldValidators.cinNumberField
  })
  private cinNumber: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.overallRemarks'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.remarkField,
        options: { fieldKey: 'pw.locationMaster.overallRemarks' }
      }
    ],
    inputConstraint: PossWebFieldValidators.locationCodeField
  })
  private overallRemarks: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.maxRateRetryAttempt'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.maxRateRetryAttempt' }
      },
      {
        name: PossWebFieldValidators.noOfTimesCardAllowedField,
        options: { fieldKey: 'pw.locationMaster.maxRateRetryAttempt' }
      }
    ],
    inputConstraint: PossWebFieldValidators.noOfTimesCardAllowedField
  })
  private maxRateRetryAttempt: string;

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
  private isDial: { id: string; name: string; checked?: boolean }[];

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
  private isEinvoiceEnabled: { id: string; name: string; checked?: boolean }[];

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
  private isPanCardVerifyIntegrationEnabled: {
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
  @Class({ className: ['isOffline'] })
  private isOffline: { id: string; name: string; checked?: boolean }[];

  // @FormField({
  //   fieldType: FormFieldType.CHECKBOX,
  //   selectOptionKeys: {
  //     labelKey: 'name',
  //     valueKey: 'id',
  //     selectedKey: 'checked'
  //   },
  //   label: ''
  // })
  // @Class({ className: ['isAutostn'] })
  // private isAutostn: { id: string; name: string; checked?: boolean }[];

  constructor(
    id: number,
    // isActive: { id: string; name: string; checked?: boolean }[],
    locationCode: string,
    locationType: { id: string; name: string; checked?: boolean }[],
    locationSize: { id: string; name: string; checked?: boolean }[],
    locationShortName: string,
    locationName: string,
    address1: string,
    address2: string,
    address3: string,
    phoneNumber1: string,
    phoneNumber2: string,
    mobileNumber: string,
    country: { id: string; name: string; selected?: boolean }[],
    state: { id: string; name: string; selected?: boolean }[],
    cityTown: { id: string; name: string; selected?: boolean }[],
    pinCode: string,
    reviewLinkURL: string,
    boutiqueEmailId: string,
    factoryCode: string,
    registeredOffice: string,
    // cfaCode: string,
    cfaCode: { id: string; name: string; selected?: boolean }[],
    ownerInfo: { id: string; name: string; selected?: boolean }[],
    region: { id: string; name: string; selected?: boolean }[],
    subRegion: { id: string; name: string; selected?: boolean }[],
    brand: { id: string; name: string; selected?: boolean }[],
    subBrand: { id: string; name: string; selected?: boolean }[],
    marketCode: { id: string; name: string; selected?: boolean }[],
    cinNumber: string,
    overallRemarks: string,
    maxRateRetryAttempt: string,
    isDial: { id: string; name: string; checked?: boolean }[],
    isEinvoiceEnabled: { id: string; name: string; checked?: boolean }[],
    isPanCardVerifyIntegrationEnabled: {
      id: string;
      name: string;
      checked?: boolean;
    }[],
    isOffline: { id: string; name: string; checked?: boolean }[],
    // isAutostn: { id: string; name: string; checked?: boolean }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    // this.isActive = isActive;
    this.locationCode = locationCode;
    this.locationType = locationType;
    this.locationSize = locationSize;
    this.locationShortName = locationShortName;
    this.locationName = locationName;
    this.address1 = address1;
    this.address2 = address2;
    this.address3 = address3;
    this.phoneNumber1 = phoneNumber1;
    this.phoneNumber2 = phoneNumber2;
    this.mobileNumber = mobileNumber;
    this.country = country;
    this.state = state;
    this.cityTown = cityTown;
    this.pinCode = pinCode;
    this.reviewLinkURL = reviewLinkURL;
    this.boutiqueEmailId = boutiqueEmailId;
    this.factoryCode = factoryCode;
    this.registeredOffice = registeredOffice;
    this.cfaCode = cfaCode;
    this.ownerInfo = ownerInfo;
    this.region = region;
    this.subRegion = subRegion;
    this.brand = brand;
    this.subBrand = subBrand;
    this.marketCode = marketCode;
    this.cinNumber = cinNumber;
    this.overallRemarks = overallRemarks;
    this.maxRateRetryAttempt = maxRateRetryAttempt;
    this.isDial = isDial;
    this.isEinvoiceEnabled = isEinvoiceEnabled;
    this.isPanCardVerifyIntegrationEnabled = isPanCardVerifyIntegrationEnabled;
    this.isOffline = isOffline;
    // this.isAutostn = isAutostn;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
