import { inject, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  AddFocToCMPayload,
  AddManualFocToCMPayload,
  CmFocPayload,
  FocSchemeRequestDto,
  IssuepPendingFocPayload,
  KeepFocPendingPayload,
  LoadFocItemDetailsPayload,
  LoadPendingCMPayload,
  LoadPendingFocSchemesPayload,
  OrderDetailsForFOC,
  PendingCMResponsePayload,
  SubTransactionTypeEnum,
  TransactionTypeEnum,
  ValidateManualFocPayload,
  VerifyManualFocPayload
} from '@poss-web/shared/models';
import * as moment from 'moment';
import {
  AddFocToCm,
  AddManualFocToCm,
  ClearABFocSchemes,
  ClearABFocSchemesCount,
  ClearLoadFocSchemesForItems,
  ClearValidatedManualFoc,
  ClearVerifyManualFoc,
  DeleteABFocSchemes,
  DeleteFocFromCm,
  DeleteManualFocFromCm,
  GetFocAssignedToCm,
  GetManualFocAssignedToCm,
  IssuePendingFOC,
  KeepFocPending,
  LoadABFocSchemes,
  LoadABFocSchemesForItems,
  LoadConfiguredFocSchemes,
  LoadFocItemDetails,
  LoadFocSchemesAndItems,
  LoadFocSchemesForItems,
  LoadManuaFocItems,
  LoadManualFocItemDetails,
  LoadPendingFocCM,
  LoadPendingFocScheme,
  LoadSelectedABFocSchemes,
  LoadSelectedABFocSchemesCount,
  ResetFocData,
  SaveABFocSchemes,
  SetKeepFocPendingTrigger,
  SetSelectedFocCM,
  ValidateManualFoc,
  VerifyManualFoc
} from './foc.actions';
import { FocFacade } from './foc.facade';
import { FocState } from './foc.state';

