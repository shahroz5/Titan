import { PrinterConfigEffect } from './printer-config.effects';
import { PrinterConfigService } from '../printer-config.service';
import { TestBed } from '@angular/core/testing';
import { DataPersistence } from '@nrwl/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  ResetResponse,
  GetDocType,
  GetDocTypeFailure,
  GetDocTypeSuccess,
  GetPrinterList,
  GetPrinterNameList,
  GetPrinterNameListSuccess,
  GetPrinterNameListFailure,
  AddPrinter,
  DeletePrinter,
  DeletePrinterSuccess,
  DeletePrinterFailure,
  AddPrinterSuccess,
  AddPrinterFailure,
  GetPrinterListFailure,
  GetPrinterListSuccess,
  PrinterConfigActionTypes
} from './printer-config.actions';
import { hot, cold } from 'jasmine-marbles';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { PrinterService } from '@poss-web/shared/util-common';
import { LovDataService } from '@poss-web/shared/masters/data-access-masters';
import {
  ConfigListingPayload,
  CustomErrors,
  Lov,
  PrinterConfigDetails,
  PrinterConfigList
} from '@poss-web/shared/models';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { printerConfigurationKey } from './printer-config.reducers';
import { ErrorEnums } from '@poss-web/shared/util-error';
const printerConfigList: PrinterConfigList = {
  count: 1,
  list: [
    {
      documentType: '',
      hostname: '',
      locationCode: '',
      printerName: '',
      id: '',
      isActive: 'true'
    }
  ]
};

const printerConfigDetails: PrinterConfigDetails = {
  documentType: '',
  hostname: '',
  locationCode: '',
  printerName: '',
  id: '',
  isActive: 'true'
};

const lov: Lov[] = [{ code: '', isActive: true, value: '' }];

const customError: CustomErrors = {
  code: ErrorEnums.ERR_QZ_TRAY,
  message: null,
  error: null,
  traceId: null,
  timeStamp: null
};

const configListingPayload: ConfigListingPayload = {
  pageIndex: 0,
  pageSize: 8
};

describe('Printer Config Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: PrinterConfigEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let printerConfigService = jasmine.createSpyObj<PrinterConfigService>(
    'PrinterConfigService',
    ['printerList', 'addPrinter', 'deletePrinter']
  );
  const lovDataService = jasmine.createSpyObj<LovDataService>(
    'LovDataService',
    ['getEngineLocationLovs']
  );

  const printerService = jasmine.createSpyObj<PrinterService>(
    'PrinterService',
    ['getPrinterList']
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PrinterConfigEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [printerConfigurationKey]: initialState
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
          provide: PrinterConfigService,
          useValue: printerConfigService
        },
        {
          provide: PrinterService,
          useValue: printerService
        },
        {
          provide: LovDataService,
          useValue: lovDataService
        },
        {
          provide: printerConfigService,
          useValue: {
            printerList: jasmine.createSpy(),
            addPrinter: jasmine.createSpy(),
            deletePrinter: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(PrinterConfigEffect);
    printerConfigService = TestBed.inject<any>(PrinterConfigService);
  });

  describe('GetPrinterList', () => {
    it('should return a stream of GetPrinterList ', () => {
      const action = new GetPrinterList(configListingPayload);
      const outcome = new GetPrinterListSuccess(printerConfigList);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: printerConfigList
      });
      printerConfigService.printerList.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.GetPrinterList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new GetPrinterList(configListingPayload);
      const error = new Error('some error');
      const outcome = new GetPrinterListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      printerConfigService.printerList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.GetPrinterList$).toBeObservable(expected);
    });
  });

  describe('AddPrinter', () => {
    it('should return Printer ', () => {
      const action = new AddPrinter(printerConfigDetails);
      const outcome = new AddPrinterSuccess(printerConfigDetails);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: printerConfigDetails
      });
      printerConfigService.addPrinter.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.AddPrinter$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new AddPrinter(printerConfigDetails);
      const error = new Error('some error');
      const outcome = new AddPrinterFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      printerConfigService.addPrinter.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.AddPrinter$).toBeObservable(expected);
    });
  });

  describe('DeletePrinter', () => {
    it('should return Deleted Printer ', () => {
      const action = new DeletePrinter(printerConfigDetails);
      const outcome = new DeletePrinterSuccess(printerConfigDetails);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: printerConfigDetails
      });
      printerConfigService.deletePrinter.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.DeletePrinter$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new DeletePrinter(printerConfigDetails);
      const error = new Error('some error');
      const outcome = new DeletePrinterFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      printerConfigService.deletePrinter.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.DeletePrinter$).toBeObservable(expected);
    });
  });

  describe('getDocType', () => {
    it('should return getDocType ', () => {
      const action = new GetDocType();
      const outcome = new GetDocTypeSuccess(lov);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: lov
      });
      lovDataService.getEngineLocationLovs.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.getDocType$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new GetDocType();
      const error = new Error('some error');
      const outcome = new GetDocTypeFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      lovDataService.getEngineLocationLovs.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.getDocType$).toBeObservable(expected);
    });
  });

  describe('GetPrinterNameList', () => {
    it('should return GetPrinterNameList ', () => {
      const action = new GetPrinterNameList();
      const outcome = new GetPrinterNameListSuccess([]);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: []
      });
      printerService.getPrinterList.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.GetPrinterNameList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new GetPrinterNameList();
      const error = new Error('some error');
      const outcome = new GetPrinterNameListFailure(customError);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, customError);
      printerService.getPrinterList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.GetPrinterNameList$).toBeObservable(expected);
    });
  });
});
