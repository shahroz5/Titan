import {
  TepActionTypes,
  CreateOpenTepTransaction,
  CreateOpenTepTransactionSuccess,
  CreateOpenTepTransactionFailure,
  UpdateOpenTepTransaction,
  UpdateOpenTepTransactionSuccess,
  UpdateOpenTepTransactionFailure,
  GetTepItemConfiguration,
  GetTepItemConfigurationSuccess,
  GetTepItemConfigurationFailure,
  GetTepCashMemoItemList,
  GetTepCashMemoItemListSuccess,
  GetTepCashMemoItemListFailure,
  LoadTepItemPriceDetails,
  LoadTepItemPriceDetailsSuccess,
  AddTepItem,
  AddTepItemSuccess,
  AddTepItemFailure,
  UpdateTepItem,
  UpdateTepItemSuccess,
  UpdateTepItemFailure,
  ConfirmTep,
  ConfirmTepSuccess,
  ConfirmTepFailure,
  DeleteTepItem,
  DeleteTepItemSuccess,
  DeleteTepItemFailure,
  LoadRsoList,
  LoadRsoListSuccess,
  LoadRsoListFailure,
  LoadTepItemCodeDetails,
  LoadTepItemCodeDetailsSuccess,
  LoadTepItemCodeDetailsFailure,
  LoadTepItemDetails,
  LoadTepItemDetailsSuccess,
  LoadTepItemDetailsFailure,
  LoadTepTransactionDetails,
  LoadTepTransactionDetailsSuccess,
  LoadTepTransactionDetailsFailure,
  DeleteTepTransactionDetails,
  DeleteTepTransactionDetailsSuccess,
  DeleteTepTransactionDetailsFailure,
  SetRemarks,
  SetTotalQty,
  SetTotalGrossWt,
  SetTotalExchangeAmt,
  SelectedPaymentMethod,
  SelectedTepType,
  ResetTep,
  SetTepItemProductCode,
  SetCutPieceTotalQty,
  SetCutPieceTotalValue,
  SetIsRefundFormValid,
  SetIsRequestRaisingScenario,
  SetSelectedRsoName,
  LoadGoldPlusLocations,
  LoadGoldPlusLocationsSuccess,
  LoadGoldPlusLocationsFailure
} from './direct-tep.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  AddOrUpdateTepItemResponse,
  AddTepItemRequestPayload,
  ConfirmOrHoldTepRequestPayload,
  ConfirmTepItemResponse,
  CreateOpenTepTransactionResponse,
  CreateTepTypesEnum,
  CustomErrors,
  DeleteTepItemResponse,
  GetTepCashMemoResponse,
  GetTepItemConfiguratonResponse,
  GetTepPriceDetailsRequestPayload,
  GetTepPriceDetailsResponse,
  PatchTepRequestPayload,
  TepItemResponse,
  TepStatusEnum,
  TepTransactionResponse,
  TepTxnTypesEnum,
  UpdateTepItemRequestPayload
} from '@poss-web/shared/models';
import { createReducer } from '@ngrx/store';
import * as moment from 'moment';

