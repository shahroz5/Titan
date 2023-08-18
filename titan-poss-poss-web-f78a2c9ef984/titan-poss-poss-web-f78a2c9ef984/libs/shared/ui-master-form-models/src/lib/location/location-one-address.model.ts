import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

import {
  DynamicFormFieldsBuilder,
  FormFieldType,
  FormField,
  Validation,
  Class
} from '@poss-web/shared/components/ui-dynamic-form';

import { Towns, Country } from '@poss-web/shared/models';
export class PersonalModel extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({ fieldType: FormFieldType.TEXT, label: 'pw.locationMaster.name' })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.nameWithSpaceField,
        options: { fieldKey: 'pw.locationMaster.name' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.name' }
      }
    ],
    inputConstraint: PossWebFieldValidators.nameWithSpaceField
  })
  private name: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.companyname'
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.nameWithSpaceField,
        options: { fieldKey: 'pw.locationMaster.companyname' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.companyname' }
      }
    ],
    inputConstraint: PossWebFieldValidators.nameWithSpaceField
  })
  private companyName: string;

  // @FormField({
  //   fieldType: FormFieldType.TEXT,
  //   label: 'pw.locationMaster.descrption'
  // })
  // @Validation({ validators: [Validators.required] })
  // private descrption: string;

  @FormField({
    fieldType: FormFieldType.TEXT_AREA,
    label: 'pw.locationMaster.addressOne'
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.addressField,
        options: { fieldKey: 'pw.locationMaster.addressOne' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.addressOne' }
      }
    ],
    inputConstraint: PossWebFieldValidators.addressField
  })
  private addressOne: string;

  @FormField({
    fieldType: FormFieldType.TEXT_AREA,
    label: 'pw.locationMaster.addressTwo'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.nameWithSpaceField,
        options: { fieldKey: 'pw.locationMaster.addressTwo' }
      }
    ],
    inputConstraint: PossWebFieldValidators.addressField
  })
  private addressTwo: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.phoneNumberOne'
    // validationErrorMessages: [
    //   { errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.phoneNumberOne_pattren' },
    //   { errorType: 'phoneNumberOneNotUnique', errorMessage: 'pw.inventoryMasterValidation.phoneNumberOne_NotUnique' }
    // ]
  })
  // @Validation({
  //   validators: [Validators.required, Validators.pattern('^[0-9]{10}$')]
  // })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.mobileField,
        options: { fieldKey: 'pw.locationMaster.phoneNumberOne' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.phoneNumberOne' }
      }
    ],
    inputConstraint: PossWebFieldValidators.mobileField
  })
  private phoneNumberOne: string;

  // @Validation({
  //   validators: [Validators.required, Validators.pattern('^[0-9]{10}$')]
  // })

  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.mobileField,
        options: { fieldKey: 'pw.locationMaster.phoneNumberTwo' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.phoneNumberTwo' }
      }
    ],
    inputConstraint: PossWebFieldValidators.mobileField
  })
  @Class({ className: ['col-12'] })
  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.phoneNumberTwo'
    // validationErrorMessages: [
    //   { errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.phoneNumberTwo_pattren' },
    //   { errorType: 'phoneNumberTwoNotUnique', errorMessage: 'pw.inventoryMasterValidation.phoneNumberTwo_NotUnique' }
    // ]
  })
  private phoneNumberTwo: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.mobileNumber'
    // validationErrorMessages: [
    //   {
    //     errorType: 'pattern',
    //     errorMessage: 'pw.inventoryMasterValidation.mobileNumber_pattern'
    //   }
    // ]
  })
  // @Validation({
  //   validators: [Validators.pattern('^[0-9]{10}$')]
  // })
  @Class({ className: ['col-12'] })
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
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.emailID'
    // validationErrorMessages: [
    //   {
    //     errorType: 'pattern',
    //     errorMessage: 'pw.inventoryMasterValidation.emailId_pattern'
    //   }
    // ]
  })
  // @Validation({
  //   validators: [
  //     Validators.required,
  //     Validators.pattern(
  //       '^[a-zA-Z0-9.!#$%&*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'
  //     )
  //   ]
  // })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.emailField,
        options: { fieldKey: 'pw.locationMaster.emailID' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.emailID' }
      }
    ],
    inputConstraint: PossWebFieldValidators.emailField
  })
  private emailId: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.pinCode'
    // validationErrorMessages: [
    //   {
    //     errorType: 'pattern',
    //     errorMessage: 'pw.inventoryMasterValidation.pinCode_pattern'
    //   }
    // ]
  })
  // @Validation({
  //   validators: [Validators.required, Validators.pattern('^[0-9]{6}$')]
  // })
  @Class({ className: ['col-12'] })
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
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.locationMaster.country'
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required] })
  private country: { id: string; name: string }[];

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected',
      foreignKey: 'countryCode'
    },
    label: 'pw.locationMaster.state',
    dependsOn: '1-country'
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.state' }
      }
    ]
  })
  private state: { id: string; name: string }[];

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      foreignKey: 'state_id',
      selectedKey: 'selected'
    },
    label: 'pw.locationMaster.City/Town',
    dependsOn: '1-state'
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.City/Town' }
      }
    ]
  })
  private cityTown: { id: string; name: string; state_id: string }[];

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'id',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.locationMaster.regionCode'
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.regionCode' }
      }
    ]
  })
  private regionCode: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'id',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.locationMaster.subRegionCode'
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.subRegionCode' }
      }
    ]
  })
  private subRegionCode: {
    id: string;
    name: string;
    selected?: boolean;
  }[];

  constructor(
    id: number,
    name: string,
    companyName: string,
    addressOne: string,
    addressTwo: string,
    phoneNumberOne: string,
    phoneNumberTwo: string,
    mobileNumber: string,
    pinCode: string,
    emailId: string,
    country: { id: string; name: string }[],
    state: { id: string; name: string; selected?: boolean }[],
    cityTown: Towns[],
    regionCode: { id: string; name: string; selected?: boolean }[],
    subRegionCode: { id: string; name: string; selected?: boolean }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.name = name;
    this.companyName = companyName;
    this.addressOne = addressOne;
    this.addressTwo = addressTwo;
    this.phoneNumberOne = phoneNumberOne;
    this.phoneNumberTwo = phoneNumberTwo;
    this.mobileNumber = mobileNumber;
    this.emailId = emailId;
    this.pinCode = pinCode;
    this.country = country;
    this.state = state;
    this.cityTown = cityTown;

    this.regionCode = regionCode;
    this.subRegionCode = subRegionCode;
    this.TranslateService = translateService;
    this.FieldValidatorsService = fieldValidatorsService;
  }
}
