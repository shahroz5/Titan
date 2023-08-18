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
  
  export class ServicePossFormDetailsModel extends DynamicFormFieldsBuilder {
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
    @Class({ className: [] })
    private servicePossDetailsCheckbox: { id: string; name: string; checked?: boolean }[];
  
    constructor(
      id: number,
      servicePossDetailsCheckbox: { id: string; name: string; checked?: boolean }[],
      fieldValidatorsService: FieldValidatorsService,
      translateService: TranslateService
    ) {
      super();
      this.id = id;
      this.servicePossDetailsCheckbox = servicePossDetailsCheckbox;
      this.FieldValidatorsService = fieldValidatorsService;
      this.TranslateService = translateService;
    }
  }
  