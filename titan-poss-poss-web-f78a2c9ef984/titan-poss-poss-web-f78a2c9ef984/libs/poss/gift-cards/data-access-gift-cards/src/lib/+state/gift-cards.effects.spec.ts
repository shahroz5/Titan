import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';
import { DataPersistence } from '@nrwl/angular';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { GiftCardsEffects } from './gift-cards.effects';
import { GiftCardsService } from '../gift-cards.service';
import {
  GcCashMemoDetailsRequest,
  AddGiftCardItemPayload,
  PartiallyUpdateGiftDetailsPayload
} from '@poss-web/shared/models';
import {
  CreateGcCashMemo,
  CreateGcCashMemoSuccess,
  CreateGcCashMemoFailure,
  PartiallyUpdateGiftCardItem,
  PartiallyUpdateGcCashMemo,
  PartiallyUpdateGcCashMemoSuccess,
  PartiallyUpdateGcCashMemoFailure,
  UpdateGcCashMemo,
  UpdateGcCashMemoSuccess,
  UpdateGcCashMemoFailure,
  AddGiftCardItem,
  AddGiftCardItemSuccess,
  AddGiftCardItemFailure,
  DeleteAddedGiftCardItem,
  DeleteAddedGiftCardItemSuccess,
  DeleteAddedGiftCardItemFailure,
  GetAddedGiftCardItem,
  GetAddedGiftCardItemSuccess,
  GetAddedGiftCardItemFailure,
  PartiallyUpdateGiftCardItemSuccess,
  PartiallyUpdateGiftCardItemFailure,
  LoadRSODetails,
  LoadRSODetailsSuccess,
  LoadRSODetailsFailure,
  LoadCashMemoBillsAvailableForCancellation,
  LoadCashMemoBillsAvailableForCancellationSuccess,
  LoadCashMemoBillsAvailableForCancellationFailure,
  LoadSelectedGcCashMemoDetails,
  LoadSelectedGcCashMemoDetailsSuccess,
  LoadSelectedGcCashMemoDetailsFailure,
  LoadCancelGcCashMemo,
  LoadCancelGcCashMemoSuccess,
  LoadCancelGcCashMemoFailure,
  LoadGcCancellationReasons,
  LoadGcCancellationReasonsSuccess,
  LoadGcCancellationReasonsFailure
} from './gift-cards.actions';
import { StoreUserDataService } from '@poss-web/shared/masters/data-access-masters';

