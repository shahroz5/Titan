import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';
import { DataPersistence } from '@nrwl/angular';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { TepEffects } from './direct-tep.effects';
import { TepService } from '../direct-tep.service';
import { StoreUserDataService } from '@poss-web/shared/masters/data-access-masters';
import {
  LoadRsoList,
  LoadRsoListSuccess,
  LoadRsoListFailure,
  CreateOpenTepTransaction,
  CreateOpenTepTransactionSuccess,
  CreateOpenTepTransactionFailure,
  UpdateOpenTepTransaction,
  UpdateOpenTepTransactionSuccess,
  UpdateOpenTepTransactionFailure,
  GetTepItemConfiguration,
  GetTepItemConfigurationSuccess,
  GetTepItemConfigurationFailure,
  LoadCmListItemTepConfiguration,
  LoadCmListItemTepConfigurationSuccess,
  LoadCmListItemTepConfigurationFailure,
  GetTepCashMemoItemListSuccess,
  GetTepCashMemoItemList,
  GetTepCashMemoItemListFailure,
  AddTepItem,
  AddTepItemSuccess,
  AddTepItemFailure,
  LoadTepItemPriceDetails,
  LoadTepItemPriceDetailsSuccess,
  LoadTepItemPriceDetailsFailure,
  UpdateTepItem,
  UpdateTepItemSuccess,
  UpdateTepItemFailure,
  ConfirmTep,
  ConfirmTepSuccess,
  ConfirmTepFailure,
  DeleteTepItem,
  DeleteTepItemSuccess,
  DeleteTepItemFailure,
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
  LoadGoldPlusLocations,
  LoadGoldPlusLocationsSuccess,
  LoadGoldPlusLocationsFailure,
  LoadWorkflowDeatils,
  LoadWorkflowDeatilsSuccess,
  LoadWorkflowDeatilsFailure,
  UpdateTepItemPriceDetails,
  UpdateTepItemPriceDetailsSuccess,
  UpdateTepItemPriceDetailsFailure,
  ConfirmTepRequest,
  ConfirmTepRequestSuccess,
  ConfirmTepRequestFailure,
  CancelRequest,
  CancelRequestSuccess,
  CancelRequestFailure,
  CancelTEPRequest,
  CancelTEPRequestSuccess,
  CancelTEPRequestFailure,
  LoadStuddedProductDetails,
  LoadStuddedProductDetailsSuccess,
  LoadStuddedProductDetailsFailure,
  GetTepItemExceptionConfiguration,
  GetTepItemExceptionConfigurationSuccess,
  GetTepItemExceptionConfigurationFailure,
  FileUpload,
  FileUploadSuccess,
  FileUploadFailure,
  FileIdProofDownloadUrl,
  FileIdProofDownloadUrlSuccess,
  FileIdProofDownloadUrlFailure,
  FileCancelledChequeDownloadUrl,
  FileCancelledChequeDownloadUrlSuccess,
  FileCancelledChequeDownloadUrlFailure
} from './direct-tep.actions';
import {
  AddOrUpdateTepItemResponse,
  AddTepItemRequestPayload,
  ConfirmOrHoldTepRequestPayload,
  ConfirmTepItemResponse,
  CreateOpenTepTransactionResponse,
  CreateTepTypesEnum,
  DeleteTepItemResponse,
  FileUploadDownloadPayload,
  GetTepCashMemoResponse,
  GetTepItemConfiguratonResponse,
  GetTepPriceDetailsRequestPayload,
  GetTepPriceDetailsResponse,
  InitiateAdvanceResponse,
  PartialUpdateAdvanceRequestPayload,
  PatchTepRequestPayload,
  TepItemResponse,
  TepStatusEnum,
  TepTransactionResponse,
  TransactionTypeEnum,
  UpdateAdvanceRequestPayload,
  UpdateAdvanceTransactionResponse,
  UpdateTepItemRequestPayload
} from '@poss-web/shared/models';
import * as moment from 'moment';

