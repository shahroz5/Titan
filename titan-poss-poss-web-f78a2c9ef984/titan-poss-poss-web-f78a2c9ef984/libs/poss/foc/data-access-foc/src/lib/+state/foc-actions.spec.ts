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
import * as moment from 'moment';
import {
  AddFocToCm,
  AddFocToCmFailure,
  AddFocToCmSuccess,
  AddManualFocToCm,
  AddManualFocToCmFailure,
  AddManualFocToCmSuccess,
  ClearABFocSchemes,
  ClearABFocSchemesCount,
  ClearLoadFocSchemesForItems,
  ClearValidatedManualFoc,
  ClearVerifyManualFoc,
  DeleteABFocSchemes,
  DeleteABFocSchemesFailure,
  DeleteABFocSchemesSuccess,
  DeleteFocFromCm,
  DeleteFocFromCmFailure,
  DeleteFocFromCmSuccess,
  DeleteManualFocFromCm,
  DeleteManualFocFromCmFailure,
  DeleteManualFocFromCmSuccess,
  FocActionTypes,
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
  ResetFocData,
  SaveABFocSchemes,
  SaveABFocSchemesFailure,
  SaveABFocSchemesSuccess,
  SetKeepFocPendingTrigger,
  SetSelectedFocCM,
  ValidateManualFoc,
  ValidateManualFocFailure,
  ValidateManualFocSuccess,
  VerifyManualFoc,
  VerifyManualFocFailure,
  VerifyManualFocSuccess
} from './foc.actions';

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
describe('Foc Actions Testing Suite', () => {
  describe('LoadPendingFocCM Action Test Cases', () => {
    it('should check correct type is used for LoadPendingFocCM action', () => {
      const payload = dummyloadPendingCmPayload;
      const action = new LoadPendingFocCM(payload);

      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_PENDING_FOC_CM,
        payload
      });
    });
    it('should check correct type is used for LoadPendingFocCMSuccess action', () => {
      const payload = dummyPendingFocCm;
      const action = new LoadPendingFocCMSuccess(payload);

      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_PENDING_FOC_CM_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadPendingFocCMFailure action', () => {
      const payload = errorPayload;
      const action = new LoadPendingFocCMFailure(payload);

      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_PENDING_FOC_CM_FAILURE,
        payload
      });
    });
  });

  describe('SetSelectedFocCM Action Test Cases', () => {
    it('should check correct type is used for SetSelectedFocCM action', () => {
      const payload: PendingCMResponsePayload = {
        customerId: 770,
        docDate: moment(),
        docNo: 11,
        finalValue: 1000,
        fiscalYear: 2000,
        id: 'AAA-BBBB-CCCC'
      };
      const action = new SetSelectedFocCM(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.SET_SELECTED_FOC_PENDIND_CM,
        payload
      });
    });
  });
  describe('LoadPendingFocScheme Action Test Cases', () => {
    it('should check correct type is used for LoadPendingFocScheme action', () => {
      const payload = dummyLoadFocSchemesPayload;
      const action = new LoadPendingFocScheme(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_PENDING_FOC_SCHEME,
        payload
      });
    });
    it('should check correct type is used for LoadPendingFocSchemeSuccess action', () => {
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
      const action = new LoadPendingFocSchemeSuccess(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_PENDING_FOC_SCHEME_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadPendingFocSchemeFailure action', () => {
      const payload = errorPayload;
      const action = new LoadPendingFocSchemeFailure(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_PENDING_FOC_SCHEME_FAILURE,
        payload
      });
    });
  });

  describe('LoadFocItemDetails Action Test Cases', () => {
    it('should check correct type is used for LoadFocItemDetails action', () => {
      const payload: LoadFocItemDetailsPayload = {
        itemsCodes: ['aaaa', 'bbbb']
      };
      const action = new LoadFocItemDetails(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_FOC_ITEM_DETAILS,
        payload
      });
    });
    it('should check correct type is used for LoadFocItemDetailsSuccess action', () => {
      const payload = dummyItemDetailsPayload;
      const action = new LoadFocItemDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_FOC_ITEM_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadFocItemDetailsFailure action', () => {
      const payload = errorPayload;
      const action = new LoadFocItemDetailsFailure(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_FOC_ITEM_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('IssuePendingFOC Action Test Cases', () => {
    it('should check correct type is used for IssuePendingFOC action', () => {
      const payload = dummyIssuePendingFocPayload;
      const action = new IssuePendingFOC(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.ISSUE_PENDING_FOC,
        payload
      });
    });
    it('should check correct type is used for IssuePendingFOCSuccess action', () => {
      const payload = dummyIssueConfirmationPayload;
      const action = new IssuePendingFOCSuccess(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.ISSUE_PENDING_FOC_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadFocItemDetailsFailure action', () => {
      const payload = errorPayload;
      const action = new IssuePendingFOCFailure(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.ISSUE_PENDING_FOC_FAILURE,
        payload
      });
    });
  });

  describe('ResetFocData Action Test Cases', () => {
    it('should check correct type is used for ResetFocData action', () => {
      const action = new ResetFocData();
      expect({ ...action }).toEqual({
        type: FocActionTypes.RESET_FOC_DATA
      });
    });
  });
  describe('LoadConfiguredFocSchemes Action Test Cases', () => {
    it('should check correct type is used for LoadConfiguredFocSchemes action', () => {
      const action = new LoadConfiguredFocSchemes();
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_CONFIGURED_FOC_SCHEMES
      });
    });
    it('should check correct type is used for LoadConfiguredFocSchemesSuccess action', () => {
      const payload: AvailableSchemesPayload[] = [
        {
          description: 'Foc Scheme',
          isActive: true,
          id: '111111111111',
          name: 'focScheme1'
        }
      ];
      const action = new LoadConfiguredFocSchemesSuccess(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_CONFIGURED_FOC_SCHEMES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadConfiguredFocSchemesFailure action', () => {
      const payload = errorPayload;
      const action = new LoadConfiguredFocSchemesFailure(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_CONFIGURED_FOC_SCHEMES_FAILURE,
        payload
      });
    });
  });
  describe('LoadFocSchemesAndItems Action Test Cases', () => {
    it('should check correct type is used for LoadFocSchemesAndItems action', () => {
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
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_AVAILABLE_FOC_SCHEMES_AND_ITEMS,
        payload
      });
    });
    it('should check correct type is used for LoadFocSchemesAndItemsSuccess action', () => {
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
      const action = new LoadFocSchemesAndItemsSuccess(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_AVAILABLE_FOC_SCHEMES_AND_ITEMS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadConfiguredFocSchemesFailure action', () => {
      const payload = errorPayload;
      const action = new LoadFocSchemesAndItemsFailure(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_AVAILABLE_FOC_SCHEMES_AND_ITEMS_FAILURE,
        payload
      });
    });
  });
  describe('AddFocToCm Action Test Cases', () => {
    it('should check correct type is used for AddFocToCm action', () => {
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
      expect({ ...action }).toEqual({
        type: FocActionTypes.ADD_FOC_TO_CM,
        payload
      });
    });
    it('should check correct type is used for AddFocToCmSuccess action', () => {
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
      const action = new AddFocToCmSuccess(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.ADD_FOC_TO_CM_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for AddFocToCmFailure action', () => {
      const payload = errorPayload;
      const action = new AddFocToCmFailure(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.ADD_FOC_TO_CM_FAILURE,
        payload
      });
    });
  });
  describe('DeleteFocFromCm Action Test Cases', () => {
    it('should check correct type is used for DeleteFocFromCm action', () => {
      const payload: CmFocPayload = {
        id: '11111111111111',
        subTxnType: 'NEW_CM',
        txnType: 'CM'
      };
      const action = new DeleteFocFromCm(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.DELETE_FOC_FROM_CM,
        payload
      });
    });
    it('should check correct type is used for DeleteFocFromCmSuccess action', () => {
      const payload = true;
      const action = new DeleteFocFromCmSuccess(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.DELETE_FOC_FROM_CM_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for DeleteFocFromCmFailure action', () => {
      const payload = errorPayload;
      const action = new DeleteFocFromCmFailure(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.DELETE_FOC_FROM_CM_FAILURE,
        payload
      });
    });
  });
  describe('GetFocAssignedToCm Action Test Cases', () => {
    it('should check correct type is used for GetFocAssignedToCm action', () => {
      const payload: CmFocPayload = {
        id: '11111111111111',
        subTxnType: 'NEW_CM',
        txnType: 'CM'
      };
      const action = new GetFocAssignedToCm(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.GET_FOC_ASSIGNED_TO_CM,
        payload
      });
    });
    it('should check correct type is used for GetFocAssignedToCmSuccess action', () => {
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
      const action = new GetFocAssignedToCmSuccess(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.GET_FOC_ASSIGNED_TO_CM_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for GetFocAssignedToCmFailure action', () => {
      const payload = errorPayload;
      const action = new GetFocAssignedToCmFailure(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.GET_FOC_ASSIGNED_TO_CM_FAILURE,
        payload
      });
    });
  });
  describe('KeepFocPending Action Test Cases', () => {
    it('should check correct type is used for KeepFocPending action', () => {
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
      expect({ ...action }).toEqual({
        type: FocActionTypes.KEEP_FOC_PENDING,
        payload
      });
    });
    it('should check correct type is used for KeepFocPendingSuccess action', () => {
      const payload = ['1111111', '2222222222222'];
      const action = new KeepFocPendingSuccess(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.KEEP_FOC_PENDING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for KeepFocPendingFailure action', () => {
      const payload = errorPayload;
      const action = new KeepFocPendingFailure(payload);

      expect({ ...action }).toEqual({
        type: FocActionTypes.KEEP_FOC_PENDING_FAILURE,
        payload
      });
    });
  });
  describe('SetKeepFocPendingTrigger Action Test Cases', () => {
    it('should check correct type is used for SetKeepFocPendingTrigger action', () => {
      const payload = true;
      const action = new SetKeepFocPendingTrigger(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.SET_PENDING_FOC_TRIGGER,
        payload
      });
    });
  });
  describe('ValidateManualFoc Action Test Cases', () => {
    it('should check correct type is used for ValidateManualFoc action', () => {
      const payload: ValidateManualFocPayload = {
        locationCode: 'CPD',
        CMNumber: '2342',
        fiscalYear: '2021'
      };
      const action = new ValidateManualFoc(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.VALIDATE_MANUAL_FOC,
        payload
      });
    });
    it('should check correct type is used for ValidateManualFocSuccess action', () => {
      const payload: any = null;
      const action = new ValidateManualFocSuccess(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.VALIDATE_MANUAL_FOC_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for ValidateManualFocFailure action', () => {
      const payload = errorPayload;
      const action = new ValidateManualFocFailure(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.VALIDATE_MANUAL_FOC_FAILURE,
        payload
      });
    });
    it('should check correct type is used for ClearValidatedManualFoc action', () => {
      const action = new ClearValidatedManualFoc();
      expect({ ...action }).toEqual({
        type: FocActionTypes.CLEAR_VALIDATED_MANUAL_FOC
      });
    });
  });
  describe('VerifyManualFoc Action Test Cases', () => {
    it('should check correct type is used for VerifyManualFoc action', () => {
      const payload: VerifyManualFocPayload = {
        customerID: '234',
        manualFocStartDate: 2333252453263,
        manualFocEndDate: 24325235325
      };
      const action = new VerifyManualFoc(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.VERIFY_MANUAL_FOC,
        payload
      });
    });
    it('should check correct type is used for VerifyManualFocSuccess action', () => {
      const action = new VerifyManualFocSuccess();
      expect({ ...action }).toEqual({
        type: FocActionTypes.VERIFY_MANUAL_FOC_SUCCESS
      });
    });
    it('should check correct type is used for VerifyManualFocFailure action', () => {
      const payload = errorPayload;
      const action = new VerifyManualFocFailure(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.VERIFY_MANUAL_FOC_FAILURE,
        payload
      });
    });
    it('should check correct type is used for ClearVerifyManualFoc action', () => {
      const action = new ClearVerifyManualFoc();
      expect({ ...action }).toEqual({
        type: FocActionTypes.CLEAR_VERIFY_MANUAL_FOC
      });
    });
  });
  describe('LoadManualFocItemDetails Action Test Cases', () => {
    it('should check correct type is used for LoadManualFocItemDetails action', () => {
      const payload: LoadFocItemDetailsPayload = {
        itemsCodes: ['aaaa', 'bbbb']
      };
      const action = new LoadManualFocItemDetails(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_MANUAL_FOC_ITEM_DETAILS,
        payload
      });
    });
    it('should check correct type is used for LoadManualFocItemDetailsSuccess action', () => {
      const payload = dummyItemDetailsPayload;
      const action = new LoadManualFocItemDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_MANUAL_FOC_ITEM_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadManualFocItemDetailsFailure action', () => {
      const payload = errorPayload;
      const action = new LoadManualFocItemDetailsFailure(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_MANUAL_FOC_ITEM_DETAILS_FAILURE,
        payload
      });
    });
  });
  describe('AddManualFocToCm Action Test Cases', () => {
    it('should check correct type is used for AddManualFocToCm action', () => {
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
      expect({ ...action }).toEqual({
        type: FocActionTypes.ADD_MANUAL_FOC_TO_CM,
        payload
      });
    });
    it('should check correct type is used for AddManualFocToCmSuccess action', () => {
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
      const action = new AddManualFocToCmSuccess(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.ADD_MANUAL_FOC_TO_CM_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for AddManualFocToCmFailure action', () => {
      const payload = errorPayload;
      const action = new AddManualFocToCmFailure(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.ADD_MANUAL_FOC_TO_CM_FAILURE,
        payload
      });
    });
  });
  describe('DeleteManualFocFromCm Action Test Cases', () => {
    it('should check correct type is used for DeleteManualFocFromCm action', () => {
      const payload: CmFocPayload = {
        id: '11111111111111',
        subTxnType: 'NEW_CM',
        txnType: 'CM'
      };
      const action = new DeleteManualFocFromCm(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.DELETE_MANUAL_FOC_FROM_CM,
        payload
      });
    });
    it('should check correct type is used for DeleteManualFocFromCmSuccess action', () => {
      const payload = true;
      const action = new DeleteManualFocFromCmSuccess(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.DELETE_MANUAL_FOC_FROM_CM_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for DeleteManualFocFromCmFailure action', () => {
      const payload = errorPayload;
      const action = new DeleteManualFocFromCmFailure(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.DELETE_MANUAL_FOC_FROM_CM_FAILURE,
        payload
      });
    });
  });
  describe('GetManualFocAssignedToCm Action Test Cases', () => {
    it('should check correct type is used for GetManualFocAssignedToCm action', () => {
      const payload: CmFocPayload = {
        id: '11111111111111',
        subTxnType: 'NEW_CM',
        txnType: 'CM'
      };
      const action = new GetManualFocAssignedToCm(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.GET_MANUAL_FOC_ASSIGNED_TO_CM,
        payload
      });
    });
    it('should check correct type is used for GetManualFocAssignedToCmSuccess action', () => {
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
      const action = new GetManualFocAssignedToCmSuccess(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.GET_MANUAL_FOC_ASSIGNED_TO_CM_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for GetManualFocAssignedToCmFailure action', () => {
      const payload = errorPayload;
      const action = new GetManualFocAssignedToCmFailure(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.GET_MANUAL_FOC_ASSIGNED_TO_CM_FAILURE,
        payload
      });
    });
  });
  describe('LoadFocSchemesForItems Action Test Cases', () => {
    it('should check correct type is used for LoadFocSchemesForItems action', () => {
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
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_FOC_SCHEME_ITEMS,
        payload
      });
    });
    it('should check correct type is used for LoadFocSchemesForItemsSuccess action', () => {
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
      const action = new LoadFocSchemesForItemsSuccess(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_FOC_SCHEME_ITEMS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadFocSchemesForItemsFailure action', () => {
      const payload = errorPayload;
      const action = new LoadFocSchemesForItemsFailure(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_FOC_SCHEME_ITEMS_FAILURE,
        payload
      });
    });
  });
  describe('LoadFocSchemesForItems Action Test Cases', () => {
    it('should check correct type is used for LoadFocSchemesForItems action', () => {
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
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_FOC_SCHEME_ITEMS,
        payload
      });
    });
    it('should check correct type is used for LoadFocSchemesForItemsSuccess action', () => {
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
      const action = new LoadFocSchemesForItemsSuccess(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_FOC_SCHEME_ITEMS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadFocSchemesForItemsFailure action', () => {
      const payload = errorPayload;
      const action = new LoadFocSchemesForItemsFailure(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_FOC_SCHEME_ITEMS_FAILURE,
        payload
      });
    });
    it('should check correct type is used for ClearLoadFocSchemesForItems action', () => {
      const action = new ClearLoadFocSchemesForItems();
      expect({ ...action }).toEqual({
        type: FocActionTypes.CLEAR_FOC_SCHEME_ITEMS
      });
    });
  });
  describe('LoadManuaFocItems Action Test Cases', () => {
    it('should check correct type is used for LoadManuaFocItems action', () => {
      const payload = '9575777373';
      const action = new LoadManuaFocItems(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_MANUAL_FOC_ITEMS,
        payload
      });
    });
    it('should check correct type is used for LoadManuaFocItemsSuccess action', () => {
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
      const action = new LoadManuaFocItemsSuccess(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_MANUAL_FOC_ITEMS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadManuaFocItemsFailure action', () => {
      const payload = errorPayload;
      const action = new LoadManuaFocItemsFailure(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_MANUAL_FOC_ITEMS_FAILURE,
        payload
      });
    });
  });

  // AB FOC Schemes
  describe('LoadABFocSchemes  Action Test Cases', () => {
    it('should check correct type is used for LoadABFocSchemes  action', () => {
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
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_AB_FOC_SCHEMES,
        payload
      });
    });
    it('should check correct type is used for LoadABFocSchemesSuccess action', () => {
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
      const action = new LoadABFocSchemesSuccess(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_AB_FOC_SCHEMES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadABFocSchemesFailure action', () => {
      const payload = errorPayload;
      const action = new LoadABFocSchemesFailure(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_AB_FOC_SCHEMES_FAILURE,
        payload
      });
    });
  });

  describe('LoadABFocSchemesForItems   Action Test Cases', () => {
    it('should check correct type is used for LoadABFocSchemesForItems   action', () => {
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
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_AB_FOC_SCHEMES_FOR_ITEMS,
        payload
      });
    });
    it('should check correct type is used for LoadABFocSchemesForItemsSuccess action', () => {
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
      const action = new LoadABFocSchemesForItemsSuccess(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_AB_FOC_SCHEMES_FOR_ITEMS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadABFocSchemesForItemsFailure action', () => {
      const payload = errorPayload;
      const action = new LoadABFocSchemesForItemsFailure();
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_AB_FOC_SCHEMES_FOR_ITEMS_FAILURE
      });
    });
  });

  describe('SaveABFocSchemes  Action Test Cases', () => {
    it('should check correct type is used for SaveABFocSchemes   action', () => {
      const payload: OrderDetailsForFOC = {
        txnType: TransactionTypeEnum.AB,
        subTxnType: SubTransactionTypeEnum.NEW_AB
      };
      const action = new SaveABFocSchemes(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.SAVE_AB_FOC_SCHEMES,
        payload
      });
    });
    it('should check correct type is used for SaveABFocSchemesSuccess action', () => {
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
      const action = new SaveABFocSchemesSuccess(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.SAVE_AB_FOC_SCHEMES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SaveABFocSchemesFailure  action', () => {
      const payload = errorPayload;
      const action = new SaveABFocSchemesFailure(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.SAVE_AB_FOC_SCHEMES_FAILURE,
        payload
      });
    });
  });

  describe('DeleteABFocSchemes   Action Test Cases', () => {
    it('should check correct type is used for DeleteABFocSchemes   action', () => {
      const payload: OrderDetailsForFOC = {
        txnType: TransactionTypeEnum.AB,
        subTxnType: SubTransactionTypeEnum.NEW_AB
      };
      const action = new DeleteABFocSchemes(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.DELETE_AB_FOC_SCHEMES,
        payload
      });
    });
    it('should check correct type is used for DeleteABFocSchemesSuccess  action', () => {
      const payload = false;
      const action = new DeleteABFocSchemesSuccess(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.DELETE_AB_FOC_SCHEMES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for DeleteABFocSchemesFailure   action', () => {
      const payload = errorPayload;
      const action = new DeleteABFocSchemesFailure(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.DELETE_AB_FOC_SCHEMES_FAILURE,
        payload
      });
    });
  });

  describe('LoadSelectedABFocSchemes   Action Test Cases', () => {
    it('should check correct type is used for LoadSelectedABFocSchemes    action', () => {
      const payload: OrderDetailsForFOC = {
        txnType: TransactionTypeEnum.AB,
        subTxnType: SubTransactionTypeEnum.NEW_AB
      };
      const action = new LoadSelectedABFocSchemes(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_SELECTED_AB_FOC_SCHEMES,
        payload
      });
    });
    it('should check correct type is used for LoadSelectedABFocSchemesSuccess  action', () => {
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
      const action = new LoadSelectedABFocSchemesSuccess(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_SELECTED_AB_FOC_SCHEMES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadSelectedABFocSchemesFailure   action', () => {
      const payload = errorPayload;
      const action = new LoadSelectedABFocSchemesFailure(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_SELECTED_AB_FOC_SCHEMES_FAILURE,
        payload
      });
    });
  });

  describe('LoadSelectedABFocSchemesCount    Action Test Cases', () => {
    it('should check correct type is used for LoadSelectedABFocSchemesCount     action', () => {
      const payload: OrderDetailsForFOC = {
        txnType: TransactionTypeEnum.AB,
        subTxnType: SubTransactionTypeEnum.NEW_AB
      };
      const action = new LoadSelectedABFocSchemesCount(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_SELECTED_AB_FOC_SCHEMES_COUNT,
        payload
      });
    });
    it('should check correct type is used for LoadSelectedABFocSchemesCountSuccess   action', () => {
      const payload = 1;
      const action = new LoadSelectedABFocSchemesCountSuccess(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_SELECTED_AB_FOC_SCHEMES_COUNT_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadSelectedABFocSchemesCountFailure    action', () => {
      const payload = errorPayload;
      const action = new LoadSelectedABFocSchemesCountFailure(payload);
      expect({ ...action }).toEqual({
        type: FocActionTypes.LOAD_SELECTED_AB_FOC_SCHEMES_COUNT_FAILURE,
        payload
      });
    });
  });

  describe('Clear AB FOC    Action Test Cases', () => {
    it('should check correct type is used for ClearABFocSchemes  action', () => {
      const action = new ClearABFocSchemes();
      expect({ ...action }).toEqual({
        type: FocActionTypes.CLEAR_AB_FOC_SCHEME
      });
    });

    it('should check correct type is used for ClearABFocSchemesCount   action', () => {
      const action = new ClearABFocSchemesCount();
      expect({ ...action }).toEqual({
        type: FocActionTypes.CLEAR_AB_FOC_SCHEME_COUNT
      });
    });
  });
});
