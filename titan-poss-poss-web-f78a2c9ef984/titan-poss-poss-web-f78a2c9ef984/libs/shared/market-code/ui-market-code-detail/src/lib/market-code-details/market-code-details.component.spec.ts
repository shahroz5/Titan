import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DynamicFormComponent } from '@poss-web/shared/components/ui-dynamic-form';
import { Validators, FormControl } from '@angular/forms';
import { TranslateStore } from '@ngx-translate/core';
import { MarketCodeDetailsComponent } from './market-code-details.component';

describe('market code details component tests', () => {
  let component: MarketCodeDetailsComponent;
  let fixture: ComponentFixture<MarketCodeDetailsComponent>;

  let componentD: DynamicFormComponent;
  let fixtureD: ComponentFixture<DynamicFormComponent>;

  let form;
  let formFields;
  let form1;
  let formFields1;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [MarketCodeDetailsComponent],
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

    fixture = TestBed.createComponent(MarketCodeDetailsComponent);
    component = fixture.componentInstance;

    fixtureD = TestBed.createComponent(DynamicFormComponent);
    componentD = fixtureD.componentInstance;
    component.dialogData = {
      marketCode: 'MAR',
      description: 'good',
      isActive: true,
      marketMaterialFacators: {
        goldFactor: '10',
        goldAddAmount: '11',
        goldDeductAmount: '12',
        silverFactor: '10',
        silverAddAmount: '11',
        silverDeductAmount: '12',
        platinuumFactor: '10',
        platinumAddAmount: '11',
        platinumDeductAmount: '12',
        f1Amount: '12',
        f2Amount: '12'
      }
    };
    form = component.prepareSet(); //['prepareSet']();
    formFields = component.getInputsOfMarketCode(form);
    form1 = component.prepareSet1();
    formFields1 = component.getInputs(form1);
  });

  it('is market code details  class component defined', () => {
    expect(component).toBeDefined();
  });

  it('is dynamic form component defined', () => {
    expect(componentD).toBeDefined();
  });

  it('Form 1 no.of fields should be 3', () => {
    const noOfFiels = 3;
    expect(formFields.formFields.length).toEqual(noOfFiels);
  });
  it('Form 2 no.of fields should be 12', () => {
    const noOfFiels = 12;
    expect(formFields1.formFields.length).toEqual(noOfFiels);
  });

  it('marketDetails form label test', () => {
    const labels = [
      'pw.marketCode.marketCodeText',
      'pw.marketCode.description',
      'pw.marketCode.isActive'
    ];
    expect(formFields.formFields[0].label).toEqual(labels[0]);
    expect(formFields.formFields[1].label).toEqual(labels[1]);
    expect(formFields.formFields[2].options[0].label).toEqual(labels[2]);
  });
  it('marketMaterialFactors label test', () => {
    const labels = [
      'pw.marketCode.gold',
      'pw.marketCode.factor',
      'pw.marketCode.amountToBeAdded',
      'pw.marketCode.amountToBeDeducted',
      'pw.marketCode.platinum',
      'pw.marketCode.silver'
    ];
    expect(formFields1.formFields[0].label).toEqual(labels[0]);
    expect(formFields1.formFields[1].label).toEqual(labels[1]);
    expect(formFields1.formFields[2].label).toEqual(labels[2]);
    expect(formFields1.formFields[3].label).toEqual(labels[3]);
    expect(formFields1.formFields[4].label).toEqual(labels[4]); //todo
    expect(formFields1.formFields[5].label).toEqual(labels[1]);
    expect(formFields1.formFields[6].label).toEqual(labels[2]);
    expect(formFields1.formFields[7].label).toEqual(labels[3]);
    expect(formFields1.formFields[8].label).toEqual(labels[5]); //todo
    expect(formFields1.formFields[9].label).toEqual(labels[1]);
    expect(formFields1.formFields[10].label).toEqual(labels[2]);
    expect(formFields1.formFields[11].label).toEqual(labels[3]);
  });

  it('Input type test for marketDetails form', () => {
    expect(formFields.formFields[0].controlType).toEqual('text');
    expect(formFields.formFields[1].controlType).toEqual('textarea');
    expect(formFields.formFields[2].controlType).toEqual('checkbox');
  });

  it('Required validation test for marketDetails form', () => {
    expect(formFields.formFields[0].validators).toContain(
      Validators.required,
      Validators.pattern
    );
    expect(formFields.formFields[1].validators).toContain(
      Validators.required,
      Validators.pattern
    );
  });
  it('Input type test for marketMaterialFactors form', () => {
    expect(formFields1.formFields[0].controlType).toEqual('textlabel');
    expect(formFields1.formFields[1].controlType).toEqual('text');
    expect(formFields1.formFields[2].controlType).toEqual('text');
    expect(formFields1.formFields[3].controlType).toEqual('text');
    expect(formFields1.formFields[4].controlType).toEqual('textlabel');
    expect(formFields1.formFields[5].controlType).toEqual('text');
    expect(formFields1.formFields[6].controlType).toEqual('text');
    expect(formFields1.formFields[7].controlType).toEqual('text');
    expect(formFields1.formFields[8].controlType).toEqual('textlabel');
    expect(formFields1.formFields[9].controlType).toEqual('text');
    expect(formFields1.formFields[10].controlType).toEqual('text');
    expect(formFields1.formFields[11].controlType).toEqual('text');
  });
  it('Required validation test for marketDetails form', () => {
    expect(formFields1.formFields[1].validators).toContain(
      Validators.required,
      Validators.pattern
    );
    expect(formFields1.formFields[2].validators).toContain(
      Validators.required,
      Validators.pattern
    );
    expect(formFields1.formFields[3].validators).toContain(
      Validators.required,
      Validators.pattern
    );
    expect(formFields1.formFields[5].validators).toContain(
      Validators.required,
      Validators.pattern
    );
    expect(formFields1.formFields[6].validators).toContain(
      Validators.required,
      Validators.pattern
    );
    expect(formFields1.formFields[7].validators).toContain(
      Validators.required,
      Validators.pattern
    );
    expect(formFields1.formFields[9].validators).toContain(
      Validators.required,
      Validators.pattern
    );
    expect(formFields1.formFields[10].validators).toContain(
      Validators.required,
      Validators.pattern
    );
    expect(formFields1.formFields[11].validators).toContain(
      Validators.required,
      Validators.pattern
    );
  });
  it('custom validation test for marketDetails form', () => {
    let validatorList = formFields.formFields[0].validators; // Tax class code
    validatorList.forEach((element, index) => {
      const testControl = new FormControl('!@#'); // Checking for invalid pattern
      const result = element(testControl);

      if (result) {
        expect(result.errorArray).toContain(
          'pw.fieldValidators.invalidErrorMsg'
        );
      }
    });

    validatorList = formFields.formFields[1].validators; // Description
    validatorList.forEach((element, index) => {
      const testControl = new FormControl('!@#'); // Checking for invalid pattern
      const result = element(testControl);

      if (result) {
        expect(result.errorArray).toContain(
          'pw.fieldValidators.invalidErrorMsg'
        );
      }
    });
  });
  it('custom validation test for marketMaterialFactors', () => {
    let validatorList = formFields1.formFields[1].validators; // Tax class code
    validatorList.forEach((element, index) => {
      const testControl = new FormControl('!@#'); // Checking for invalid pattern
      const result = element(testControl);

      if (result) {
        expect(result.errorArray).toContain(
          'pw.fieldValidators.invalidErrorMsg'
        );
      }
    });

    validatorList = formFields1.formFields[2].validators; // amount field
    validatorList.forEach((element, index) => {
      const testControl = new FormControl('!@#'); // Checking for invalid pattern
      const result = element(testControl);

      if (result) {
        expect(result.errorArray).toContain(
          'pw.fieldValidators.invalidErrorMsg'
        );
      }
    });
    validatorList = formFields1.formFields[3].validators; // Description
    validatorList.forEach((element, index) => {
      const testControl = new FormControl('!@#'); // Checking for invalid pattern
      const result = element(testControl);

      if (result) {
        expect(result.errorArray).toContain(
          'pw.fieldValidators.invalidErrorMsg'
        );
      }
    });
    validatorList = formFields1.formFields[5].validators; // amount field
    validatorList.forEach((element, index) => {
      const testControl = new FormControl('!@#'); // Checking for invalid pattern
      const result = element(testControl);

      if (result) {
        expect(result.errorArray).toContain(
          'pw.fieldValidators.invalidErrorMsg'
        );
      }
    });
    validatorList = formFields1.formFields[6].validators;
    validatorList.forEach((element, index) => {
      const testControl = new FormControl('!@#');
      const result = element(testControl);

      if (result) {
        expect(result.errorArray).toContain(
          'pw.fieldValidators.invalidErrorMsg'
        );
      }
    });
    validatorList = formFields1.formFields[7].validators;
    validatorList.forEach((element, index) => {
      const testControl = new FormControl('!@#');
      const result = element(testControl);

      if (result) {
        expect(result.errorArray).toContain(
          'pw.fieldValidators.invalidErrorMsg'
        );
      }
    });
    validatorList = formFields1.formFields[9].validators;
    validatorList.forEach((element, index) => {
      const testControl = new FormControl('!@#');
      const result = element(testControl);

      if (result) {
        expect(result.errorArray).toContain(
          'pw.fieldValidators.invalidErrorMsg'
        );
      }
    });
    validatorList = formFields1.formFields[10].validators;
    validatorList.forEach((element, index) => {
      const testControl = new FormControl('!@#');
      const result = element(testControl);

      if (result) {
        expect(result.errorArray).toContain(
          'pw.fieldValidators.invalidErrorMsg'
        );
      }
    });
    validatorList = formFields1.formFields[11].validators;
    validatorList.forEach((element, index) => {
      const testControl = new FormControl('!@#');
      const result = element(testControl);

      if (result) {
        expect(result.errorArray).toContain(
          'pw.fieldValidators.invalidErrorMsg'
        );
      }
    });
  });
});
