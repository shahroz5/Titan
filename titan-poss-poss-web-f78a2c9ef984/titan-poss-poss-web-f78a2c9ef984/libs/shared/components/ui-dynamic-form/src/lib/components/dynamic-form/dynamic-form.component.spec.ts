import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

import { DynamicFormComponent } from './dynamic-form.component';
import { SharedComponentsUiDynamicFormModule } from '../../shared-components-ui-dynamic-form.module';
import { DynamicFormFieldsBuilder } from '../../DynamicFormFieldsBuilder';
import { FormField } from '../../decorators/FormFieldDecorator';
import { FormFieldType } from '../../FormFieldType';
import { Validation } from '../../decorators/ValidationDecorator';
import { Class } from '../../decorators/ClassDecorator';
import { TEMPLATE8 } from '../../template.constant';
import { TranslateStore } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { POSS_WEB_DATE_FORMAT } from '@poss-web/shared/util-config';

export class TestFormModel extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'code'
  })
  @Validation({
    validators: [Validators.required, Validators.pattern('^[a-zA-Z0-9/]+$')]
  })
  @Class({ className: ['col'] })
  private code: string;

  @FormField({
    fieldType: FormFieldType.CHECKBOX,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked',
      foreignKey: 'foreignKey'
    },
    label: ''
  })
  @Class({ className: ['row'] })
  private checkBoxes: { id: string; name: string; checked?: boolean }[];

  @FormField({
    fieldType: FormFieldType.TEXT_AREA,
    label: 'textAreaInput'
  })
  @Validation({
    validators: [Validators.required, Validators.pattern('^[a-zA-Z0-9/]+$')]
  })
  @Class({ className: ['col'] })
  private textarea: string;

  @FormField({
    fieldType: FormFieldType.OUTLINE,
    label: 'textAreaInput'
  })
  @Validation({
    validators: [Validators.required, Validators.pattern('^[a-zA-Z0-9/]+$')]
  })
  @Class({ className: ['col'] })
  private outline: string;

  @FormField({
    fieldType: FormFieldType.RADIO,
    selectOptionKeys: {
      labelKey: 'name',
      valueKey: 'id',
      selectedKey: 'checked',
      foreignKey: 'foreignKey'
    },
    label: ''
  })
  @Validation({
    validators: [Validators.required, Validators.pattern('^[a-zA-Z0-9/]+$')]
  })
  @Class({ className: ['col'] })
  private radios: { id: string; name: string; checked?: boolean }[];

  @FormField({
    fieldType: FormFieldType.DATE,
    label: 'dateInput'
  })
  @Validation({
    validators: [Validators.required, Validators.pattern('^[a-zA-Z0-9/]+$')]
  })
  @Class({ className: ['col'] })
  private dateInput: string;

  constructor(
    id: number,
    code: string,
    checkBoxes: { id: string; name: string; checked?: boolean }[],
    radios: { id: string; name: string; checked?: boolean }[],
    dateInput: string,
    outline: string,
    textarea: string
  ) {
    super();
    this.id = id;
    this.code = code;
    this.checkBoxes = checkBoxes;
    this.radios = radios;
    this.dateInput = dateInput;
    this.outline = outline;
    this.textarea = textarea;
  }
}

describe('Dynamic component tests', () => {
  let componentD: DynamicFormComponent;
  let fixtureD: ComponentFixture<DynamicFormComponent>;

  let form;
  let formFields;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        SharedComponentsUiDynamicFormModule,
        CommonCustomMaterialModule,
        SharedComponentsUiLoaderModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: POSS_WEB_DATE_FORMAT, useValue: {} },
        TranslateStore
      ]
    }).compileComponents();

    fixtureD = TestBed.createComponent(DynamicFormComponent);
    componentD = fixtureD.componentInstance;

    form = prepareSet();
    formFields = getInputs(form);

    componentD.formFields = formFields;
    componentD.disabled = false;
    componentD.enableSubmitOnInvalid = true;
    componentD.buttonNames = ['Cancel', 'Save'];

    componentD.ngOnChanges();
    componentD.ngOnInit();
    componentD.ngAfterViewInit();

    fixtureD.detectChanges();
  });

  it('Dynamic component defined', () => {
    expect(componentD).toBeDefined();
  });

  it('number of fields should be 7', () => {
    const noOfFiels = 6;

    // const form = prepareSet();
    // const formFields = getInputs(form);
    expect(formFields.formFields.length).toEqual(noOfFiels);
  });

  it('label test', () => {
    const labels = ['code'];

    // const form = prepareSet();
    // const formFields = getInputs(form);
    expect(formFields.formFields[0].label).toEqual(labels[0]);
  });

  it('Type test', () => {
    const controlType = 'text';
    // const form = prepareSet();
    // const formFields = getInputs(form);

    expect(formFields.formFields[0].controlType).toContain(controlType);
  });

  it('Required validation test', () => {
    // const form = prepareSet();
    // const formFields = getInputs(form);

    expect(formFields.formFields[0].validators).toContain(Validators.required);
  });

  it('Pattern validation test for Code field', () => {
    // const form = prepareSet();
    // const formFields = getInputs(form);

    if (formFields.formFields[0].value === 'code') {
      let validatorCount = 0;
      const validatorList = formFields.formFields[0].validators;

      validatorList.forEach((element, index) => {
        //check if it is second validator which is pattern validator
        if (validatorCount === 1) {
          const testControl = new FormControl('test-data');
          const result = element(testControl);
          expect(result['pattern'].requiredPattern).toBe('^[a-zA-Z0-9/]+$');
        }
        validatorCount++;
      });
    }
  });

  it('Rendering input test', () => {
    const compiled = fixtureD.debugElement.nativeElement;
    const codeInput = compiled.querySelector('input[id="1-code"]');
    expect(codeInput).toBeTruthy();
  });

  it('Rendering radio test', () => {
    const compiled = fixtureD.debugElement.nativeElement;
    const radioInput = compiled.querySelector('mat-radio-button');
    expect(radioInput).toBeTruthy();
  });

  it('Rendering dateInput test', () => {
    const compiled = fixtureD.debugElement.nativeElement;
    const dateInput = compiled.querySelector('input[id="1-dateInput"]');
    expect(dateInput).toBeTruthy();
  });

  it('Rendering textarea test', () => {
    const compiled = fixtureD.debugElement.nativeElement;
    const textarea = compiled.querySelector('textarea[id="1-textarea"]');
    expect(textarea).toBeTruthy();
  });

  it('Rendering outline test', () => {
    const compiled = fixtureD.debugElement.nativeElement;
    const outline = compiled.querySelector('input[id="1-outline"]');
    expect(outline).toBeTruthy();
  });
});

// helper functions
function prepareSet() {
  const testFormModel = new TestFormModel(
    1,
    'code',
    [{ id: '1', name: 'ck1' }],
    [{ id: '1', name: 'rd1' }],
    '',
    'outline',
    'txtarea'
  );
  return testFormModel;
}

function getInputs(form) {
  return {
    formConfig: setFormConfig(),
    formFields: form.buildFormFields()
  };
}

function setFormConfig() {
  return {
    formName: 'Form Name',
    formDesc: 'Form Desc',
    formTemplate: TEMPLATE8
  };
}
