import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence } from '@nrwl/angular';
import {
  ABFocSchemeDetailsDto,
  AddFocToCMPayload,
  AddFocToCmResponsePayload,
  AddManualFocToCMPayload,
  AvailableSchemesPayload,
  CmFocPayload,
  CustomErrors,
  FocItemDetailsResponsePayload,
  FocSchemeDetailsDto,
  FocSchemeRequestDto,
  IssuePendingFocConfirmationPayload,
  IssuepPendingFocPayload,
  KeepFocPendingPayload,
  LoadFocItemDetailsPayload,
  LoadPendingCMPayload,
  LoadPendingFocSchemesPayload,
  ManualFocDetailsDto,
  OrderDetailsForFOC,
  PendingCMResponsePayload,
  PendingFocSchemesResponsePayload,
  SubTransactionTypeEnum,
  TransactionTypeEnum,
  ValidateManualFocPayload,
  VerifyManualFocPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import { cold, hot } from 'jasmine-marbles';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { FocService } from '../foc.service';
import {
  AddFocToCm,
  AddFocToCmFailure,
  AddFocToCmSuccess,
  AddManualFocToCm,
  AddManualFocToCmFailure,
  AddManualFocToCmSuccess,
  DeleteABFocSchemes,
  DeleteABFocSchemesFailure,
  DeleteABFocSchemesSuccess,
  DeleteFocFromCm,
  DeleteFocFromCmFailure,
  DeleteFocFromCmSuccess,
  DeleteManualFocFromCm,
  DeleteManualFocFromCmFailure,
  DeleteManualFocFromCmSuccess,
  GetFocAssignedToCm,
  GetFocAssignedToCmFailure,
  GetFocAssignedToCmSuccess,
  GetManualFocAssignedToCm,
  GetManualFocAssignedToCmFailure,
  GetManualFocAssignedToCmSuccess,
  IssuePendingFOC,
  IssuePendingFOCFailure,
  IssuePendingFOCSuccess,
  KeepFocPending,
  KeepFocPendingFailure,
  KeepFocPendingSuccess,
  LoadABFocSchemes,
  LoadABFocSchemesFailure,
  LoadABFocSchemesForItems,
  LoadABFocSchemesForItemsFailure,
  LoadABFocSchemesForItemsSuccess,
  LoadABFocSchemesSuccess,
  LoadConfiguredFocSchemes,
  LoadConfiguredFocSchemesFailure,
  LoadConfiguredFocSchemesSuccess,
  LoadFocItemDetails,
  LoadFocItemDetailsFailure,
  LoadFocItemDetailsSuccess,
  LoadFocSchemesAndItems,
  LoadFocSchemesAndItemsFailure,
  LoadFocSchemesAndItemsSuccess,
  LoadFocSchemesForItems,
  LoadFocSchemesForItemsFailure,
  LoadFocSchemesForItemsSuccess,
  LoadManuaFocItems,
  LoadManuaFocItemsFailure,
  LoadManuaFocItemsSuccess,
  LoadManualFocItemDetails,
  LoadManualFocItemDetailsFailure,
  LoadManualFocItemDetailsSuccess,
  LoadPendingFocCM,
  LoadPendingFocCMFailure,
  LoadPendingFocCMSuccess,
  LoadPendingFocScheme,
  LoadPendingFocSchemeFailure,
  LoadPendingFocSchemeSuccess,
  LoadSelectedABFocSchemes,
  LoadSelectedABFocSchemesCount,
  LoadSelectedABFocSchemesCountFailure,
  LoadSelectedABFocSchemesCountSuccess,
  LoadSelectedABFocSchemesFailure,
  LoadSelectedABFocSchemesSuccess,
  SaveABFocSchemes,
  SaveABFocSchemesFailure,
  SaveABFocSchemesSuccess,
  ValidateManualFoc,
  ValidateManualFocFailure,
  ValidateManualFocSuccess,
  VerifyManualFoc,
  VerifyManualFocFailure,
  VerifyManualFocSuccess
} from './foc.actions';
import { FocEffects } from './foc.effects';
import { FOC_FEATURE_KEY } from './foc.reducer';

const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
  Error('Some Error')
);
const dummyloadPendingCmPayload: LoadPendingCMPayload = {
  subTxnType: 'FOC_CM',
  txnType: 'CM',
  fiscalYear: '2019',
  docNo: null,
  customerId: null
};
const dummyPendingFocCm: PendingCMResponsePayload[] = [
  {
    customerId: 770,
    docDate: moment(),
    docNo: 11,
    finalValue: 1000,
    fiscalYear: 2000,
    id: 'AAA-BBBB-CCCC'
  },
  {
    customerId: 770,
    docDate: moment(),
    docNo: 22,
    finalValue: 1000,
    fiscalYear: 2000,
    id: 'AAA-BBBB-CCCC-DDD'
  }
];

