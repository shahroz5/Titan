import { Input } from '@angular/core';
// import { Validators } from '@angular/forms';
import {
  DynamicFormFieldsBuilder,
  Class,
  FormField,
  FormFieldType,
  Validation
} from '@poss-web/shared/components/ui-dynamic-form';
import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

export class CorporateTownModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.SELECT,
    selectOptionKeys: {
      labelKey: 'description',
      valueKey: 'stateId',
      selectedKey: 'selected'
    },
    label: 'pw.corporateTown.selectState'
  })
  // @Validation({ validators: [Validators.required] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.corporateTown.selectState' }
      }
    ]
  })
  @Class({ className: ['col-12'] })
  private state: {
    stateId: number;
    description: string;
  }[];

  // @FormField({
  //   fieldType: FormFieldType.SELECT,
  //   selectOptionKeys: {
  //     labelKey: 'description',
  //     valueKey: 'regionCode',
  //     selectedKey: 'selected'
  //   },
  //   label: 'pw.corporateTown.selectRegion'
  // })
  // @Validation({ validators: [Validators.required] })
  // @Class({ className: ['col-12'] })
  // private region: { regionCode: string; description: string }[];

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.corporateTown.townName'
  })
  // @Validation({ validators: [Validators.required,
  //                            Validators.pattern('^[a-zA-Z_ ]{3,100}$') ] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.cityField,
        options: { fieldKey: 'pw.corporateTown.townName' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.corporateTown.townName' }
      }
    ],
    inputConstraint: PossWebFieldValidators.cityField
  })
  @Class({ className: ['col-12'] })
  private townName: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.corporateTown.eghsRefTownIdLabel'
  })
  // @Validation({ validators: [Validators.required,
  //                            Validators.pattern('^[a-zA-Z_ ]{3,100}$') ] })
  /* @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.numbersField,
        options: { fieldKey: 'pw.corporateTown.eghsRefTownIdLabel' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.corporateTown.eghsRefTownIdLabel' }
      }
    ],
    inputConstraint: PossWebFieldValidators.numbersField
  }) */
  @Class({ className: ['col-12'] })
  private eghsRefTownId: number;

  constructor(
    id: number,
    state: { stateId: number; description: string; selected?: boolean }[],
    townName: string,
    eghsRefTownId: number,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.state = state;
    // this.region = region;
    this.eghsRefTownId = eghsRefTownId;
    this.townName = townName;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