describe('Gift Cards Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: GiftCardsEffects;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  const giftCardsServiceSpy = jasmine.createSpyObj<GiftCardsService>(
    'GiftCardsService',
    [
      'createGiftCardCashMemo',
      'partiallyUpdateGcCashMemo',
      'updateGcCashMemo',
      'addGiftCardItem',
      'getAddedGiftCardItem',
      'deleteAddedGiftCardItem',
      'partiallyUpdateGiftCardItem',
      'getCashMemoBillsAvailableForCancellation',
      'getGcCashMemoById',
      'cancelGcCashMemo',
      'getGcCancellationReasons'
    ]
  );
  const storeUserDataServiceSpy = jasmine.createSpyObj<StoreUserDataService>(
    'storeUserDataService',
    ['getStoreUsers']
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GiftCardsEffects,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: GiftCardsService,
          useValue: giftCardsServiceSpy
        },
        {
          provide: StoreUserDataService,
          useValue: storeUserDataServiceSpy
        }
      ]
    });
    effect = TestBed.inject(GiftCardsEffects);
  });

  describe('createGcCashMemo', () => {
    it('should create GC Cash Memo', () => {
      const gcCashMemoResponse = {
        id: '',
        status: '',
        docNo: ''
      };
      const action = new CreateGcCashMemo();
      const outCome = new CreateGcCashMemoSuccess(gcCashMemoResponse);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: gcCashMemoResponse });
      giftCardsServiceSpy.createGiftCardCashMemo.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.createGcCashMemo$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new CreateGcCashMemo();
      const error = new Error('some error');
      const outCome = new CreateGcCashMemoFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      giftCardsServiceSpy.createGiftCardCashMemo.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.createGcCashMemo$).toBeObservable(expected);
    });
  });

  describe('partiallyUpdateGcCashMemo', () => {
    it('should partially update GC Cash Memo', () => {
      const partiallyUpdatedGcCashMemoResponse = {
        customerId: 625,
        paidValue: 0.0,
        id: 'AE2DFEE2-9FC7-483C-9CDD-89D6803EA825',
        status: 'OPEN',
        docNo: 413,
        docDate: 1597948200000,
        employeeCode: 'rso.urb.2',
        txnType: 'CM',
        subTxnType: 'GIFT_SALE'
      };
      const action = new PartiallyUpdateGcCashMemo('', { customerId: 625 });
      const outCome = new PartiallyUpdateGcCashMemoSuccess(
        partiallyUpdatedGcCashMemoResponse
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: partiallyUpdatedGcCashMemoResponse });
      giftCardsServiceSpy.partiallyUpdateGcCashMemo.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.partiallyUpdateGcCashMemo$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new PartiallyUpdateGcCashMemo('', { customerId: 625 });
      const error = new Error('some error');
      const outCome = new PartiallyUpdateGcCashMemoFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      giftCardsServiceSpy.partiallyUpdateGcCashMemo.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.partiallyUpdateGcCashMemo$).toBeObservable(expected);
    });
  });

  describe('UpdateGcCashMemo', () => {
    it('should update GC Cash Memo', () => {
      const updateGcCashMemoResponse = {
        customerId: 625,
        docDate: '2020-08-21T15:01:17.019Z',
        docNo: 0,
        employeeCode: 'string',
        finalValue: 0,
        id: 'string',
        paidValue: 0,
        remarks: 'string',
        status: 'string',
        subTxnType: 'string',
        totalDiscount: 0,
        totalQuantity: 0,
        totalTax: 0,
        totalValue: 0,
        txnType: 'string'
      };

      const requestBody: GcCashMemoDetailsRequest = {
        customerId: 625,
        finalValue: 0,
        remarks: '',
        totalDiscount: 0,
        totalQuantity: 0,
        totalTax: 0,
        totalValue: 0,
        paidValue: 0,
        totalWeight: 0
      };
      const action = new UpdateGcCashMemo('', requestBody);
      const outCome = new UpdateGcCashMemoSuccess(updateGcCashMemoResponse);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: updateGcCashMemoResponse });
      giftCardsServiceSpy.updateGcCashMemo.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.updateGcCashMemo$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const requestBody: GcCashMemoDetailsRequest = {
        customerId: 625,
        finalValue: 0,
        remarks: '',
        totalDiscount: 0,
        totalQuantity: 0,
        totalTax: 0,
        totalValue: 0,
        paidValue: 0,
        totalWeight: 0
      };
      const action = new UpdateGcCashMemo('', requestBody);
      const error = new Error('some error');
      const outCome = new UpdateGcCashMemoFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      giftCardsServiceSpy.updateGcCashMemo.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.updateGcCashMemo$).toBeObservable(expected);
    });
  });

  describe('AddGiftCardItem', () => {
    it('should add gift card item', () => {
      const addGiftCardItemResponse = {
        customerId: 624,
        totalQuantity: 1,
        totalWeight: 0,
        totalValue: 24222.0,
        totalTax: 0.0,
        finalValue: 24222.0,
        totalDiscount: 0,
        paidValue: 0.0,
        id: '44BC9734-2003-48DF-89E3-10306B5FAA1F',
        status: 'OPEN',
        docNo: 417,
        docDate: 1597948200000,
        employeeCode: 'rso.urb.2',
        txnType: 'CM',
        subTxnType: 'GIFT_SALE',
        giftDetailsDto: {
          itemId: '5405fefd-41bc-41c5-b264-5442e4b90663',
          instrumentNo: '8877661190000040',
          vendorCode: 'QC',
          binCode: 'QCGC',
          giftType: 'CARD',
          rowId: 1,
          totalValue: 24222,
          finalValue: 24222,
          totalTax: 0,
          taxDetails: null
        }
      };

      const requestBody: AddGiftCardItemPayload = {
        finalValue: 1000,
        instrumentNo: '13214214325325',
        rowId: 1,
        totalTax: 0,
        totalValue: 1000
      };

      const action = new AddGiftCardItem('', requestBody);
      const outCome = new AddGiftCardItemSuccess(addGiftCardItemResponse);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: addGiftCardItemResponse });
      giftCardsServiceSpy.addGiftCardItem.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.addGiftCardItem$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const requestBody: AddGiftCardItemPayload = {
        finalValue: 1000,
        instrumentNo: '13214214325325',
        rowId: 1,
        totalTax: 0,
        totalValue: 1000
      };
      const action = new AddGiftCardItem('', requestBody);
      const error = new Error('some error');
      const outCome = new AddGiftCardItemFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      giftCardsServiceSpy.addGiftCardItem.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.addGiftCardItem$).toBeObservable(expected);
    });
  });

  describe('DeleteGiftCardItem', () => {
    it('should delete gift card item', () => {
      const deleteGiftCardItemResponse = {
        customerId: 624,
        totalQuantity: 1,
        totalWeight: 0,
        totalValue: 24222.0,
        totalTax: 0.0,
        finalValue: 24222.0,
        totalDiscount: 0,
        paidValue: 0.0,
        id: '44BC9734-2003-48DF-89E3-10306B5FAA1F',
        status: 'OPEN',
        docNo: 417,
        docDate: 1597948200000,
        employeeCode: 'rso.urb.2',
        txnType: 'CM',
        subTxnType: 'GIFT_SALE'
      };

      const action = new DeleteAddedGiftCardItem('', '');
      const outCome = new DeleteAddedGiftCardItemSuccess(
        deleteGiftCardItemResponse
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: deleteGiftCardItemResponse });
      giftCardsServiceSpy.deleteAddedGiftCardItem.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.deleteAddedGiftCardItem$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new DeleteAddedGiftCardItem('', '');
      const error = new Error('some error');
      const outCome = new DeleteAddedGiftCardItemFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      giftCardsServiceSpy.deleteAddedGiftCardItem.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.deleteAddedGiftCardItem$).toBeObservable(expected);
    });
  });

  describe('GetGiftCardItem', () => {
    it('should get gift card item', () => {
      const getGiftCardItemResponse = {
        itemId: '5405fefd-41bc-41c5-b264-5442e4b90663',
        instrumentNo: '8877661190000040',
        vendorCode: 'QC',
        binCode: 'QCGC',
        giftType: 'CARD',
        rowId: 1,
        totalValue: 24222,
        finalValue: 24222,
        totalTax: 0,
        taxDetails: null
      };

      const action = new GetAddedGiftCardItem('', '');
      const outCome = new GetAddedGiftCardItemSuccess(getGiftCardItemResponse);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: getGiftCardItemResponse });
      giftCardsServiceSpy.getAddedGiftCardItem.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.getAddedGiftCardItem$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new GetAddedGiftCardItem('', '');
      const error = new Error('some error');
      const outCome = new GetAddedGiftCardItemFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      giftCardsServiceSpy.getAddedGiftCardItem.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.getAddedGiftCardItem$).toBeObservable(expected);
    });
  });

  describe('PartiallyUpdateGiftCardItem', () => {
    it('should partially update gift card item', () => {
      const partiallyGiftCardItemResponse = {
        customerId: 624,
        totalQuantity: 1,
        totalWeight: 0,
        totalValue: 24222.0,
        totalTax: 0.0,
        finalValue: 24222.0,
        totalDiscount: 0,
        paidValue: 0.0,
        id: '44BC9734-2003-48DF-89E3-10306B5FAA1F',
        status: 'OPEN',
        docNo: 417,
        docDate: 1597948200000,
        employeeCode: 'rso.urb.2',
        txnType: 'CM',
        subTxnType: 'GIFT_SALE',
        giftDetailsDto: {
          itemId: '5405fefd-41bc-41c5-b264-5442e4b90663',
          instrumentNo: '8877661190000040',
          vendorCode: 'QC',
          binCode: 'QCGC',
          giftType: 'CARD',
          rowId: 1,
          totalValue: 24222,
          finalValue: 24222,
          totalTax: 0,
          taxDetails: null
        }
      };

      const requestBody: PartiallyUpdateGiftDetailsPayload = {
        finalValue: 1000,
        totalTax: 0,
        totalValue: 1000
      };

      const action = new PartiallyUpdateGiftCardItem('', '', requestBody);
      const outCome = new PartiallyUpdateGiftCardItemSuccess(
        partiallyGiftCardItemResponse
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: partiallyGiftCardItemResponse });
      giftCardsServiceSpy.partiallyUpdateGiftCardItem.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.partiallyUpdateGiftCardItem$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const requestBody: PartiallyUpdateGiftDetailsPayload = {
        finalValue: 1000,
        totalTax: 0,
        totalValue: 1000
      };
      const action = new PartiallyUpdateGiftCardItem('', '', requestBody);
      const error = new Error('some error');
      const outCome = new PartiallyUpdateGiftCardItemFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      giftCardsServiceSpy.partiallyUpdateGiftCardItem.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outCome });
      expect(effect.partiallyUpdateGiftCardItem$).toBeObservable(expected);
    });
  });

  describe('loadRSODetails', () => {
    it('should Load RSO Details', () => {
      const rsoDetailsResponse = [
        {
          employeeCode: 'rso.urb.2',
          empName: 'rso.urb.2'
        }
      ];
      const action = new LoadRSODetails('RSO');
      const outCome = new LoadRSODetailsSuccess([
        {
          value: 'rso.urb.2',
          description: 'rso.urb.2'
        }
      ]);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: rsoDetailsResponse });
      storeUserDataServiceSpy.getStoreUsers.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadRSODetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRSODetails('RSO');
      const error = new Error('some error');
      const outCome = new LoadRSODetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      storeUserDataServiceSpy.getStoreUsers.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.loadRSODetails$).toBeObservable(expected);
    });
  });

  describe('loadGcCashMemoAvailableForCancellation', () => {
    it('should Load Gc Cash Memo Available For Cancellation', () => {
      const mockCmListResponse = [
        {
          customerName: '',
          refDocDate: '',
          refDocNo: 23,
          refTxnId: '',
          refTxnTime: '',
          subTxnType: ''
        }
      ];
      const action = new LoadCashMemoBillsAvailableForCancellation(
        '9876543210',
        65
      );
      const outCome = new LoadCashMemoBillsAvailableForCancellationSuccess(
        mockCmListResponse
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: mockCmListResponse });
      giftCardsServiceSpy.getCashMemoBillsAvailableForCancellation.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadGcCashMemoAvailableForCancellation$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCashMemoBillsAvailableForCancellation(
        '9876543210',
        65
      );
      const error = new Error('some error');
      const outCome = new LoadCashMemoBillsAvailableForCancellationFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      giftCardsServiceSpy.getCashMemoBillsAvailableForCancellation.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outCome });
      expect(effect.loadGcCashMemoAvailableForCancellation$).toBeObservable(
        expected
      );
    });
  });

  describe('loadSelectedGcCashMemoDetails', () => {
    it('should Load Selected Gc Cash Memo Details', () => {
      const cashMemoMinimalDetail = {
        customerId: 625,
        itemIdList: [],
        id: '',
        docNo: 23,
        totalQuantity: 2,
        totalTax: 0,
        confirmedTime: 1234567890,
        totalValue: 1000
      };
      const action = new LoadSelectedGcCashMemoDetails('12345678');
      const outCome = new LoadSelectedGcCashMemoDetailsSuccess(
        cashMemoMinimalDetail
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: cashMemoMinimalDetail });
      giftCardsServiceSpy.getGcCashMemoById.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadSelectedGcCashMemoDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadSelectedGcCashMemoDetails('12345678');
      const error = new Error('some error');
      const outCome = new LoadSelectedGcCashMemoDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      giftCardsServiceSpy.getGcCashMemoById.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.loadSelectedGcCashMemoDetails$).toBeObservable(expected);
    });
  });

  describe('loadCancelGcCashMemo', () => {
    it('should Load Cancel Gc Cash Memo', () => {
      const cmCancelRequestBody = {
        cancelType: '',
        reasonForCancellation: '',
        refTxnId: '',
        remarks: '',
        employeeCode: ''
      };
      const mockGcCashMemoCancelResponse = {
        cndocNos: [],
        docNo: 34,
        id: ''
      };
      const action = new LoadCancelGcCashMemo(cmCancelRequestBody);
      const outCome = new LoadCancelGcCashMemoSuccess(
        mockGcCashMemoCancelResponse
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: mockGcCashMemoCancelResponse });
      giftCardsServiceSpy.cancelGcCashMemo.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadCancelGcCashMemo$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const cmCancelRequestBody = {
        cancelType: '',
        reasonForCancellation: '',
        refTxnId: '',
        remarks: '',
        employeeCode: ''
      };
      const action = new LoadCancelGcCashMemo(cmCancelRequestBody);
      const error = new Error('some error');
      const outCome = new LoadCancelGcCashMemoFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      giftCardsServiceSpy.cancelGcCashMemo.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.loadCancelGcCashMemo$).toBeObservable(expected);
    });
  });

  describe('LoadGcCancellationReasons', () => {
    it('should Load Gc Cancellation Reasons', () => {
      const mockReasonsResponse = ['Reason 1', 'Reason 2'];
      const action = new LoadGcCancellationReasons();
      const outCome = new LoadGcCancellationReasonsSuccess(mockReasonsResponse);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: mockReasonsResponse });
      giftCardsServiceSpy.getGcCancellationReasons.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadGcCancellationReasons$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadGcCancellationReasons();
      const error = new Error('some error');
      const outCome = new LoadGcCancellationReasonsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      giftCardsServiceSpy.getGcCancellationReasons.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.loadGcCancellationReasons$).toBeObservable(expected);
    });
  });
});
