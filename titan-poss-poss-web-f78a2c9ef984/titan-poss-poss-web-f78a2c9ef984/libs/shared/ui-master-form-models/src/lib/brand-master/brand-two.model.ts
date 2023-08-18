import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Validation,
  Class
} from '@poss-web/shared/components/ui-dynamic-form';
import { Validators } from '@angular/forms';
import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

export class BrandTwo extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.ULPServiceURL'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.urlField,
        options: { fieldKey: 'pw.brandMaster.ULPServiceURL' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.ULPServiceURL' }
      }
    ],
    inputConstraint: PossWebFieldValidators.urlField
  })
  private ULPServiceURL: string;

  // @FormField({
  //   fieldType: FormFieldType.TEXT,
  //   label: 'pw.brandMaster.dummyMobNo'
  // })
  // @Class({ className: ['col-12'] })
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
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.description'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.descriptionField,
        options: { fieldKey: 'pw.brandMaster.description' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.description' }
      }
    ],
    inputConstraint: PossWebFieldValidators.descriptionField
  })
  private brandDescription: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.minUtilizationPercentageforGRN'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.percentageField,
        options: { fieldKey: 'pw.brandMaster.minUtilizationPercentageforGRN' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.minUtilizationPercentageforGRN' }
      }
    ],
    inputConstraint: PossWebFieldValidators.percentageField
  })
  private minUtilizationPercentageforGRN: string;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Validation({
    validators: [Validators.required]
  })
  @Class({ className: ['col-12 pl-0'] })
  private isActive: { id: string; name: string; checked: boolean }[];

  constructor(
    id: number,
    ULPServiceURL: string,
    // dummyMobNo: string,
    brandDescription: string,
    minUtilizationPercentageforGRN: string,
    isActive: { id: string; name: string; checked: boolean }[],
    fieldValidatorsService: FieldValidatorsService,

    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.ULPServiceURL = ULPServiceURL;
    // this.dummyMobNo = dummyMobNo;
    this.brandDescription = brandDescription;
    this.minUtilizationPercentageforGRN = minUtilizationPercentageforGRN;
    this.isActive = isActive;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
