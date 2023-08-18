import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DynamicFormComponent,
  SharedComponentsUiDynamicFormModule
} from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateStore } from '@ngx-translate/core';
import { Validators, FormControl } from '@angular/forms';
import { ItemSteponeComponent } from './item-stepone.component';
import { ItemDetails } from '@poss-web/shared/models';
describe('item master component tests', () => {
  let component: ItemSteponeComponent;
  let fixture: ComponentFixture<ItemSteponeComponent>;

  let componentD: DynamicFormComponent;
  let fixtureD: ComponentFixture<DynamicFormComponent>;

  let form;
  let formFields;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ItemSteponeComponent],
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

    fixture = TestBed.createComponent(ItemSteponeComponent);
    component = fixture.componentInstance;

    fixtureD = TestBed.createComponent(DynamicFormComponent);
    componentD = fixtureD.componentInstance;
    const itemData: ItemDetails = {
      isEditable: true,
      itemCode: 'ABC',
      description: 'ABC',
      isActive: true,
      stoneWeight: 'ABC',
      indentType: 'ABC',
      isConsignable: true,
      maxWeightDeviation: 'ABC',
      stdWeight: 'ABC',
      productCode: 'ABC',
      brandCode: 'ABC',
      productType: 'ABC',
      materialCode: 'ABC',
      supplyChainCode: 'ABC',
      itemNature: 'ABC',
      stdPrice: 'ABC',
      stoneCharges: 'ABC',
      leadTime: 'ABC',
      hsnSacCode: 'ABC',
      purity: 'ABC',
      inventoryType: 'ABC',
      CFAproductCode: 'ABC',
      complexityCode: 'ABC',
      pricingType: 'ABC',
      taxClass: 'ABC',
      findingCode: 'ABC',
      size: 'ABC',
      finishing: 'ABC',
      pricingGroupType: 'ABC',
      priceFactor: 'ABC',
      karatage: 'ABC',
      diamondKaratage: 'ABC',
      diamondClarity: 'ABC',
      diamondColour: 'ABC',
      perGram: true,
      saleable: true,
      returnable: true,
      indentable: true
    };

    form = component.prepareSet(itemData); //['prepareSet']();
    formFields = component.getInputs(form);
  });
  it('is item master component defined', () => {
    expect(component).toBeDefined();
  });

  it('is dynamic form component defined', () => {
    expect(componentD).toBeDefined();
  });
  it('number of sub forms should be 2', () => {
    const noOfFiels = 2;
    expect(formFields.formFields.length).toEqual(noOfFiels);
  });

  it('First subform label test', () => {
    const labels = [
      'pw.itemMaster.itemMasterStoneWeight',
      'Indent Type',
      '',
      'pw.itemMaster.itemMasterWeightDeviation',
      'pw.itemMaster.itemMasterStdWeight',
      'pw.itemMaster.itemMasterProductCode',
      'pw.itemMaster.itemMasterBrandCode',
      'pw.itemMaster.itemMasterProductType',
      'pw.itemMaster.itemMasterMaterialCode',
      'pw.itemMaster.itemMasterSupplyChainCode',
      'pw.itemMaster.itemMasterItemNature',
      'pw.itemMaster.itemMasterStdPrice',
      'pw.itemMaster.itemMasterStoneCharges',
      'pw.itemMaster.itemMasterLeadTime',
      'pw.itemMaster.itemMasterHSNSACCode',
      'pw.itemMaster.itemMasterPurity'
    ];
    expect(formFields.formFields[0].fields[0].label).toEqual(labels[0]);
    expect(formFields.formFields[0].fields[1].label).toEqual(labels[1]);
    expect(formFields.formFields[0].fields[2].label).toEqual(labels[2]);
    expect(formFields.formFields[0].fields[3].label).toEqual(labels[3]);
    expect(formFields.formFields[0].fields[4].label).toEqual(labels[4]);
    expect(formFields.formFields[0].fields[5].label).toEqual(labels[5]);
    expect(formFields.formFields[0].fields[6].label).toEqual(labels[6]);
    expect(formFields.formFields[0].fields[7].label).toEqual(labels[7]);
    expect(formFields.formFields[0].fields[8].label).toEqual(labels[8]);
    expect(formFields.formFields[0].fields[9].label).toEqual(labels[9]);
    expect(formFields.formFields[0].fields[10].label).toEqual(labels[10]);
    expect(formFields.formFields[0].fields[11].label).toEqual(labels[11]);
    expect(formFields.formFields[0].fields[12].label).toEqual(labels[12]);
    expect(formFields.formFields[0].fields[13].label).toEqual(labels[13]);
    expect(formFields.formFields[0].fields[14].label).toEqual(labels[14]);
    expect(formFields.formFields[0].fields[15].label).toEqual(labels[15]);
  });
  it('Second subform label test', () => {
    const labels = [
      'pw.itemMaster.itemMasterCFAproductCode',
      'pw.itemMaster.itemMasterComplexityCode',
      'Inventory Type',
      'pw.itemMaster.itemMasterPricingType',
      'pw.itemMaster.itemMasterTaxClass',
      'pw.itemMaster.itemMasterFindingCode',
      'pw.itemMaster.itemMasterSize',
      'pw.itemMaster.itemMasterFinishing',
      'pw.itemMaster.itemMasterPricingGroupType',
      'pw.itemMaster.itemMasterPriceFactor',
      'pw.itemMaster.itemMasterKaratage',
      'pw.itemMaster.itemMasterDiamondKaratage',
      'pw.itemMaster.itemMasterDiamondClarity',
      'pw.itemMaster.itemMasterDiamondColour',
      'pw.itemMaster.itemMasterPerGram',
      'pw.itemMaster.itemMasterSaleable',
      'pw.itemMaster.itemMasterReturnable',
      'pw.itemMaster.itemMasterIndentable'
      // 'pw.itemMaster.itemMasterInterBrandAcceptable'
    ];
    expect(formFields.formFields[1].fields[0].label).toEqual(labels[0]);
    expect(formFields.formFields[1].fields[1].label).toEqual(labels[1]);
    expect(formFields.formFields[1].fields[2].label).toEqual(labels[2]);
    expect(formFields.formFields[1].fields[3].label).toEqual(labels[3]);
    expect(formFields.formFields[1].fields[4].label).toEqual(labels[4]);
    expect(formFields.formFields[1].fields[5].label).toEqual(labels[5]);
    expect(formFields.formFields[1].fields[6].label).toEqual(labels[6]);
    expect(formFields.formFields[1].fields[7].label).toEqual(labels[7]);
    expect(formFields.formFields[1].fields[8].label).toEqual(labels[8]);
    expect(formFields.formFields[1].fields[9].label).toEqual(labels[9]);
    expect(formFields.formFields[1].fields[10].label).toEqual(labels[10]);
    expect(formFields.formFields[1].fields[11].label).toEqual(labels[11]);
    expect(formFields.formFields[1].fields[12].label).toEqual(labels[12]);
    expect(formFields.formFields[1].fields[13].label).toEqual(labels[13]);
    expect(formFields.formFields[1].fields[14].options[0].label).toEqual(
      labels[14]
    );
    expect(formFields.formFields[1].fields[14].options[1].label).toEqual(
      labels[15]
    );
    expect(formFields.formFields[1].fields[14].options[2].label).toEqual(
      labels[16]
    );
    expect(formFields.formFields[1].fields[14].options[3].label).toEqual(
      labels[17]
    );
    // expect(formFields.formFields[1].fields[4].options[4].label).toEqual(
    //   labels[16]
    // );
  });
  it('First sub form Input type test', () => {
    expect(formFields.formFields[0].fields[0].controlType).toEqual(
      'textOutline'
    );

    expect(formFields.formFields[0].fields[1].controlType).toEqual(
      'textOutline'
    );
    expect(formFields.formFields[0].fields[2].controlType).toEqual('checkbox');
    expect(formFields.formFields[0].fields[3].controlType).toEqual(
      'textOutline'
    );
    expect(formFields.formFields[0].fields[4].controlType).toEqual(
      'textOutline'
    );
    expect(formFields.formFields[0].fields[5].controlType).toEqual(
      'textOutline'
    );
    expect(formFields.formFields[0].fields[6].controlType).toEqual(
      'textOutline'
    );
    expect(formFields.formFields[0].fields[7].controlType).toEqual(
      'textOutline'
    );
    expect(formFields.formFields[0].fields[8].controlType).toEqual(
      'textOutline'
    );
    expect(formFields.formFields[0].fields[9].controlType).toEqual(
      'textOutline'
    );
    expect(formFields.formFields[0].fields[10].controlType).toEqual(
      'textOutline'
    );
    expect(formFields.formFields[0].fields[11].controlType).toEqual(
      'textOutline'
    );
    expect(formFields.formFields[0].fields[12].controlType).toEqual(
      'textOutline'
    );
    expect(formFields.formFields[0].fields[13].controlType).toEqual(
      'textOutline'
    );
    expect(formFields.formFields[0].fields[14].controlType).toEqual(
      'textOutline'
    );
    expect(formFields.formFields[0].fields[15].controlType).toEqual(
      'textOutline'
    );
  });
  it('Second sub form Input type test', () => {
    expect(formFields.formFields[1].fields[0].controlType).toEqual(
      'textOutline'
    );
    expect(formFields.formFields[1].fields[1].controlType).toEqual(
      'textOutline'
    );
    expect(formFields.formFields[1].fields[2].controlType).toEqual(
      'textOutline'
    );
    expect(formFields.formFields[1].fields[3].controlType).toEqual(
      'textOutline'
    );
    expect(formFields.formFields[1].fields[4].controlType).toEqual(
      'textOutline'
    );
    expect(formFields.formFields[1].fields[5].controlType).toEqual(
      'textOutline'
    );
    expect(formFields.formFields[1].fields[6].controlType).toEqual(
      'textOutline'
    );
    expect(formFields.formFields[1].fields[7].controlType).toEqual(
      'textOutline'
    );
    expect(formFields.formFields[1].fields[8].controlType).toEqual(
      'textOutline'
    );
    expect(formFields.formFields[1].fields[9].controlType).toEqual(
      'textOutline'
    );
    expect(formFields.formFields[1].fields[10].controlType).toEqual(
      'textOutline'
    );
    expect(formFields.formFields[1].fields[11].controlType).toEqual(
      'textOutline'
    );
    expect(formFields.formFields[1].fields[12].controlType).toEqual(
      'textOutline'
    );
    expect(formFields.formFields[1].fields[13].controlType).toEqual(
      'textOutline'
    );
    // expect(formFields.formFields[1].fields[12].controlType).toEqual('checkbox');
  });

  // it('Required validation test', () => {
  //   expect(formFields.formFields[0].fields[0].validators).toContain(
  //     Validators.required,
  //     Validators.pattern
  //   );
  //   expect(formFields.formFields[0].fields[1].validators).toContain(
  //     Validators.required
  //   );
  //   expect(formFields.formFields[0].fields[5].validators).toContain(
  //     Validators.required
  //   );
  //   expect(formFields.formFields[0].fields[6].validators).toContain(
  //     Validators.required
  //   );
  //   expect(formFields.formFields[0].fields[7].validators).toContain(
  //     Validators.required
  //   );
  //   expect(formFields.formFields[0].fields[8].validators).toContain(
  //     Validators.required
  //   );
  //   expect(formFields.formFields[1].fields[0].validators).toContain(
  //     Validators.required
  //   );
  // });
  // it('custom validation test', () => {
  //   const validatorList = formFields.formFields[0].fields[0].validators; // item code
  //   validatorList.forEach((element, index) => {
  //     const testControl = new FormControl('!@#'); // Checking for invalid pattern
  //     const result = element(testControl);

  //     if (result) {
  //       expect(result.errorArray).toContain(
  //         'pw.fieldValidators.alphanumericPatternErrorMsg'
  //       );
  //     }
  //   });
  // });
});
