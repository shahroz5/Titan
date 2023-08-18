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

export class VendorMaster extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.vendorMaster.vendorName'
  })
  @Validation({
    customValidators: [
      // {
      //   name: PossWebFieldValidators.vendorCode,
      //   options: {
      //     fieldKey: 'pw.vendorMaster.vendorName'
      //   }
      // },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.vendorMaster.vendorName' }
      }
    ]
    // inputConstraint: PossWebFieldValidators.vendorCode
  })
  @Class({ className: ['col-12'] })
  private vendorCode: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.vendorMaster.vendorType'
  })
  @Validation({
    customValidators: [
      // {
      //   name: PossWebFieldValidators.vendorType,
      //   options: {
      //     fieldKey: 'pw.vendorMaster.vendorType'
      //   }
      // },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.vendorMaster.vendorType' }
      }
    ]
    //inputConstraint: PossWebFieldValidators.vendorType
  })
  @Class({ className: ['col-12'] })
  private vendorType: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.vendorMaster.vendorName'
  })
  @Validation({
    customValidators: [
      // {
      //   name: PossWebFieldValidators.vendorName,
      //   options: {
      //     fieldKey: 'pw.vendorMaster.vendorName'
      //   }
      // },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.vendorMaster.vendorName' }
      }
    ]
    // inputConstraint: PossWebFieldValidators.vendorName
  })
  @Class({ className: ['col-12'] })
  private vendorName: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.vendorMaster.baseUrl'
  })
  @Validation({
    customValidators: [
      // {
      //   name: PossWebFieldValidators.baseUrl,
      //   options: {
      //     fieldKey: 'pw.vendorMaster.baseUrl'
      //   }
      // },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.vendorMaster.baseUrl' }
      }
    ]
    // inputConstraint: PossWebFieldValidators.baseUrl
  })
  @Class({ className: ['col-12'] })
  private baseUrl: string;

  @FormField({
    fieldType: FormFieldType.TEXT_AREA,
    label: 'pw.vendorMaster.vendorDetails'
  })
  // @Validation({ validators: [Validators.pattern("^[0-9.]*$")] })
  @Validation({
    customValidators: [
      // {
      //   name: PossWebFieldValidators.vendorDetail,
      //   options: {
      //     fieldKey: 'pw.vendorMaster.vendorDetails'
      //   }
      // },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.vendorMaster.vendorDetails' }
      }
    ]
    //  inputConstraint: PossWebFieldValidators.vendorDetail
  })
  @Class({ className: ['col-12'] })
  private vendorDetails: string;

  constructor(
    id: number,
    vendorCode: string,
    vendorType: string,
    vendorName: string,
    baseUrl: string,
    vendorDetails: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.vendorCode = vendorCode;
    this.vendorType = vendorType;
    this.vendorName = vendorName;
    this.baseUrl = baseUrl;
    this.vendorDetails = vendorDetails;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
