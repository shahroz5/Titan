import { TestBed } from '@angular/core/testing';
import { DataPersistence } from '@nrwl/angular';

import { Observable } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  GSTMappingDetails,
  GSTMappingPayload,
  GSTMappingResponse,
  LoadGSTMappingListPayload,
  Lov,
  Tax
} from '@poss-web/shared/models';

import { hot, cold } from 'jasmine-marbles';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LovDataService } from '@poss-web/shared/masters/data-access-masters';
import { GSTMappingService } from '../gst-mapping.service';
import { GST_MAPPING_FEATURE_KEY, initialState } from './gst-mapping.reducer';
import { GSTMappingEffects } from './gst-mapping.effects';
import {
  AddGSTMapping,
  AddGSTMappingFailure,
  AddGSTMappingSuccess,
  EditGSTMapping,
  EditGSTMappingFailure,
  EditGSTMappingSuccess,
  LoadGSTMappingList,
  LoadGSTMappingListFailure,
  LoadGSTMappingListSuccess,
  LoadTaxes,
  LoadTaxesFailure,
  LoadTaxesSuccess,
  LoadTransactionTypes,
  LoadTransactionTypesFailure,
  LoadTransactionTypesSuccess
} from './gst-mapping.action';

describe('GST mapping Effect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: GSTMappingEffects;

  const gstMappingDetails: GSTMappingDetails = {
    isActive: true,
    customerTaxType: 'REGISTERED',
    destLocationTaxType: 'L2',
    srcLocationTaxType: 'CFA',
    txnType: 'SERVICE_TAx',
    applicableTax: 'GST',
    destLocationApplicableTax: 'GST',
    isSameState: false,
    srcLocationApplicableTax: 'GST',
    srcTaxApplicable: false,
    id: 'ID'
  };

  const gstMappingServiceSpy = jasmine.createSpyObj<GSTMappingService>([
    'loadGSTMappingList',
    'addGSTMapping',
    'editGSTMapping',
    'loadTaxDetails',
  ]);
  const lovDataServiceSpy = jasmine.createSpyObj<LovDataService>([
    'getLocationLovs'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GSTMappingEffects,
        DataPersistence,
        provideMockStore({
          initialState: {
            [GST_MAPPING_FEATURE_KEY]: initialState
          }
        }),
        provideMockActions(() => actions$),

        {
          provide: LovDataService,
          useValue: lovDataServiceSpy
        },

        {
          provide: GSTMappingService,
          useValue: gstMappingServiceSpy
        }
      ]
    });

    effect = TestBed.inject(GSTMappingEffects);
  });

  describe('LoadGSTMappingList', () => {
    it('should return a GST mapping List', () => {
      const payload: LoadGSTMappingListPayload = {
        pageIndex: 10,
        pageSize: 20,
        filter: {
          isActive: true,
          customerTaxType: 'REGISTERED',
          destLocationTaxType: 'L2',
          srcLocationTaxType: 'CFA',
          txnType: 'SERVICE_TAx'
        }
      };

      const response: GSTMappingResponse = {
        gstMappingList: [gstMappingDetails],
        totalElements: 1
      };

      const action = new LoadGSTMappingList(payload);
      const outcome = new LoadGSTMappingListSuccess(response);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: response });
      gstMappingServiceSpy.loadGSTMappingList.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadGSTMappingList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: LoadGSTMappingListPayload = {
        pageIndex: 10,
        pageSize: 20,
        filter: {
          isActive: true,
          customerTaxType: 'REGISTERED',
          destLocationTaxType: 'L2',
          srcLocationTaxType: 'CFA',
          txnType: 'SERVICE_TAx'
        }
      };

      const error = new Error('some error');

      const action = new LoadGSTMappingList(payload);
      const outcome = new LoadGSTMappingListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      gstMappingServiceSpy.loadGSTMappingList.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadGSTMappingList$).toBeObservable(expected$);
    });
  });

  describe('AddGSTMapping', () => {
    it('should add new GST mapping', () => {
      const payload: GSTMappingPayload = {
        isActive: true,
        customerTaxType: 'REGISTERED',
        destLocationTaxType: 'L2',
        srcLocationTaxType: 'CFA',
        txnType: 'SERVICE_TAx',
        applicableTax: 'GST',
        destLocationApplicableTax: 'GST',
        isSameState: false,
        srcLocationApplicableTax: 'GST',
        srcTaxApplicable: false
      };

      const response = gstMappingDetails;

      const action = new AddGSTMapping(payload);
      const outcome = new AddGSTMappingSuccess(response);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: response });
      gstMappingServiceSpy.addGSTMapping.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.addGSTMapping$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: GSTMappingPayload = {
        isActive: true,
        customerTaxType: 'REGISTERED',
        destLocationTaxType: 'L2',
        srcLocationTaxType: 'CFA',
        txnType: 'SERVICE_TAx',
        applicableTax: 'GST',
        destLocationApplicableTax: 'GST',
        isSameState: false,
        srcLocationApplicableTax: 'GST',
        srcTaxApplicable: false
      };

      const error = new Error('some error');

      const action = new AddGSTMapping(payload);
      const outcome = new AddGSTMappingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      gstMappingServiceSpy.addGSTMapping.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.addGSTMapping$).toBeObservable(expected$);
    });
  });

  describe('EditGSTMapping', () => {
    it('should edit GST mapping', () => {
      const payload = {
        data: {
          isActive: true,
          customerTaxType: 'REGISTERED',
          destLocationTaxType: 'L2',
          srcLocationTaxType: 'CFA',
          txnType: 'SERVICE_TAx',
          applicableTax: 'GST',
          destLocationApplicableTax: 'GST',
          isSameState: false,
          srcLocationApplicableTax: 'GST',
          srcTaxApplicable: false
        },
        configId: 'TEST ID'
      };

      const response = gstMappingDetails;

      const action = new EditGSTMapping(payload);
      const outcome = new EditGSTMappingSuccess(response);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: response });
      gstMappingServiceSpy.editGSTMapping.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.editGSTMapping$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = {
        data: {
          isActive: true,
          customerTaxType: 'REGISTERED',
          destLocationTaxType: 'L2',
          srcLocationTaxType: 'CFA',
          txnType: 'SERVICE_TAx',
          applicableTax: 'GST',
          destLocationApplicableTax: 'GST',
          isSameState: false,
          srcLocationApplicableTax: 'GST',
          srcTaxApplicable: false
        },
        configId: 'TEST ID'
      };
      const error = new Error('some error');

      const action = new EditGSTMapping(payload);
      const outcome = new EditGSTMappingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      gstMappingServiceSpy.editGSTMapping.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.editGSTMapping$).toBeObservable(expected$);
    });
  });

  describe('LoadTaxes', () => {
    it('should return taxws', () => {
      const response: Tax[] = [
        {
          taxCode: 'TAX-1',
          description: 'TAX DESC 1'
        }
      ];

      const action = new LoadTaxes();
      const outcome = new LoadTaxesSuccess(response);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: response });
      gstMappingServiceSpy.loadTaxDetails.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadTaxes$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const error = new Error('some error');

      const action = new LoadTaxes();
      const outcome = new LoadTaxesFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      gstMappingServiceSpy.loadTaxDetails.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTaxes$).toBeObservable(expected$);
    });
  });

  describe('LoadTxnTypes', () => {
    it('should return taxws', () => {
      const response: Lov[] = [
        {
          code: 'TYPE 1',
          value: 'TYPE 1',
          isActive: true
        }
      ];

      const action = new LoadTransactionTypes();
      const outcome = new LoadTransactionTypesSuccess(response);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: response });
      lovDataServiceSpy.getLocationLovs.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadTxnTypes$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const error = new Error('some error');

      const action = new LoadTransactionTypes();
      const outcome = new LoadTransactionTypesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      lovDataServiceSpy.getLocationLovs.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTxnTypes$).toBeObservable(expected$);
    });
  });
});
