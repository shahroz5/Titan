import { RegionDetailsComponent } from '..';
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

describe('Region component tests', () => {
  let component: RegionDetailsComponent;
  let fixture: ComponentFixture<RegionDetailsComponent>;

  let componentD: DynamicFormComponent;
  let fixtureD: ComponentFixture<DynamicFormComponent>;

  let form;
  let formFields;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [RegionDetailsComponent],
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

    fixture = TestBed.createComponent(RegionDetailsComponent);
    component = fixture.componentInstance;

    component.dialogData = {
      orgCode: 'A1',
      regionCode: '1',
      description: 'desc',
      configDetails: {},
      parentRegionCode: 'dddd',
      isActive: true
    }; // Mock data

    fixtureD = TestBed.createComponent(DynamicFormComponent);
    componentD = fixtureD.componentInstance;

    form = component.prepareSet(); //['prepareSet']();
    formFields = component.getInputs(form);
  });

  it('is region component defined', () => {
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
    const labels = ['Region', 'Description']; // Test labels
    expect(formFields.formFields[0].label).toEqual(labels[0]);
    expect(formFields.formFields[1].label).toEqual(labels[1]);
    // expect(formFields.formFields[2].options[0].label).toEqual(labels[2]);
  });

  it('Input type test', () => {
    expect(formFields.formFields[0].controlType).toEqual('text');
    expect(formFields.formFields[1].controlType).toEqual('text');
    // expect(formFields.formFields[2].controlType).toEqual('checkbox');
  });

  it('Required validation test', () => {
    expect(formFields.formFields[0].validators).toContain(Validators.required);
    expect(formFields.formFields[1].validators).toContain(Validators.required);
  });

  it('custom validation test', () => {
    let validatorList = formFields.formFields[0].validators; // region code
    validatorList.forEach((element, index) => {
      const testControl = new FormControl('!@#'); // Checking for invalid pattern
      const result = element(testControl);

      if (result) {
        expect(
          result.errorArray
        ).toContain('pw.fieldValidators.invalidErrorMsg', [
          'pw.fieldValidators.regioncodePatternErrorMsg'
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