const dummyLoadFocSchemesPayload: LoadPendingFocSchemesPayload = {
  id: 'AAAA-BBB-CCC-DDD',
  txnType: 'CM',
  subTxnType: 'NEW_CM'
};
const dummyPendingFocSchemes = {
  focSchemes: [
    {
      id: 'AD06C897-9DEB-44E6-80D2-FCFB9C8048FA',
      salesTxnId: '4216F1D5-7060-4430-822E-B0DA6EAFE48B',
      eligibleWeight: 5,
      eligibleQuantity: null,
      purchaseItems: {
        purchaseItemList: [
          {
            productGroupCode: '71',
            itemCodeList: ['511107CSOGAA01', '511107CTEGAA01']
          }
        ]
      },
      eligibleFocItems: {
        eligibleFocItemList: [
          {
            itemCode: '60102ZFARAP11',
            unitWeight: 5
          },
          {
            itemCode: '600102ZFARAP22',
            unitWeight: 5
          }
        ]
      },
      status: 'PENDING'
    },
    {
      id: 'BD06C897-9DEB-44E6-80D2-FCFB9C8048FA',
      salesTxnId: '3216F1D5-7060-4430-822E-B0DA6EAFE48B',
      eligibleWeight: 5,
      eligibleQuantity: null,

      eligibleFocItems: {
        eligibleFocItemList: [
          {
            itemCode: '600102ZFARAP00',
            unitWeight: 5
          }
        ]
      },
      purchaseItems: {
        purchaseItemList: [
          {
            productGroupCode: '71',
            itemCodeList: ['511107CSOGAA00', '511107CTEGAA00']
          }
        ]
      },

      status: 'PENDING'
    }
  ]
};
const dummyItemDetailsPayload: FocItemDetailsResponsePayload[] = [
  {
    binCode: 'FOC',
    itemCode: '600102ZFARAP00',
    lotNumber: '110011ABB',
    availableQuantity: 10,
    stdWeight: 5,
    unitWeight: 1,
    weightDetials: {}
  },
  {
    binCode: 'FOC',
    itemCode: '600102ZFARAP00',
    lotNumber: '110011ACC',
    availableQuantity: 10,
    stdWeight: 5,
    unitWeight: 1,
    weightDetials: {}
  },
  {
    binCode: 'FOC',
    itemCode: '60102ZFARAP11',
    lotNumber: '110011ADD',
    availableQuantity: 10,
    stdWeight: 5,
    unitWeight: 1,
    weightDetials: {}
  },
  {
    binCode: 'FOC',
    itemCode: '60102ZFARAP11',
    lotNumber: '110011AEE',
    availableQuantity: 10,
    stdWeight: 5,
    unitWeight: 1,
    weightDetials: {}
  },
  {
    binCode: 'FOC',
    itemCode: '600102ZFARAP22',
    lotNumber: '110011AFF',
    availableQuantity: 10,
    stdWeight: 5,
    unitWeight: 1,
    weightDetials: {}
  },
  {
    binCode: 'FOC',
    itemCode: '60102ZFARAP11',
    lotNumber: '110011ADD',
    availableQuantity: 10,
    stdWeight: 5,
    unitWeight: 1,
    weightDetials: {}
  }
];
const dummyIssuePendingFocPayload: IssuepPendingFocPayload = {
  refTxnId: '11111AAAAAa',
  subTxnType: 'FOC_CM',
  txnType: 'CM',
  payload: null
};
const dummyIssueConfirmationPayload: IssuePendingFocConfirmationPayload = {
  docNo: 111,
  fiscalYear: 0,
  focItems: [
    {
      binCode: 'string',
      employeeCode: 'string',
      focSchemeId: 'string',
      id: 'string',
      inventoryId: 'string',
      itemCode: 'string',
      lotNumber: 'string',
      rowId: 0,
      salesTxnId: 'string',
      status: 'string',
      totalQuantity: 0,
      totalWeight: 0,
      unitWeight: 0
    }
  ],
  id: 'string',
  refTxnId: 'string',
  status: 'string',
  subTxnType: 'string',
  txnType: 'string'
};
describe('Foc Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: FocEffects;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  const focServiceSpy = jasmine.createSpyObj<FocService>([
    'getPendingCM',
    'getFocSchemes',
    'getFocItemDetails',
    'issuePendingFOC',
    'getConfiguredSchemes',
    'getSchemesAndItems',
    'addFocToCM',
    'deleteFOC',
    'getAssignedFOC',
    'keepFocPending',
    'verifyManualFoc',
    'validateManualFoc',
    'getManualFocItem',
    'addManualFocToCM',
    'getAssignedManualFOC',
    'getABFOCSchemes',
    'getSaveABFOCSchemes',
    'getDeleteABFOCSchemes',
    'getSelectedABFOCSchemes'
  ]);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FocEffects,
        DataPersistence,
        provideMockStore({
          initialState: {
            [FOC_FEATURE_KEY]: initialState
          }
        }),
        provideMockActions(() => actions$),

        {
          provide: POSS_WEB_API_URL,
          useValue: ''
        },
        {
          provide: POSS_WEB_CACHING_STRATEGY,
          useValue: []
        },
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: FocService,
          useValue: focServiceSpy
        }
      ]
    });

    effect = TestBed.inject(FocEffects);
    // focService = TestBed.get(FocService);
  });
  describe('loadPendingCM', () => {
    it('should return a stream of pendingFocCms', () => {
      const action = new LoadPendingFocCM(dummyloadPendingCmPayload);
      const outcome = new LoadPendingFocCMSuccess(dummyPendingFocCm);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: dummyPendingFocCm
      });
      focServiceSpy.getPendingCM.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPendingCM$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadPendingFocCM(dummyloadPendingCmPayload);
      const error = new Error('some error');
      const outcome = new LoadPendingFocCMFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focServiceSpy.getPendingCM.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPendingCM$).toBeObservable(expected);
    });
  });

  describe('loadPendingFocScheme', () => {
    it('should return a stream of pending FOc Schemes', () => {
      const payload: PendingFocSchemesResponsePayload = {
        focSchemes: [
          {
            eligibleFocItemDetails: {
              focItems: [{ itemCode: '111111', quantity: 1, weight: null }]
            },
            eligibleWeight: 1,
            eligibleQuantity: null,
            id: '111122222',
            purchaseItemDetails: {
              purchaseItems: [
                {
                  itemCodeList: ['itemCode1', 'itemCode2'],
                  productGroupCode: '71'
                }
              ]
            },
            schemeName: 'Performace Scheme',
            salesTxnId: '222221111111',
            status: 'OPEN'
          }
        ]
      };
      const action = new LoadPendingFocScheme(dummyLoadFocSchemesPayload);
      const outcome = new LoadPendingFocSchemeSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      focServiceSpy.getFocSchemes.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPendingFocScheme$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadPendingFocScheme(dummyLoadFocSchemesPayload);
      const error = new Error('some error');
      const outcome = new LoadPendingFocSchemeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focServiceSpy.getFocSchemes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPendingFocScheme$).toBeObservable(expected);
    });
  });
  describe('loadFocItemDetails', () => {
    const payload: LoadFocItemDetailsPayload = {
      itemsCodes: ['aaaa', 'bbbb']
    };
    it('should return a stream of itemDetails', () => {
      const action = new LoadFocItemDetails(payload);
      const outcome = new LoadFocItemDetailsSuccess(dummyItemDetailsPayload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: dummyItemDetailsPayload
      });
      focServiceSpy.getFocItemDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadFocItemDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadFocItemDetails(payload);
      const error = new Error('some error');
      const outcome = new LoadFocItemDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focServiceSpy.getFocItemDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadFocItemDetails$).toBeObservable(expected);
    });
  });

  describe('issuePendingFOC', () => {
    it('should return issue confirmation payload', () => {
      const action = new IssuePendingFOC(dummyIssuePendingFocPayload);
      const outcome = new IssuePendingFOCSuccess(dummyIssueConfirmationPayload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: dummyIssueConfirmationPayload
      });
      focServiceSpy.issuePendingFOC.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.issuePendingFOC$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new IssuePendingFOC(dummyIssuePendingFocPayload);
      const error = new Error('some error');
      const outcome = new IssuePendingFOCFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focServiceSpy.issuePendingFOC.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.issuePendingFOC$).toBeObservable(expected);
    });
  });
  describe('loadAvailableSchemes', () => {
    it('should return issue AvailableSchemes payload', () => {
      const action = new LoadConfiguredFocSchemes();
      const payload: AvailableSchemesPayload[] = [
        {
          description: 'Foc Scheme',
          isActive: true,
          id: '111111111111',
          name: 'focScheme1'
        }
      ];
      const outcome = new LoadConfiguredFocSchemesSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      focServiceSpy.getConfiguredSchemes.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadAvailableSchemes$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadConfiguredFocSchemes();
      const error = new Error('some error');
      const outcome = new LoadConfiguredFocSchemesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focServiceSpy.getConfiguredSchemes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadAvailableSchemes$).toBeObservable(expected);
    });
  });
  describe('loadFocSchemesAndItems', () => {
    it('should return schemes and items payload', () => {
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
      const res: FocSchemeDetailsDto[] = [
        {
          focItems: [{ itemCode: '111111', quantity: 1, weight: null }],
          purchaseItems: [
            {
              productGroupCode: '71',
              itemCodeList: ['511107CSOGAA01', '511107CTEGAA01']
            }
          ],
          schemeDetailId: 'schemeDetailId1',
          schemeId: 'schemeId1',
          schemeName: 'focScheme1',
          schemeCategory: 'VALUE_BASED'
        }
      ];
      const action = new LoadFocSchemesAndItems(payload);

      const outcome = new LoadFocSchemesAndItemsSuccess(res);

      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: res
      });
      focServiceSpy.getSchemesAndItems.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadFocSchemesAndItems$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
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
      const action = new LoadFocSchemesAndItems(payload);
      const error = new Error('some error');
      const outcome = new LoadFocSchemesAndItemsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focServiceSpy.getSchemesAndItems.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadFocSchemesAndItems$).toBeObservable(expected);
    });
  });
  describe('addFocToCM', () => {
    it('should return schemes and items payload', () => {
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
      const res: AddFocToCmResponsePayload[] = [
        {
          binCode: 'Bincode',
          employeeCode: 'rsocpd',
          focSchemeId: 'focScheeId',
          id: '11111111111',
          inventoryId: '222222222',
          itemCode: 'itemcode1',
          lotNumber: 'lotnumber',
          rowId: 1,
          salesTxnId: '444444444444',
          status: 'OPEN',
          totalQuantity: 2,
          totalWeight: 20,
          unitWeight: 5,
          isManualFOC: false
        }
      ];
      const action = new AddFocToCm(payload);

      const outcome = new AddFocToCmSuccess(res);

      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: res
      });
      focServiceSpy.addFocToCM.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.addFocToCM$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
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
      const action = new AddFocToCm(payload);
      const error = new Error('some error');
      const outcome = new AddFocToCmFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focServiceSpy.addFocToCM.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.addFocToCM$).toBeObservable(expected);
    });
  });
  describe('deleteFoc', () => {
    it('should return schemes and items payload', () => {
      const payload: CmFocPayload = {
        id: '11111111111111',
        subTxnType: 'NEW_CM',
        txnType: 'CM'
      };
      const res = true;
      const action = new DeleteFocFromCm(payload);

      const outcome = new DeleteFocFromCmSuccess(res);

      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: res
      });
      focServiceSpy.deleteFOC.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.deleteFoc$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const payload: CmFocPayload = {
        id: '11111111111111',
        subTxnType: 'NEW_CM',
        txnType: 'CM'
      };
      const action = new DeleteFocFromCm(payload);
      const error = new Error('some error');
      const outcome = new DeleteFocFromCmFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focServiceSpy.deleteFOC.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.deleteFoc$).toBeObservable(expected);
    });
  });
  describe('getAssignedFoc', () => {
    it('should return schemes and items payload', () => {
      const payload: CmFocPayload = {
        id: '11111111111111',
        subTxnType: 'NEW_CM',
        txnType: 'CM'
      };
      const res: AddFocToCmResponsePayload[] = [
        {
          binCode: 'Bincode',
          employeeCode: 'rsocpd',
          focSchemeId: 'focScheeId',
          id: '11111111111',
          inventoryId: '222222222',
          itemCode: 'itemcode1',
          lotNumber: 'lotnumber',
          rowId: 1,
          salesTxnId: '444444444444',
          status: 'OPEN',
          totalQuantity: 2,
          totalWeight: 20,
          unitWeight: 5,
          isManualFOC: false
        }
      ];

      const action = new GetFocAssignedToCm(payload);

      const outcome = new GetFocAssignedToCmSuccess(res);

      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: res
      });
      focServiceSpy.getAssignedFOC.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.getAssignedFoc$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const payload: CmFocPayload = {
        id: '11111111111111',
        subTxnType: 'NEW_CM',
        txnType: 'CM'
      };
      const action = new GetFocAssignedToCm(payload);
      const error = new Error('some error');
      const outcome = new GetFocAssignedToCmFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focServiceSpy.getAssignedFOC.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.getAssignedFoc$).toBeObservable(expected);
    });
  });
  describe('keepFocPending', () => {
    it('should return schemes and items payload', () => {
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
      const res = ['1111111', '2222222222222'];

      const action = new KeepFocPending(payload);

      const outcome = new KeepFocPendingSuccess(res);

      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: res
      });
      focServiceSpy.keepFocPending.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.keepFocPending$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
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
      const action = new KeepFocPending(payload);
      const error = new Error('some error');
      const outcome = new KeepFocPendingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focServiceSpy.keepFocPending.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.keepFocPending$).toBeObservable(expected);
    });
  });
  describe('loadManualFocItemDetails', () => {
    const payload: LoadFocItemDetailsPayload = {
      itemsCodes: ['aaaa', 'bbbb']
    };
    it('should return a stream of itemDetails', () => {
      const action = new LoadManualFocItemDetails(payload);
      const outcome = new LoadManualFocItemDetailsSuccess(
        dummyItemDetailsPayload
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: dummyItemDetailsPayload
      });
      focServiceSpy.getFocItemDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadManualFocItemDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadManualFocItemDetails(payload);
      const error = new Error('some error');
      const outcome = new LoadManualFocItemDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focServiceSpy.getFocItemDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadManualFocItemDetails$).toBeObservable(expected);
    });
  });
  describe('ValidateManualFoc', () => {
    const payload: ValidateManualFocPayload = {
      locationCode: 'CPD',
      CMNumber: '2345',
      fiscalYear: '2021'
    };
    it('should return a stream of itemDetails', () => {
      const action = new ValidateManualFoc(payload);
      const outcome = new ValidateManualFocSuccess(null);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: null
      });
      focServiceSpy.validateManualFoc.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.isManualFocValidated$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new ValidateManualFoc(payload);
      const error = new Error('some error');
      const outcome = new ValidateManualFocFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focServiceSpy.validateManualFoc.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.isManualFocValidated$).toBeObservable(expected);
    });
  });
  describe('VerifyManualFoc', () => {
    const payload: VerifyManualFocPayload = {
      customerID: '3322',
      manualFocEndDate: 242135255,
      manualFocStartDate: 34623464442
    };
    it('should return a stream of itemDetails', () => {
      const action = new VerifyManualFoc(payload);
      const outcome = new VerifyManualFocSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: null
      });
      focServiceSpy.verifyManualFoc.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.isManualFocVefied$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new VerifyManualFoc(payload);
      const error = new Error('some error');
      const outcome = new VerifyManualFocFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focServiceSpy.verifyManualFoc.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.isManualFocVefied$).toBeObservable(expected);
    });
  });
  describe('LoadManuaFocItems', () => {
    it('should return schemes and items payload', () => {
      const payload = '345923599';
      const res: ManualFocDetailsDto[] = [
        {
          focItems: [{ itemCode: '111111', quantity: 1, weight: null }],
          manualFOCEndDate: moment(),
          manualFOCStartDate: moment(),
          schemeId: 'schemeId1',
          schemeName: 'focScheme1',
          configDetails: {}
        }
      ];
      const action = new LoadManuaFocItems(payload);

      const outcome = new LoadManuaFocItemsSuccess(res);

      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: res
      });
      focServiceSpy.getManualFocItem.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadManualFocItems$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const payload = '345923599';
      const action = new LoadManuaFocItems(payload);
      const error = new Error('some error');
      const outcome = new LoadManuaFocItemsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focServiceSpy.getManualFocItem.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadManualFocItems$).toBeObservable(expected);
    });
  });
  describe('AddManualFocToCm', () => {
    it('should return schemes and items payload', () => {
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
      const res: AddFocToCmResponsePayload[] = [
        {
          binCode: 'Bincode',
          employeeCode: 'rsocpd',
          focSchemeId: 'focScheeId',
          id: '11111111111',
          inventoryId: '222222222',
          itemCode: 'itemcode1',
          lotNumber: 'lotnumber',
          rowId: 1,
          salesTxnId: '444444444444',
          status: 'OPEN',
          totalQuantity: 2,
          totalWeight: 20,
          unitWeight: 5,
          isManualFOC: false
        }
      ];
      const action = new AddManualFocToCm(payload);

      const outcome = new AddManualFocToCmSuccess(res);

      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: res
      });
      focServiceSpy.addManualFocToCM.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.addManualFocToCM$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
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
      const action = new AddManualFocToCm(payload);
      const error = new Error('some error');
      const outcome = new AddManualFocToCmFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focServiceSpy.addManualFocToCM.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.addManualFocToCM$).toBeObservable(expected);
    });
  });
  describe('deleteManualFoc', () => {
    it('should return schemes and items payload', () => {
      const payload: CmFocPayload = {
        id: '11111111111111',
        subTxnType: 'NEW_CM',
        txnType: 'CM'
      };
      const res = true;
      const action = new DeleteManualFocFromCm(payload);

      const outcome = new DeleteManualFocFromCmSuccess(res);

      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: res
      });
      focServiceSpy.deleteFOC.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.deleteManualFoc$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const payload: CmFocPayload = {
        id: '11111111111111',
        subTxnType: 'NEW_CM',
        txnType: 'CM'
      };
      const action = new DeleteManualFocFromCm(payload);
      const error = new Error('some error');
      const outcome = new DeleteManualFocFromCmFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focServiceSpy.deleteFOC.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.deleteManualFoc$).toBeObservable(expected);
    });
  });
  describe('getAssignedManualFoc', () => {
    it('should return schemes and items payload', () => {
      const payload: CmFocPayload = {
        id: '11111111111111',
        subTxnType: 'NEW_CM',
        txnType: 'CM'
      };
      const res: AddFocToCmResponsePayload[] = [
        {
          binCode: 'Bincode',
          employeeCode: 'rsocpd',
          focSchemeId: 'focScheeId',
          id: '11111111111',
          inventoryId: '222222222',
          itemCode: 'itemcode1',
          lotNumber: 'lotnumber',
          rowId: 1,
          salesTxnId: '444444444444',
          status: 'OPEN',
          totalQuantity: 2,
          totalWeight: 20,
          unitWeight: 5,
          isManualFOC: false
        }
      ];

      const action = new GetManualFocAssignedToCm(payload);

      const outcome = new GetManualFocAssignedToCmSuccess(res);

      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: res
      });
      focServiceSpy.getAssignedManualFOC.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.getAssignedManualFoc$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const payload: CmFocPayload = {
        id: '11111111111111',
        subTxnType: 'NEW_CM',
        txnType: 'CM'
      };
      const action = new GetManualFocAssignedToCm(payload);
      const error = new Error('some error');
      const outcome = new GetManualFocAssignedToCmFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focServiceSpy.getAssignedManualFOC.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.getAssignedManualFoc$).toBeObservable(expected);
    });
  });
  describe('LoadFocSchemesForItems', () => {
    it('should return schemes and items payload', () => {
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
      const res: FocSchemeDetailsDto[] = [
        {
          focItems: [{ itemCode: '111111', quantity: 1, weight: null }],
          purchaseItems: [
            {
              productGroupCode: '71',
              itemCodeList: ['511107CSOGAA01', '511107CTEGAA01']
            }
          ],
          schemeDetailId: 'schemeDetailId1',
          schemeId: 'schemeId1',
          schemeName: 'focScheme1',
          schemeCategory: 'VALUE_BASED'
        }
      ];
      const action = new LoadFocSchemesForItems(payload);

      const outcome = new LoadFocSchemesForItemsSuccess(res);

      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: res
      });
      focServiceSpy.getSchemesAndItems.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadFocSchemesForItems$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
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
      const action = new LoadFocSchemesForItems(payload);
      const error = new Error('some error');
      const outcome = new LoadFocSchemesForItemsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focServiceSpy.getSchemesAndItems.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadFocSchemesForItems$).toBeObservable(expected);
    });
  });

  // AB FOC
  describe('LoadABFocSchemes', () => {
    it('should return schemes and items payload', () => {
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
      const res: FocSchemeDetailsDto[] = [
        {
          focItems: [{ itemCode: '111111', quantity: 1, weight: null }],
          purchaseItems: [
            {
              productGroupCode: '71',
              itemCodeList: ['511107CSOGAA01', '511107CTEGAA01']
            }
          ],
          schemeDetailId: 'schemeDetailId1',
          schemeId: 'schemeId1',
          schemeName: 'focScheme1',
          schemeCategory: 'VALUE_BASED'
        }
      ];
      const action = new LoadABFocSchemes(payload);

      const outcome = new LoadABFocSchemesSuccess(res);

      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: res
      });
      focServiceSpy.getABFOCSchemes.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadABFocSchemes$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
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
      const action = new LoadABFocSchemes(payload);
      const error = new Error('some error');
      const outcome = new LoadABFocSchemesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focServiceSpy.getABFOCSchemes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadABFocSchemes$).toBeObservable(expected);
    });
  });

  describe('LoadABFocSchemesForItems', () => {
    it('should return schemes and items payload', () => {
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
      const res: FocSchemeDetailsDto[] = [
        {
          focItems: [{ itemCode: '111111', quantity: 1, weight: null }],
          purchaseItems: [
            {
              productGroupCode: '71',
              itemCodeList: ['511107CSOGAA01', '511107CTEGAA01']
            }
          ],
          schemeDetailId: 'schemeDetailId1',
          schemeId: 'schemeId1',
          schemeName: 'focScheme1',
          schemeCategory: 'VALUE_BASED'
        }
      ];
      const action = new LoadABFocSchemesForItems(payload);

      const outcome = new LoadABFocSchemesForItemsSuccess(res);

      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: res
      });
      focServiceSpy.getABFOCSchemes.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadABFocSchemesForItems$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
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
      const action = new LoadABFocSchemesForItems(payload);
      const error = new Error('some error');
      const outcome = new LoadABFocSchemesForItemsFailure();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focServiceSpy.getABFOCSchemes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadABFocSchemesForItems$).toBeObservable(expected);
    });
  });

  describe('SaveABFocSchemes', () => {
    it('should return schemes and items payload', () => {
      const payload: OrderDetailsForFOC = {
        txnType: TransactionTypeEnum.AB,
        subTxnType: SubTransactionTypeEnum.NEW_AB
      };
      const res: ABFocSchemeDetailsDto[] = [
        {
          schemeDetailId: '123',
          schemeId: '345',
          schemeName: 'scheme1',
          schemeCategory: 'VALUE_BASED',
          weight: 0.5,
          id: '789'
        }
      ];
      const action = new SaveABFocSchemes(payload);

      const outcome = new SaveABFocSchemesSuccess(res);

      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: res
      });
      focServiceSpy.getSaveABFOCSchemes.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveABFocSchemes$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const payload: OrderDetailsForFOC = {
        txnType: TransactionTypeEnum.AB,
        subTxnType: SubTransactionTypeEnum.NEW_AB
      };
      const action = new SaveABFocSchemes(payload);
      const error = new Error('some error');
      const outcome = new SaveABFocSchemesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focServiceSpy.getSaveABFOCSchemes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveABFocSchemes$).toBeObservable(expected);
    });
  });

  describe('DeleteABFocSchemes', () => {
    it('should return schemes and items payload', () => {
      const payload: OrderDetailsForFOC = {
        txnType: TransactionTypeEnum.AB,
        subTxnType: SubTransactionTypeEnum.NEW_AB
      };
      const res = true;
      const action = new DeleteABFocSchemes(payload);

      const outcome = new DeleteABFocSchemesSuccess(res);

      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: res
      });
      focServiceSpy.getDeleteABFOCSchemes.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.deleteABFocSchemes$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const payload: OrderDetailsForFOC = {
        txnType: TransactionTypeEnum.AB,
        subTxnType: SubTransactionTypeEnum.NEW_AB
      };
      const action = new DeleteABFocSchemes(payload);
      const error = new Error('some error');
      const outcome = new DeleteABFocSchemesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focServiceSpy.getDeleteABFOCSchemes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.deleteABFocSchemes$).toBeObservable(expected);
    });
  });

  describe('LoadSelectedABFocSchemes', () => {
    it('should return schemes and items payload', () => {
      const payload: OrderDetailsForFOC = {
        txnType: TransactionTypeEnum.AB,
        subTxnType: SubTransactionTypeEnum.NEW_AB
      };
      const res: ABFocSchemeDetailsDto[] = [
        {
          schemeDetailId: '123',
          schemeId: '345',
          schemeName: 'scheme1',
          schemeCategory: 'VALUE_BASED',
          weight: 0.5,
          id: '789'
        }
      ];
      const action = new LoadSelectedABFocSchemes(payload);

      const outcome = new LoadSelectedABFocSchemesSuccess(res);

      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: res
      });
      focServiceSpy.getSelectedABFOCSchemes.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSelectedABFocSchemes$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const payload: OrderDetailsForFOC = {
        txnType: TransactionTypeEnum.AB,
        subTxnType: SubTransactionTypeEnum.NEW_AB
      };
      const action = new LoadSelectedABFocSchemes(payload);
      const error = new Error('some error');
      const outcome = new LoadSelectedABFocSchemesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focServiceSpy.getSelectedABFOCSchemes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSelectedABFocSchemes$).toBeObservable(expected);
    });
  });

  describe('LoadSelectedABFocSchemesCount', () => {
    it('should return schemes and items payload', () => {
      const payload: OrderDetailsForFOC = {
        txnType: TransactionTypeEnum.AB,
        subTxnType: SubTransactionTypeEnum.NEW_AB
      };
      const res: ABFocSchemeDetailsDto[] = [
        {
          schemeDetailId: '123',
          schemeId: '345',
          schemeName: 'scheme1',
          schemeCategory: 'VALUE_BASED',
          weight: 0.5,
          id: '789'
        }
      ];
      const action = new LoadSelectedABFocSchemesCount(payload);

      const outcome = new LoadSelectedABFocSchemesCountSuccess(res.length);

      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: res
      });
      focServiceSpy.getSelectedABFOCSchemes.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSelectedABFocSchemesCount$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const payload: OrderDetailsForFOC = {
        txnType: TransactionTypeEnum.AB,
        subTxnType: SubTransactionTypeEnum.NEW_AB
      };
      const action = new LoadSelectedABFocSchemesCount(payload);
      const error = new Error('some error');
      const outcome = new LoadSelectedABFocSchemesCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focServiceSpy.getSelectedABFOCSchemes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSelectedABFocSchemesCount$).toBeObservable(expected);
    });
  });
});
