import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Validation,
  Class
} from '@poss-web/shared/components/ui-dynamic-form';
// import { Validators } from '@angular/forms';
import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

export class InventoryDetailsModel extends DynamicFormFieldsBuilder {
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
  @Class({ className: ['row', 'pw-form-card__checkbox-container'] })
  private inventoryDetailsCheckbox1: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.daysforphysicalReceiptdate'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.daysforphysicalReceiptdate' }
      }
    ]
  })
  private maxDaysPhysicalReceipt: string;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['row', 'pw-form-card__checkbox-container'] })
  private inventoryDetailsCheckbox2: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.daysforSTNCancellation'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.daysField,
        options: { fieldKey: 'pw.locationMaster.daysforSTNCancellation' }
      }
    ]
  })
  private maxDaysSTNCancellation: string;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['row', 'pw-form-card__checkbox-container'] })
  private inventoryDetailsCheckbox3: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked'
    },
    label: ''
  })
  @Class({ className: ['row', 'pw-form-card__checkbox-container'] })
  private inventoryDetailsCheckbox4: {
    id: string;
    name: string;
    checked?: boolean;
  }[];

  constructor(
    id: number,
    inventoryDetailsCheckbox1: {
      id: string;
      name: string;
      checked?: boolean;
    }[],
    maxDaysPhysicalReceipt: string,
    inventoryDetailsCheckbox2: {
      id: string;
      name: string;
      checked?: boolean;
    }[],
    maxDaysSTNCancellation: string,
    inventoryDetailsCheckbox3: {
      id: string;
      name: string;
      checked?: boolean;
    }[],
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService,
    inventoryDetailsCheckbox4?: {
      id: string;
      name: string;
      checked?: boolean;
    }[]
  ) {
    super();
    this.id = id;
    this.inventoryDetailsCheckbox1 = inventoryDetailsCheckbox1;
    this.maxDaysPhysicalReceipt = maxDaysPhysicalReceipt;
    this.inventoryDetailsCheckbox2 = inventoryDetailsCheckbox2;
    this.maxDaysSTNCancellation = maxDaysSTNCancellation;
    this.inventoryDetailsCheckbox3 = inventoryDetailsCheckbox3;
    this.inventoryDetailsCheckbox4 = inventoryDetailsCheckbox4;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
