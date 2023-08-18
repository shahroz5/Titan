import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DynamicFormComponent } from '@poss-web/shared/components/ui-dynamic-form';
import { Validators, FormControl } from '@angular/forms';
import { TranslateStore } from '@ngx-translate/core';
import { PurityDetailsComponent } from './purity-details.component';
import { CurrencyFormatterService } from '@poss-web/shared/components/ui-formatters';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';

describe('purity component tests', () => {
  let component: PurityDetailsComponent;
  let fixture: ComponentFixture<PurityDetailsComponent>;

  let componentD: DynamicFormComponent;
  let fixtureD: ComponentFixture<DynamicFormComponent>;

  let form;
  let formFields;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [PurityDetailsComponent],
      imports: [
        SharedComponentsUiDynamicFormModule,
        CommonCustomMaterialModule,
        SharedComponentsUiLoaderModule
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        {
          provide: CurrencyFormatterService,
          useValue: {
            format: (data: any) => data
          }
        },
        {
          provide: POSS_WEB_CURRENCY_CODE,
          useValue: 'IND'
        },
        TranslateStore
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PurityDetailsComponent);
    component = fixture.componentInstance;

    component.dialogData = {
      purity: {
        materialCode: 'J',
        description: 'J',
        karat: '24',
        purity: '100',
        offset: '1',
        isActive: true
      },
      materialTypes: [{ materialCode: 'J' }]
    }; // Mock data

    fixtureD = TestBed.createComponent(DynamicFormComponent);
    componentD = fixtureD.componentInstance;

    form = component.prepareSet(); //['prepareSet']();
    formFields = component.getInputs(form);
  });

  it('is purity component defined', () => {
    expect(component).toBeDefined();
  });

  it('is dynamic form component defined', () => {
    expect(componentD).toBeDefined();
  });

  it('number of fields should be 6', () => {
    const noOfFiels = 6;
    expect(formFields.formFields.length).toEqual(noOfFiels);
  });

  it('label test', () => {
    const labels = [
      'pw.purity.materialCodeLable',
      'pw.purity.purityLable',
      'pw.purity.karat',
      'pw.purity.offsetLable',
      'pw.purity.descriptionLable',
      'pw.purity.isDisplayed'
    ]; // Test labels
    expect(formFields.formFields[0].label).toEqual(labels[0]);
    expect(formFields.formFields[1].label).toEqual(labels[1]);
    expect(formFields.formFields[2].label).toEqual(labels[2]);
    expect(formFields.formFields[3].label).toEqual(labels[3]);
    expect(formFields.formFields[4].label).toEqual(labels[4]);
    expect(formFields.formFields[5].options[0].label).toEqual(labels[5]);
  });

  it('Input type test', () => {
    expect(formFields.formFields[0].controlType).toEqual('select');
    expect(formFields.formFields[1].controlType).toEqual('text');
    expect(formFields.formFields[2].controlType).toEqual('text');
    expect(formFields.formFields[3].controlType).toEqual('text');
    expect(formFields.formFields[4].controlType).toEqual('text');
    expect(formFields.formFields[5].controlType).toEqual('checkbox');
  });

  it('Required validation test', () => {
    expect(formFields.formFields[0].validators).toContain(Validators.required);
    expect(formFields.formFields[1].validators).toContain(Validators.required);
    expect(formFields.formFields[2].validators).toContain(Validators.required);
    expect(formFields.formFields[3].validators).toContain(Validators.required);
    expect(formFields.formFields[4].validators).toContain(Validators.required);
  });

  it('custom validation test', () => {
    let validatorList = formFields.formFields[1].validators;
    validatorList.forEach(element => {
      const testControlPurity = new FormControl('!@#'); // Checking for invalid pattern
      const result = element(testControlPurity);

      if (result) {
        expect(
          result.errorArray
        ).toContain('pw.fieldValidators.invalidErrorMsg', [
          'pw.fieldValidators.purityOffsetPatternErrorMsg'
        ]);
      }
    });

    validatorList = formFields.formFields[2].validators; // Description
    validatorList.forEach(element => {
      const testControlKarat = new FormControl('!@#'); // Checking for invalid pattern
      const result = element(testControlKarat);

      if (result) {
        expect(
          result.errorArray
        ).toContain('pw.fieldValidators.invalidErrorMsg', [
          'pw.fieldValidators.karatPatternErrorMsg'
        ]);
      }
    });

    validatorList = formFields.formFields[3].validators; // Description
    validatorList.forEach(element => {
      const testControlOffset = new FormControl('!@#'); // Checking for invalid pattern
      const result = element(testControlOffset);

      if (result) {
        expect(
          result.errorArray
        ).toContain('pw.fieldValidators.invalidErrorMsg', [
          'pw.fieldValidators.purityOffsetPatternErrorMsg'
        ]);
      }
    });
    validatorList = formFields.formFields[4].validators; // Description
    validatorList.forEach(element => {
      const testControlDescription = new FormControl('!@#'); // Checking for invalid pattern
      const result = element(testControlDescription);

      if (result) {
        expect(
          result.errorArray
        ).toContain('pw.fieldValidators.invalidErrorMsg', [
          'pw.fieldValidators.descriptionPatternErrorMsg'
        ]);
      }
    });
  });
});
