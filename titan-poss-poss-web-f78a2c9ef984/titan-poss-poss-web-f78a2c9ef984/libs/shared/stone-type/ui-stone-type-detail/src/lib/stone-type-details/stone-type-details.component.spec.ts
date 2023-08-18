import { StoneTypeDetailsComponent } from './stone-type-details.component';

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

describe('Stone type component tests', () => {
  let component: StoneTypeDetailsComponent;
  let fixture: ComponentFixture<StoneTypeDetailsComponent>;

  let componentD: DynamicFormComponent;
  let fixtureD: ComponentFixture<DynamicFormComponent>;

  let form;
  let formFields;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [StoneTypeDetailsComponent],
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

    fixture = TestBed.createComponent(StoneTypeDetailsComponent);
    component = fixture.componentInstance;

    component.dialogData = {
      stoneTypeCode: '0011',
      description: 'test',
      configDetails: {
        karatageWeightPrint: 'yes'
      }
    }; // Mock data

    fixtureD = TestBed.createComponent(DynamicFormComponent);
    componentD = fixtureD.componentInstance;

    form = component.prepareSet(component.dialogData); //['prepareSet']();
    formFields = component.getInputs(form);
  });

  it('is Stone type component defined', () => {
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
      'pw.stoneType.stoneTypeCode',
      'pw.stoneType.description',
      'pw.stoneType.karatageWeightPrint'
    ]; // Test labels
    expect(formFields.formFields[0].label).toEqual(labels[0]);
    expect(formFields.formFields[1].label).toEqual(labels[1]);
    expect(formFields.formFields[2].label).toEqual(labels[2]);
  });

  it('Input type test', () => {
    expect(formFields.formFields[0].controlType).toEqual('text');
    expect(formFields.formFields[1].controlType).toEqual('textarea');
    expect(formFields.formFields[2].controlType).toEqual('radio');
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
  });

  it('custom validation test', () => {
    let validatorList = formFields.formFields[0].validators; // Stone type code
    validatorList.forEach((element, index) => {
      const testControl = new FormControl('!@#'); // Checking for invalid pattern
      const result = element(testControl);

      if (result) {
        expect(
          result.errorArray
        ).toContain('pw.fieldValidators.invalidErrorMsg', [
          'pw.fieldValidators.stoneTypeCodeRangeErrorMsg',
          'pw.fieldValidators.stoneTypeCodePatternErrorMsg'
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
  });
});
