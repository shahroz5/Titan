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
export class CourierDetailsMainModel extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.courierDetails.courierNameLabel'
  })
  @Class({ className: ['col-lg-12 col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.nameWithSpaceField,
        options: { fieldKey: 'pw.courierDetails.courierNameLabel' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.courierDetails.courierNameLabel' }
      }
    ],
    inputConstraint: PossWebFieldValidators.nameWithSpaceField
  })
  private courierName: string;

  // @FormField({
  //   fieldType: FormFieldType.TOGGLE,
  //   selectOptionKeys: {
  //     labelKey: 'name',
  //     valueKey: 'id',
  //     selectedKey: 'checked'
  //   },
  //   label: ''
  // })
  // @Class({ className: ['col-lg-3 col-4 pw-text-right align-self-center'] })
  // private isActive: { id: string; name: string; checked?: boolean }[];

  @FormField({
    fieldType: FormFieldType.TEXT_AREA,
    label: 'pw.courierDetails.addressLabel'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.addressField,
        options: { fieldKey: 'pw.courierDetails.addressLabel' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.courierDetails.addressLabel' }
      }
    ],
    inputConstraint: PossWebFieldValidators.addressField
  })
  @Class({ className: ['col-6 wdth'] })
  private address: string;
  @FormField({
    fieldType: FormFieldType.TEXT_AREA,
    label: 'pw.courierDetails.descriptionLabel'
  })
  @Class({ className: ['col-6 wdth'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.descriptionField,
        options: { fieldKey: 'pw.courierDetails.descriptionLabel' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.courierDetails.descriptionLabel' }
      }
    ],
    inputConstraint: PossWebFieldValidators.descriptionField
  })
  private description: string;
  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.courierDetails.countryLabel'
  })
  @Class({ className: ['col-6 wdth'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.courierDetails.countryLabel' }
      }
    ]
  })
  private country: { id: string; name: string }[];
  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected',
      foreignKey: 'countryCode'
    },
    label: 'pw.courierDetails.stateLabel',
    dependsOn: '1-country'
  })
  @Class({ className: ['col-6 wdth'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.courierDetails.stateLabel' }
      }
    ]
  })
  private state: { id: string; name: string }[];
  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.courierDetails.cityLabel'
  })
  @Class({ className: ['col-6 wdth'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.courierDetails.cityLabel' }
      },
      {
        name: PossWebFieldValidators.cityField,
        options: { fieldKey: 'pw.courierDetails.cityLabel' }
      }
    ]
  })
  private city: string;
  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.courierDetails.emailIdLabel'
  })
  @Class({ className: ['col-6 wdth'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.emailField,
        options: { fieldKey: 'pw.courierDetails.emailIdLabel' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.courierDetails.emailIdLabel' }
      }
    ],
    inputConstraint: PossWebFieldValidators.emailField
  })
  private emailId: string;
  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.courierDetails.phoneNumberLabel'
  })
  @Class({ className: ['col-6 wdth'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.mobileField,
        options: { fieldKey: 'pw.courierDetails.phoneNumberLabel' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.courierDetails.phoneNumberLabel' }
      }
    ],
    inputConstraint: PossWebFieldValidators.mobileField
  })
  private phoneNumber: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.courierDetails.contactPersonLabel'
  })
  @Class({ className: ['col-6 wdth'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.nameWithSpaceField,
        options: { fieldKey: 'pw.courierDetails.contactPersonLabel' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.courierDetails.contactPersonLabel' }
      }
    ],
    inputConstraint: PossWebFieldValidators.nameWithSpaceField
  })
  private contactPerson: string;
  constructor(
    id: number,
    courierName: string,
    //isActive: { id: string; name: string; checked?: boolean }[],
    address: string,
    description: string,
    country: { id: string; name: string }[],
    state: { id: string; name: string; selected?: boolean }[],
    city: string,
    emialId: string,
    phoneNumber: string,
    contactPerson: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.courierName = courierName;
    //this.isActive = isActive;
    this.address = address;
    this.description = description;
    this.country = country;
    this.state = state;
    this.city = city;
    this.emailId = emialId;
    this.phoneNumber = phoneNumber;
    this.contactPerson = contactPerson;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
