import { CurrencyDetailsComponent } from './currency-details.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DynamicFormComponent } from '@poss-web/shared/components/ui-dynamic-form';
import { Validators, FormControl } from '@angular/forms';
import { TranslateStore } from '@ngx-translate/core';
import { CurrencyFormatterService } from '@poss-web/shared/components/ui-formatters';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';

describe('currency detail component tests', () => {
  let component: CurrencyDetailsComponent;
  let fixture: ComponentFixture<CurrencyDetailsComponent>;

  let componentD: DynamicFormComponent;
  let fixtureD: ComponentFixture<DynamicFormComponent>;

  let form;
  let formFields;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [CurrencyDetailsComponent],
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

        { provide: MAT_DIALOG_DATA, useValue: {} },
        TranslateStore
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CurrencyDetailsComponent);
    component = fixture.componentInstance;

    component.dialogData = {
      currencyCode: 'ABC',
      description: 'desc',
      currencySymbol: 'ABCD',
      unicode: '1234',
      isActive: true
    }; // Mock data

    fixtureD = TestBed.createComponent(DynamicFormComponent);
    componentD = fixtureD.componentInstance;

    form = component.prepareSet(); //['prepareSet']();
    formFields = component.getInputs(form);
  });

  it('is currency component defined', () => {
    expect(component).toBeDefined();
  });

  it('is dynamic form component defined', () => {
    expect(componentD).toBeDefined();
  });

  it('number of fields should be 4', () => {
    const noOfFiels = 4;
    expect(formFields.formFields.length).toEqual(noOfFiels);
  });

  it('label test', () => {
    const labels = [
      'pw.currencyMaster.currencyCode',
      'pw.currencyMaster.description',
      'pw.currencyMaster.currencySymbol',
      '',
      'pw.productCategory.isActiveLabel'
    ]; // Test labels
    expect(formFields.formFields[0].label).toEqual(labels[0]);
    expect(formFields.formFields[1].label).toEqual(labels[1]);
    expect(formFields.formFields[2].label).toEqual(labels[2]);
    expect(formFields.formFields[3].options[0].label).toEqual(labels[4]);
  });

  it('Input type test', () => {
    expect(formFields.formFields[0].controlType).toEqual('text');
    expect(formFields.formFields[1].controlType).toEqual('text');
    expect(formFields.formFields[2].controlType).toEqual('text');
    expect(formFields.formFields[3].controlType).toEqual('checkbox');
  });

  it('Required validation test', () => {
    expect(formFields.formFields[0].validators).toContain(
      Validators.required,
      Validators.pattern
    );
    expect(formFields.formFields[1].validators).toContain(
      Validators.required,
      Validators.pattern
    );
    expect(formFields.formFields[2].validators).toContain(Validators.required);
  });

  it('custom validation test', () => {
    let validatorList = formFields.formFields[0].validators; // currencyCode
    validatorList.forEach((element, index) => {
      const testControl = new FormControl('!@#'); // Checking for invalid pattern
      const result = element(testControl);

      if (result) {
        expect(
          result.errorArray
        ).toContain('pw.fieldValidators.invalidErrorMsg', [
          'pw.fieldValidators.currencyCodePatternErrorMsg'
        ]);
      }
    });

    validatorList = formFields.formFields[1].validators; // Description
    validatorList.forEach((element, index) => {
      const testControl = new FormControl('!@#'); // Checking for invalid pattern
      const result = element(testControl);

      if (result) {
        expect(
          result.errorArray
        ).toContain('pw.fieldValidators.invalidErrorMsg', [
          'pw.fieldValidators.descriptionPatternErrorMsg'
        ]);
      }
    });
    validatorList = formFields.formFields[2].validators; // currency symbol
    validatorList.forEach((element, index) => {
      const testControl = new FormControl('!@#'); // Checking for invalid pattern
      const result = element(testControl);

      if (result) {
        expect(
          result.errorArray
        ).toContain('pw.fieldValidators.invalidErrorMsg', [
          'pw.fieldValidators.alphanumericPatternErrorMsg'
        ]);
      }
    });
    validatorList = formFields.formFields[3].validators; // unicode
    validatorList.forEach((element, index) => {
      const testControl = new FormControl('!@#'); // Checking for invalid pattern
      const result = element(testControl);

      if (result) {
        expect(
          result.errorArray
        ).toContain('pw.fieldValidators.invalidErrorMsg', [
          'pw.fieldValidators.uniCodePatternErrorMsg'
        ]);
      }
    });
  });
});
