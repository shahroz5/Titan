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

export class BinCodeMaster extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'binGroupCode',
      valueKey: 'binGroupCode',
      selectedKey: 'selected'
    },
    label: 'pw.binCode.binGroup'
  })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'Bin Group' }
      }
    ]
  })
  @Class({ className: ['col-12'] })
  private binGroup: { binGroupCode: string; description: string }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.binCode.bincode'
    // validationErrorMessages: [{ errorType: 'pattern',
    // errorMessage: 'pw.corporateTown.binCodelengthError' }]
  })
  // @Validation({ validators: [Validators.required,
  //                            Validators.pattern('^[a-zA-Z_ ]{3,20}$')]
  //                            })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.binCodeField,
        options: { fieldKey: 'pw.binCode.bincode' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.binCode.bincode' }
      }
    ],
    inputConstraint: PossWebFieldValidators.binCodeField
  })
  @Class({ className: ['col-12'] })
  private binCode: string;

  @FormField({
    fieldType: FormFieldType.TEXT_AREA,
    label: 'pw.binCode.description'
    // validationErrorMessages: [{ errorType: 'pattern',
    // errorMessage: 'pw.corporateTown.townNamelengthError' }]
  })
  // @Validation({ validators: [Validators.required,
  //                            Validators.pattern('^[a-zA-Z_ ]{3,100}$')]
  //                           })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.descriptionField,
        options: { fieldKey: 'pw.binCode.description' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.binCode.description' }
      }
    ],
    inputConstraint: PossWebFieldValidators.descriptionField
  })
  @Class({ className: ['col-12'] })
  private description: string;

  constructor(
    id: number,
    binGroup: {
      binGroupCode: string;
      description: string;
      selected?: boolean;
    }[],
    binCode: string,
    desctiption: string,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.binGroup = binGroup;
    this.binCode = binCode;
    this.description = desctiption;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
