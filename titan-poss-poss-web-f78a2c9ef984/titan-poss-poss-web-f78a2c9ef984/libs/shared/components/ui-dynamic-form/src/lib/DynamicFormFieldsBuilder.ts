import { forOwn, map } from 'lodash';
import { FormMetadataKeys } from './decorators/FormMetadataKeys';
import { BaseElementFactory } from './inputs/base/BaseElementFactory';
import { FormFieldType } from './FormFieldType';
import { SelectOption } from './inputs/SelectOption';
import { FormFieldOptions } from './decorators/FormFieldOptions';
import { BaseElementParams } from './inputs/base/BaseElementParams';
import {
  ValidationOptions,
  CustomValidatorsOptions
} from './decorators/ValidationOptions';
import { SubFormInput } from './inputs/SubFormInput';
import { ClassOptions } from './decorators/ClassOptions';
// import { Reflect } from 'core-js/es7/Reflect';
import 'reflect-metadata';
import { ValidatorFn, Validators } from '@angular/forms';
import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

export abstract class DynamicFormFieldsBuilder {
  private fieldValidatorsService: FieldValidatorsService;
  private translateService: TranslateService;

  set FieldValidatorsService(fieldValidatorsService: FieldValidatorsService) {
    // We are injecting translateservice  via set property because fieldvalidatiors and translateService is optional. This service is used to translate fieldKey
    this.fieldValidatorsService = fieldValidatorsService;
  }

  set TranslateService(translateService: TranslateService) {
    // We are injecting translateservice  via set property because fieldvalidatiors and translateService is optional. This service is used to translate fieldKey
    this.translateService = translateService;
  }

  public buildFormFields(): any[] {
    const inputs: any[] = [];
    let subInputs: any[] = [];
    let formId: number;
    // let isRequired: boolean;

    forOwn(this, (value: any, propertyKey: string) => {
      // isRequired = false;
      const formFieldOptions: FormFieldOptions = this.getFormFieldMetadata(
        propertyKey
      );

      let validationOptions: ValidationOptions = this.getValidationMetadata(
        propertyKey
      );

      if (validationOptions) {
        if (!validationOptions.validators) {
          validationOptions.validators = [];
        }
        if (validationOptions.customValidators) {
          if (this.fieldValidatorsService) {
            if (validationOptions.inputConstraint) {
              formFieldOptions.fieldName = validationOptions.inputConstraint;
            }
            if (validationOptions.customValidators.length) {
              validationOptions.customValidators.forEach(customVal => {
                this.getCustomValidatorOptions(customVal).forEach(
                  validatorFnEl => {
                    validationOptions.validators.push(validatorFnEl);
                  }
                );
              });
            }
          }
        }
      }

      // if (validationOptions) {
      //   validationOptions.validators.forEach(val => {
      //     if (val === Validators.required) {
      //       isRequired = true;
      //     }
      //   });
      // }

      let classOptions: ClassOptions = this.getClassMetadata(propertyKey); // Avi
      if (!classOptions) {
        classOptions = { className: [] }; // Avi
      }
      if (!formFieldOptions && !validationOptions) {
        formId = value;
      } else {
        if (formFieldOptions.fieldType === FormFieldType.SUB_FORM) {
          subInputs = value.buildFormFields();
          inputs.push(
            new SubFormInput(
              formId,
              subInputs,
              propertyKey,
              formFieldOptions,
              classOptions
            )
          );
        } else {
          if (!validationOptions) {
            validationOptions = { validators: [] };
          }

          if (formFieldOptions) {
            const selectOptions: {
              value: string | string[];
              selectOptions: SelectOption[];
            } = this.buildSelectOptions(formFieldOptions, value);
            if (!value) {
              console.error('formFieldOptions', formFieldOptions);
            }
            inputs.push(
              this.buildBaseElement(
                formFieldOptions,
                validationOptions,
                classOptions,
                value ? value?.toString() : '',
                propertyKey,
                selectOptions,
                formId
              )
            );
          }
        }
      }
    });

    return inputs;
  }

