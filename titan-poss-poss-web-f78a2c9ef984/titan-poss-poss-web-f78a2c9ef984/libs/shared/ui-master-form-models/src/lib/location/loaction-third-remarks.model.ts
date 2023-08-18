import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Validation,
  Class
} from '@poss-web/shared/components/ui-dynamic-form';
// import { Validators } from '@angular/forms';
import {
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';

export class RemarksModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.TEXT_AREA,
    label: 'pw.locationMaster.remarks'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.remarkField,
        options: { fieldKey: 'pw.locationMaster.remarks' }
      }
    ],
    inputConstraint: PossWebFieldValidators.remarkField
  })
  private remarks: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.SAPCode'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.SAPCode' }
      }
    ]
  })

  // @Validation({ validators: [Validators.required] })
  private SAPCode: string;

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'selected'
    },
    label: 'pw.locationMaster.paymentModeForRefund'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.paymentModeForRefund' }
      }
    ]
  })
  // @Validation({ validators: [Validators.required] })
  private paymentModeForRefund: {
    id: string;
    name: string;
    selected?: boolean;
  }[];

  // @FormField({
  //   fieldType: FormFieldType.CHECKBOX,
  //   selectOptionKeys: {
  //     labelKey: 'name',
  //     valueKey: 'id',
  //     selectedKey: 'checked',
  //     foreignKey: 'foreignKey'
  //   },
  //   label: ''
  // })
  // @Class({ className: ['row'] })
  // private locationcheckBoxes: { id: string; name: string; checked?: boolean }[];

  constructor(
    id: number,
    remarks: string,
    SAPCode: string,
    paymentModeForRefund: { id: string; name: string; selected?: boolean }[]
    // locationcheckBoxes: { id: string; name: string; checked?: boolean }[]
  ) {
    super();
    this.id = id;
    this.remarks = remarks;
    this.SAPCode = SAPCode;
    this.paymentModeForRefund = paymentModeForRefund;

    // this.locationcheckBoxes = locationcheckBoxes
  }
}