describe('TEP Actions Testing', () => {
  describe('CreateOpenTepTransaction Action Test Cases', () => {
    it('should check correct type is used for CreateOpenTepTransaction action ', () => {
      const action = new CreateOpenTepTransaction(
        TepTxnTypesEnum.NEW_TEP,
        null
      );
      expect({ ...action }).toEqual({
        type: TepActionTypes.CREATE_OPEN_TEP_TRANSACTION,
        subTransactionType: TepTxnTypesEnum.NEW_TEP,
        requestPayload: null
      });
    });
    it('should check correct type is used for CreateOpenTepTransactionSuccess action ', () => {
      const createOpenTepTransactionSuccessResponse: CreateOpenTepTransactionResponse = {
        docNo: 1,
        id: '',
        status: '',
        subTxnType: '',
        txnType: ''
      };
      const action = new CreateOpenTepTransactionSuccess(
        createOpenTepTransactionSuccessResponse
      );
      expect({ ...action }).toEqual({
        type: TepActionTypes.CREATE_OPEN_TEP_TRANSACTION_SUCCESS,
        payload: createOpenTepTransactionSuccessResponse
      });
    });
    it('should check correct type is used for  CreateOpenTepTransactionFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CreateOpenTepTransactionFailure(payload);
      expect({ ...action }).toEqual({
        type: TepActionTypes.CREATE_OPEN_TEP_TRANSACTION_FAILURE,
        payload
      });
    });
  });

  describe('UpdateOpenTepTransaction Action Test Cases', () => {
    it('should check correct type is used for UpdateOpenTepTransaction action ', () => {
      const requestPayload: PatchTepRequestPayload = {
        customerId: 621
      };
      const action = new UpdateOpenTepTransaction(
        '1234-abcd',
        CreateTepTypesEnum.REGULAR_TEP,
        requestPayload
      );
      expect({ ...action }).toEqual({
        type: TepActionTypes.UPDATE_OPEN_TEP_TRANSACTION,
        id: '1234-abcd',
        subTransactionType: CreateTepTypesEnum.REGULAR_TEP,
        requestPayload
      });
    });
    it('should check correct type is used for UpdateOpenTepTransactionSuccess action ', () => {
      const updateOpenTepTransactionSuccessResponse: CreateOpenTepTransactionResponse = {
        docNo: 1,
        id: '',
        status: '',
        subTxnType: '',
        txnType: ''
      };
      const action = new UpdateOpenTepTransactionSuccess(
        updateOpenTepTransactionSuccessResponse
      );
      expect({ ...action }).toEqual({
        type: TepActionTypes.UPDATE_OPEN_TEP_TRANSACTION_SUCCESS,
        payload: updateOpenTepTransactionSuccessResponse
      });
    });
    it('should check correct type is used for  UpdateOpenTepTransactionFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateOpenTepTransactionFailure(payload);
      expect({ ...action }).toEqual({
        type: TepActionTypes.UPDATE_OPEN_TEP_TRANSACTION_FAILURE,
        payload
      });
    });
  });

  describe('GetTepItemConfiguration Action Test Cases', () => {
    it('should check correct type is used for GetTepItemConfiguration action ', () => {
      const action = new GetTepItemConfiguration(
        '502218HDSAAA00',
        CreateTepTypesEnum.REGULAR_TEP,
        false,
        '8445678909'
      );
      expect({ ...action }).toEqual({
        type: TepActionTypes.GET_TEP_ITEM_CONFIGURATION,
        itemCode: '502218HDSAAA00',
        tepType: CreateTepTypesEnum.REGULAR_TEP,
        isDummy: false,
        customerMobileNo: '8445678909'
      });
    });
    it('should check correct type is used for GetTepItemConfigurationSuccess action ', () => {
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
      const action = new GetTepItemConfigurationSuccess(
        getTepItemConfiguratonResponse
      );
      expect({ ...action }).toEqual({
        type: TepActionTypes.GET_TEP_ITEM_CONFIGURATION_SUCCESS,
        payload: getTepItemConfiguratonResponse
      });
    });
    it('should check correct type is used for  GetTepItemConfigurationFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetTepItemConfigurationFailure(payload);
      expect({ ...action }).toEqual({
        type: TepActionTypes.GET_TEP_ITEM_CONFIGURATION_FAILURE,
        payload
      });
    });
  });

  describe('GetTepCashMemoItemList Action Test Cases', () => {
    it('should check correct type is used for GetTepCashMemoItemList action ', () => {
      const action = new GetTepCashMemoItemList(
        'CPD',
        '258',
        '2020',
        CreateTepTypesEnum.REGULAR_TEP,
        '8445678909'
      );
      expect({ ...action }).toEqual({
        type: TepActionTypes.GET_TEP_CASH_MEMO_ITEM_LIST,
        locationCode: 'CPD',
        refDocNo: '258',
        refFiscalYear: '2020',
        subTransactionType: CreateTepTypesEnum.REGULAR_TEP,
        mobileNumber: '8445678909'
      });
    });
    it('should check correct type is used for GetTepCashMemoItemListSuccess action ', () => {
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
      const action = new GetTepCashMemoItemListSuccess(getTepCashMemoResponse);
      expect({ ...action }).toEqual({
        type: TepActionTypes.GET_TEP_CASH_MEMO_ITEM_LIST_SUCCESS,
        payload: getTepCashMemoResponse
      });
    });
    it('should check correct type is used for  GetTepCashMemoItemListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetTepCashMemoItemListFailure(payload);
      expect({ ...action }).toEqual({
        type: TepActionTypes.GET_TEP_CASH_MEMO_ITEM_LIST_FAILURE,
        payload
      });
    });
  });

  describe('LoadTepItemPriceDetails Action Test Cases', () => {
    it('should check correct type is used for LoadTepItemPriceDetails action ', () => {
      const requestPayload: GetTepPriceDetailsRequestPayload = {
        itemCode: '',
        standardPrice: null,
        tepType: undefined
      };
      const action = new LoadTepItemPriceDetails(requestPayload, null, null);
      expect({ ...action }).toEqual({
        type: TepActionTypes.LOAD_TEP_ITEM_PRICE_DETAILS,
        requestPayload,
        locationCode: null,
        customerId: null,
        customerType: undefined,
        tepType: undefined
      });
    });
    it('should check correct type is used for LoadTepItemPriceDetailsSuccess action ', () => {
      const getTepPriceDetailsResponse: GetTepPriceDetailsResponse = {
        currencyCode: 'INR',
        deductionAmount: 1000,
        discountRecovered: 1200,
        finalValue: 1200,
        isExceptionValue: true,
        isUCPCMValue: true,
        iscashMemoAvailable: true,
        refundDeductionAmount: 0,
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
        stones: []
      };
      const action = new LoadTepItemPriceDetailsSuccess(
        getTepPriceDetailsResponse
      );
      expect({ ...action }).toEqual({
        type: TepActionTypes.LOAD_TEP_ITEM_PRICE_DETAILS_SUCCESS,
        payload: getTepPriceDetailsResponse
      });
    });
    it('should check correct type is used for  GetTepCashMemoItemListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetTepCashMemoItemListFailure(payload);
      expect({ ...action }).toEqual({
        type: TepActionTypes.GET_TEP_CASH_MEMO_ITEM_LIST_FAILURE,
        payload
      });
    });
  });

  describe('AddTepItem Action Test Cases', () => {
    it('should check correct type is used for AddTepItem action ', () => {
      const requestPayload: AddTepItemRequestPayload = {
        finalValue: 1000,
        totalValue: 1000,
        itemCode: '',
        quantity: 1
      };
      const action = new AddTepItem(
        '1234-abcd',
        CreateTepTypesEnum.REGULAR_TEP,
        requestPayload
      );
      expect({ ...action }).toEqual({
        type: TepActionTypes.ADD_TEP_ITEM,
        id: '1234-abcd',
        subTransactionType: CreateTepTypesEnum.REGULAR_TEP,
        requestPayload
      });
    });
    it('should check correct type is used for AddTepItemSuccess action ', () => {
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
          taxDetails: null,
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
      const action = new AddTepItemSuccess(addOrUpdateTepItemResponse);
      expect({ ...action }).toEqual({
        type: TepActionTypes.ADD_TEP_ITEM_SUCCESS,
        payload: addOrUpdateTepItemResponse
      });
    });
    it('should check correct type is used for  AddTepItemFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new AddTepItemFailure(payload);
      expect({ ...action }).toEqual({
        type: TepActionTypes.ADD_TEP_ITEM_FAILURE,
        payload
      });
    });
  });

  describe('UpdateTepItem Action Test Cases', () => {
    it('should check correct type is used for UpdateTepItem action ', () => {
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
      const action = new UpdateTepItem(
        '1234-abcd',
        '1234-abcd-efgh',
        CreateTepTypesEnum.REGULAR_TEP,
        requestPayload
      );
      expect({ ...action }).toEqual({
        type: TepActionTypes.UPDATE_TEP_ITEM,
        id: '1234-abcd',
        itemId: '1234-abcd-efgh',
        subTransactionType: CreateTepTypesEnum.REGULAR_TEP,
        requestPayload
      });
    });
    it('should check correct type is used for UpdateTepItemSuccess action ', () => {
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
      const action = new UpdateTepItemSuccess(addOrUpdateTepItemResponse);
      expect({ ...action }).toEqual({
        type: TepActionTypes.UPDATE_TEP_ITEM_SUCCESS,
        payload: addOrUpdateTepItemResponse
      });
    });
    it('should check correct type is used for  AddTepItemFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateTepItemFailure(payload);
      expect({ ...action }).toEqual({
        type: TepActionTypes.UPDATE_TEP_ITEM_FAILURE,
        payload
      });
    });
  });

  describe('ConfirmTep Action Test Cases', () => {
    it('should check correct type is used for ConfirmTep action ', () => {
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
      const action = new ConfirmTep(
        '1234-abcd',
        TepStatusEnum.CONFIRMED,
        CreateTepTypesEnum.REGULAR_TEP,
        confirmOrHoldTepRequestPayload
      );
      expect({ ...action }).toEqual({
        type: TepActionTypes.CONFIRM_TEP,
        id: '1234-abcd',
        status: TepStatusEnum.CONFIRMED,
        subTransactionType: CreateTepTypesEnum.REGULAR_TEP,
        requestPayload: confirmOrHoldTepRequestPayload
      });
    });
    it('should check correct type is used for ConfirmTepSuccess action ', () => {
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
      const action = new ConfirmTepSuccess(confirmTepItemResponse);
      expect({ ...action }).toEqual({
        type: TepActionTypes.CONFIRM_TEP_SUCCESS,
        payload: confirmTepItemResponse
      });
    });
    it('should check correct type is used for  ConfirmTepFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ConfirmTepFailure(payload);
      expect({ ...action }).toEqual({
        type: TepActionTypes.CONFIRM_TEP_FAILURE,
        payload
      });
    });
  });

  describe('DeleteTepItem Action Test Cases', () => {
    it('should check correct type is used for DeleteTepItem action ', () => {
      const action = new DeleteTepItem(
        '1234-abcd',
        '1234-abcd-efgh',
        CreateTepTypesEnum.REGULAR_TEP
      );
      expect({ ...action }).toEqual({
        type: TepActionTypes.DELETE_TEP_ITEM,
        id: '1234-abcd',
        itemId: '1234-abcd-efgh',
        subTransactionType: CreateTepTypesEnum.REGULAR_TEP
      });
    });
    it('should check correct type is used for DeleteTepItemSuccess action ', () => {
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
      const action = new DeleteTepItemSuccess(deleteTepItemResponse);
      expect({ ...action }).toEqual({
        type: TepActionTypes.DELETE_TEP_ITEM_SUCCESS,
        payload: deleteTepItemResponse
      });
    });
    it('should check correct type is used for  DeleteTepItemFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new DeleteTepItemFailure(payload);
      expect({ ...action }).toEqual({
        type: TepActionTypes.DELETE_TEP_ITEM_FAILURE,
        payload
      });
    });
  });

  describe('LoadRsoList Action Test Cases', () => {
    it('should check correct type is used for LoadRsoList action ', () => {
      const action = new LoadRsoList('RSO');
      expect({ ...action }).toEqual({
        type: TepActionTypes.LOAD_RSO_LIST,
        payload: 'RSO'
      });
    });
    it('should check correct type is used for LoadRsoListSuccess action ', () => {
      const action = new LoadRsoListSuccess([
        { value: 'rsocpd', description: 'rsocpd' }
      ]);
      expect({ ...action }).toEqual({
        type: TepActionTypes.LOAD_RSO_LIST_SUCCESS,
        payload: [{ value: 'rsocpd', description: 'rsocpd' }]
      });
    });
    it('should check correct type is used for  LoadRsoListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRsoListFailure(payload);
      expect({ ...action }).toEqual({
        type: TepActionTypes.LOAD_RSO_LIST_FAILURE,
        payload
      });
    });
  });

  describe('LoadTepItemCodeDetails Action Test Cases', () => {
    it('should check correct type is used for LoadTepItemCodeDetails action ', () => {
      const action = new LoadTepItemCodeDetails('502218HDSAAA00');
      expect({ ...action }).toEqual({
        type: TepActionTypes.LOAD_TEP_ITEM_CODE_DETAILS,
        itemCode: '502218HDSAAA00'
      });
    });
    it('should check correct type is used for LoadTepItemCodeDetailsSuccess action ', () => {
      const action = new LoadTepItemCodeDetailsSuccess('');
      expect({ ...action }).toEqual({
        type: TepActionTypes.LOAD_TEP_ITEM_CODE_DETAILS_SUCCESS,
        payload: ''
      });
    });
    it('should check correct type is used for  LoadTepItemCodeDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTepItemCodeDetailsFailure(payload);
      expect({ ...action }).toEqual({
        type: TepActionTypes.LOAD_TEP_ITEM_CODE_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadTepItemDetails Action Test Cases', () => {
    it('should check correct type is used for LoadTepItemDetails action ', () => {
      const action = new LoadTepItemDetails(
        '1234-abcd',
        '1234-abcd-efgh',
        CreateTepTypesEnum.REGULAR_TEP,
        CreateTepTypesEnum.REGULAR_TEP,
        '8970890890'
      );
      expect({ ...action }).toEqual({
        type: TepActionTypes.LOAD_TEP_ITEM_DETAILS,
        id: '1234-abcd',
        itemId: '1234-abcd-efgh',
        subTransactionType: CreateTepTypesEnum.REGULAR_TEP,
        tepType: CreateTepTypesEnum.REGULAR_TEP,
        mobileNumber: '8970890890'
      });
    });
    it('should check correct type is used for LoadTepItemDetailsSuccess action ', () => {
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
      const action = new LoadTepItemDetailsSuccess(tepItemResponse);
      expect({ ...action }).toEqual({
        type: TepActionTypes.LOAD_TEP_ITEM_DETAILS_SUCCESS,
        payload: tepItemResponse
      });
    });
    it('should check correct type is used for  LoadTepItemDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTepItemDetailsFailure(payload);
      expect({ ...action }).toEqual({
        type: TepActionTypes.LOAD_TEP_ITEM_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadTepTransactionDetails Action Test Cases', () => {
    it('should check correct type is used for LoadTepTransactionDetails action ', () => {
      const action = new LoadTepTransactionDetails(
        '1234-abcd',
        CreateTepTypesEnum.REGULAR_TEP,
        null
      );
      expect({ ...action }).toEqual({
        type: TepActionTypes.LOAD_TEP_TRANSACTION_DETAILS,
        id: '1234-abcd',
        subTransactionType: CreateTepTypesEnum.REGULAR_TEP,
        recalculate: null
      });
    });
    it('should check correct type is used for LoadTepTransactionDetailsSuccess action ', () => {
      const tepTransactionResponse: TepTransactionResponse = {
        reason: 'Full Value TEP Reason',
        confirmedTime: '',
        currencyCode: '',
        customerId: 521,
        docDate: '',
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
      const action = new LoadTepTransactionDetailsSuccess(
        tepTransactionResponse
      );
      expect({ ...action }).toEqual({
        type: TepActionTypes.LOAD_TEP_TRANSACTION_DETAILS_SUCCESS,
        payload: tepTransactionResponse
      });
    });
    it('should check correct type is used for  LoadTepTransactionDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTepTransactionDetailsFailure(payload);
      expect({ ...action }).toEqual({
        type: TepActionTypes.LOAD_TEP_TRANSACTION_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('DeleteTepTransactionDetails Action Test Cases', () => {
    it('should check correct type is used for DeleteTepTransactionDetails action ', () => {
      const action = new DeleteTepTransactionDetails(
        '1234-abcd',
        CreateTepTypesEnum.REGULAR_TEP
      );
      expect({ ...action }).toEqual({
        type: TepActionTypes.DELETE_TEP_TRANSACTION_DETAILS,
        id: '1234-abcd',
        subTransactionType: CreateTepTypesEnum.REGULAR_TEP
      });
    });
    it('should check correct type is used for DeleteTepTransactionDetailsSuccess action ', () => {
      const action = new DeleteTepTransactionDetailsSuccess({});
      expect({ ...action }).toEqual({
        type: TepActionTypes.DELETE_TEP_TRANSACTION_DETAILS_SUCCESS,
        payload: {}
      });
    });
    it('should check correct type is used for  DeleteTepTransactionDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new DeleteTepTransactionDetailsFailure(payload);
      expect({ ...action }).toEqual({
        type: TepActionTypes.DELETE_TEP_TRANSACTION_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadGoldPlusLocations Action Test Cases', () => {
    it('should check correct type is used for LoadGoldPlusLocations action ', () => {
      const action = new LoadGoldPlusLocations();
      expect({ ...action }).toEqual({
        type: TepActionTypes.LOAD_GOLD_PLUS_LOCATIONS,
        payload: undefined
      });
    });
    it('should check correct type is used for LoadGoldPlusLocationsSuccess action ', () => {
      const mockResponse = [
        { description: '', locationCode: '', locationFormat: '' }
      ];
      const action = new LoadGoldPlusLocationsSuccess(mockResponse);
      expect({ ...action }).toEqual({
        type: TepActionTypes.LOAD_GOLD_PLUS_LOCATIONS_SUCCESS,
        payload: mockResponse
      });
    });
    it('should check correct type is used for  LoadGoldPlusLocationsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadGoldPlusLocationsFailure(payload);
      expect({ ...action }).toEqual({
        type: TepActionTypes.LOAD_GOLD_PLUS_LOCATIONS_FAILURE,
        payload
      });
    });
  });

  describe('Other Actions Test Cases', () => {
    it('should check correct type is used for SetRemarks action ', () => {
      const action = new SetRemarks('');
      expect({ ...action }).toEqual({
        type: TepActionTypes.SET_REMARKS,
        payload: ''
      });
    });
    it('should check correct type is used for SetTotalQty action ', () => {
      const action = new SetTotalQty(1);
      expect({ ...action }).toEqual({
        type: TepActionTypes.SET_TOTALQTY,
        payload: 1
      });
    });
    it('should check correct type is used for SetTotalGrossWt action ', () => {
      const action = new SetTotalGrossWt(1);
      expect({ ...action }).toEqual({
        type: TepActionTypes.SET_TOTAL_GROSS_WT,
        payload: 1
      });
    });
    it('should check correct type is used for SetTotalExchangeAmt action ', () => {
      const action = new SetTotalExchangeAmt(1200);
      expect({ ...action }).toEqual({
        type: TepActionTypes.SET_TOTAL_EXCHANGE_AMT,
        payload: 1200
      });
    });
    it('should check correct type is used for SelectedPaymentMethod action ', () => {
      const action = new SelectedPaymentMethod('CN');
      expect({ ...action }).toEqual({
        type: TepActionTypes.SELECTED_PAYMENT_METHOD,
        payload: 'CN'
      });
    });
    it('should check correct type is used for SelectedTepType action ', () => {
      const action = new SelectedTepType(CreateTepTypesEnum.FULL_VALUE_TEP);
      expect({ ...action }).toEqual({
        type: TepActionTypes.SELECTED_TEP_TYPE,
        payload: CreateTepTypesEnum.FULL_VALUE_TEP
      });
    });
    it('should check correct type is used for ResetTep action ', () => {
      const action = new ResetTep();
      expect({ ...action }).toEqual({
        type: TepActionTypes.RESET_TEP
      });
    });
    it('should check correct type is used for SetTepItemProductCode action ', () => {
      const action = new SetTepItemProductCode('');
      expect({ ...action }).toEqual({
        type: TepActionTypes.LOAD_TEP_ITEM_CODE_DETAILS_SUCCESS,
        payload: ''
      });
    });
    it('should check correct type is used for SetCutPieceTotalQty action ', () => {
      const action = new SetCutPieceTotalQty(1);
      expect({ ...action }).toEqual({
        type: TepActionTypes.SET_CUT_PIECE_TOTAL_QTY,
        payload: 1
      });
    });
    it('should check correct type is used for SetCutPieceTotalValue action ', () => {
      const action = new SetCutPieceTotalValue(1);
      expect({ ...action }).toEqual({
        type: TepActionTypes.SET_CUT_PIECE_TOTAL_VALUE,
        payload: 1
      });
    });
    it('should check correct type is used for SetIsRefundFormValid action ', () => {
      const action = new SetIsRefundFormValid(true);
      expect({ ...action }).toEqual({
        type: TepActionTypes.SET_IS_REFUND_FORM_VALID,
        isValid: true
      });
    });
    it('should check correct type is used for SetIsRequestRaisingScenario action ', () => {
      const action = new SetIsRequestRaisingScenario(true);
      expect({ ...action }).toEqual({
        type: TepActionTypes.SET_IS_REQUEST_RAISING_SCENARIO,
        payload: true
      });
    });
    it('should check correct type is used for SetIsRequestRaisingScenario action ', () => {
      const action = new SetIsRequestRaisingScenario(true);
      expect({ ...action }).toEqual({
        type: TepActionTypes.SET_IS_REQUEST_RAISING_SCENARIO,
        payload: true
      });
    });
    it('should check correct type is used for SetSelectedRsoName action ', () => {
      const action = new SetSelectedRsoName({
        value: 'rsocpd',
        description: 'rsocpd'
      });
      expect({ ...action }).toEqual({
        type: TepActionTypes.SET_SELECTED_RSO_NAME,
        payload: { value: 'rsocpd', description: 'rsocpd' }
      });
    });
  });
});