  private getCustomValidatorOptions(
    customValidatorsOptions: CustomValidatorsOptions
  ): ValidatorFn[] {
    ',';
    const fieldKey = this.translateService.instant(
      customValidatorsOptions.options.fieldKey
    );
    switch (customValidatorsOptions.name) {
      case PossWebFieldValidators.addressField:
        return [this.fieldValidatorsService.addressField(fieldKey)];
      case PossWebFieldValidators.numberOfPrintsAllowedField:
        return [
          this.fieldValidatorsService.numberOfPrintsAllowedField(fieldKey)
        ];
      case PossWebFieldValidators.corporateAddressField:
        return [this.fieldValidatorsService.corporateAddressField(fieldKey)];
      case PossWebFieldValidators.alphaNumericField:
        return [this.fieldValidatorsService.alphaNumericField(fieldKey)];
      case PossWebFieldValidators.alphaNumericWithSpaceField:
        return [
          this.fieldValidatorsService.alphaNumericWithSpaceField(fieldKey)
        ];
      case PossWebFieldValidators.alphabetsField:
        return [this.fieldValidatorsService.alphabetsField(fieldKey)];
      case PossWebFieldValidators.amountField:
        return [this.fieldValidatorsService.amountField(fieldKey)];
      case PossWebFieldValidators.approvalCodeField:
        return [this.fieldValidatorsService.approvalCodeField(fieldKey)];
      case PossWebFieldValidators.binCodeField:
        return [this.fieldValidatorsService.binCodeField(fieldKey)];
      case PossWebFieldValidators.binGroupCodeField:
        return [this.fieldValidatorsService.binGroupCodeField(fieldKey)];
      case PossWebFieldValidators.brandCodeField:
        return [this.fieldValidatorsService.brandCodeField(fieldKey)];
      case PossWebFieldValidators.cfaProductCodeField:
        return [this.fieldValidatorsService.cfaProductCodeField(fieldKey)];
      case PossWebFieldValidators.cinNumberField:
        return [this.fieldValidatorsService.cinNumberField(fieldKey)];
      case PossWebFieldValidators.cityField:
        return [this.fieldValidatorsService.cityField(fieldKey)];
      case PossWebFieldValidators.colorField:
        return [this.fieldValidatorsService.colorField(fieldKey)];
      case PossWebFieldValidators.complexityCodeField:
        return [this.fieldValidatorsService.complexityCodeField(fieldKey)];
      case PossWebFieldValidators.contactNoField:
        return [this.fieldValidatorsService.contactNoField(fieldKey)];
      case PossWebFieldValidators.countryCodeField:
        return [this.fieldValidatorsService.countryCodeField(fieldKey)];
      case PossWebFieldValidators.courierDocNoField:
        return [this.fieldValidatorsService.courierDocNoField(fieldKey)];
      case PossWebFieldValidators.courierRoadPermitNoField:
        return [this.fieldValidatorsService.courierRoadPermitNoField(fieldKey)];
      case PossWebFieldValidators.currencyCodeField:
        return [this.fieldValidatorsService.currencyCodeField(fieldKey)];
      case PossWebFieldValidators.daysField:
        return [this.fieldValidatorsService.daysField(fieldKey)];
      case PossWebFieldValidators.depreciationCodeField:
        return [this.fieldValidatorsService.depreciationCodeField(fieldKey)];
      case PossWebFieldValidators.descriptionField:
        return [this.fieldValidatorsService.descriptionField(fieldKey)];
      case PossWebFieldValidators.designationField:
        return [this.fieldValidatorsService.designationField(fieldKey)];
      case PossWebFieldValidators.emailField:
        return [this.fieldValidatorsService.emailField(fieldKey)];
      case PossWebFieldValidators.employeeCodeField:
        return [this.fieldValidatorsService.employeeCodeField(fieldKey)];
      case PossWebFieldValidators.factorField:
        return [this.fieldValidatorsService.factorField(fieldKey)];
      case PossWebFieldValidators.findingCodeField:
        return [this.fieldValidatorsService.findingCodeField(fieldKey)];
      case PossWebFieldValidators.gstNumberField:
        return [this.fieldValidatorsService.gstNumberField(fieldKey)];
      case PossWebFieldValidators.isUniqueCheck:
        return [
          this.fieldValidatorsService.isUniqueCheck(
            fieldKey,
            customValidatorsOptions.options.params.get('isUnique') === 'true'
              ? true
              : false
          )
        ];
      case PossWebFieldValidators.itemCodeField:
        return [this.fieldValidatorsService.itemCodeField(fieldKey)];
      case PossWebFieldValidators.karatField:
        return [this.fieldValidatorsService.karatField(fieldKey)];
      case PossWebFieldValidators.locationCodeField:
        return [this.fieldValidatorsService.locationCodeField(fieldKey)];
      case PossWebFieldValidators.locationTypeCodeField:
        return [this.fieldValidatorsService.locationTypeCodeField(fieldKey)];
      case PossWebFieldValidators.lockNumberField:
        return [this.fieldValidatorsService.lockNumberField(fieldKey)];
      case PossWebFieldValidators.marketCodeField:
        return [this.fieldValidatorsService.marketCodeField(fieldKey)];
      case PossWebFieldValidators.materialCodeField:
        return [this.fieldValidatorsService.materialCodeField(fieldKey)];
      case PossWebFieldValidators.max:
        return [
          this.fieldValidatorsService.max(
            +customValidatorsOptions.options.params.get('max'),
            fieldKey
          )
        ];
      case PossWebFieldValidators.maxLength:
        return [
          this.fieldValidatorsService.maxLength(
            +customValidatorsOptions.options.params.get('maxLength'),
            fieldKey
          )
        ];
      case PossWebFieldValidators.min:
        return [
          this.fieldValidatorsService.min(
            +customValidatorsOptions.options.params.get('min'),
            fieldKey
          )
        ];
      case PossWebFieldValidators.minLength:
        return [
          this.fieldValidatorsService.minLength(
            +customValidatorsOptions.options.params.get('minLength'),
            fieldKey
          )
        ];
      case PossWebFieldValidators.mobileField:
        return [this.fieldValidatorsService.mobileField(fieldKey)];
      case PossWebFieldValidators.nameWithSpaceField:
        return [this.fieldValidatorsService.nameWithSpaceField(fieldKey)];
      case PossWebFieldValidators.numbersField:
        return [this.fieldValidatorsService.numbersField(fieldKey)];
      case PossWebFieldValidators.pancardField:
        return [this.fieldValidatorsService.pancardField(fieldKey)];
      case PossWebFieldValidators.paymentCodeField:
        return [this.fieldValidatorsService.paymentCodeField(fieldKey)];
      case PossWebFieldValidators.percentageField:
        return [this.fieldValidatorsService.percentageField(fieldKey)];
      case PossWebFieldValidators.pincodeField:
        return [this.fieldValidatorsService.pincodeField(fieldKey)];
      case PossWebFieldValidators.priceGroupCodeField:
        return [this.fieldValidatorsService.priceGroupCodeField(fieldKey)];
      case PossWebFieldValidators.priceGroupTypeCodeField:
        return [this.fieldValidatorsService.priceGroupTypeCodeField(fieldKey)];
      case PossWebFieldValidators.productCategoryField:
        return [this.fieldValidatorsService.productCategoryField(fieldKey)];
      case PossWebFieldValidators.productCodeField:
        return [this.fieldValidatorsService.productCodeField(fieldKey)];
      case PossWebFieldValidators.productGroupCodeField:
        return [this.fieldValidatorsService.productGroupCodeField(fieldKey)];
      case PossWebFieldValidators.productTypeCodeField:
        return [this.fieldValidatorsService.productTypeCodeField(fieldKey)];
      case PossWebFieldValidators.purityField:
        return [this.fieldValidatorsService.purityField(fieldKey)];
      case PossWebFieldValidators.quantityField:
        return [this.fieldValidatorsService.quantityField(fieldKey)];
      case PossWebFieldValidators.reasonField:
        return [this.fieldValidatorsService.reasonField(fieldKey)];
      case PossWebFieldValidators.regionCodeField:
        return [this.fieldValidatorsService.regionCodeField(fieldKey)];
      case PossWebFieldValidators.remarkField:
        return [this.fieldValidatorsService.remarkField(fieldKey)];
      case PossWebFieldValidators.requestNumberField:
        return [this.fieldValidatorsService.requestNumberField(fieldKey)];
      case PossWebFieldValidators.roleCodeField:
        return [this.fieldValidatorsService.roleCodeField(fieldKey)];
      case PossWebFieldValidators.stateCodeField:
        return [this.fieldValidatorsService.stateCodeField(fieldKey)];
      case PossWebFieldValidators.stateField:
        return [this.fieldValidatorsService.stateField(fieldKey)];
      case PossWebFieldValidators.stoneCodeField:
        return [this.fieldValidatorsService.stoneCodeField(fieldKey)];
      case PossWebFieldValidators.stoneQualityField:
        return [this.fieldValidatorsService.stoneQualityField(fieldKey)];
      case PossWebFieldValidators.stoneTypeCodeField:
        return [this.fieldValidatorsService.stoneTypeCodeField(fieldKey)];
      case PossWebFieldValidators.subBrandCodeField:
        return [this.fieldValidatorsService.subBrandCodeField(fieldKey)];
      case PossWebFieldValidators.subRegionCodeField:
        return [this.fieldValidatorsService.subBrandCodeField(fieldKey)];
      case PossWebFieldValidators.supplyChainCodeField:
        return [this.fieldValidatorsService.supplyChainCodeField(fieldKey)];
      case PossWebFieldValidators.taxClassCodeField:
        return [this.fieldValidatorsService.taxClassCodeField(fieldKey)];
      case PossWebFieldValidators.taxCodeField:
        return [this.fieldValidatorsService.taxCodeField(fieldKey)];
      case PossWebFieldValidators.toleranceField:
        return [this.fieldValidatorsService.toleranceField(fieldKey)];
      case PossWebFieldValidators.townCodeField:
        return [this.fieldValidatorsService.townCodeField(fieldKey)];
      case PossWebFieldValidators.ulpIdField:
        return [this.fieldValidatorsService.ulpIdField(fieldKey)];
      case PossWebFieldValidators.uniCodeField:
        return [this.fieldValidatorsService.uniCodeField(fieldKey)];
      case PossWebFieldValidators.urlField:
        return [this.fieldValidatorsService.urlField(fieldKey)];
      case PossWebFieldValidators.userCodeField:
        return [this.fieldValidatorsService.userCodeField(fieldKey)];
      case PossWebFieldValidators.weightField:
        return [this.fieldValidatorsService.weightField(fieldKey)];
      case PossWebFieldValidators.stateTaxCodeField:
        return [this.fieldValidatorsService.stateTaxCodeField(fieldKey)];
      case PossWebFieldValidators.customerNameField:
        return [this.fieldValidatorsService.customerNameField(fieldKey)];
      case PossWebFieldValidators.countryNameField:
        return [this.fieldValidatorsService.countryNameField(fieldKey)];
      case PossWebFieldValidators.alphabetWithSpaceField:
        return [this.fieldValidatorsService.alphabetWithSpaceField(fieldKey)];
      case PossWebFieldValidators.requiredField:
        return [
          Validators.required,
          this.fieldValidatorsService.requiredField(fieldKey)
        ];
      case PossWebFieldValidators.passwordField:
        return [this.fieldValidatorsService.passwordField(fieldKey)];
      case PossWebFieldValidators.singleNumberField:
        return [this.fieldValidatorsService.singleNumberField(fieldKey)];
      case PossWebFieldValidators.numberOfCardDigitsField:
        return [this.fieldValidatorsService.numberOfCardDigitsField(fieldKey)];
      case PossWebFieldValidators.localeField:
        return [this.fieldValidatorsService.localeField(fieldKey)];
      case PossWebFieldValidators.maxNumberOfProducts:
        return [this.fieldValidatorsService.maxNumberOfProducts(fieldKey)];
      case PossWebFieldValidators.noOfRequestPerMonth:
        return [this.fieldValidatorsService.noOfRequestPerMonth(fieldKey)];
      case PossWebFieldValidators.reqValidUpto:
        return [this.fieldValidatorsService.reqValidUpto(fieldKey)];
      case PossWebFieldValidators.cashbackNameField:
        return [this.fieldValidatorsService.cashbackNameField(fieldKey)];
      // case PossWebFieldValidators.fiscalYearStartField:
      //   return [this.fieldValidatorsService.fiscalYearStartField(fieldKey)];
      case PossWebFieldValidators.noOfTimesCardAllowedField:
        return [
          this.fieldValidatorsService.noOfTimesCardAllowedField(fieldKey)
        ];
      case PossWebFieldValidators.bankNameField:
        return [this.fieldValidatorsService.bankNameField(fieldKey)];
      case PossWebFieldValidators.bankCodeField:
        return [this.fieldValidatorsService.bankCodeField(fieldKey)];
      case PossWebFieldValidators.purityField:
        return [this.fieldValidatorsService.purityField(fieldKey)];
      case PossWebFieldValidators.offsetField:
        return [this.fieldValidatorsService.offsetField(fieldKey)];
      case PossWebFieldValidators.referenceIdField:
        return [this.fieldValidatorsService.referenceIdField(fieldKey)];
      case PossWebFieldValidators.cpgGroupNameField:
        return [this.fieldValidatorsService.cpgGroupNameField(fieldKey)];
      case PossWebFieldValidators.commaSaperatedNumberField:
        return [
          this.fieldValidatorsService.commaSaperatedNumberField(fieldKey)
        ];
      case PossWebFieldValidators.numberGreaterThanZeroPattern:
        return [
          this.fieldValidatorsService.numberGreaterThanZeroPattern(fieldKey)
        ];

      case PossWebFieldValidators.noOfDaysForRazorPayPaymentExpiry:
        return [
          this.fieldValidatorsService.noOfDaysForRazorPayPaymentExpiry(fieldKey)
        ];
    }
  }

