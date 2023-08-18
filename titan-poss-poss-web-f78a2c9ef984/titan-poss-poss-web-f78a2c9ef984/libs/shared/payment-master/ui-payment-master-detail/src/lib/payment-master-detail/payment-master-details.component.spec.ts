import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DynamicFormComponent } from '@poss-web/shared/components/ui-dynamic-form';
import { Validators, FormControl } from '@angular/forms';
import { TranslateStore } from '@ngx-translate/core';
import { PaymentMasterDetailComponent } from './payment-master-detail.component';
import { CurrencyFormatterService } from '@poss-web/shared/components/ui-formatters';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';
describe('payment Master component tests', () => {
  let component: PaymentMasterDetailComponent;
  let fixture: ComponentFixture<PaymentMasterDetailComponent>;

  let componentD: DynamicFormComponent;
  let fixtureD: ComponentFixture<DynamicFormComponent>;

  let form;
  let formFields;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [PaymentMasterDetailComponent],
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

    fixture = TestBed.createComponent(PaymentMasterDetailComponent);
    component = fixture.componentInstance;

    component.dialogData = {
      type: 'REGULAR',
      paymentCode: 'CASH',
      description: 'India',
      referenceOne: 'Remarks',
      referenceTwo: '',
      referenceThree: '',
      isEditable: true,
      isActive: false,
      customerDependent: true
    }; // Mock data

    fixtureD = TestBed.createComponent(DynamicFormComponent);
    componentD = fixtureD.componentInstance;

    form = component.prepareSet(); //['prepareSet']();

    formFields = component.getInputs(form);
  });

  it('is payment master component defined', () => {
    expect(component).toBeDefined();
  });

  it('is dynamic form component defined', () => {
    expect(componentD).toBeDefined();
  });

  it('number of fields should be 7', () => {
    const noOfFiels = 7;
    expect(formFields.formFields.length).toEqual(noOfFiels);
  });

  it('label test', () => {
    const labels = [
      'pw.paymentMaster.selectType',
      'pw.paymentMaster.paymentCode',
      'pw.paymentMaster.description',
      'pw.paymentMaster.referenceOne',
      'pw.paymentMaster.referenceTwo',
      'pw.paymentMaster.referenceThree',
      'pw.paymentMaster.customerDependent'
    ]; // Test labels
    expect(formFields.formFields[0].label).toEqual(labels[0]);
    expect(formFields.formFields[1].label).toEqual(labels[1]);
    expect(formFields.formFields[2].label).toEqual(labels[2]);
    expect(formFields.formFields[3].label).toEqual(labels[3]);
    expect(formFields.formFields[4].label).toEqual(labels[4]);
    expect(formFields.formFields[5].label).toEqual(labels[5]);
    expect(formFields.formFields[6].options[0].label).toEqual(labels[6]);
  });

  it('Input type test', () => {
    expect(formFields.formFields[0].controlType).toEqual('radio');
    expect(formFields.formFields[1].controlType).toEqual('text');
    expect(formFields.formFields[2].controlType).toEqual('text');
    expect(formFields.formFields[3].controlType).toEqual('text');
    expect(formFields.formFields[4].controlType).toEqual('text');
    expect(formFields.formFields[5].controlType).toEqual('text');
    expect(formFields.formFields[6].controlType).toEqual('checkbox');
  });

  it('Required validation test', () => {
    expect(formFields.formFields[1].validators).toContain(Validators.required);
    expect(formFields.formFields[2].validators).toContain(Validators.required);
    expect(formFields.formFields[3].validators).toContain(Validators.required);
  });

  it('custom validation test', () => {
    let validatorList = formFields.formFields[1].validators;
    validatorList.forEach(element => {
      const testControlPaymentCode = new FormControl('!@#'); // Checking for invalid pattern
      const result = element(testControlPaymentCode);

      if (result) {
        expect(
          result.errorArray
        ).toContain('pw.fieldValidators.invalidErrorMsg', [
          'pw.fieldValidators.paymentcodePatternErrorMsg'
        ]);
      }
    });

    validatorList = formFields.formFields[2].validators; // Description
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

    validatorList = formFields.formFields[3].validators; // Description
    validatorList.forEach(element => {
      const testControlReferenceOne = new FormControl('!@#'); // Checking for invalid pattern
      const result = element(testControlReferenceOne);

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
