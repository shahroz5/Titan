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

export class TcsDetailsModel extends DynamicFormFieldsBuilder {
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
  private tcsDetailsCheckbox: { id: string; name: string; checked?: boolean }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.locationMaster.tcsPanNumber'
  })
  @Class({ className: [] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.pancardField,
        options: { fieldKey: 'pw.locationMaster.tcsPanNumber' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.locationMaster.tcsPanNumber' }
      }
    ]
  })
  private tcsPanNumber: string;

  @FormField({
    fieldType: FormFieldType.DATE,
    label: 'pw.locationMaster.tcsStartDate'
  })
  @Class({ className: [] })
  // @Validation({
  //   customValidators: [
  //     {
  //       name: PossWebFieldValidators.percentageField,
  //       options: { fieldKey: 'pw.locationMaster.tcsStartDate' }
  //     }
  //   ]
  // })
  private tcsStartDate: string;

  @FormField({
    fieldType: FormFieldType.DATE,
    label: 'pw.locationMaster.tcsApplicableDate'
  })
  @Class({ className: [] })
  // @Validation({
  //   customValidators: [
  //     {
  //       name: PossWebFieldValidators.percentageField,
  //       options: { fieldKey: 'pw.locationMaster.tcsApplicableDate' }
  //     }
  //   ]
  // })
  private tcsApplicableDate: string;

  constructor(
    id: number,
    tcsDetailsCheckbox: { id: string; name: string; checked?: boolean }[],
    tcsPanNumber: string,
    tcsStartDate: string,
    tcsApplicableDate: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.tcsDetailsCheckbox = tcsDetailsCheckbox;
    this.tcsPanNumber = tcsPanNumber;
    this.tcsStartDate = tcsStartDate;
    this.tcsApplicableDate = tcsApplicableDate;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