  private buildBaseElement(
    formFieldOptions: FormFieldOptions,
    validationOptions: ValidationOptions,
    classOptions: ClassOptions,
    value: string | string[],
    propertyKey: string,
    selectOptions: { value: string | string[]; selectOptions: SelectOption[] },
    formId: number
  ) {
    const params: BaseElementParams = this.buildBaseInputParams(
      formFieldOptions,
      validationOptions,
      selectOptions,
      classOptions,
      value,
      formId
    );

    return BaseElementFactory.build(
      formFieldOptions.fieldType,
      propertyKey,
      params
    );
  }

  private hasSelectOptions(formFieldOptions: FormFieldOptions) {
    return (
      formFieldOptions.fieldType === FormFieldType.SELECTION_INPUT ||
      formFieldOptions.fieldType === FormFieldType.SELECT ||
      formFieldOptions.fieldType === FormFieldType.REFRESH_SELECT ||
      formFieldOptions.fieldType === FormFieldType.MULTISELECT ||
      formFieldOptions.fieldType === FormFieldType.RADIO ||
      formFieldOptions.fieldType === FormFieldType.CHECKBOX ||
      formFieldOptions.fieldType === FormFieldType.TOGGLE
    );
  }

  private buildSelectOptions(formFieldOptions: FormFieldOptions, value: any) {
    let selectOptions: SelectOption[];
    let selvalue: string | string[];

    if (this.hasSelectOptions(formFieldOptions)) {
      // if (formFieldOptions.selectOptionKeys.foreignKey === undefined) {
      //   selectOptions = map(value, element => {
      //     return new SelectOption(
      //       element[formFieldOptions.selectOptionKeys.labelKey],
      //       element[formFieldOptions.selectOptionKeys.valueKey],
      //       undefined,
      //       element[formFieldOptions.selectOptionKeys.selected]
      //     );
      //   });
      // } else {
      selectOptions = map(value, element => {
        return new SelectOption(
          element[formFieldOptions.selectOptionKeys.labelKey],
          element[formFieldOptions.selectOptionKeys.valueKey],
          element[formFieldOptions.selectOptionKeys.foreignKey],
          element[formFieldOptions.selectOptionKeys.selectedKey]
        );
      });
      // }
    }

    if (selectOptions) {
      selectOptions.forEach(val => {
        if (val.selectedKey) {
          selvalue = val.value;
        }
      });
    }

    let so = { value: selvalue, selectOptions };
    if (formFieldOptions.fieldType === FormFieldType.MULTISELECT) {
      const val: any[] = [];
      so.selectOptions.forEach(data => {
        if (data.selectedKey) {
          val.push(data.value);
        }
      });
      so = { ...so, value: val };
    }
    return so;
  }

