// import { Validators } from '@angular/forms';
import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Validation,
  Class
} from '@poss-web/shared/components/ui-dynamic-form';
import { TranslateService } from '@ngx-translate/core';

export class GHSDayDetailsModelCreditNoteConfig extends DynamicFormFieldsBuilder {
  private id: number;
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
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.baseCurrency' }
      }
    ]
  })
  private baseCurrency: { id: string; name: string }[];

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.suspendingCNs'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.suspendingCNsdigis' }]
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.suspendingCNs' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.suspendingCNs' }
      }
    ],
    inputConstraint: PossWebFieldValidators.daysField
  })
  private suspendingCNs: number;
  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.transferredCNs'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.transferredCNsdigis' }]
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required, Validators.pattern('^[0-9]*$')] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.transferredCNs' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.transferredCNs' }
      }
    ],
    inputConstraint: PossWebFieldValidators.daysField
  })
  private transferredCNs: number;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.activatedCNs'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.activatedCNsdigis' }]
  })
  @Class({ className: ['col-12'] })
  // @Validation({ validators: [Validators.required, Validators.pattern('^[0-9]*$')] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.activatedCNs' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.activatedCNs' }
      }
    ],
    inputConstraint: PossWebFieldValidators.daysField
  })
  private activatedCNs: number;
  constructor(
    id: number,
    baseCurrency: { id: string; name: string; selected?: boolean }[],
    suspendingCNs: number,
    transferredCNs: number,
    activatedCNs: number,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.baseCurrency = baseCurrency;
    this.suspendingCNs = suspendingCNs;
    this.transferredCNs = transferredCNs;
    this.activatedCNs = activatedCNs;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
