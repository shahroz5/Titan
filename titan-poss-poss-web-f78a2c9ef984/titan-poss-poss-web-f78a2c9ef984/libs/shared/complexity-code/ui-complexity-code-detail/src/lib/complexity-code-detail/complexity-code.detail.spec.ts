import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DynamicFormComponent } from '@poss-web/shared/components/ui-dynamic-form';
import { Validators, FormControl } from '@angular/forms';
import { TranslateStore } from '@ngx-translate/core';
import { ComplexityCodeDetailComponent } from './complexity-code-detail.component';
import { CurrencyFormatterService } from '@poss-web/shared/components/ui-formatters';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';

describe('complexity code component tests', () => {
  let component: ComplexityCodeDetailComponent;
  let fixture: ComponentFixture<ComplexityCodeDetailComponent>;

  let componentD: DynamicFormComponent;
  let fixtureD: ComponentFixture<DynamicFormComponent>;

  let form;
  let formFields;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ComplexityCodeDetailComponent],
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

    fixture = TestBed.createComponent(ComplexityCodeDetailComponent);
    component = fixture.componentInstance;

    component.dialogData = {
      complexityCode: '1',
      description: 'desc',
      isActive: true
    }; // Mock data

    fixtureD = TestBed.createComponent(DynamicFormComponent);
    componentD = fixtureD.componentInstance;

    form = component.prepareSet(); //['prepareSet']();
    formFields = component.getInputs(form);
  });

  it('is complexity code component defined', () => {
    expect(component).toBeDefined();
  });

  it('is dynamic form component defined', () => {
    expect(componentD).toBeDefined();
  });

  it('number of fields should be 2', () => {
    const noOfFiels = 2;
    expect(formFields.formFields.length).toEqual(noOfFiels);
  });

  it('label test', () => {
    const labels = [
      'pw.complexityCode.complexityCode',
      'pw.complexityCode.description'
    ]; // Test labels
    expect(formFields.formFields[0].label).toEqual(labels[0]);
    expect(formFields.formFields[1].label).toEqual(labels[1]);
  });

  it('Input type test', () => {
    expect(formFields.formFields[0].controlType).toEqual('text');
    expect(formFields.formFields[1].controlType).toEqual('text');
  });

  it('Required validation test', () => {
    expect(formFields.formFields[0].validators).toContain(Validators.required);
  });

  it('custom validation test', () => {
    let validatorList = formFields.formFields[0].validators;
    validatorList.forEach(element => {
      const testControlComplexityCode = new FormControl('!@#'); // Checking for invalid pattern
      const result = element(testControlComplexityCode);

      if (result) {
        expect(
          result.errorArray
        ).toContain('pw.fieldValidators.invalidErrorMsg', [
          'pw.fieldValidators.complexityCodePatternErrorMsg'
        ]);
      }
    });

    validatorList = formFields.formFields[1].validators; // Description
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
