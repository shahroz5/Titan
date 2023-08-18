// import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
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
export class GrnIbtInventoryOne extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.maxNoOfDaysForPhysicalReceiptDate'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.maximumNoOfDaysForPhysicalReceiptDatae_pattern' }]
  })
  // @Validation({
  //   validators: [Validators.required, Validators.pattern('^[1-9][0-9]*')]
  // })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: {
          fieldKey: 'pw.locationMaster.maxNoOfDaysForPhysicalReceiptDate'
        }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: {
          fieldKey: 'pw.locationMaster.maxNoOfDaysForPhysicalReceiptDate'
        }
      }
    ],
    inputConstraint: PossWebFieldValidators.daysField
  })
  @Class({ className: ['col-12'] })
  private maxNoOfDaysForPhysicalReceiptDate: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.configurationAmountForStuddedSplit'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.totalValueRequestedeInCurrentMonth_pattern' }]
  })
  // @Validation({
  //   validators: [Validators.pattern('[0-9]*(.{1})?[0-9]{1,2}')]
  // })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.amountField,
        options: {
          fieldKey: 'pw.locationMaster.configurationAmountForStuddedSplit'
        }
      }
    ],
    inputConstraint: PossWebFieldValidators.amountField
  })
  private configurationAmountForStuddedSplit: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'pw.locationMaster.maxNoOfDaysForSTNCancellation'
    // validationErrorMessages: [{ errorType: 'pattern', errorMessage: 'pw.inventoryMasterValidation.noOFDaysGRNAllowed_pattern' }]
  })
  // @Validation({
  //   validators: [Validators.pattern('^[0-9]*')]
  // })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.maxNoOfDaysForSTNCancellation' }
      }
    ],
    inputConstraint: PossWebFieldValidators.daysField
  })
  private maxNoOfDaysForSTNCancellation: string;
  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Validation({ validators: [] })
  @Class({ className: ['col-12 pl-0'] })
  private checkBoxes: { id: string; name: string; checked?: boolean }[];

  constructor(
    id: number,
    maxNoOfDaysForPhysicalReceiptDate: string,
    configurationAmountForStuddedSplit: string,
    maxNoOfDaysForSTNCancellation: string,
    checkBoxes: { id: string; name: string; checked?: boolean }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.maxNoOfDaysForPhysicalReceiptDate = maxNoOfDaysForPhysicalReceiptDate;
    this.configurationAmountForStuddedSplit = configurationAmountForStuddedSplit;
    this.maxNoOfDaysForSTNCancellation = maxNoOfDaysForSTNCancellation;
    this.checkBoxes = checkBoxes;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
