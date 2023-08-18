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

export class PayeeBankMaster extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.payeeBank.bankName'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.bankNameField,
        options: { fieldKey: 'pw.payeeBank.bankName' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.payeeBank.bankName' }
      }
    ],
    inputConstraint: PossWebFieldValidators.bankNameField
  })
  @Class({ className: ['col-12'] })
  private bankname: string;

  // @FormField({
  //   fieldType: FormFieldType.TOGGLE,
  //   selectOptionKeys: {
  //     labelKey: 'name',
  //     valueKey: 'id',
  //     selectedKey: 'checked'
  //   },
  //   label: ''
  // })
  // // @Validation({
  // //   customValidators: [
  // //     {
  // //       name: PossWebFieldValidators.requiredField,
  // //       options: { fieldKey: 'Is Active' }
  // //     }
  // //   ]
  // // })
  // @Class({ className: ['col-12'] })
  // private isActive: { id: string; name: string; checked?: boolean }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.payeeBank.bankCode'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.bankCodeField,
        options: { fieldKey: 'pw.payeeBank.bankCode' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.payeeBank.bankCode' }
      }
    ],
    inputConstraint: PossWebFieldValidators.bankCodeField
  })
  @Class({ className: ['col-12'] })
  private bankCode: string;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: 'Level'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'Level' }
      }
    ]
  })
  @Class({ className: ['check-box'] })
  private ownerType: { id: string; name: string; checked: string }[];

  @FormField({
    fieldType: FormFieldType.TEXT_AREA,
    label: 'pw.payeeBank.addressOne'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.addressField,
        options: { fieldKey: 'pw.payeeBank.addressOne' }
      }
    ],
    inputConstraint: PossWebFieldValidators.addressField
  })
  @Class({ className: ['col-12'] })
  private addressOne: string;

  @FormField({
    fieldType: FormFieldType.TEXT_AREA,
    label: 'pw.payeeBank.addressTwo'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.addressField,
        options: { fieldKey: 'pw.payeeBank.addressTwo' }
      }
    ],
    inputConstraint: PossWebFieldValidators.addressField
  })
  @Class({ className: ['col-12'] })
  private addressTwo: string;
  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'Country'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.countryCodeField,
        options: { fieldKey: 'Country' }
      }
    ],
    inputConstraint: PossWebFieldValidators.countryCodeField
  })
  @Class({ className: ['col-12'] })
  private country: string;
  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.payeeBank.state'
  })
  @Class({ className: ['col-12'] })
  // @Validation({
  //   customValidators: [
  //     {
  //       name: PossWebFieldValidators.stateField,
  //       options: { fieldKey: 'pw.payeeBank.state' }
  //     }
  //   ],
  //   inputConstraint: PossWebFieldValidators.stateField
  // })
  private state: { id: string; name: string; selected?: boolean }[];
  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.payeeBank.city/town'
  })
  @Class({ className: ['col-12'] })
  // @Validation({
  //   customValidators: [
  //     {
  //       name: PossWebFieldValidators.cityField,
  //       options: { fieldKey: 'pw.payeeBank.city/town' }
  //     }
  //   ],
  //   inputConstraint: PossWebFieldValidators.cityField
  // })
  private city: { id: string; name: string; selected?: boolean }[];

  @FormField({
    fieldType: FormFieldType.TEXT_AREA,
    label: 'pw.payeeBank.emailId'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.emailField,
        options: { fieldKey: 'pw.payeeBank.emailId' }
      }
      // {
      //   name: PossWebFieldValidators.requiredField,
      //   options: { fieldKey: 'pw.payeeBank.emailId' }
      // }
    ],
    inputConstraint: PossWebFieldValidators.emailField
  })
  @Class({ className: ['col-12'] })
  private emailId: string;

  @FormField({
    fieldType: FormFieldType.TEXT_AREA,
    label: 'pw.payeeBank.contactPerson'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.nameWithSpaceField,
        options: { fieldKey: 'pw.payeeBank.contactPerson' }
      }
      // {
      //   name: PossWebFieldValidators.requiredField,
      //   options: { fieldKey: 'pw.payeeBank.contactPerson' }
      // }
    ],
    inputConstraint: PossWebFieldValidators.nameWithSpaceField
  })
  @Class({ className: ['col-12'] })
  private contactPerson: string;

  constructor(
    id: number,
    bankname: string,
    bankCode: string,
    ownerType: { id: string; name: string; checked: string }[],
    addressOne: string,
    addressTwo: string,
    country: string,
    state: { id: string; name: string; selected?: boolean }[],
    city: { id: string; name: string; selected?: boolean }[],
    emailId: string,
    contactPerson: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.bankname = bankname;
    // this.isActive = [
    //   {
    //     id: '1',
    //     name: 'Active',
    //     checked: true
    //   }
    // ];
    this.bankCode = bankCode;
    this.ownerType = ownerType;
    this.addressOne = addressOne;
    this.addressTwo = addressTwo;
    this.country = country;
    this.state = state;
    this.city = city;
    this.emailId = emailId;
    this.contactPerson = contactPerson;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
