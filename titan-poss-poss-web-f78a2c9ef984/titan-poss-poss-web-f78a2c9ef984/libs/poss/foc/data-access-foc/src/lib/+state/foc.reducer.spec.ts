import {
  ABFocSchemeDetailsDto,
  AddFocToCMPayload,
  AddFocToCmResponsePayload,
  AddManualFocToCMPayload,
  AvailableSchemesPayload,
  CmFocPayload,
  CustomErrors,
  FocItemDetailsResponsePayload,
  FocProductDetailsInGrid,
  FocSchemeDetailsDto,
  FocSchemeRequestDto,
  IssuePendingFocConfirmationPayload,
  IssuepPendingFocPayload,
  KeepFocPendingPayload,
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
import * as moment from 'moment';
import * as actions from './foc.actions';
import { FocReducer, initalState } from './foc.reducer';
import { FocState } from './foc.state';

describe('FOC Reducer Testing Suite', () => {
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

  const dummyFocItems: FocProductDetailsInGrid[] = [
    {
      itemCode: '11111111111111111',
      description: null,
      binCode: null,
      selectedLotNumber: '100AB10',
      availableLotNumbers: [],
      unitWeight: 2,
      actualWeight: 2,
      reason: null,
      remarks: null,
      selectedRso: 'rso',
      availableRso: [],
      pricePerUnit: 100,
      discount: null,
      finalPrice: 1000,
      priceBreakUp: null,
      productDetails: null,
      inventoryId: '222211112222221',
      itemId: '2222222222',
      productType: null,
      isAdd: true,
      priceDetails: null,
      imageUrl: 'imageUrl',
      quantity: 2,
      focSchemeId: '111BBBCCSDD'
    }
  ];

  describe('Testing Load Pending FOC CM Related reducers', () => {
    it('LoadPendingFocCM should be called', () => {
      const action = new actions.LoadPendingFocCM(dummyloadPendingCmPayload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoadingPendingCM).toBe(true);
      expect(result.pendingFocCm.length).toBe(0);
      expect(result.error).toBe(null);
    });
    it('LoadPendingFocCMSuccess should be called', () => {
      const action = new actions.LoadPendingFocCMSuccess(dummyPendingFocCm);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoadingPendingCM).toBe(false);
      expect(result.pendingFocCm).toBe(dummyPendingFocCm);
    });
    it('LoadPendingFocCMFailure should be called', () => {
      const action = new actions.LoadPendingFocCMFailure(errorPayload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoadingPendingCM).toBe(false);
      expect(result.error).toBe(errorPayload);
    });
  });

  describe('Testing Load FOC schemes related reducers', () => {
    it('LoadPendingFocScheme should be called', () => {
      const action = new actions.LoadPendingFocScheme(
        dummyLoadFocSchemesPayload
      );
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoadingPendingFocSchemes).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadPendingFocSchemeSucess should be called', () => {
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
      const action = new actions.LoadPendingFocSchemeSuccess(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoadingPendingFocSchemes).toBe(false);
      expect(result.pendingFocSchemes).toBe(payload);
    });
    it('LoadPendingFocSchemeFailure should be called', () => {
      const action = new actions.LoadPendingFocSchemeFailure(errorPayload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoadingPendingFocSchemes).toBe(false);
      expect(result.error).toBe(errorPayload);
    });
  });

  describe('Testing Load FOC Items related reducers', () => {
    it('LoadFocItemDetails should be called', () => {
      const action = new actions.LoadFocItemDetails({
        itemsCodes: ['aaaa', 'bbbb']
      });
      const result: FocState = FocReducer(initalState, action);
      expect(result.focItemDetails).toBe(null);
      expect(result.isLoadingFocItemDetails).toBe(true);
      expect(result.hasFocItemDetails).toBe(false);
    });
    it('LoadFocItemDetailsSuccess should be called', () => {
      const action = new actions.LoadFocItemDetailsSuccess(
        dummyItemDetailsPayload
      );
      const result: FocState = FocReducer(initalState, action);
      expect(result.focItemDetails).toBe(dummyItemDetailsPayload);
      expect(result.isLoadingFocItemDetails).toBe(false);
      expect(result.hasFocItemDetails).toBe(true);
    });
    it('LoadFocItemDetailsFailure should be called', () => {
      const action = new actions.LoadFocItemDetailsFailure(errorPayload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoadingFocItemDetails).toBe(false);
      expect(result.isLoadingFocItemDetails).toBe(false);
      expect(result.error).toBe(
        errorPayload.code === 'ERR-INV-029' ? null : errorPayload
      );
      expect(result.focItemDetails).toBe(
        errorPayload.code === 'ERR-INV-029' ? [] : null
      );
    });
  });
  describe('Testing Issue Pending FOC related reducers', () => {
    it('IssuePendingFOC should be called', () => {
      const action = new actions.IssuePendingFOC(dummyIssuePendingFocPayload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isIssuingPendingFOC).toBe(true);
      expect(result.error).toBe(null);
    });
    it('IssuePendingFOCSuccess should be called', () => {
      const action = new actions.IssuePendingFOCSuccess(
        dummyIssueConfirmationPayload
      );
      const result: FocState = FocReducer(initalState, action);
      expect(result.isIssuingPendingFOC).toBe(false);
      expect(result.pendingIssueResponse).toBe(dummyIssueConfirmationPayload);
    });
    it('IssuePendingFOCFailure should be called', () => {
      const action = new actions.IssuePendingFOCFailure(errorPayload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isIssuingPendingFOC).toBe(false);
      expect(result.error).toBe(errorPayload);
    });
  });

  describe('Testing Set Selected Pending CM FOC related reducers', () => {
    it('SetSelectedPendingCM should be called', () => {
      const payload: PendingCMResponsePayload = {
        customerId: 770,
        docDate: moment(),
        docNo: 11,
        finalValue: 1000,
        fiscalYear: 2000,
        id: 'AAA-BBBB-CCCC'
      };
      const action = new actions.SetSelectedFocCM(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.selectedPendingCM).toBe(payload);
    });
  });
  describe('Testing ResetFocData related reducers', () => {
    it('ResetFocData should be called', () => {
      const action = new actions.ResetFocData();
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoadingPendingFocSchemes).toBe(false);
      expect(result.pendingFocSchemes).toBe(null);
      expect(result.selectedPendingCM).toBe(null);
      expect(result.focItemDetails).toBe(null);
      expect(result.isLoadingFocItemDetails).toBe(false);
      expect(result.focItems.length).toBe(0);
      expect(result.hasFocItemDetails).toBe(false);
      expect(result.pendingIssueResponse).toBe(null);
      expect(result.isIssuingPendingFOC).toBe(false);

      expect(result.totalFocEligibleWt).toBe(0);
      expect(result.totalFocIssuingWt).toBe(0);
      expect(result.focItemsCount).toBe(0);
      expect(result.isLoading).toBe(false);
      expect(result.focSchemes).toBe(null);
      expect(result.isFocSchemesLoaded).toBe(false);

      expect(result.focAddedToCM.length).toBe(0);
      expect(result.isFocAdded).toBe(false);
      expect(result.pendingFocSchemeIds.length).toBe(0);
      expect(result.error).toBe(null);
    });
  });
  describe('Testing LoadConfiguredFocSchemes related reducers', () => {
    it('LoadConfiguredFocSchemes should be called', () => {
      const action = new actions.LoadConfiguredFocSchemes();
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(true);
      expect(result.focSchemes).toBe(null);
      expect(result.availableFocSchemes.length).toBe(0);
    });
    it('LoadConfiguredFocSchemesSuccess should be called', () => {
      const payload: AvailableSchemesPayload[] = [
        {
          description: 'Foc Scheme',
          isActive: true,
          id: '111111111111',
          name: 'focScheme1'
        }
      ];
      const action = new actions.LoadConfiguredFocSchemesSuccess(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.availableFocSchemes).toBe(payload);
    });
    it('LoadConfiguredFocSchemesFailure should be called', () => {
      const action = new actions.LoadConfiguredFocSchemesFailure(errorPayload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.availableFocSchemes.length).toBe(0);
      expect(result.error).toBe(errorPayload);
    });
  });

  describe('Testing LoadFocSchemesAndItems related reducers', () => {
    it('LoadFocSchemesAndItems should be called', () => {
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
      const action = new actions.LoadFocSchemesAndItems(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(true);
      expect(result.focSchemes).toBe(null);
      expect(result.isFocSchemesLoaded).toBe(false);
    });
    it('LoadFocSchemesAndItemsSuccess should be called', () => {
      const payload: FocSchemeDetailsDto[] = [
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
      const action = new actions.LoadFocSchemesAndItemsSuccess(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.focSchemes).toBe(payload);
      expect(result.isFocSchemesLoaded).toBe(true);
    });
    it('LoadConfiguredFocSchemesFailure should be called', () => {
      const action = new actions.LoadFocSchemesAndItemsFailure(errorPayload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(errorPayload);
    });
  });

  describe('Testing AddFocToCm related reducers', () => {
    it('AddFocToCm should be called', () => {
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
      const action = new actions.AddFocToCm(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(true);
      expect(result.focAddedToCM.length).toBe(0);
    });
    it('AddFocToCmSuccess should be called', () => {
      const payload: AddFocToCmResponsePayload[] = [
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
      const action = new actions.AddFocToCmSuccess(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.focAddedToCM).toBe(payload);
      expect(result.isFocAdded).toBe(true);
    });
    it('LoadConfiguredFocSchemesFailure should be called', () => {
      const action = new actions.LoadConfiguredFocSchemesFailure(errorPayload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(errorPayload);
    });
  });

  describe('Testing DeleteFocFromCm related reducers', () => {
    it('AddFocToCm should be called', () => {
      const payload: CmFocPayload = {
        id: '11111111111111',
        subTxnType: 'NEW_CM',
        txnType: 'CM'
      };
      const action = new actions.DeleteFocFromCm(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(true);
    });
    it('DeleteFocFromCmSuccess should be called', () => {
      const payload = true;
      const action = new actions.DeleteFocFromCmSuccess(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.focAddedToCM.length).toBe(0);
      expect(result.isFocAdded).toBe(false);
    });
    it('LoadConfiguredFocSchemesFailure should be called', () => {
      const action = new actions.DeleteFocFromCmFailure(errorPayload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.focAddedToCM.length).toBe(0);
      expect(result.error).toBe(errorPayload);
    });
  });
  describe('Testing GetFocAssignedToCm related reducers', () => {
    it('GetFocAssignedToCm should be called', () => {
      const payload: CmFocPayload = {
        id: '11111111111111',
        subTxnType: 'NEW_CM',
        txnType: 'CM'
      };
      const action = new actions.GetFocAssignedToCm(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(true);
      expect(result.isFocAdded).toBe(false);
      expect(result.focAddedToCM.length).toBe(0);
    });
    it('GetFocAssignedToCmSuccess should be called', () => {
      const payload: AddFocToCmResponsePayload[] = [
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
      const action = new actions.GetFocAssignedToCmSuccess(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.focAddedToCM).toBe(payload);
      expect(result.isFocAdded).toBe(true);
    });
    it('GetFocAssignedToCmFailure should be called', () => {
      const action = new actions.GetFocAssignedToCmFailure(errorPayload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(errorPayload);
    });
  });

  describe('Testing KeepFocPending related reducers', () => {
    it('GetFocAssignedToCm should be called', () => {
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
      const action = new actions.KeepFocPending(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(true);
      expect(result.pendingFocSchemeIds.length).toBe(0);
    });
    it('GetFocAssignedToCmSuccess should be called', () => {
      const payload = ['1111111', '2222222222222'];
      const action = new actions.KeepFocPendingSuccess(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.pendingFocSchemeIds).toBe(payload);
    });
    it('KeepFocPendingFailure should be called', () => {
      const action = new actions.KeepFocPendingFailure(errorPayload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(errorPayload);
    });
  });
  describe('Testing SetKeepFocPendingTrigger related reducers', () => {
    it('SetKeepFocPendingTrigger should be called', () => {
      const payload = true;
      const action = new actions.SetKeepFocPendingTrigger(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.keepFOCPendingTrigger).toBe(payload);
    });
  });
  describe('Testing Load Manual FOC Items related reducers', () => {
    it('LoadManualFocItemDetails should be called', () => {
      const action = new actions.LoadManualFocItemDetails({
        itemsCodes: ['aaaa', 'bbbb']
      });
      const result: FocState = FocReducer(initalState, action);
      expect(result.manualFocItemDetails).toBe(null);
      expect(result.isLoadingManualFocItemDetails).toBe(true);
      expect(result.hasManualFocItemDetails).toBe(false);
    });
    it('LoadManualFocItemDetailsSuccess should be called', () => {
      const action = new actions.LoadManualFocItemDetailsSuccess(
        dummyItemDetailsPayload
      );
      const result: FocState = FocReducer(initalState, action);
      expect(result.manualFocItemDetails).toBe(dummyItemDetailsPayload);
      expect(result.isLoadingManualFocItemDetails).toBe(false);
      expect(result.hasManualFocItemDetails).toBe(true);
    });
    it('LoadManualFocItemDetailsFailure should be called', () => {
      const action = new actions.LoadManualFocItemDetailsFailure(errorPayload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoadingManualFocItemDetails).toBe(false);
      expect(result.isLoadingManualFocItemDetails).toBe(false);
      expect(result.error).toBe(
        errorPayload.code === 'ERR-INV-029' ? null : errorPayload
      );
      expect(result.manualFocItemDetails).toBe(
        errorPayload.code === 'ERR-INV-029' ? [] : null
      );
    });
  });
  describe('Testing LoadManualFocItems related reducers', () => {
    it('LoadManualFocItems should be called', () => {
      const payload = '46364574';
      const action = new actions.LoadManuaFocItems(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(true);
      expect(result.manualFocSchemes).toBe(null);
    });
    it('LoadManuaFocItemsSuccess should be called', () => {
      const payload: ManualFocDetailsDto[] = [
        {
          focItems: [{ itemCode: '111111', quantity: 1, weight: null }],
          manualFOCEndDate: moment(),
          manualFOCStartDate: moment(),
          schemeId: 'schemeId1',
          schemeName: 'focScheme1',
          configDetails: {}
        }
      ];
      const action = new actions.LoadManuaFocItemsSuccess(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.manualFocSchemes).toBe(payload);
    });
    it('LoadManuaFocItemsFailure should be called', () => {
      const action = new actions.LoadManuaFocItemsFailure(errorPayload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(errorPayload);
    });
  });

  describe('Testing AddManualFocToCm related reducers', () => {
    it('AddManualFocToCm should be called', () => {
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
      const action = new actions.AddManualFocToCm(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(true);
      expect(result.manualFocAddedToCM.length).toBe(0);
    });
    it('AddManualFocToCmSuccess should be called', () => {
      const payload: AddFocToCmResponsePayload[] = [
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
      const action = new actions.AddManualFocToCmSuccess(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.manualFocAddedToCM).toBe(payload);
      expect(result.isManualFocAdded).toBe(true);
    });
    it('AddManualFocToCmFailure should be called', () => {
      const action = new actions.AddManualFocToCmFailure(errorPayload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(errorPayload);
    });
  });

  describe('Testing DeleteManualFocFromCm related reducers', () => {
    it('DeleteManualFocFromCm should be called', () => {
      const payload: CmFocPayload = {
        id: '11111111111111',
        subTxnType: 'NEW_CM',
        txnType: 'CM'
      };
      const action = new actions.DeleteManualFocFromCm(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(true);
    });
    it('DeleteManualFocFromCmSuccess should be called', () => {
      const payload = true;
      const action = new actions.DeleteManualFocFromCmSuccess(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.manualFocAddedToCM.length).toBe(0);
      expect(result.isManualFocAdded).toBe(false);
    });
    it('DeleteManualFocFromCmFailure should be called', () => {
      const action = new actions.DeleteManualFocFromCmFailure(errorPayload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.manualFocAddedToCM.length).toBe(0);
      expect(result.error).toBe(errorPayload);
    });
  });

  describe('Testing GetManualFocAssignedToCm related reducers', () => {
    it('GetManualFocAssignedToCm should be called', () => {
      const payload: CmFocPayload = {
        id: '11111111111111',
        subTxnType: 'NEW_CM',
        txnType: 'CM'
      };
      const action = new actions.GetManualFocAssignedToCm(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(true);
      expect(result.isManualFocAdded).toBe(false);
      expect(result.manualFocAddedToCM.length).toBe(0);
    });
    it('GetManualFocAssignedToCmSuccess should be called', () => {
      const payload: AddFocToCmResponsePayload[] = [
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
      const action = new actions.GetManualFocAssignedToCmSuccess(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.manualFocAddedToCM).toBe(payload);
      expect(result.isManualFocAdded).toBe(true);
    });
    it('GetManualFocAssignedToCmFailure should be called', () => {
      const action = new actions.GetManualFocAssignedToCmFailure(errorPayload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(errorPayload);
    });
  });

  describe('Testing LoadFocSchemeItems related reducers', () => {
    it('LoadFocSchemeItems should be called', () => {
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
      const action = new actions.LoadFocSchemesForItems(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(true);
      expect(result.isFocSchemesForItems).toBe(false);
    });
    it('LoadFocSchemesForItemsSuccess should be called', () => {
      const payload: FocSchemeDetailsDto[] = [
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
      const action = new actions.LoadFocSchemesForItemsSuccess(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.isFocSchemesForItems).toBe(true);
    });
    it('LoadFocSchemesForItemsFailure should be called', () => {
      const action = new actions.LoadFocSchemesForItemsFailure(errorPayload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(errorPayload);
    });
  });

  describe('Testing ValidateManualFoc related reducers', () => {
    it('ValidateManualFoc should be called', () => {
      const payload: ValidateManualFocPayload = {
        CMNumber: '5423',
        fiscalYear: '2022',
        locationCode: 'CPD'
      };
      const action = new actions.ValidateManualFoc(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(true);
      expect(result.manualFocValidationDetails).toBe(null);
    });
    it('ValidateManualFocSuccess should be called', () => {
      const payload = {
        cmNumber: 1244
      };
      const action = new actions.ValidateManualFocSuccess(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.manualFocValidationDetails).toBe(payload);
    });
    it('ValidateManualFocFailure should be called', () => {
      const action = new actions.ValidateManualFocFailure(errorPayload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(errorPayload);
    });
    it('ClearValidatedManualFoc should be called', () => {
      const action = new actions.ClearValidatedManualFoc();
      const result: FocState = FocReducer(initalState, action);
      expect(result.manualFocValidationDetails).toBe(null);
    });
  });

  describe('Testing VerifyManualFoc related reducers', () => {
    it('VerifyManualFoc should be called', () => {
      const payload: VerifyManualFocPayload = {
        customerID: '5423',
        manualFocEndDate: 442452636,
        manualFocStartDate: 214235
      };
      const action = new actions.VerifyManualFoc(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(true);
      expect(result.isManualFocVerified).toBe(false);
    });
    it('VerifyManualFocSuccess should be called', () => {
      const action = new actions.VerifyManualFocSuccess();
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.isManualFocVerified).toBe(true);
    });
    it('VerifyManualFocFailure should be called', () => {
      const action = new actions.VerifyManualFocFailure(errorPayload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(errorPayload);
      expect(result.isManualFocVerified).toBe(false);
    });
    it('ClearVerifyManualFoc should be called', () => {
      const action = new actions.ClearVerifyManualFoc();
      const result: FocState = FocReducer(initalState, action);
      expect(result.isManualFocVerified).toBe(false);
    });
  });

  describe('Testing CLear FOC related reducers', () => {
    it('ClearLoadFocSchemesForItems should be called', () => {
      const action = new actions.ClearLoadFocSchemesForItems();
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.isFocSchemesForItems).toBe(false);
      expect(result.ABFocSchemesForItems).toBe(false);
    });
  });

  // AB FOC
  describe('Testing LoadABFocSchemes related reducers', () => {
    it('LoadABFocSchemes should be called', () => {
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
      const action = new actions.LoadABFocSchemes(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(true);
      expect(result.ABFocSchemes).toBe(null);
    });
    it('LoadABFocSchemesSuccess should be called', () => {
      const payload: FocSchemeDetailsDto[] = [
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
      const action = new actions.LoadABFocSchemesSuccess(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.ABFocSchemes).toBe(payload);
    });
    it('LoadABFocSchemesFailure should be called', () => {
      const action = new actions.LoadABFocSchemesFailure(errorPayload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(errorPayload);
    });
  });

  describe('Testing LoadABFocSchemesForItems related reducers', () => {
    it('LoadABFocSchemesForItems should be called', () => {
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
      const action = new actions.LoadABFocSchemesForItems(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(true);
      expect(result.ABFocSchemesForItems).toBe(false);
    });
    it('LoadABFocSchemesForItemsSuccess should be called', () => {
      const payload: FocSchemeDetailsDto[] = [
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
      const action = new actions.LoadABFocSchemesForItemsSuccess(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.ABFocSchemesForItems).toBe(true);
    });
    it('LoadABFocSchemesForItemsFailure should be called', () => {
      const action = new actions.LoadABFocSchemesForItemsFailure();
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.ABFocSchemesForItems).toBe(false);
    });
  });

  describe('Testing SaveABFocSchemes related reducers', () => {
    it('SaveABFocSchemes should be called', () => {
      const payload: OrderDetailsForFOC = {
        txnType: TransactionTypeEnum.AB,
        subTxnType: SubTransactionTypeEnum.NEW_AB
      };
      const action = new actions.SaveABFocSchemes(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(true);
      expect(result.SaveFocSchemes).toBe(null);
    });
    it('SaveABFocSchemesSuccess should be called', () => {
      const payload: ABFocSchemeDetailsDto[] = [
        {
          schemeDetailId: '123',
          schemeId: '345',
          schemeName: 'scheme1',
          schemeCategory: 'VALUE_BASED',
          weight: 0.5,
          id: '789'
        }
      ];
      const action = new actions.SaveABFocSchemesSuccess(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.SaveFocSchemes).toBe(payload);
    });
    it('SaveABFocSchemesFailure should be called', () => {
      const action = new actions.SaveABFocSchemesFailure(errorPayload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(errorPayload);
    });
  });

  describe('Testing DeleteABFocSchemes related reducers', () => {
    it('DeleteABFocSchemes should be called', () => {
      const payload: OrderDetailsForFOC = {
        txnType: TransactionTypeEnum.AB,
        subTxnType: SubTransactionTypeEnum.NEW_AB
      };
      const action = new actions.DeleteABFocSchemes(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(true);
      expect(result.deleteABFOCSchemesRes).toBe(false);
    });
    it('DeleteABFocSchemesSuccess should be called', () => {
      const payload = false;
      const action = new actions.DeleteABFocSchemesSuccess(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.deleteABFOCSchemesRes).toBe(payload);
    });
    it('DeleteABFocSchemesFailure should be called', () => {
      const action = new actions.DeleteABFocSchemesFailure(errorPayload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(errorPayload);
    });
  });

  describe('Testing LoadSelectedABFocSchemes related reducers', () => {
    it('LoadSelectedABFocSchemes should be called', () => {
      const payload: OrderDetailsForFOC = {
        txnType: TransactionTypeEnum.AB,
        subTxnType: SubTransactionTypeEnum.NEW_AB
      };
      const action = new actions.LoadSelectedABFocSchemes(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(true);
      expect(result.SelectedABFocSchemes).toBe(null);
    });
    it('LoadSelectedABFocSchemesSuccess should be called', () => {
      const payload: ABFocSchemeDetailsDto[] = [
        {
          schemeDetailId: '123',
          schemeId: '345',
          schemeName: 'scheme1',
          schemeCategory: 'VALUE_BASED',
          weight: 0.5,
          id: '789'
        }
      ];
      const action = new actions.LoadSelectedABFocSchemesSuccess(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.SelectedABFocSchemes).toBe(payload);
      expect(result.SelectedABFocSchemesCount).toBe(payload.length);
    });
    it('LoadSelectedABFocSchemesFailure should be called', () => {
      const action = new actions.LoadSelectedABFocSchemesFailure(errorPayload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.SelectedABFocSchemes.length).toBe(0);
      expect(result.SelectedABFocSchemesCount).toBe(0);
    });
  });

  describe('Testing LoadSelectedABFocSchemesCount related reducers', () => {
    it('LoadSelectedABFocSchemesCount should be called', () => {
      const payload: OrderDetailsForFOC = {
        txnType: TransactionTypeEnum.AB,
        subTxnType: SubTransactionTypeEnum.NEW_AB
      };
      const action = new actions.LoadSelectedABFocSchemesCount(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(true);
      expect(result.SelectedABFocSchemesCount).toBe(-1);
    });
    it('LoadSelectedABFocSchemesCountSuccess should be called', () => {
      const payload = 1;
      const action = new actions.LoadSelectedABFocSchemesCountSuccess(payload);
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.SelectedABFocSchemesCount).toBe(payload);
    });
    it('LoadSelectedABFocSchemesCountFailure should be called', () => {
      const action = new actions.LoadSelectedABFocSchemesCountFailure(
        errorPayload
      );
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.SelectedABFocSchemesCount).toBe(0);
    });
  });

  describe('Testing CLear AB FOC related reducers', () => {
    it('ClearABFocSchemes should be called', () => {
      const action = new actions.ClearABFocSchemes();
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.ABFocSchemes).toBe(null);
      expect(result.SelectedABFocSchemes).toBe(null);
      expect(result.SaveFocSchemes).toBe(null);
      expect(result.deleteABFOCSchemesRes).toBe(false);
    });
    it('ClearABFocSchemesCount should be called', () => {
      const action = new actions.ClearABFocSchemesCount();
      const result: FocState = FocReducer(initalState, action);
      expect(result.isLoading).toBe(false);
      expect(result.SelectedABFocSchemesCount).toBe(-1);
    });
  });
});
