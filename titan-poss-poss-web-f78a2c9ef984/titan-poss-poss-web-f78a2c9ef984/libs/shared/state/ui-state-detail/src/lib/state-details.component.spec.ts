import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DynamicFormComponent } from '@poss-web/shared/components/ui-dynamic-form';
import { Validators, FormControl } from '@angular/forms';
import { TranslateStore } from '@ngx-translate/core';
import { StateDetailsComponent } from './state-details.component';
import { CurrencyFormatterService } from '@poss-web/shared/components/ui-formatters';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';
describe('state component tests', () => {
  let component: StateDetailsComponent;
  let fixture: ComponentFixture<StateDetailsComponent>;

  let componentD: DynamicFormComponent;
  let fixtureD: ComponentFixture<DynamicFormComponent>;

  let form;
  let formFields;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [StateDetailsComponent],
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

    fixture = TestBed.createComponent(StateDetailsComponent);
    component = fixture.componentInstance;

    component.dialogData = {
      countryCode: 'IND',
      isUnionTerritory: false,
      stateCode: 'KA',
      description: 'India',
      isActive: true
    }; // Mock data

    fixtureD = TestBed.createComponent(DynamicFormComponent);
    componentD = fixtureD.componentInstance;

    form = component.prepareSet(component.dialogData, [
      { countryCode: 'IND', description: 'India' }
    ]); //['prepareSet']();

    formFields = component.getInputs(form);
  });

  it('is state component defined', () => {
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
      'pw.states.country',
      'pw.states.selectType',
      'pw.states.stateCode',
      'pw.states.stateDescription'
    ]; // Test labels
    expect(formFields.formFields[0].label).toEqual(labels[0]);
    expect(formFields.formFields[1].label).toEqual(labels[1]);
    expect(formFields.formFields[2].label).toEqual(labels[2]);

    expect(formFields.formFields[3].label).toEqual(labels[3]);
  });

  it('Input type test', () => {
    expect(formFields.formFields[0].controlType).toEqual('select');
    expect(formFields.formFields[1].controlType).toEqual('radio');
    expect(formFields.formFields[2].controlType).toEqual('text');
    expect(formFields.formFields[3].controlType).toEqual('text');
  });

  it('Required validation test', () => {
    expect(formFields.formFields[0].validators).toContain(Validators.required);
    expect(formFields.formFields[2].validators).toContain(Validators.required);
    expect(formFields.formFields[3].validators).toContain(Validators.required);
  });
});
