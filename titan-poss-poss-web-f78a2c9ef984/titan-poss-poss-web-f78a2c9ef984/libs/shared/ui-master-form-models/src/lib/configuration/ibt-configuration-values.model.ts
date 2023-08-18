import {
  FormField,
  FormFieldType,
  Validation,
  DynamicFormFieldsBuilder,
  Class
} from '@poss-web/shared/components/ui-dynamic-form';
import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

export class IbtConfigurationValueModel extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.ibtConfiguration.noOfRequestPerMonth'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.ibtConfiguration.noOfRequestPerMonth' }
      },
      {
        name: PossWebFieldValidators.noOfRequestPerMonth,
        options: { fieldKey: 'pw.ibtConfiguration.noOfRequestPerMonth' }
      }
    ],
    inputConstraint: PossWebFieldValidators.noOfRequestPerMonth
  })
  @Class({ className: ['col-12'] })
  private noOfRequestPerMonth: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.ibtConfiguration.maxNoOfProductsPerStn'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.ibtConfiguration.maxNoOfProductsPerStn' }
      },
      {
        name: PossWebFieldValidators.maxNumberOfProducts,
        options: { fieldKey: 'pw.ibtConfiguration.maxNoOfProductsPerStn' }
      }
    ],
    inputConstraint: PossWebFieldValidators.maxNumberOfProducts
  })
  @Class({ className: ['col-12'] })
  private maxNoOfProductsPerStn: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.ibtConfiguration.maxValuePerStn'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.ibtConfiguration.maxValuePerStn' }
      },
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.ibtConfiguration.maxValuePerStn' }
      }
    ],
    inputConstraint: PossWebFieldValidators.amountField
  })
  @Class({ className: ['col-12'] })
  private maxValuePerStn: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.ibtConfiguration.reqValidUpto'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.reqValidUpto,
        options: { fieldKey: 'pw.ibtConfiguration.reqValidUpto' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.ibtConfiguration.reqValidUpto' }
      }
    ],
    inputConstraint: PossWebFieldValidators.reqValidUpto
  })
  @Class({ className: ['col-12'] })
  private reqValidUpto: string;

  constructor(
    id: number,
    noOfRequestPerMonth: string,
    maxNoOfProductsPerStn: string,
    maxValuePerStn: string,
    reqValidUpto: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.noOfRequestPerMonth = noOfRequestPerMonth;
    this.maxNoOfProductsPerStn = maxNoOfProductsPerStn;
    this.maxValuePerStn = maxValuePerStn;
    this.reqValidUpto = reqValidUpto;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
