import { SubRegionDetailsComponent } from '..';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DynamicFormComponent } from '@poss-web/shared/components/ui-dynamic-form';
import { Validators, FormControl } from '@angular/forms';
import { TranslateStore } from '@ngx-translate/core';

describe('sub-region detail component tests', () => {
  let component: SubRegionDetailsComponent;
  let fixture: ComponentFixture<SubRegionDetailsComponent>;

  let componentD: DynamicFormComponent;
  let fixtureD: ComponentFixture<DynamicFormComponent>;

  let form;
  let formFields;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [SubRegionDetailsComponent],
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
        TranslateStore
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SubRegionDetailsComponent);
    component = fixture.componentInstance;

    component.dialogData = {
      orgCode: 'A1',
      configDetails: {},
      description: 'East ',
      isActive: true,
      parentRegionCode: 'East',
      regionCode: 'East1'
    }; // Mock data

    fixtureD = TestBed.createComponent(DynamicFormComponent);
    componentD = fixtureD.componentInstance;

    form = component.prepareSet(component.dialogData, [
      { regionCode: 'RS', description: 'testw' }
    ]); //['prepareSet']();
    formFields = component.getInputs(form);
  });

  it('is sub-region component defined', () => {
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
      'pw.subRegion.parentRegion',
      'pw.subRegion.subRegion',
      'pw.subRegion.description',
      'pw.subRegion.isActive'
    ]; // Test labels
    expect(formFields.formFields[0].label).toEqual(labels[0]);
    expect(formFields.formFields[1].label).toEqual(labels[1]);
    expect(formFields.formFields[2].label).toEqual(labels[2]);
    expect(formFields.formFields[3].options[0].label).toEqual(labels[3]);
  });

  it('Input type test', () => {
    expect(formFields.formFields[0].controlType).toEqual('select');
    expect(formFields.formFields[1].controlType).toEqual('text');
    expect(formFields.formFields[2].controlType).toEqual('text');
    expect(formFields.formFields[3].controlType).toEqual('checkbox');
  });

  it('Required validation test', () => {
    expect(formFields.formFields[0].validators).toContain(Validators.required);
    expect(formFields.formFields[1].validators).toContain(Validators.required);
    expect(formFields.formFields[2].validators).toContain(Validators.required);
  });
  it('custom validation test', () => {
    let validatorList = formFields.formFields[0].validators; //parentRegion
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
    validatorList = formFields.formFields[1].validators; // subRegion
    validatorList.forEach((element, index) => {
      const testControl = new FormControl('!@#'); // Checking for invalid pattern
      const result = element(testControl);

      if (result) {
        expect(
          result.errorArray
        ).toContain('pw.fieldValidators.invalidErrorMsg', [
          'pw.fieldValidators.subregioncodePatternErrorMsg'
        ]);
      }
    });

    validatorList = formFields.formFields[2].validators; // Description
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
