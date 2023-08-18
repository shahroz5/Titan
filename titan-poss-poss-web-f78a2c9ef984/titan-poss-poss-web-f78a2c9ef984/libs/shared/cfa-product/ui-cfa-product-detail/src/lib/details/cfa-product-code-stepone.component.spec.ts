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
import { CFAProductCodeSteponeComponent } from './cfa-product-code-stepone.component';
import {
  ProductType,
  ItemTypesResponse,
  ProductGroupDetails,
  AlertPopupServiceAbstraction
} from '@poss-web/shared/models';
import { CommonModule } from '@angular/common';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
describe('cfa-product-code component tests', () => {
  let component: CFAProductCodeSteponeComponent;
  let fixture: ComponentFixture<CFAProductCodeSteponeComponent>;

  let componentD: DynamicFormComponent;
  let fixtureD: ComponentFixture<DynamicFormComponent>;

  let form;
  let formFields;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [CFAProductCodeSteponeComponent],
      imports: [
        CommonModule,
        SharedComponentsUiDynamicFormModule,
        CommonCustomMaterialModule
        //SharedComponentsUiLoaderModule
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        TranslateStore,
        FieldValidatorsService,
        AlertPopupServiceAbstraction
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CFAProductCodeSteponeComponent);
    component = fixture.componentInstance;

    fixtureD = TestBed.createComponent(DynamicFormComponent);
    componentD = fixtureD.componentInstance;
    const cfaProductData: ProductGroupDetails = {
      productGroupCode: 'PRO',
      description: 'PRO',
      itemTypeCode: 'MP',
      orgCode: 'MP',
      isEligibleForLoyaltyPoints: true,
      printGuranteeCard: true,
      isGRNEnabled: true,
      isConversionEnabled: true,
      isBestGoldRateEnabled: true,
      isGoldPriceMandatory: true,
      isMakingChargeMandatory: true,
      isAllowedForDigiGoldMandatory: true,
      isPlatinumPriceMandatory: true,
      isSilverPriceMandatory: true,
      isStonePriceMandatory: true,
      isActive: true,
      isMia: true,
      plainStudded: 'MP',
      plainStuddedTep: 'MP',
      plainStuddedGrn: 'MP',
      plainStuddedGrf: 'MP',
      pricingType: 'MP',
      hallmarkingExcludeGrams: 0,
      hallmarkingExcludeKarat: '',
      isAllowedForTCS: false,
      isHallmarked: false
    };
    const productTypes: ProductType[] = [
      {
        id: '123',
        name: 'Gold',
        isActive: true
      },
      {
        id: '456',
        name: 'Platinum',
        isActive: true
      }
    ];
    const materialType: ItemTypesResponse[] = [
      {
        id: '123',
        name: 'Gold'
      },
      {
        id: '456',
        name: 'Platinum'
      }
    ];

    form = component.prepareSet(cfaProductData, productTypes, materialType, [
      {
        id: 'UCP',
        name: 'UCP'
      }
    ]); //['prepareSet']();
    formFields = component.getInputs(form);
  });

  it('is cfa product code component defined', () => {
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
      'pw.CFAProduct.productGroup',
      'pw.CFAProduct.isActive',
      'pw.CFAProduct.description',
      'pw.CFAProduct.isMia',
      'pw.CFAProduct.productCategory',
      'pw.CFAProduct.metalType',
      'pw.CFAProduct.goldPriceMandatory',
      'pw.CFAProduct.platinumPriceMandatory',
      'pw.CFAProduct.makingChargesMandatory'
    ];
    expect(formFields.formFields[0].fields[0].label).toEqual(labels[0]);
    expect(formFields.formFields[0].fields[1].options[0].label).toEqual(
      labels[1]
    );
    expect(formFields.formFields[0].fields[2].label).toEqual(labels[2]); //description
    expect(formFields.formFields[0].fields[3].options[0].label).toEqual(
      labels[3]
    ); //mia
    expect(formFields.formFields[0].fields[4].label).toEqual(labels[4]); //drop
    expect(formFields.formFields[0].fields[5].label).toEqual(labels[5]); //drop
    expect(formFields.formFields[0].fields[6].options[0].label).toEqual(
      labels[6]
    );
    expect(formFields.formFields[0].fields[7].options[0].label).toEqual(
      labels[7]
    );
    expect(formFields.formFields[0].fields[8].options[0].label).toEqual(
      labels[8]
    );
  });
  it('Second subform label test', () => {
    const labels = [
      'pw.CFAProduct.stoneChargesMandatory',
      'pw.CFAProduct.isEligibleForLoyalityPoints',
      'pw.CFAProduct.printGuarnteeCard',
      'pw.CFAProduct.eligibleForBillLevelDiscount',
      'pw.CFAProduct.isPlainGold',
      'pw.CFAProduct.isGRFStuddedCategory',
      'pw.CFAProduct.isLoyalityPointsRedeemable',
      'pw.CFAProduct.isPlainSilver',
      'pw.CFAProduct.isPlainPlatinum',
      'pw.CFAProduct.isFOCApplicable',
      'pw.CFAProduct.isBiMetal',
      'pw.CFAProduct.isMiaUCP',
      'pw.CFAProduct.isPlainStudPricing',
      'pw.CFAProduct.isJewelleryItem',
      'pw.CFAProduct.quickSilverRedemptionAllowed',
      'pw.CFAProduct.whetherItIsStuddedOrNot',
      'pw.CFAProduct.TEPIssueOutCategory',
      'Yes',
      'NO'
    ];
    expect(formFields.formFields[1].fields[0].options[0].label).toEqual(
      labels[0]
    );
    expect(formFields.formFields[1].fields[0].options[1].label).toEqual(
      labels[1]
    );
    expect(formFields.formFields[1].fields[0].options[2].label).toEqual(
      labels[2]
    );
    expect(formFields.formFields[1].fields[0].options[3].label).toEqual(
      labels[3]
    );
    expect(formFields.formFields[1].fields[0].options[4].label).toEqual(
      labels[4]
    );
    expect(formFields.formFields[1].fields[0].options[5].label).toEqual(
      labels[5]
    );
    expect(formFields.formFields[1].fields[0].options[6].label).toEqual(
      labels[6]
    );
    expect(formFields.formFields[1].fields[0].options[7].label).toEqual(
      labels[7]
    );
    expect(formFields.formFields[1].fields[0].options[8].label).toEqual(
      labels[8]
    );
    expect(formFields.formFields[1].fields[0].options[9].label).toEqual(
      labels[9]
    );
    expect(formFields.formFields[1].fields[0].options[10].label).toEqual(
      labels[10]
    );
    expect(formFields.formFields[1].fields[0].options[11].label).toEqual(
      labels[11]
    );
    expect(formFields.formFields[1].fields[0].options[12].label).toEqual(
      labels[12]
    );
    expect(formFields.formFields[1].fields[0].options[13].label).toEqual(
      labels[13]
    );
    expect(formFields.formFields[1].fields[0].options[14].label).toEqual(
      labels[14]
    );
    expect(formFields.formFields[1].fields[0].options[15].label).toEqual(
      labels[15]
    );
    expect(formFields.formFields[1].fields[0].options[16].label).toEqual(
      labels[16]
    );
    expect(formFields.formFields[1].fields[1].options[0].label).toEqual(
      labels[17]
    );
    expect(formFields.formFields[1].fields[1].options[1].label).toEqual(
      labels[18]
    );
  });

  it('First sub form Input type test', () => {
    expect(formFields.formFields[0].fields[0].controlType).toEqual('text');
    expect(formFields.formFields[0].fields[1].controlType).toEqual('checkbox');
    expect(formFields.formFields[0].fields[2].controlType).toEqual('textarea');
    expect(formFields.formFields[0].fields[3].controlType).toEqual('checkbox');
    expect(formFields.formFields[0].fields[4].controlType).toEqual('select');
    expect(formFields.formFields[0].fields[5].controlType).toEqual('select');
    expect(formFields.formFields[0].fields[6].controlType).toEqual('checkbox');
    expect(formFields.formFields[0].fields[7].controlType).toEqual('checkbox');
    expect(formFields.formFields[0].fields[8].controlType).toEqual('checkbox');
  });
  it('Second sub form Input type test', () => {
    expect(formFields.formFields[1].fields[0].controlType).toEqual('checkbox');
    expect(formFields.formFields[1].fields[1].controlType).toEqual('radio');
  });

  it('Required validation test', () => {
    expect(formFields.formFields[0].fields[0].validators).toContain(
      Validators.required,
      Validators.pattern
    );
    expect(formFields.formFields[0].fields[2].validators).toContain(
      Validators.required,
      Validators.pattern
    );
    expect(formFields.formFields[0].fields[4].validators).toContain(
      Validators.required,
      Validators.pattern
    );
    expect(formFields.formFields[0].fields[5].validators).toContain(
      Validators.required,
      Validators.pattern
    );
  });
  it('custom validation test', () => {
    let validatorList = formFields.formFields[0].fields[0].validators; // Tax class code
    validatorList.forEach((element, index) => {
      const testControl = new FormControl('!@#'); // Checking for invalid pattern
      const result = element(testControl);

      if (result) {
        expect(result.errorArray).toContain(
          'pw.fieldValidators.invalidErrorMsg'
        );
      }
    });

    validatorList = formFields.formFields[0].fields[2].validators; // Description
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
});