  private buildBaseInputParams(
    formFieldOptions: FormFieldOptions,
    validationOptions: ValidationOptions,
    selectOptions: { value: string | string[]; selectOptions: SelectOption[] },
    classOptions: ClassOptions,
    value: string | string[],
    formId: number
  ): BaseElementParams {
    const params: BaseElementParams = this.hasSelectOptions(formFieldOptions)
      ? { selectOptions }
      : { value };

    params.formId = formId;
    params.classNames = classOptions.className; // Avi
    params.validators = validationOptions.validators;
    params.label = formFieldOptions.label;
    params.dependsOn = formFieldOptions.dependsOn
      ? formFieldOptions.dependsOn
      : '';
    params.subForm = formFieldOptions.subForm ? formFieldOptions.subForm : [''];
    params.show = formFieldOptions.show ? formFieldOptions.show : [''];
    params.validationErrorMessages = formFieldOptions.validationErrorMessages
      ? formFieldOptions.validationErrorMessages
      : [];
    params.fieldName = formFieldOptions.fieldName
      ? formFieldOptions.fieldName
      : '';
    params.min = formFieldOptions.min ? formFieldOptions.min : false;
    return params;
  }

  private getFormFieldMetadata(propertyKey: string): FormFieldOptions {
    return Reflect.getMetadata(FormMetadataKeys.FORM_FIELD, this, propertyKey);
  }

  private getValidationMetadata(propertyKey: string): ValidationOptions {
    return Reflect.getMetadata(FormMetadataKeys.VALIDATION, this, propertyKey);
  }

  private getClassMetadata(propertyKey: string): ClassOptions {
    return Reflect.getMetadata(FormMetadataKeys.CLASS_NAME, this, propertyKey);
  }
}
