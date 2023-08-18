import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DynamicFormComponent } from '@poss-web/shared/components/ui-dynamic-form';
import { Validators, FormControl } from '@angular/forms';
import { TranslateStore } from '@ngx-translate/core';
import { SubbrandDetailsComponent } from './subbrand-details.component';
import { CurrencyFormatterService } from '@poss-web/shared/components/ui-formatters';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';

describe('sub brand component tests', () => {
  let component: SubbrandDetailsComponent;
  let fixture: ComponentFixture<SubbrandDetailsComponent>;

  let componentD: DynamicFormComponent;
  let fixtureD: ComponentFixture<DynamicFormComponent>;

  let form;
  let formFields;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [SubbrandDetailsComponent],
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

    fixture = TestBed.createComponent(SubbrandDetailsComponent);
    component = fixture.componentInstance;

    component.dialogData = {
      subBrandDetails: {
        brandCode: 'sub',
        description: 'sub',
        configDetails: {},
        isActive: true
      },
      parentBrandDetails: [
        {
          brandCode: 'parent',
          description: 'parent',
          configDetails: {},
          isActive: true
        }
      ]
    }; // Mock data

    fixtureD = TestBed.createComponent(DynamicFormComponent);
    componentD = fixtureD.componentInstance;

    form = component.prepareSet(); //['prepareSet']();
    formFields = component.getInputs(form);
  });

  it('is subbrand component defined', () => {
    expect(component).toBeDefined();
  });

  it('is dynamic form component defined', () => {
    expect(componentD).toBeDefined();
  });

  it('number of fields should be 3', () => {
    const noOfFiels = 3;
    expect(formFields.formFields.length).toEqual(noOfFiels);
  });

  it('label test', () => {
    const labels = [
      'pw.brandMaster.subBrandCode',
      'pw.brandMaster.description',
      'pw.brandMaster.parentBrandCode'
    ]; // Test labels
    expect(formFields.formFields[0].label).toEqual(labels[0]);
    expect(formFields.formFields[1].label).toEqual(labels[1]);
    expect(formFields.formFields[2].label).toEqual(labels[2]);
  });

  it('Input type test', () => {
    expect(formFields.formFields[0].controlType).toEqual('text');
    expect(formFields.formFields[1].controlType).toEqual('textarea');
    expect(formFields.formFields[2].controlType).toEqual('select');
  });

  it('Required validation test', () => {
    expect(formFields.formFields[0].validators).toContain(Validators.required);
    expect(formFields.formFields[1].validators).toContain(Validators.required);
    expect(formFields.formFields[2].validators).toContain(Validators.required);
  });

  it('custom validation test', () => {
    let validatorList = formFields.formFields[0].validators;
    validatorList.forEach(element => {
      const testControlSubbrandCode = new FormControl('!@#'); // Checking for invalid pattern
      const result = element(testControlSubbrandCode);

      if (result) {
        expect(
          result.errorArray
        ).toContain('pw.fieldValidators.invalidErrorMsg', [
          'pw.fieldValidators.subbrandcodePatternErrorMsg'
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
