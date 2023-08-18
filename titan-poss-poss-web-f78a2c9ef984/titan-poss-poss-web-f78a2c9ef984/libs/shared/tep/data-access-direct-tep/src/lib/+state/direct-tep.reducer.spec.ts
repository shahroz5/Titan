import { TepState } from './direct-tep.state';
import { initialState, TepReducer } from './direct-tep.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './direct-tep.actions';
import {
  AddOrUpdateTepItemResponse,
  AddTepItemRequestPayload,
  ConfirmOrHoldTepRequestPayload,
  ConfirmTepItemResponse,
  CreateOpenTepTransactionResponse,
  CreateTepTypesEnum,
  DeleteTepItemResponse,
  GetTepCashMemoResponse,
  GetTepItemConfiguratonResponse,
  GetTepPriceDetailsRequestPayload,
  GetTepPriceDetailsResponse,
  PatchTepRequestPayload,
  TepItemResponse,
  TepStatusEnum,
  TepTransactionResponse,
  TransactionTypeEnum,
  UpdateTepItemRequestPayload
} from '@poss-web/shared/models';
import * as moment from 'moment';

describe('TEP reducer Testing Suite', () => {
  describe('Testing Create Open TEP Transaction reducer', () => {
    beforeEach(() => {});
    it('Testing CREATE_OPEN_TEP_TRANSACTION', () => {
      const action = new actions.CreateOpenTepTransaction(
        CreateTepTypesEnum.REGULAR_TEP,
        null
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('CREATE_OPEN_TEP_TRANSACTION_SUCCESS should update createOpenTepTransactionResponse field in state', () => {
      const createOpenTepTransactionSuccessResponse: CreateOpenTepTransactionResponse = {
        docNo: 1,
        id: '',
        status: '',
        subTxnType: '',
        txnType: ''
      };
      const action = new actions.CreateOpenTepTransactionSuccess(
        createOpenTepTransactionSuccessResponse
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.createOpenTepTransactionResponse).toBe(
        createOpenTepTransactionSuccessResponse
      );
    });
    it('CREATE_OPEN_TEP_TRANSACTION_FAILURE should return error', () => {
      const action = new actions.CreateOpenTepTransactionFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing Update Open TEP Transaction reducer', () => {
    beforeEach(() => {});
    it('Testing UPDATE_OPEN_TEP_TRANSACTION', () => {
      const requestPayload: PatchTepRequestPayload = {
        customerId: 621
      };
      const action = new actions.UpdateOpenTepTransaction(
        '1234-abcd',
        CreateTepTypesEnum.REGULAR_TEP,
        requestPayload
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('UPDATE_OPEN_TEP_TRANSACTION_SUCCESS should update updateOpenTepTransactionResponse field in state', () => {
      const updateOpenTepTransactionResponse: CreateOpenTepTransactionResponse = {
        docNo: 1,
        id: '',
        status: '',
        subTxnType: '',
        txnType: ''
      };
      const action = new actions.UpdateOpenTepTransactionSuccess(
        updateOpenTepTransactionResponse
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.updateOpenTepTransactionResponse).toBe(
        updateOpenTepTransactionResponse
      );
    });
    it('UPDATE_OPEN_TEP_TRANSACTION_FAILURE should return error', () => {
      const action = new actions.UpdateOpenTepTransactionFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing Get Tep Item Configuration reducer', () => {
    beforeEach(() => {});
    it('Testing GET_TEP_ITEM_CONFIGURATION', () => {
      const action = new actions.GetTepItemConfiguration(
        '502218HDSAAA00',
        CreateTepTypesEnum.REGULAR_TEP,
        false,
        '8445678909'
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('GET_TEP_ITEM_CONFIGURATION_SUCCESS should update tepItemConfiguratonResponse field in state', () => {
      const getTepItemConfiguratonResponse: GetTepItemConfiguratonResponse = {
        isCMMandatory: true,
        isQuantityEditable: false,
        isTepAllowed: true,
        isTEPSaleBin: true,
        isCutPieceTepAllowed: true,
        isFVTAllowed: true,
        tepOfferDetails: {
          type: '',
          data: {
            deductionPercent: 2,
            flatTepExchangeValue: 70,
            isWeightToleranceAllowed: true,
            approvedBy: '',
            reasonForException: ''
          }
        },
        goldDeductionPercent: 2,
        silverDeductionPercent: 2,
        platinumDeductionPercent: 2,
        ucpDeductionPercent: 2,
        ucpDeductionFlatValue: 1000,
        isStoneChargesApplicable: true,
        stoneDeductionPercent: 2,
        cmUnavailableDeductionPercent: 2,
        recoverDiscountPercent: 2,
        refundDeductionPercent: 2,
        weightTolerancePercent: 2,
        isProportionedValue: true,
        typeOfExchange: '',
        isInterBrandTepAllowed: true,
        tepGeneralCodeConfig: {
          allowedProductGroups: [],
          isCMMandatory: true,
          isValuationAtStore: true
        },
        tepCutPieceConfig: { weightTolerancePercent: 2 },
        allowedRefundMode: 'RTGS',
        refundCashLimit: 1000
      };
      const action = new actions.GetTepItemConfigurationSuccess(
        getTepItemConfiguratonResponse
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.tepItemConfiguratonResponse).toBe(
        getTepItemConfiguratonResponse
      );
    });
    it('GET_TEP_ITEM_CONFIGURATION_FAILURE should return error', () => {
      const action = new actions.GetTepItemConfigurationFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing Load Tep Item Price Details reducer', () => {
    beforeEach(() => {});
    it('Testing LOAD_TEP_ITEM_PRICE_DETAILS', () => {
      const requestPayload: GetTepPriceDetailsRequestPayload = {
        itemCode: '',
        standardPrice: null,
        tepType: ''
      };
      const action = new actions.LoadTepItemPriceDetails(requestPayload);
      const result: TepState = TepReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('LOAD_TEP_ITEM_PRICE_DETAILS_SUCCESS should update tepPriceDetailsResponse field in state', () => {
      const getTepPriceDetailsResponse: GetTepPriceDetailsResponse = {
        currencyCode: 'INR',
        deductionAmount: 1000,
        discountRecovered: 1200,
        finalValue: 1200,
        isExceptionValue: true,
        isUCPCMValue: true,
        iscashMemoAvailable: true,
        itemCode: '',
        itemQuantity: 1,
        itemTypeCode: '',
        lotNumber: '',
        materialDetails: {
          materialWeight: 1,
          preDiscountValue: 1,
          weightUnit: ''
        },
        metalPriceDetails: {
          metalPrices: [
            {
              karat: 22,
              metalTypeCode: 'J',
              metalValue: 4560,
              netWeight: 1,
              purity: 92.7,
              ratePerUnit: 4560,
              type: '',
              weightUnit: ''
            }
          ],
          preDiscountValue: 1
        },
        netWeight: 1,
        productCategoryCode: '',
        productCategoryDesc: '',
        productGroupCode: '',
        productGroupDesc: '',
        stdWeight: 1,
        stonePriceDetails: {
          numberOfStones: 1,
          preDiscountValue: 1,
          stoneWeight: 1,
          weightUnit: ''
        },
        stones: [],
        refundDeductionAmount: 0
      };
      const action = new actions.LoadTepItemPriceDetailsSuccess(
        getTepPriceDetailsResponse
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.tepPriceDetailsResponse).toBe(getTepPriceDetailsResponse);
    });
    it('LOAD_TEP_ITEM_PRICE_DETAILS_FAILURE should return error', () => {
      const action = new actions.LoadTepItemPriceDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing Get Tep Cash Memo Item List reducer', () => {
    beforeEach(() => {});
    it('Testing GET_TEP_CASH_MEMO_ITEM_LIST', () => {
      const action = new actions.GetTepCashMemoItemList(
        'CPD',
        '258',
        '2020',
        CreateTepTypesEnum.REGULAR_TEP,
        '8445678909'
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('GET_TEP_CASH_MEMO_ITEM_LIST_SUCCESS should update tepCashMemoResponseItemList field in state', () => {
      const getTepCashMemoResponse: GetTepCashMemoResponse = {
        results: [
          {
            itemCode: '',
            lotNumber: '',
            totalWeight: 1,
            cashMemoDetailsId: '',
            totalValue: 1,
            totalQuantity: 1,
            totalPendingQuantity: 1,
            productGroupCode: '',
            isCMMandatory: true
          }
        ]
      };
      const action = new actions.GetTepCashMemoItemListSuccess(
        getTepCashMemoResponse
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.tepCashMemoResponseItemList).toBe(getTepCashMemoResponse);
    });
    it('GET_TEP_CASH_MEMO_ITEM_LIST_FAILURE should return error', () => {
      const action = new actions.GetTepCashMemoItemListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing Add TEP Item reducer', () => {
    beforeEach(() => {});
    it('Testing ADD_TEP_ITEM', () => {
      const requestPayload: AddTepItemRequestPayload = {
        finalValue: 1000,
        totalValue: 1000,
        itemCode: '',
        quantity: 1
      };
      const action = new actions.AddTepItem(
        '1234-abcd',
        CreateTepTypesEnum.REGULAR_TEP,
        requestPayload
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('ADD_TEP_ITEM_SUCCESS should update addTepItemResponse field in state', () => {
      const addOrUpdateTepItemResponse: AddOrUpdateTepItemResponse = {
        taxDetails: null,
        confirmedTime: '',
        currencyCode: '',
        customerId: 1,
        docDate: '',
        docNo: 1,
        employeeCode: '',
        firstHoldTime: '',
        fiscalYear: 1,
        id: '',
        itemDetails: {
          refDocDate: '',
          binCode: '',
          cashMemoDetailsId: '',
          finalValue: 1,
          inventoryId: '',
          itemCode: '',
          itemId: '',
          itemType: '',
          karat: 1,
          lotNumber: '',
          measuredPurity: 1,
          measuredWeight: 1,
          metalType: '',
          preMeltingDetails: {
            karatage: 1,
            purity: 1,
            weight: 1
          },
          priceDetails: {},
          purity: 1,
          quantity: 1,
          rowId: 1,
          taxDetails: {
            cess: [
              {
                cessCode: '',
                cessOnTax: true,
                cessPercentage: 0,
                cessValue: 0
              }
            ],
            data: [
              {
                taxCode: '',
                taxPercentage: 1,
                taxValue: 1
              }
            ],
            taxClass: '',
            taxType: ''
          },
          totalTax: 1,
          totalValue: 1,
          totalWeight: 1,
          unitValue: 1,
          unitWeight: 1
        },
        lastHoldTime: '',
        metalRateList: {
          metalRates: null
        },
        remarks: '',
        roundingVariance: 1,
        status: '',
        manualBillDetails: null,
        totalQuantity: 1,
        totalTax: 1,
        totalValue: 1,
        totalWeight: 1,
        weightUnit: ''
      };
      const action = new actions.AddTepItemSuccess(addOrUpdateTepItemResponse);
      const result: TepState = TepReducer(initialState, action);
      expect(result.addTepItemResponse).toBe(addOrUpdateTepItemResponse);
    });
    it('ADD_TEP_ITEM_FAILURE should return error', () => {
      const action = new actions.AddTepItemFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing Update TEP Item reducer', () => {
    beforeEach(() => {});
    it('Testing UPDATE_TEP_ITEM', () => {
      const requestPayload: UpdateTepItemRequestPayload = {
        finalValue: 1000,
        isSaleable: true,
        quantity: 1,
        stonesDetails: [],
        totalValue: 1000,
        totalWeight: 1,
        unitValue: 1000,
        unitWeight: 1
      };
      const action = new actions.UpdateTepItem(
        '1234-abcd',
        '1234-abcd-efgh',
        CreateTepTypesEnum.REGULAR_TEP,
        requestPayload
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('UPDATE_TEP_ITEM_SUCCESS should update updateTepItemResponse field in state', () => {
      const addOrUpdateTepItemResponse: AddOrUpdateTepItemResponse = {
        taxDetails: null,
        confirmedTime: '',
        currencyCode: '',
        customerId: 1,
        docDate: '',
        docNo: 1,
        employeeCode: '',
        firstHoldTime: '',
        fiscalYear: 1,
        id: '',
        itemDetails: {
          refDocDate: '',
          binCode: '',
          cashMemoDetailsId: '',
          finalValue: 1,
          inventoryId: '',
          itemCode: '',
          itemId: '',
          itemType: '',
          karat: 1,
          lotNumber: '',
          measuredPurity: 1,
          measuredWeight: 1,
          metalType: '',
          preMeltingDetails: {
            karatage: 1,
            purity: 1,
            weight: 1
          },
          priceDetails: {},
          purity: 1,
          quantity: 1,
          rowId: 1,
          taxDetails: {
            cess: [
              {
                cessCode: '',
                cessOnTax: true,
                cessPercentage: 0,
                cessValue: 0
              }
            ],
            data: [
              {
                taxCode: '',
                taxPercentage: 1,
                taxValue: 1
              }
            ],
            taxClass: '',
            taxType: ''
          },
          totalTax: 1,
          totalValue: 1,
          totalWeight: 1,
          unitValue: 1,
          unitWeight: 1
        },
        lastHoldTime: '',
        metalRateList: {
          metalRates: null
        },
        remarks: '',
        roundingVariance: 1,
        status: '',
        manualBillDetails: null,
        totalQuantity: 1,
        totalTax: 1,
        totalValue: 1,
        totalWeight: 1,
        weightUnit: ''
      };
      const action = new actions.UpdateTepItemSuccess(
        addOrUpdateTepItemResponse
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.addTepItemResponse).toBe(addOrUpdateTepItemResponse);
    });
    it('UPDATE_TEP_ITEM_FAILURE should return error', () => {
      const action = new actions.UpdateTepItemFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing Confirm TEP reducer', () => {
    beforeEach(() => {});
    it('Testing CONFIRM_TEP', () => {
      const confirmOrHoldTepRequestPayload: ConfirmOrHoldTepRequestPayload = {
        customerId: 621,
        employeeCode: 'rsocpd',
        exchangeDetails: {
          data: {},
          type: ''
        },
        metalRateList: {
          metalRates: null
        },
        remarks: '',
        totalQuantity: 1,
        totalTax: 100,
        totalValue: 1000,
        totalWeight: 1
      };
      const action = new actions.ConfirmTep(
        '1234-abcd',
        TepStatusEnum.CONFIRMED,
        CreateTepTypesEnum.REGULAR_TEP,
        confirmOrHoldTepRequestPayload
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('CONFIRM_TEP_SUCCESS should update confirmTepItemResponse field in state', () => {
      const confirmTepItemResponse: ConfirmTepItemResponse = {
        cnDocNo: 123,
        confirmedTime: '',
        currencyCode: '',
        customerId: 521,
        docDate: '',
        docNo: 251,
        employeeCode: '',
        firstHoldTime: '',
        fiscalYear: 2020,
        id: '',
        itemDetails: {
          binCode: '',
          cashMemoDetailsId: '',
          finalValue: 1000,
          inventoryId: '',
          itemCode: '',
          itemId: '',
          itemType: '',
          karat: 123,
          lotNumber: '',
          measuredPurity: 123,
          measuredWeight: 123,
          metalType: '',
          preMeltingDetails: {
            karatage: 22,
            purity: 92,
            weight: 1
          },
          priceDetails: {},
          purity: 1,
          quantity: 1,
          rowId: 1,
          taxDetails: {
            cess: [
              {
                cessCode: '',
                cessOnTax: true,
                cessPercentage: 0,
                cessValue: 0
              }
            ],
            data: [
              {
                taxCode: '',
                taxPercentage: 1,
                taxValue: 1
              }
            ],
            taxClass: '',
            taxType: ''
          },
          totalTax: 100,
          totalValue: 1000,
          totalWeight: 1,
          unitValue: 1000,
          unitWeight: 1
        },
        lastHoldTime: '',
        metalRateList: {
          metalRates: null
        },
        remarks: '',
        roundingVariance: 0,
        status: '',
        manualBillDetails: null,
        totalQuantity: 1,
        totalTax: 1,
        totalValue: 1000,
        totalWeight: 1,
        weightUnit: ''
      };
      const action = new actions.ConfirmTepSuccess(confirmTepItemResponse);
      const result: TepState = TepReducer(initialState, action);
      expect(result.confirmTepItemResponse).toBe(confirmTepItemResponse);
    });
    it('CONFIRM_TEP_FAILURE should return error', () => {
      const action = new actions.ConfirmTepFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing Delete TEP item reducer', () => {
    beforeEach(() => {});
    it('Testing DELETE_TEP_ITEM', () => {
      const action = new actions.DeleteTepItem(
        '1234-abcd',
        '1234-abcd-efgh',
        CreateTepTypesEnum.REGULAR_TEP
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('CONFIRM_TEP_SUCCESS should update confirmTepItemResponse field in state', () => {
      const deleteTepItemResponse: DeleteTepItemResponse = {
        confirmedTime: '',
        currencyCode: '',
        customerId: 1,
        docDate: '',
        docNo: 1,
        employeeCode: '',
        firstHoldTime: '',
        fiscalYear: 1,
        id: '',
        itemDetails: {
          binCode: '',
          cashMemoDetailsId: '',
          finalValue: 1,
          inventoryId: '',
          itemCode: '',
          itemId: '',
          itemType: '',
          karat: 1,
          lotNumber: '',
          measuredPurity: 1,
          measuredWeight: 1,
          metalType: '',
          preMeltingDetails: {
            karatage: 1,
            purity: 1,
            weight: 1
          },
          priceDetails: {},
          purity: 1,
          quantity: 1,
          rowId: 1,
          taxDetails: {
            cess: [
              {
                cessCode: '',
                cessOnTax: true,
                cessPercentage: 0,
                cessValue: 0
              }
            ],
            data: [
              {
                taxCode: '',
                taxPercentage: 1,
                taxValue: 1
              }
            ],
            taxClass: '',
            taxType: ''
          },
          totalTax: 1,
          totalValue: 1,
          totalWeight: 1,
          unitValue: 1,
          unitWeight: 1
        },
        lastHoldTime: '',
        metalRateList: {
          metalRates: null
        },
        remarks: '',
        roundingVariance: 1,
        status: '',
        manualBillDetails: null,
        totalQuantity: 1,
        totalTax: 1,
        totalValue: 1,
        totalWeight: 1,
        weightUnit: ''
      };
      const action = new actions.DeleteTepItemSuccess(deleteTepItemResponse);
      const result: TepState = TepReducer(initialState, action);
      expect(result.deleteTepItemResponse).toBe(deleteTepItemResponse);
    });
    it('CONFIRM_TEP_FAILURE should return error', () => {
      const action = new actions.DeleteTepItemFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing Load Rso List reducer', () => {
    beforeEach(() => {});
    it('Testing LOAD_RSO_LIST', () => {
      const action = new actions.LoadRsoList('RSO');
      const result: TepState = TepReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('LOAD_RSO_LIST_SUCCESS should update confirmTepItemResponse field in state', () => {
      const action = new actions.LoadRsoListSuccess([{ value: 'rsocpd', description: 'rsocpd' }]);
      const result: TepState = TepReducer(initialState, action);
      expect(result.rsoList[0]).toBeDefined();
    });
    it('LOAD_RSO_LIST_FAILURE should return error', () => {
      const action = new actions.LoadRsoListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing Load Cm List Item TEP Configuration reducer', () => {
    beforeEach(() => {});
    it('Testing LOAD_CM_LIST_ITEM_TEP_CONFIGURATION', () => {
      const action = new actions.LoadCmListItemTepConfiguration(
        '',
        '',
        false,
        ''
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('LOAD_CM_LIST_ITEM_TEP_CONFIGURATION_SUCCESS should update confirmTepItemResponse field in state', () => {
      const getTepItemConfiguratonResponse: GetTepItemConfiguratonResponse = {
        allowedRefundMode: 'RTGS',
        refundCashLimit: 1000,
        isCMMandatory: true,
        isQuantityEditable: false,
        isTepAllowed: true,
        isTEPSaleBin: true,
        isCutPieceTepAllowed: true,
        isFVTAllowed: true,
        tepOfferDetails: {
          type: '',
          data: {
            deductionPercent: 2,
            flatTepExchangeValue: 70,
            isWeightToleranceAllowed: true,
            approvedBy: '',
            reasonForException: ''
          }
        },
        goldDeductionPercent: 2,
        silverDeductionPercent: 2,
        platinumDeductionPercent: 2,
        ucpDeductionPercent: 2,
        ucpDeductionFlatValue: 1000,
        isStoneChargesApplicable: true,
        stoneDeductionPercent: 2,
        cmUnavailableDeductionPercent: 2,
        recoverDiscountPercent: 2,
        refundDeductionPercent: 2,
        weightTolerancePercent: 2,
        isProportionedValue: true,
        typeOfExchange: '',
        isInterBrandTepAllowed: true,
        tepGeneralCodeConfig: {
          allowedProductGroups: [],
          isCMMandatory: true,
          isValuationAtStore: true
        },
        tepCutPieceConfig: { weightTolerancePercent: 2 }
      };
      const action = new actions.LoadCmListItemTepConfigurationSuccess(
        getTepItemConfiguratonResponse
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.cmListItemTepConfigurationResponse).toBe(
        getTepItemConfiguratonResponse
      );
    });
    it('LOAD_CM_LIST_ITEM_TEP_CONFIGURATION_FAILURE should return error', () => {
      const action = new actions.LoadCmListItemTepConfigurationFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing Load Tep Item Code Details reducer', () => {
    beforeEach(() => {});
    it('Testing LOAD_TEP_ITEM_CODE_DETAILS', () => {
      const action = new actions.LoadTepItemCodeDetails('502218HDSAAA00');
      const result: TepState = TepReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('LOAD_TEP_ITEM_CODE_DETAILS_SUCCESS should update confirmTepItemResponse field in state', () => {
      const action = new actions.LoadTepItemCodeDetailsSuccess('');
      const result: TepState = TepReducer(initialState, action);
      expect(result.scannedTepItemCode).toBe('');
    });
    it('LOAD_TEP_ITEM_CODE_DETAILS_FAILURE should return error', () => {
      const action = new actions.LoadTepItemCodeDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing Load Tep Item Details reducer', () => {
    beforeEach(() => {});
    it('Testing LOAD_TEP_ITEM_DETAILS', () => {
      const action = new actions.LoadTepItemDetails(
        '1234-abcd',
        '1234-abcd-efgh',
        CreateTepTypesEnum.REGULAR_TEP,
        CreateTepTypesEnum.REGULAR_TEP,
        '8970890890'
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('LOAD_TEP_ITEM_DETAILS_SUCCESS should update confirmTepItemResponse field in state', () => {
      const tepItemResponse: TepItemResponse = {
        binCode: '',
        cashMemoDetailsId: '',
        discountDetails: {
          data: null,
          type: ''
        },
        finalValue: 1000,
        inventoryId: '',
        itemCode: '',
        itemId: '',
        itemType: '',
        karat: 22,
        lotNumber: '',
        measuredPurity: 92,
        measuredWeight: 1,
        metalType: '',
        preMeltingDetails: {
          karatage: 22,
          purity: 92,
          weight: 1
        },
        priceDetails: null,
        purity: 92,
        quantity: 1,
        rowId: 1,
        stones: [],
        taxDetails: {
          cess: [
            {
              cessCode: '',
              cessOnTax: true,
              cessPercentage: 1,
              cessValue: 100
            }
          ],
          data: [
            {
              taxCode: '',
              taxPercentage: 1,
              taxValue: 100
            }
          ],
          taxClass: '',
          taxType: ''
        },
        totalTax: 100,
        totalValue: 1000,
        totalWeight: 1,
        unitValue: 1000,
        unitWeight: 1,
        itemDetails: {
          type: '',
          data: null
        }
      };
      const action = new actions.LoadTepItemDetailsSuccess(tepItemResponse);
      const result: TepState = TepReducer(initialState, action);
      expect(result.viewTepItemResponse).toBe(tepItemResponse);
    });
    it('LOAD_TEP_ITEM_DETAILS_FAILURE should return error', () => {
      const action = new actions.LoadTepItemDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing Load Tep Transaction Details reducer', () => {
    beforeEach(() => {});
    it('Testing LOAD_TEP_TRANSACTION_DETAILS', () => {
      const action = new actions.LoadTepTransactionDetails(
        '1234-abcd',
        CreateTepTypesEnum.REGULAR_TEP
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('LOAD_TEP_TRANSACTION_DETAILS_SUCCESS should update confirmTepItemResponse field in state', () => {
      const tepTransactionResponse: TepTransactionResponse = {
        confirmedTime: '',
        currencyCode: '',
        customerId: 521,
        docDate: '',
        reason: 'Full Value TEP Reason',
        docNo: 241,
        employeeCode: '',
        exchangeDetails: null,
        firstHoldTime: moment(),
        fiscalYear: 2020,
        id: '',
        itemIdList: [],
        lastHoldTime: moment(),
        manualBillDetails: null,
        manualBillId: '',
        metalRateList: {
          metalRates: null
        },
        roundingVariance: 0,
        status: '',
        taxDetails: null,
        totalQuantity: 1,
        totalTax: 100,
        totalValue: 1000,
        totalWeight: 1,
        weightUnit: 'gms'
      };
      const action = new actions.LoadTepTransactionDetailsSuccess(
        tepTransactionResponse
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.viewTepTransactionResponse).toBe(tepTransactionResponse);
    });
    it('LOAD_TEP_TRANSACTION_DETAILS_FAILURE should return error', () => {
      const action = new actions.LoadTepTransactionDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing Delete Tep Transaction Details reducer', () => {
    beforeEach(() => {});
    it('Testing DELETE_TEP_TRANSACTION_DETAILS', () => {
      const action = new actions.DeleteTepTransactionDetails(
        '1234-abcd',
        CreateTepTypesEnum.REGULAR_TEP
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('DELETE_TEP_TRANSACTION_DETAILS_SUCCESS should update confirmTepItemResponse field in state', () => {
      const action = new actions.DeleteTepTransactionDetailsSuccess('Success');
      const result: TepState = TepReducer(initialState, action);
      expect(result.deleteTepTransactionResponse).toBe('Success');
    });
    it('DELETE_TEP_TRANSACTION_DETAILS_FAILURE should return error', () => {
      const action = new actions.DeleteTepTransactionDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing Load Gold Plus Locations reducer', () => {
    beforeEach(() => {});
    it('Testing LOAD_GOLD_PLUS_LOCATIONS', () => {
      const action = new actions.LoadGoldPlusLocations();
      const result: TepState = TepReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('LOAD_GOLD_PLUS_LOCATIONS_SUCCESS should update confirmTepItemResponse field in state', () => {
      const mockResponse = [
        { description: '', locationCode: '', locationFormat: '' }
      ];
      const action = new actions.LoadGoldPlusLocationsSuccess(mockResponse);
      const result: TepState = TepReducer(initialState, action);
      expect(result.goldPlusLocations).toBe(mockResponse);
    });
    it('LOAD_GOLD_PLUS_LOCATIONS_FAILURE should return error', () => {
      const action = new actions.LoadGoldPlusLocationsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing Other reducer', () => {
    beforeEach(() => {});
    it('Testing SET_REMARKS', () => {
      const action = new actions.SetRemarks('Remarks');
      const result: TepState = TepReducer(initialState, action);
      expect(result.remarks).toBe('Remarks');
    });
    it('Testing SET_TOTALQTY', () => {
      const action = new actions.SetTotalQty(1);
      const result: TepState = TepReducer(initialState, action);
      expect(result.totalQty).toBe(1);
    });
    it('Testing SET_TOTAL_GROSS_WT', () => {
      const action = new actions.SetTotalGrossWt(1);
      const result: TepState = TepReducer(initialState, action);
      expect(result.totalGrossWt).toBe(1);
    });
    it('Testing SET_TOTAL_EXCHANGE_AMT', () => {
      const action = new actions.SetTotalExchangeAmt(1200);
      const result: TepState = TepReducer(initialState, action);
      expect(result.totalExchangeAmt).toBe(1200);
    });
    it('Testing SELECTED_PAYMENT_METHOD', () => {
      const action = new actions.SelectedPaymentMethod('CN');
      const result: TepState = TepReducer(initialState, action);
      expect(result.selectedPaymentMethod).toBe('CN');
    });
    it('Testing SELECTED_TEP_TYPE', () => {
      const action = new actions.SelectedTepType(
        CreateTepTypesEnum.FULL_VALUE_TEP
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.selectedTepType).toBe(CreateTepTypesEnum.FULL_VALUE_TEP);
    });
    it('Testing RESET_TEP', () => {
      const action = new actions.ResetTep();
      const result: TepState = TepReducer(initialState, action);
      expect(result.remarks).toBe('');
    });
    it('Testing SET_SELECTED_RSO_NAME', () => {
      const action = new actions.SetSelectedRsoName({
        value: 'rsocpd',
        description: 'rsocpd'
      });
      const result: TepState = TepReducer(initialState, action);
      expect(result.selectedRsoName['value']).toBe('rsocpd');
    });
    it('Testing SET_CUT_PIECE_TOTAL_QTY', () => {
      const action = new actions.SetCutPieceTotalQty(1);
      const result: TepState = TepReducer(initialState, action);
      expect(result.cutPieceTotalQty).toBe(1);
    });
    it('Testing SET_CUT_PIECE_TOTAL_VALUE', () => {
      const action = new actions.SetCutPieceTotalValue(1230);
      const result: TepState = TepReducer(initialState, action);
      expect(result.cutPieceTotalValue).toBe(1230);
    });
    it('Testing SET_IS_REFUND_FORM_VALID', () => {
      const action = new actions.SetIsRefundFormValid(true);
      const result: TepState = TepReducer(initialState, action);
      expect(result.isRefundFormValid).toBe(true);
    });
    it('Testing SET_IS_REQUEST_RAISING_SCENARIO', () => {
      const action = new actions.SetIsRequestRaisingScenario(true);
      const result: TepState = TepReducer(initialState, action);
      expect(result.isRequestRaisingScenario).toBe(true);
    });
    it('Testing UPDATE_TEP_ITEM_PRICE_DETAILS', () => {
      const action = new actions.UpdateTepItemPriceDetails({
        itemCode: '',
        standardPrice: null,
        tepType: 'NEW_TEP'
      });
      const result: TepState = TepReducer(initialState, action);
      expect(result.isLoadingPriceUpdate).toBe(true);
    });
    it('Testing FILE_ID_PROOF_DOWNLOAD_URL', () => {
      const action = new actions.FileIdProofDownloadUrl({
        txnType: TransactionTypeEnum.TEP,
        id: ''
      });
      const result: TepState = TepReducer(initialState, action);
      expect(result.downloadIdProofFileUrl).toBe(null);
    });
    it('Testing FILE_CANCELLED_CHEQUE_DOWNLOAD_URL', () => {
      const action = new actions.FileCancelledChequeDownloadUrl({
        txnType: TransactionTypeEnum.TEP,
        id: ''
      });
      const result: TepState = TepReducer(initialState, action);
      expect(result.downloadCancelledChequeFileUrl).toBe(null);
    });

    it('Testing FILE_APPROVAL_MAIL_DOWNLOAD_URL', () => {
      const action = new actions.FileApprovalMailDownloadUrl({
        txnType: TransactionTypeEnum.TEP,
        id: ''
      });
      const result: TepState = TepReducer(initialState, action);
      expect(result.downloadApprovalMailFileUrl).toBe(null);
    });

    it('Testing FILE_UPLOAD_SUCCESS', () => {
      const action = new actions.FileUpload({
        txnType: TransactionTypeEnum.TEP,
        id: ''
      });
      const result: TepState = TepReducer(initialState, action);
      expect(result.uploadFileResponse).toBe(false);
    });

    it('Testing FILE_UPLOAD_SUCCESS', () => {
      const action = new actions.FileUpload({
        txnType: TransactionTypeEnum.TEP,
        id: ''
      });
      const result: TepState = TepReducer(initialState, action);
      expect(result.uploadFileResponse).toBe(false);
    });

    it('Testing FILE_UPLOAD_SUCCESS', () => {
      const action = new actions.FileUploadSuccess(true);
      const result: TepState = TepReducer(initialState, action);
      expect(result.uploadFileResponse).toBe(true);
    });

    it('Testing FILE_ID_PROOF_DOWNLOAD_URL_SUCCESS', () => {
      const action = new actions.FileIdProofDownloadUrlSuccess('abc');
      const result: TepState = TepReducer(initialState, action);
      expect(result.downloadIdProofFileUrl).toBe('abc');
    });

    it('Testing FILE_CANCELLED_CHEQUE_DOWNLOAD_URL_SUCCESS', () => {
      const action = new actions.FileCancelledChequeDownloadUrlSuccess('abc');
      const result: TepState = TepReducer(initialState, action);
      expect(result.downloadCancelledChequeFileUrl).toBe('abc');
    });

    it('Testing FILE_APPROVAL_MAIL_DOWNLOAD_URL_SUCCESS', () => {
      const action = new actions.FileApprovalMailDownloadUrlSuccess('abc');
      const result: TepState = TepReducer(initialState, action);
      expect(result.downloadApprovalMailFileUrl).toBe('abc');
    });

    it('Testing FILE_UPLOAD_FAILURE', () => {
      const action = new actions.FileUploadFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.uploadFileResponse).toBe(null);
      expect(result.errors.message).toBe('some error');
    });

    it('Testing FILE_ID_PROOF_DOWNLOAD_URL_FAILURE', () => {
      const action = new actions.FileIdProofDownloadUrlFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toBe('some error');
    });

    it('Testing FILE_CANCELLED_CHEQUE_DOWNLOAD_URL_FAILURE', () => {
      const action = new actions.FileCancelledChequeDownloadUrlFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toBe('some error');
    });

    it('Testing FILE_APPROVAL_MAIL_DOWNLOAD_URL_FAILURE', () => {
      const action = new actions.FileApprovalMailDownloadUrlFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toBe('some error');
    });

    it('Testing UPDATE_TEP_ITEM_PRICE_DETAILS_SUCCESS', () => {
      const action = new actions.UpdateTepItemPriceDetailsSuccess(null);
      const result: TepState = TepReducer(initialState, action);
      expect(result.UpdatePriceDetailsResponse).toBe(null);
    });

    it('Testing UPDATE_TEP_ITEM_PRICE_DETAILS_FAILURE', () => {
      const action = new actions.UpdateTepItemPriceDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toBe('some error');
    });

    it('Testing LOAD_WORKFLOW_DETAILS_FAILURE', () => {
      const action = new actions.LoadWorkflowDeatilsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toBe('some error');
    });

    it('Testing LOAD_WORKFLOW_DETAILS_SUCCESS', () => {
      const action = new actions.LoadWorkflowDeatilsSuccess(null);
      const result: TepState = TepReducer(initialState, action);
      expect(result.selectedData).toBe(null);
    });

    it('Testing LOAD_FTEP_REASONS_SUCCESS', () => {
      const action = new actions.LoadFtepReasonsSuccess(['reason1']);
      const result: TepState = TepReducer(initialState, action);
      expect(result.fvtReasons.length).toBe(1);
    });

    it('Testing LOAD_FTEP_REASONS_FAILURE', () => {
      const action = new actions.LoadFtepReasonsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toBe('some error');
    });

    it('Testing UPDATE_TEP_TRANSACTION_PRICE_DETAILS', () => {
      const action = new actions.LoadTepTransactionDetails('', '');
      const result: TepState = TepReducer(initialState, action);
      expect(result.updateTepTransactionPriceDetailsResponse).toBe(null);
    });

    it('Testing UPDATE_TEP_TRANSACTION_PRICE_DETAILS_SUCCESS', () => {
      const action = new actions.LoadTepTransactionDetailsSuccess(null);
      const result: TepState = TepReducer(initialState, action);
      expect(result.updateTepTransactionPriceDetailsResponse).toBe(null);
    });

    it('Testing UPDATE_TEP_TRANSACTION_PRICE_DETAILS_FAILURE', () => {
      const action = new actions.LoadTepTransactionDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toBe('some error');
    });

    it('Testing CREATE_OPEN_CUT_PIECE_TEP_TRANSACTION', () => {
      const action = new actions.CreateOpenCutPieceTepTransaction();
      const result: TepState = TepReducer(initialState, action);
      expect(result.createOpenCutPieceTepTransactionResponse).toBe(null);
    });

    it('Testing CREATE_OPEN_CUT_PIECE_TEP_TRANSACTION_SUCCESS', () => {
      const action = new actions.CreateOpenCutPieceTepTransactionSuccess(null);
      const result: TepState = TepReducer(initialState, action);
      expect(result.createOpenCutPieceTepTransactionResponse).toBe(null);
    });

    it('Testing CREATE_OPEN_CUT_PIECE_TEP_TRANSACTION_FAILURE', () => {
      const action = new actions.CreateOpenCutPieceTepTransactionFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toBe('some error');
    });

    it('Testing PATCH_CUT_PIECE_TEP_TRANSACTION', () => {
      const action = new actions.PatchCutPieceTepItem('', '', null);
      const result: TepState = TepReducer(initialState, action);
      expect(result.patchCutPieceTepItemResponse).toBe(null);
    });

    it('Testing PATCH_CUT_PIECE_TEP_TRANSACTION_SUCCESS', () => {
      const action = new actions.PatchCutPieceTepItemSuccess(null);
      const result: TepState = TepReducer(initialState, action);
      expect(result.patchCutPieceTepItemResponse).toBe(null);
    });

    it('Testing PATCH_CUT_PIECE_TEP_TRANSACTION_FAILURE', () => {
      const action = new actions.PatchCutPieceTepItemFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toBe('some error');
    });

    it('Testing ADD_CUT_PIECE_TEP_ITEM', () => {
      const action = new actions.AddCutPieceTepItem('', null);
      const result: TepState = TepReducer(initialState, action);
      expect(result.addCutPieceTepItemResponse).toBe(null);
    });

    it('Testing ADD_CUT_PIECE_TEP_ITEM_SUCCESS', () => {
      const action = new actions.AddCutPieceTepItemSuccess(null);
      const result: TepState = TepReducer(initialState, action);
      expect(result.addCutPieceTepItemResponse).toBe(null);
    });

    it('Testing ADD_CUT_PIECE_TEP_ITEM_FAILURE', () => {
      const action = new actions.AddCutPieceTepItemFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toBe('some error');
    });

    it('Testing PATCH_CUT_PIECE_TEP_ITEM', () => {
      const action = new actions.PatchCutPieceTepItem('', '', null);
      const result: TepState = TepReducer(initialState, action);
      expect(result.patchCutPieceTepItemResponse).toBe(null);
    });

    it('Testing PATCH_CUT_PIECE_TEP_ITEM_SUCCESS', () => {
      const action = new actions.PatchCutPieceTepItemSuccess(null);
      const result: TepState = TepReducer(initialState, action);
      expect(result.patchCutPieceTepItemResponse).toBe(null);
    });

    it('Testing PATCH_CUT_PIECE_TEP_ITEM_FAILURE', () => {
      const action = new actions.PatchCutPieceTepItemFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toBe('some error');
    });

    it('Testing CONFIRM_CUT_PIECE_TEP_TRANSACTION', () => {
      const action = new actions.ConfirmCutPieceTepTransaction('', null);
      const result: TepState = TepReducer(initialState, action);
      expect(result.confirmCutPieceTepItemResponse).toBe(null);
    });

    it('Testing CONFIRM_CUT_PIECE_TEP_TRANSACTION_SUCCESS', () => {
      const action = new actions.ConfirmCutPieceTepTransactionSuccess(null);
      const result: TepState = TepReducer(initialState, action);
      expect(result.confirmCutPieceTepItemResponse).toBe(null);
    });

    it('Testing CONFIRM_CUT_PIECE_TEP_TRANSACTION_FAILURE', () => {
      const action = new actions.ConfirmCutPieceTepTransactionFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toBe('some error');
    });

    it('Testing LOAD_AVAILABLE_DISCOUNTS_LIST_SUCCESS', () => {
      const action = new actions.LoadAvailableDiscountsListSuccess([]);
      const result: TepState = TepReducer(initialState, action);
      expect(result.confirmCutPieceTepItemResponse).toBe(null);
    });

    it('Testing LOAD_AVAILABLE_DISCOUNTS_LIST_FAILURE', () => {
      const action = new actions.LoadAvailableDiscountsListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toBe('some error');
    });

    it('Testing GET_TEP_ITEM_EXCEPTION_CONFIGURATION_SUCCESS', () => {
      const action = new actions.GetTepItemExceptionConfigurationSuccess({} as any);
      const result: TepState = TepReducer(initialState, action);
      expect(result.isExceptionScenario).toBe(false);
    });

    it('Testing GET_TEP_ITEM_EXCEPTION_CONFIGURATION_FAILURE', () => {
      const action = new actions.GetTepItemExceptionConfigurationFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: TepState = TepReducer(initialState, action);
      expect(result.errors.message).toBe('some error');
    });
  });
});
