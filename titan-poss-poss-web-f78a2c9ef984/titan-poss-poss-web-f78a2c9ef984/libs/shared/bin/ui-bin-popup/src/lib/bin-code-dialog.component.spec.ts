import { BinCodeDialogComponent } from '..';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DynamicFormComponent } from '@poss-web/shared/components/ui-dynamic-form';
import { Validators, FormControl } from '@angular/forms';
import { TranslateStore } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { CurrencyFormatterService } from '@poss-web/shared/components/ui-formatters';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';

describe('Bin Code component tests', () => {
  let component: BinCodeDialogComponent;
  let fixture: ComponentFixture<BinCodeDialogComponent>;

  let componentD: DynamicFormComponent;
  let fixtureD: ComponentFixture<DynamicFormComponent>;

  let form;
  let formFields;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [BinCodeDialogComponent],
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
          provide: ActivatedRoute,
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

    fixture = TestBed.createComponent(BinCodeDialogComponent);
    component = fixture.componentInstance;

    component.dialogData = {
      binCode: 'ABC',
      binGroupCode: 'TO',
      description: 'Desc'
      // isActive: true
    }; // Mock data

    fixtureD = TestBed.createComponent(DynamicFormComponent);
    componentD = fixtureD.componentInstance;

    form = component.prepareSet(component.dialogData, [
      { binGroupCode: '1', description: 'hss' }
    ]); //['prepareSet']();
    formFields = component.getInputs(form);
  });

  it('is bin code component defined', () => {
    expect(component).toBeDefined();
  });

  it('is dynamic form component defined', () => {
    expect(componentD).toBeDefined();
  });

  it('number of fields should be 4', () => {
    const noOfFiels = 3;
    expect(formFields.formFields.length).toEqual(noOfFiels);
  });

  it('label test', () => {
    const labels = [
      'pw.binCode.binGroup',
      'pw.binCode.bincode',
      'pw.binCode.description'
    ]; // Test labels
    expect(formFields.formFields[0].label).toEqual(labels[0]);
    expect(formFields.formFields[1].label).toEqual(labels[1]);
    expect(formFields.formFields[2].label).toEqual(labels[2]);
    // expect(formFields.formFields[3].options[0].label).toEqual(labels[3]);
  });

  it('Input type test', () => {
    expect(formFields.formFields[0].controlType).toEqual('select');
    expect(formFields.formFields[1].controlType).toEqual('text');
    expect(formFields.formFields[2].controlType).toEqual('textarea');
    // expect(formFields.formFields[3].controlType).toEqual('checkbox');
  });

  it('Required validation test', () => {
    expect(formFields.formFields[0].validators).toContain(Validators.required);
    expect(formFields.formFields[1].validators).toContain(Validators.required);
    expect(formFields.formFields[2].validators).toContain(Validators.required);
  });
  it('custom validation test', () => {
    let validatorList = formFields.formFields[0].validators; // Bin group
    validatorList.forEach((element, index) => {
      const testControl = new FormControl('!@#'); // Checking for invalid pattern
      const result = element(testControl);

      if (result) {
        expect(result.errorArray).toContain(
          'pw.fieldValidators.bingroupPatternErrorMsg'
        );
      }
    });

    validatorList = formFields.formFields[1].validators; // bin code
    validatorList.forEach((element, index) => {
      const testControl = new FormControl('!@#'); // Checking for invalid pattern
      const result = element(testControl);

      if (result) {
        expect(
          result.errorArray
        ).toContain('pw.fieldValidators.invalidErrorMsg', [
          'pw.fieldValidators.bincodePatternErrorMsg'
        ]);
      }
    });
    validatorList = formFields.formFields[2].validators; // description
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
  });
});
