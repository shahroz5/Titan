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

export class ProductCategoryMaster extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.productCategory.productCategoryCodeField'
  })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.productCategoryField,
        options: { fieldKey: 'pw.productCategory.productCategoryCodeField' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.productCategory.productCategoryCodeField' }
      }
    ],
    inputConstraint: PossWebFieldValidators.productCategoryField
  })
  // @Validation({ validators: [Validators.required, Validators.pattern('^[a-zA-Z0-9/]+$')] })
  @Class({ className: ['col'] })
  private prodCatCode: string;

  @FormField({
    fieldType: FormFieldType.TEXT_AREA,
    label: 'pw.productCategory.descriptionField'
  })
  // @Validation({ validators: [Validators.required, Validators.pattern('^[-a-zA-Z0-9-/]+(\\s+[-a-zA-Z0-9-/]+)*$')] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.descriptionField,
        options: { fieldKey: 'pw.productCategory.descriptionField' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.productCategory.descriptionField' }
      }
    ],
    inputConstraint: PossWebFieldValidators.descriptionField
  })
  @Class({ className: ['col-12'] })
  private desctiption: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.productCategory.hallmarkingCharges'
  })
  // @Validation({ validators: [Validators.required, Validators.pattern('^[-a-zA-Z0-9-/]+(\\s+[-a-zA-Z0-9-/]+)*$')] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: { fieldKey: 'pw.productCategory.hallmarkingCharges' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.productCategory.hallmarkingCharges' }
      }
    ],
    inputConstraint: PossWebFieldValidators.descriptionField
  })
  @Class({ className: ['col-12'] })
  private hallmarkingCharges: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.productCategory.hallmarkingQuantity'
  })
  // @Validation({ validators: [Validators.required, Validators.pattern('^[-a-zA-Z0-9-/]+(\\s+[-a-zA-Z0-9-/]+)*$')] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.quantityField,
        options: { fieldKey: 'pw.productCategory.hallmarkingQuantity' }
      }
    ],
    inputConstraint: PossWebFieldValidators.descriptionField
  })
  @Class({ className: ['col-12'] })
  private hallmarkQuantity: number;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['col-12', 'pl-0'] })
  private hallmarking: { id: string; name: string; checked?: boolean }[];

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['col-12', 'pl-0'] })
  private isConversionEnabled: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  constructor(
    id: number,
    prodCatCode: string,
    desctiption: string,
    hallmarkingCharges: string,
    hallmarkQuantity: number,
    hallmarking: { id: string; name: string; checked?: boolean }[],
    isConversionEnabled: { id: string; name: string; checked?: boolean }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.prodCatCode = prodCatCode;
    this.desctiption = desctiption;
    this.hallmarkingCharges = hallmarkingCharges;
    this.hallmarkQuantity = hallmarkQuantity;
    this.hallmarking = hallmarking;
    this.isConversionEnabled = isConversionEnabled;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