describe('Foc Facade Testing Suite Action', () => {
  const initialState: FocState = {
    pendingFocCm: [],
    isLoadingPendingCM: false,

    selectedPendingCM: null,

    pendingFocSchemes: null,
    isLoadingPendingFocSchemes: false,

    focItemDetails: null,
    isLoadingFocItemDetails: false,
    hasFocItemDetails: false,

    pendingIssueResponse: null,
    isIssuingPendingFOC: false,

    focItems: [],
    totalFocEligibleWt: 0,
    totalFocIssuingWt: 0,
    focItemsCount: 0,

    isLoading: false,
    availableFocSchemes: [],

    focSchemes: null,
    manualFocSchemes: null,
    isFocSchemesLoaded: false,
    isFocSchemesForItems: false,

    focAddedToCM: [],
    isFocAdded: false,

    manualFocAddedToCM: [],
    isManualFocAdded: false,

    pendingFocSchemeIds: [],
    isFocKeptPending: false,

    keepFOCPendingTrigger: false,

    error: null,
    isCleared: false,

    ABFocSchemes: null,
    ABFocSchemesForItems: false,
    SelectedABFocSchemes: null,
    SaveFocSchemes: null,
    deleteABFOCSchemesRes: false,
    manualFocItemDetails: null,
    isLoadingManualFocItemDetails: false,
    hasManualFocItemDetails: false,
    manualFocValidationDetails: null,
    isManualFocVerified: false,
    SelectedABFocSchemesCount: 0
  };
  let focFacade: FocFacade;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), FocFacade]
    });
    focFacade = TestBed.inject(FocFacade);
  });
  describe('Value Accessor Methods testing', () => {
    it('should return the values', () => {
      expect(focFacade.getIsLoadingPendingCm()).toBeTruthy();
      expect(focFacade.getPendingCM()).toBeTruthy();
      expect(focFacade.getSelectedCmDetails()).toBeTruthy();
      expect(focFacade.getIsLoadingPendingFocScheme()).toBeTruthy();
      expect(focFacade.getPendingSchemes()).toBeTruthy();
      expect(focFacade.getIsLoadingFocItemDetails()).toBeTruthy();
      expect(focFacade.getHasFocItemDetails()).toBeTruthy();
      expect(focFacade.getFocItemDetails()).toBeTruthy();
      expect(focFacade.getIssuePendingFOCResponse()).toBeTruthy();
      expect(focFacade.getIsIssuingPendingFOC()).toBeTruthy();
      expect(focFacade.getFocItems()).toBeTruthy();
      expect(focFacade.getError()).toBeTruthy();

      expect(focFacade.getIsLoading()).toBeTruthy();
      expect(focFacade.getAvailableSchemes()).toBeTruthy();
      expect(focFacade.getFocSchemes()).toBeTruthy();
      expect(focFacade.getFocListAddedToCM()).toBeTruthy();
      expect(focFacade.getIsFocAdded()).toBeTruthy();
      expect(focFacade.getPendingFocSchemeIds()).toBeTruthy();
      expect(focFacade.getIsFocSchemesLoaded()).toBeTruthy();
      expect(focFacade.getKeepFocPendingTrigger()).toBeTruthy();
      expect(focFacade.getIsLoadingManualFocItemDetails()).toBeTruthy();
      expect(focFacade.getHasManualFocItemDetails()).toBeTruthy();
      expect(focFacade.getManualFocItemDetails()).toBeTruthy();
      expect(focFacade.getManualFocListAddedToCM()).toBeTruthy();
      expect(focFacade.getIsManualFocAdded()).toBeTruthy();
      expect(focFacade.getIsFocKeptPending()).toBeTruthy();
      expect(focFacade.getIsFocSchemesForItems()).toBeTruthy();
      expect(focFacade.getABFocSchemes()).toBeTruthy();
      expect(focFacade.getABFocSchemesForItems()).toBeTruthy();
      expect(focFacade.getSavedABFocSchemes()).toBeTruthy();
      expect(focFacade.getDeletedABFocSchemes()).toBeTruthy();
      expect(focFacade.getSelectedABFocSchemes()).toBeTruthy();
      expect(focFacade.getSelectedABFocSchemesCount()).toBeTruthy();
      expect(focFacade.getManualFocItems()).toBeTruthy();
      expect(focFacade.getIsManualFocValidated()).toBeTruthy();
      expect(focFacade.getIsManualFocVerified()).toBeTruthy();
    });
  });
  describe('Testing Action Dispatchers', () => {
    it('should dispatch loadOtherIssueHistory action', inject(
      [Store],
      store => {
        const dummyloadPendingCmPayload: LoadPendingCMPayload = {
          subTxnType: 'FOC_CM',
          txnType: 'CM',
          fiscalYear: '2019',
          docNo: null,
          customerId: null
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadPendingFocCM(dummyloadPendingCmPayload);
        focFacade.loadPendingCM(dummyloadPendingCmPayload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));

    it('should dispatch setSelectedFocCm action', inject([Store], store => {
      const payload: PendingCMResponsePayload = {
        customerId: 770,
        docDate: moment(),
        docNo: 11,
        finalValue: 1000,
        fiscalYear: 2000,
        id: 'AAA-BBBB-CCCC'
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SetSelectedFocCM(payload);
      focFacade.setSelectedFocCm(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));

    it('should dispatch loadPendingSchemes action', inject([Store], store => {
      const dummyLoadFocSchemesPayload: LoadPendingFocSchemesPayload = {
        id: 'AAAA-BBB-CCC-DDD',
        txnType: 'CM',
        subTxnType: 'NEW_CM'
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadPendingFocScheme(
        dummyLoadFocSchemesPayload
      );
      focFacade.loadPendingSchemes(dummyLoadFocSchemesPayload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));

    it('should dispatch loadFocItemDetails action', inject([Store], store => {
      const payload: LoadFocItemDetailsPayload = {
        itemsCodes: ['aaaa', 'bbbb']
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadFocItemDetails(payload);
      focFacade.loadFocItemDetails(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));

    it('should dispatch issuePendingFoc action', inject([Store], store => {
      const dummyIssuePendingFocPayload: IssuepPendingFocPayload = {
        refTxnId: '11111AAAAAa',
        subTxnType: 'FOC_CM',
        txnType: 'CM',
        payload: null
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new IssuePendingFOC(dummyIssuePendingFocPayload);
      focFacade.issuePendingFoc(dummyIssuePendingFocPayload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
    it('should dispatch resetFOCData action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ResetFocData();
      focFacade.resetFOCData();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
    it('should dispatch loadAvailableSchemes action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadConfiguredFocSchemes();
      focFacade.loadAvailableSchemes();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
    it('should dispatch loadFocSchemesAndItems action', inject(
      [Store],
      store => {
        const payload: FocSchemeRequestDto = {
          payload: {
            businessDate: 1111111111111,
            purchaseItems: [
              {
                itemCodes: ['itemcode1', 'itemCode2'],
                productGroupCode: '71',
                totalDiscount: 0,
                totalMaterialWeight: 12,
                totalMetalWeight: 12,
                totalStoneWeight: 12,
                totalTax: 1000,
                totalValue: 10000
              }
            ]
          }
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadFocSchemesAndItems(payload);
        focFacade.loadFocSchemesAndItems(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
    it('should dispatch addFocToCm action', inject([Store], store => {
      const payload: AddFocToCMPayload = {
        id: '11111111111111',
        subTxnType: 'NEW_CM',
        txnType: 'CM',
        focDetails: [
          {
            focItemDetails: [
              {
                employeeCode: 'rsocpd',
                itemCode: 'itemcode1',
                lotNumber: 'lotNumber1',
                totalQuantity: 1,
                totalWeight: 10,
                unitWeight: 1
              }
            ],
            focScheme: {
              eligibleFocItemDetails: {
                focItems: [{ itemCode: 'itemCode1', quantity: 1, weight: null }]
              },
              purchaseItemDetails: {
                purchaseItems: [
                  {
                    itemCodeList: ['itemCode1', 'itemCode2'],
                    productGroupCode: '71'
                  }
                ]
              },
              schemeDetailIds: ['1111111111111'],
              schemeId: 'schemeId1',
              schemeName: 'schemename1',
              schemeCategory: 'VALUE_BASED'
            }
          }
        ]
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new AddFocToCm(payload);
      focFacade.addFocToCm(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
    it('should dispatch deleteFoc action', inject([Store], store => {
      const payload: CmFocPayload = {
        id: '11111111111111',
        subTxnType: 'NEW_CM',
        txnType: 'CM'
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new DeleteFocFromCm(payload);
      focFacade.deleteFoc(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
    it('should dispatch getFocAssignedToCM action', inject([Store], store => {
      const payload: CmFocPayload = {
        id: '11111111111111',
        subTxnType: 'NEW_CM',
        txnType: 'CM'
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new GetFocAssignedToCm(payload);
      focFacade.getFocAssignedToCM(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
    it('should dispatch keepFocPending action', inject([Store], store => {
      const payload: KeepFocPendingPayload = {
        id: '11111111111111',
        subTxnType: 'NEW_CM',
        txnType: 'CM',
        focSchemes: [
          {
            eligibleFocItemDetails: {
              focItems: [{ itemCode: 'itemCode1', quantity: 1, weight: null }]
            },
            purchaseItemDetails: {
              purchaseItems: [
                {
                  itemCodeList: ['itemCode1', 'itemCode2'],
                  productGroupCode: '71'
                }
              ]
            },
            schemeDetailIds: ['1111111111111'],
            schemeId: 'schemeId1',
            schemeName: 'schemename1',
            schemeCategory: 'VALUE_BASED'
          }
        ]
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new KeepFocPending(payload);
      focFacade.keepFocPending(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
    it('should dispatch setKeepFocTrigger action', inject([Store], store => {
      const payload = true;
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SetKeepFocPendingTrigger(payload);
      focFacade.setKeepFocTrigger(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));

    it('should dispatch loadManualFocItemDetails action', inject(
      [Store],
      store => {
        const payload: LoadFocItemDetailsPayload = {
          itemsCodes: ['aaaa', 'bbbb']
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadManualFocItemDetails(payload);
        focFacade.loadManualFocItemDetails(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));

    it('should dispatch loadManualFocItems action', inject([Store], store => {
      const payload = '894848484';
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadManuaFocItems(payload);
      focFacade.loadManualFocItems(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));

    it('should dispatch addManualFocToCm action', inject([Store], store => {
      const payload: AddManualFocToCMPayload = {
        id: '11111111111111',
        subTxnType: 'NEW_CM',
        txnType: 'CM',
        focDetails: [
          {
            focItemDetails: [
              {
                employeeCode: 'rsocpd',
                itemCode: 'itemcode1',
                lotNumber: 'lotNumber1',
                totalQuantity: 1,
                totalWeight: 10,
                unitWeight: 1
              }
            ],
            focScheme: {
              eligibleFocItemDetails: {
                focItems: [{ itemCode: 'itemCode1', quantity: 1, weight: null }]
              },

              schemeId: 'schemeId1',
              schemeName: 'schemename1'
            }
          }
        ]
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new AddManualFocToCm(payload);
      focFacade.addManualFocToCm(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));

    it('should dispatch deleteManualFoc action', inject([Store], store => {
      const payload: CmFocPayload = {
        id: '11111111111111',
        subTxnType: 'NEW_CM',
        txnType: 'CM'
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new DeleteManualFocFromCm(payload);
      focFacade.deleteManualFoc(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
    it('should dispatch getManualFocAssignedToCM action', inject(
      [Store],
      store => {
        const payload: CmFocPayload = {
          id: '11111111111111',
          subTxnType: 'NEW_CM',
          txnType: 'CM'
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new GetManualFocAssignedToCm(payload);
        focFacade.getManualFocAssignedToCM(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));

    it('should dispatch loadFocSchemesForItems action', inject(
      [Store],
      store => {
        const payload: FocSchemeRequestDto = {
          payload: {
            businessDate: 1111111111111,
            purchaseItems: [
              {
                itemCodes: ['itemcode1', 'itemCode2'],
                productGroupCode: '71',
                totalDiscount: 0,
                totalMaterialWeight: 12,
                totalMetalWeight: 12,
                totalStoneWeight: 12,
                totalTax: 1000,
                totalValue: 10000
              }
            ]
          }
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadFocSchemesForItems(payload);
        focFacade.loadFocSchemesForItems(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));

    it('should dispatch clearFocSchemesForItems action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ClearLoadFocSchemesForItems();
        focFacade.clearFocSchemesForItems();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));

    it('should dispatch validateManualFoc action', inject([Store], store => {
      const payload: ValidateManualFocPayload = {
        locationCode: 'CPD',
        CMNumber: '3234',
        fiscalYear: '2022'
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ValidateManualFoc(payload);
      focFacade.validateManualFoc(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));

    it('should dispatch verifyManualFoc action', inject([Store], store => {
      const payload: VerifyManualFocPayload = {
        customerID: '234',
        manualFocEndDate: 222222222222222,
        manualFocStartDate: 3425353555
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new VerifyManualFoc(payload);
      focFacade.verifyManualFoc(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));

    it('should dispatch clearVerifyManualFoc action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ClearVerifyManualFoc();
      focFacade.clearVerifyManualFoc();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));

    it('should dispatch clearValidatedManualFoc action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ClearValidatedManualFoc();
        focFacade.clearValidatedManualFoc();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));

    // AB FOC
    it('should dispatch loadABFocSchemes action', inject([Store], store => {
      const payload: FocSchemeRequestDto = {
        payload: {
          businessDate: 1111111111111,
          purchaseItems: [
            {
              itemCodes: ['itemcode1', 'itemCode2'],
              productGroupCode: '71',
              totalDiscount: 0,
              totalMaterialWeight: 12,
              totalMetalWeight: 12,
              totalStoneWeight: 12,
              totalTax: 1000,
              totalValue: 10000
            }
          ]
        }
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadABFocSchemes(payload);
      focFacade.loadABFocSchemes(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));

    it('should dispatch loadABFocSchemesForItems action', inject(
      [Store],
      store => {
        const payload: FocSchemeRequestDto = {
          payload: {
            businessDate: 1111111111111,
            purchaseItems: [
              {
                itemCodes: ['itemcode1', 'itemCode2'],
                productGroupCode: '71',
                totalDiscount: 0,
                totalMaterialWeight: 12,
                totalMetalWeight: 12,
                totalStoneWeight: 12,
                totalTax: 1000,
                totalValue: 10000
              }
            ]
          }
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadABFocSchemesForItems(payload);
        focFacade.loadABFocSchemesForItems(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));

    it('should dispatch saveABFocSchemes action', inject([Store], store => {
      const payload: OrderDetailsForFOC = {
        txnType: TransactionTypeEnum.AB,
        subTxnType: SubTransactionTypeEnum.NEW_AB
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SaveABFocSchemes(payload);
      focFacade.saveABFocSchemes(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));

    it('should dispatch loadSelectedABFocSchemes action', inject(
      [Store],
      store => {
        const payload: OrderDetailsForFOC = {
          txnType: TransactionTypeEnum.AB,
          subTxnType: SubTransactionTypeEnum.NEW_AB
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadSelectedABFocSchemes(payload);
        focFacade.loadSelectedABFocSchemes(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));

    it('should dispatch loadSelectedABFocSchemesCount action', inject(
      [Store],
      store => {
        const payload: OrderDetailsForFOC = {
          txnType: TransactionTypeEnum.AB,
          subTxnType: SubTransactionTypeEnum.NEW_AB
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadSelectedABFocSchemesCount(payload);
        focFacade.loadSelectedABFocSchemesCount(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));

    it('should dispatch deleteABFocSchemes action', inject([Store], store => {
      const payload: OrderDetailsForFOC = {
        txnType: TransactionTypeEnum.AB,
        subTxnType: SubTransactionTypeEnum.NEW_AB
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new DeleteABFocSchemes(payload);
      focFacade.deleteABFocSchemes(payload);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));

    it('should dispatch clearABFocSchemes action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ClearABFocSchemes();
      focFacade.clearABFocSchemes();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));

    it('should dispatch clearABFocSchemesCount action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ClearABFocSchemesCount();
        focFacade.clearABFocSchemesCount();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
});