describe('TEP Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: TepEffects;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  const tepServiceSpy = jasmine.createSpyObj<TepService>('TepService', [
    'uploadFile',
    'downloadFile',
    'getTepItemConfiguration',
    'loadProductGroupCodes',
    'initiateTepOpenTransaction',
    'updateTepOpenTransaction',
    'getTepItemConfiguration',
    'getTepCashMemoItemsList',
    'addTepItem',
    'getTepItemPriceDetails',
    'updateTepItemInGrid',
    'confirmOrHoldTep',
    'deleteTepItem',
    'getTepItemCodeDetails',
    'getTepTransactionDetails',
    'deleteTepTransactionDetails',
    'getTepItemDetails',
    'getGoldPlusLocationDetails',
    'loadWorkflowDeatils',
    'confirmRequestTep',
    'cancel',
    'cancelTEP'
  ]);
  const storeUserDataServiceSpy = jasmine.createSpyObj<StoreUserDataService>(
    'storeUserDataService',
    ['getStoreUsers']
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TepEffects,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: TepService,
          useValue: tepServiceSpy
        },
        {
          provide: StoreUserDataService,
          useValue: storeUserDataServiceSpy
        }
      ]
    });
    effect = TestBed.inject(TepEffects);
  });

  describe('loadRSOList', () => {
    it('should Load RSO List', () => {
      const rsoDetailsResponse = [
        {
          employeeCode: 'rso.urb.2',
          empName: 'rsocpd'
        }
      ];
      const action = new LoadRsoList('RSO');
      const outCome = new LoadRsoListSuccess([{ value: 'rso.urb.2', description: 'rsocpd' }]);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: rsoDetailsResponse });
      storeUserDataServiceSpy.getStoreUsers.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadRsoList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRsoList('RSO');
      const error = new Error('some error');
      const outCome = new LoadRsoListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      storeUserDataServiceSpy.getStoreUsers.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.loadRsoList$).toBeObservable(expected);
    });
  });

  describe('initiateTepOpenTransaction effects', () => {
    it('should initiateTepOpenTransaction', () => {
      const createOpenTepTransactionSuccessResponse: CreateOpenTepTransactionResponse = {
        docNo: 1,
        id: '',
        status: '',
        subTxnType: '',
        txnType: ''
      };
      const action = new CreateOpenTepTransaction(
        CreateTepTypesEnum.REGULAR_TEP,
        null
      );
      const outCome = new CreateOpenTepTransactionSuccess(
        createOpenTepTransactionSuccessResponse
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: createOpenTepTransactionSuccessResponse
      });
      tepServiceSpy.initiateTepOpenTransaction.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.initiateTepOpenTransaction$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new CreateOpenTepTransaction(
        CreateTepTypesEnum.REGULAR_TEP,
        null
      );
      const error = new Error('some error');
      const outCome = new CreateOpenTepTransactionFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepServiceSpy.initiateTepOpenTransaction.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.initiateTepOpenTransaction$).toBeObservable(expected);
    });
  });

  describe('updateTepOpenTransaction effects', () => {
    it('should updateTepOpenTransaction', () => {
      const updateOpenTepTransactionSuccessResponse: CreateOpenTepTransactionResponse = {
        docNo: 1,
        id: '',
        status: '',
        subTxnType: '',
        txnType: ''
      };
      const requestPayload: PatchTepRequestPayload = {
        customerId: 621
      };
      const action = new UpdateOpenTepTransaction(
        '1234-abcd',
        CreateTepTypesEnum.REGULAR_TEP,
        requestPayload
      );
      const outCome = new UpdateOpenTepTransactionSuccess(
        updateOpenTepTransactionSuccessResponse
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: updateOpenTepTransactionSuccessResponse
      });
      tepServiceSpy.updateTepOpenTransaction.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.updateTepOpenTransaction$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const requestPayload: PatchTepRequestPayload = {
        customerId: 621
      };
      const action = new UpdateOpenTepTransaction(
        '1234-abcd',
        CreateTepTypesEnum.REGULAR_TEP,
        requestPayload
      );
      const error = new Error('some error');
      const outCome = new UpdateOpenTepTransactionFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepServiceSpy.updateTepOpenTransaction.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.updateTepOpenTransaction$).toBeObservable(expected);
    });
  });

  describe('getTepItemConfiguration effects', () => {
    it('should getTepItemConfiguration', () => {
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
      const action = new GetTepItemConfiguration(
        '502218HDSAAA00',
        CreateTepTypesEnum.REGULAR_TEP,
        false,
        '8445678909'
      );
      const outCome = new GetTepItemConfigurationSuccess(
        getTepItemConfiguratonResponse
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: getTepItemConfiguratonResponse
      });
      tepServiceSpy.getTepItemConfiguration.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.getTepItemConfiguration$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new GetTepItemConfiguration(
        '502218HDSAAA00',
        CreateTepTypesEnum.REGULAR_TEP,
        false,
        '8445678909'
      );
      const error = new Error('some error');
      const outCome = new GetTepItemConfigurationFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepServiceSpy.getTepItemConfiguration.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.getTepItemConfiguration$).toBeObservable(expected);
    });
  });

  describe('getCmListItemTepConfiguration effects', () => {
    it('should getCmListItemTepConfiguration', () => {
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
      const action = new LoadCmListItemTepConfiguration(
        '502218HDSAAA00',
        CreateTepTypesEnum.REGULAR_TEP,
        false,
        '8445678909'
      );
      const outCome = new LoadCmListItemTepConfigurationSuccess(
        getTepItemConfiguratonResponse
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: getTepItemConfiguratonResponse
      });
      tepServiceSpy.getTepItemConfiguration.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.getCmListItemTepConfiguration$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCmListItemTepConfiguration(
        '502218HDSAAA00',
        CreateTepTypesEnum.REGULAR_TEP,
        false,
        '8445678909'
      );
      const error = new Error('some error');
      const outCome = new LoadCmListItemTepConfigurationFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepServiceSpy.getTepItemConfiguration.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.getCmListItemTepConfiguration$).toBeObservable(expected);
    });
  });

  describe('getTepCashMemoItemsList effects', () => {
    it('should getTepCashMemoItemsList', () => {
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
      const action = new GetTepCashMemoItemList(
        'CPD',
        '258',
        '2020',
        CreateTepTypesEnum.REGULAR_TEP,
        '8445678909'
      );
      const outCome = new GetTepCashMemoItemListSuccess(getTepCashMemoResponse);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: getTepCashMemoResponse
      });
      tepServiceSpy.getTepCashMemoItemsList.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.getTepCashMemoItemsList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new GetTepCashMemoItemList(
        'CPD',
        '258',
        '2020',
        CreateTepTypesEnum.REGULAR_TEP,
        '8445678909'
      );
      const error = new Error('some error');
      const outCome = new GetTepCashMemoItemListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepServiceSpy.getTepCashMemoItemsList.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.getTepCashMemoItemsList$).toBeObservable(expected);
    });
  });

  describe('addTepItem effects', () => {
    it('should addTepItem', () => {
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
      const outCome = new AddTepItemSuccess(addOrUpdateTepItemResponse);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: addOrUpdateTepItemResponse
      });
      tepServiceSpy.addTepItem.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.addTepItem$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
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
      const error = new Error('some error');
      const outCome = new AddTepItemFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepServiceSpy.addTepItem.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.addTepItem$).toBeObservable(expected);
    });
  });

  describe('getTepItemPriceDetails effects', () => {
    it('should getTepItemPriceDetails', () => {
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
      const requestPayload: GetTepPriceDetailsRequestPayload = {
        itemCode: '',
        standardPrice: null,
        tepType: ''
      };
      const action = new LoadTepItemPriceDetails(requestPayload);
      const outCome = new LoadTepItemPriceDetailsSuccess(
        getTepPriceDetailsResponse
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: getTepPriceDetailsResponse
      });
      tepServiceSpy.getTepItemPriceDetails.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.getTepItemPriceDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const requestPayload: GetTepPriceDetailsRequestPayload = {
        itemCode: '',
        standardPrice: null,
        tepType: ''
      };
      const action = new LoadTepItemPriceDetails(requestPayload);
      const error = new Error('some error');
      const outCome = new LoadTepItemPriceDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepServiceSpy.getTepItemPriceDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.getTepItemPriceDetails$).toBeObservable(expected);
    });
  });

  describe('updateTepItemInGrid effects', () => {
    it('should updateTepItemInGrid', () => {
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
      const outCome = new UpdateTepItemSuccess(addOrUpdateTepItemResponse);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: addOrUpdateTepItemResponse
      });
      tepServiceSpy.updateTepItemInGrid.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.updateTepItemInGrid$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
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
      const error = new Error('some error');
      const outCome = new UpdateTepItemFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepServiceSpy.updateTepItemInGrid.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.updateTepItemInGrid$).toBeObservable(expected);
    });
  });

  describe('ConfirmTep effects', () => {
    it('should ConfirmTep', () => {
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
      const outCome = new ConfirmTepSuccess(confirmTepItemResponse);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: confirmTepItemResponse
      });
      tepServiceSpy.confirmOrHoldTep.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.confirmOrHoldTep$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
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
      const error = new Error('some error');
      const outCome = new ConfirmTepFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepServiceSpy.confirmOrHoldTep.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.confirmOrHoldTep$).toBeObservable(expected);
    });
  });

  describe('DeleteTepItem effects', () => {
    it('should DeleteTepItem', () => {
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
      const action = new DeleteTepItem(
        '1234-abcd',
        '1234-abcd-efgh',
        CreateTepTypesEnum.REGULAR_TEP
      );
      const outCome = new DeleteTepItemSuccess(deleteTepItemResponse);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: deleteTepItemResponse
      });
      tepServiceSpy.deleteTepItem.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.deleteTepItem$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new DeleteTepItem(
        '1234-abcd',
        '1234-abcd-efgh',
        CreateTepTypesEnum.REGULAR_TEP
      );
      const error = new Error('some error');
      const outCome = new DeleteTepItemFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepServiceSpy.deleteTepItem.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.deleteTepItem$).toBeObservable(expected);
    });
  });

  describe('getTepItemCodeDetails effects', () => {
    it('should getTepItemCodeDetails', () => {
      const action = new LoadTepItemCodeDetails('502218HDSAAA00');
      const outCome = new LoadTepItemCodeDetailsSuccess('');
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: ''
      });
      tepServiceSpy.getTepItemCodeDetails.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.getTepItemCodeDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadTepItemCodeDetails('502218HDSAAA00');
      const error = new Error('some error');
      const outCome = new LoadTepItemCodeDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepServiceSpy.getTepItemCodeDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.getTepItemCodeDetails$).toBeObservable(expected);
    });
  });

  describe('getTepItemDetails effects', () => {
    it('should getTepItemDetails', () => {
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
      const action = new LoadTepItemDetails(
        '1234-abcd',
        '1234-abcd-efgh',
        CreateTepTypesEnum.REGULAR_TEP,
        CreateTepTypesEnum.REGULAR_TEP,
        '8970890890'
      );
      const outCome = new LoadTepItemDetailsSuccess(tepItemResponse);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: tepItemResponse
      });
      tepServiceSpy.getTepItemDetails.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.getTepItemDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadTepItemDetails(
        '1234-abcd',
        '1234-abcd-efgh',
        CreateTepTypesEnum.REGULAR_TEP,
        CreateTepTypesEnum.REGULAR_TEP,
        '8970890890'
      );
      const error = new Error('some error');
      const outCome = new LoadTepItemDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepServiceSpy.getTepItemDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.getTepItemDetails$).toBeObservable(expected);
    });
  });

  describe('getTepTransactionDetails effects', () => {
    it('should getTepTransactionDetails', () => {
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
      const action = new LoadTepTransactionDetails(
        '1234-abcd',
        CreateTepTypesEnum.REGULAR_TEP
      );
      const outCome = new LoadTepTransactionDetailsSuccess(
        tepTransactionResponse
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: tepTransactionResponse
      });
      tepServiceSpy.getTepTransactionDetails.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.getTepTransactionDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadTepTransactionDetails(
        '1234-abcd',
        CreateTepTypesEnum.REGULAR_TEP
      );
      const error = new Error('some error');
      const outCome = new LoadTepTransactionDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepServiceSpy.getTepTransactionDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.getTepTransactionDetails$).toBeObservable(expected);
    });
  });

  describe('deleteTepTransactionDetails effects', () => {
    it('should deleteTepTransactionDetails', () => {
      const action = new DeleteTepTransactionDetails(
        '1234-abcd',
        CreateTepTypesEnum.REGULAR_TEP
      );
      const outCome = new DeleteTepTransactionDetailsSuccess('Success');
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: 'Success'
      });
      tepServiceSpy.deleteTepTransactionDetails.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.deleteTepTransactionDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new DeleteTepTransactionDetails(
        '1234-abcd',
        CreateTepTypesEnum.REGULAR_TEP
      );
      const error = new Error('some error');
      const outCome = new DeleteTepTransactionDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepServiceSpy.deleteTepTransactionDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.deleteTepTransactionDetails$).toBeObservable(expected);
    });
  });

  describe('loadGoldPlusLocations effects', () => {
    it('should loadGoldPlusLocations', () => {
      const mockResponse = [
        { description: '', locationCode: '', locationFormat: '' }
      ];
      const action = new LoadGoldPlusLocations();
      const outCome = new LoadGoldPlusLocationsSuccess(mockResponse);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: mockResponse
      });
      tepServiceSpy.getGoldPlusLocationDetails.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadGoldPlusLocations$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadGoldPlusLocations();
      const error = new Error('some error');
      const outCome = new LoadGoldPlusLocationsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepServiceSpy.getGoldPlusLocationDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.loadGoldPlusLocations$).toBeObservable(expected);
    });
  });

  describe('loadWorkflowDetails effects', () => {
    it('should loadWorkflowDetails', () => {
      const mockResponse = [
        { description: '', locationCode: '', locationFormat: '' }
      ];
      const action = new LoadWorkflowDeatils({
        processId: '123',
        workflowType: null
      });
      const outCome = new LoadWorkflowDeatilsSuccess(mockResponse);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: mockResponse
      });
      tepServiceSpy.loadWorkflowDeatils.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadWorkflowDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadWorkflowDeatils({
        processId: '123',
        workflowType: null
      });
      const error = new Error('some error');
      const outCome = new LoadWorkflowDeatilsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepServiceSpy.loadWorkflowDeatils.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.loadWorkflowDetails$).toBeObservable(expected);
    });
  });

  describe('updateTepItemPriceDetails effects', () => {
    it('should updateTepItemPriceDetails', () => {
      const action = new UpdateTepItemPriceDetails({
        itemCode: '57CC1045567',
        tepType: 'NEW_TEP',
        standardPrice: null
      });
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
      const outCome = new UpdateTepItemPriceDetailsSuccess(
        getTepPriceDetailsResponse
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: getTepPriceDetailsResponse
      });
      tepServiceSpy.getTepItemPriceDetails.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.updateTepItemPriceDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new UpdateTepItemPriceDetails({
        itemCode: '57CC1045567',
        tepType: 'NEW_TEP',
        standardPrice: null
      });
      const error = new Error('some error');
      const outCome = new UpdateTepItemPriceDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepServiceSpy.getTepItemPriceDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.updateTepItemPriceDetails$).toBeObservable(expected);
    });
  });

  describe('confirmRequestTep effects', () => {
    it('should confirmRequestTep', () => {
      const action = new ConfirmTepRequest('123', 'CONFIRMED', 'NEW_TEP', null);
      const outCome = new ConfirmTepRequestSuccess(null);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: null
      });
      tepServiceSpy.confirmRequestTep.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.confirmRequestTep$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new ConfirmTepRequest('123', 'CONFIRMED', 'NEW_TEP', null);
      const error = new Error('some error');
      const outCome = new ConfirmTepRequestFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepServiceSpy.confirmRequestTep.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.confirmRequestTep$).toBeObservable(expected);
    });
  });

  describe('Cancel effects', () => {
    it('should call Cancel Request', () => {
      const action = new CancelRequest('123', 'REQUEST_APPROVAL');
      const outCome = new CancelRequestSuccess({
        msg: ''
      });
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: {
          msg: ''
        }
      });
      tepServiceSpy.cancel.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.cancel$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new CancelRequest('123', 'REQUEST_APPROVAL');
      const error = new Error('some error');
      const outCome = new CancelRequestFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepServiceSpy.cancel.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.cancel$).toBeObservable(expected);
    });
  });

  describe('Cancel TEP effects', () => {
    it('should call Cancel TEP Request', () => {
      const requestPayload = {
        employeeCode: 'cashiercpd',
        reasonForCancellation: 'Reason2',
        refTxnId: '123',
        remarks: 'remarks'
      };
      const mockResponse = {
        cndocNos: ['123'],
        docNo: 123,
        id: 'abc'
      };
      const action = new CancelTEPRequest(requestPayload);
      const outCome = new CancelTEPRequestSuccess(mockResponse);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: mockResponse
      });
      tepServiceSpy.cancelTEP.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.cancelTEP$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const requestPayload = {
        employeeCode: 'cashiercpd',
        reasonForCancellation: 'Reason2',
        refTxnId: '123',
        remarks: 'remarks'
      };
      const action = new CancelTEPRequest(requestPayload);
      const error = new Error('some error');
      const outCome = new CancelTEPRequestFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepServiceSpy.cancelTEP.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.cancelTEP$).toBeObservable(expected);
    });
  });

  describe('Load studded products', () => {
    it('should call load product group codes', () => {
      const requestPayload = {
        employeeCode: 'cashiercpd',
        reasonForCancellation: 'Reason2',
        refTxnId: '123',
        remarks: 'remarks'
      };
      const mockResponse = {
        cndocNos: ['123'],
        docNo: 123,
        id: 'abc'
      };
      const action = new LoadStuddedProductDetails('S', 'TEP');
      const outCome = new LoadStuddedProductDetailsSuccess(['71','72']);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: ['71','72']
      });
      tepServiceSpy.loadProductGroupCodes.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadStuddedProducts$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const requestPayload = {
        employeeCode: 'cashiercpd',
        reasonForCancellation: 'Reason2',
        refTxnId: '123',
        remarks: 'remarks'
      };
      const action = new LoadStuddedProductDetails('S', 'TEP');
      const error = new Error('some error');
      const outCome = new LoadStuddedProductDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepServiceSpy.loadProductGroupCodes.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.loadStuddedProducts$).toBeObservable(expected);
    });
  });

  describe('Load TEP Exception Configuration', () => {
    it('should call TEP exception configuration', () => {
      const requestPayload = {
        employeeCode: 'cashiercpd',
        reasonForCancellation: 'Reason2',
        refTxnId: '123',
        remarks: 'remarks'
      };
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
      const action = new GetTepItemExceptionConfiguration('S', 'TEP', true, '123');
      const outCome = new GetTepItemExceptionConfigurationSuccess(getTepItemConfiguratonResponse);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: getTepItemConfiguratonResponse
      });
      tepServiceSpy.getTepItemConfiguration.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.getTepItemExceptionConfiguration$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const requestPayload = {
        employeeCode: 'cashiercpd',
        reasonForCancellation: 'Reason2',
        refTxnId: '123',
        remarks: 'remarks'
      };
      const action = new GetTepItemExceptionConfiguration('S', 'TEP');
      const error = new Error('some error');
      const outCome = new GetTepItemExceptionConfigurationFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepServiceSpy.getTepItemConfiguration.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.getTepItemExceptionConfiguration$).toBeObservable(expected);
    });
  });

  describe('getFileUpload', () => {
    it('upload file', () => {
      const requestPayload = {
        employeeCode: 'cashiercpd',
        reasonForCancellation: 'Reason2',
        refTxnId: '123',
        remarks: 'remarks'
      };

      let payload : FileUploadDownloadPayload = {
        txnType: TransactionTypeEnum.TEP,
        id: '12'
      }
      const action = new FileUpload(payload);
      const outCome = new FileUploadSuccess(true);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: true
      });
      tepServiceSpy.uploadFile.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.getFileUpload$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const requestPayload = {
        employeeCode: 'cashiercpd',
        reasonForCancellation: 'Reason2',
        refTxnId: '123',
        remarks: 'remarks'
      };

      let payload : FileUploadDownloadPayload = {
        txnType: TransactionTypeEnum.TEP,
        id: '12'
      }

      const action = new FileUpload(payload);
      const error = new Error('some error');
      const outCome = new FileUploadFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepServiceSpy.uploadFile.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.getFileUpload$).toBeObservable(expected);
    });
  });

  describe('getFileIdProofDownload', () => {
    it('download file', () => {
      const requestPayload = {
        employeeCode: 'cashiercpd',
        reasonForCancellation: 'Reason2',
        refTxnId: '123',
        remarks: 'remarks'
      };

      let payload : FileUploadDownloadPayload = {
        txnType: TransactionTypeEnum.TEP,
        id: '12'
      }
      const action = new FileIdProofDownloadUrl(payload);
      const outCome = new FileIdProofDownloadUrlSuccess('dummy');
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: 'dummy'
      });
      tepServiceSpy.downloadFile.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.getFileIdProofDownload$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const requestPayload = {
        employeeCode: 'cashiercpd',
        reasonForCancellation: 'Reason2',
        refTxnId: '123',
        remarks: 'remarks'
      };

      let payload : FileUploadDownloadPayload = {
        txnType: TransactionTypeEnum.TEP,
        id: '12'
      }

      const action = new FileIdProofDownloadUrl(payload);
      const error = new Error('some error');
      const outCome = new FileIdProofDownloadUrlFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepServiceSpy.downloadFile.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.getFileIdProofDownload$).toBeObservable(expected);
    });
  });

  describe('getFileCancelledChequeDownload', () => {
    it('download file', () => {
      const requestPayload = {
        employeeCode: 'cashiercpd',
        reasonForCancellation: 'Reason2',
        refTxnId: '123',
        remarks: 'remarks'
      };

      let payload : FileUploadDownloadPayload = {
        txnType: TransactionTypeEnum.TEP,
        id: '12'
      }
      const action = new FileCancelledChequeDownloadUrl(payload);
      const outCome = new FileCancelledChequeDownloadUrlSuccess('dummy');
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: 'dummy'
      });
      tepServiceSpy.downloadFile.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.getFileCancelledChequeDownload$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const requestPayload = {
        employeeCode: 'cashiercpd',
        reasonForCancellation: 'Reason2',
        refTxnId: '123',
        remarks: 'remarks'
      };

      let payload : FileUploadDownloadPayload = {
        txnType: TransactionTypeEnum.TEP,
        id: '12'
      }

      const action = new FileCancelledChequeDownloadUrl(payload);
      const error = new Error('some error');
      const outCome = new FileCancelledChequeDownloadUrlFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepServiceSpy.downloadFile.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.getFileCancelledChequeDownload$).toBeObservable(expected);
    });
  });
});
