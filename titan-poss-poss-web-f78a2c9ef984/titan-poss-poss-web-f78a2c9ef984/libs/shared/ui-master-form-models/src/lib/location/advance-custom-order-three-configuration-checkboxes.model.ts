import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Class,
  Validation
} from '@poss-web/shared/components/ui-dynamic-form';

export class AdvanceCustomOrderConfigurationStepThreeCheckBox extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['col-12 pl-0'] })
  private advanceCustomOrderStpeThreecheckBoxes: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.sparewtToleranceforStockItem'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.toleranceField,
        options: { fieldKey: 'pw.locationMaster.sparewtToleranceforStockItem' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.sparewtToleranceforStockItem' }
      }
    ],
    inputConstraint: PossWebFieldValidators.toleranceField
  })
  private sparewtToleranceforStockItem: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.servicewtToleranceforStockItem'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.toleranceField,
        options: { fieldKey: 'pw.locationMaster.sparewtToleranceforStockItem' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: {
          fieldKey: 'pw.locationMaster.servicewtToleranceforStockItem'
        }
      }
    ],
    inputConstraint: PossWebFieldValidators.toleranceField
  })
  private servicewtToleranceforStockItem: string;

  constructor(
    id: number,
    advanceCustomOrderStpeThreecheckBoxes: {
      id: string;
      name: string;
      checked?: boolean;
    }[],

    sparewtToleranceforStockItem: string,
    servicewtToleranceforStockItem: string,

    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.advanceCustomOrderStpeThreecheckBoxes = advanceCustomOrderStpeThreecheckBoxes;
    this.sparewtToleranceforStockItem = sparewtToleranceforStockItem;
    this.servicewtToleranceforStockItem = servicewtToleranceforStockItem;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
