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
import { PrinterConfigurationState } from './printer-config.state';
import { Store } from '@ngrx/store';
import { TestBed, inject } from '@angular/core/testing';
import { PrinterConfigurationFacade } from './printer-config.facade';
import { PrinterConfigAdapter } from './printer-config.entity';
import * as moment from 'moment';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import {
  ConfigListingPayload,
  CustomErrors,
  Lov,
  PrinterConfigDetails,
  PrinterConfigList
} from '@poss-web/shared/models';
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

describe('printer config facade Testing Suite action', () => {
  let printerConfigurationFacade: PrinterConfigurationFacade;

  //let store: MockStore<UnipayConfigurationState>;
  const initialState: PrinterConfigurationState = {
    printer: null,
    printerList: PrinterConfigAdapter.getInitialState(),
    hasError: null,
    docType: [],
    printernameList: [],
    isLoading: false,
    totalCount: 0
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        PrinterConfigurationFacade
      ]
    });

    printerConfigurationFacade = TestBed.inject(PrinterConfigurationFacade);
  });

  describe('Dispatch printer config action', () => {
    it('should call loadPrinterNameList action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const action = new GetPrinterNameList();
      printerConfigurationFacade.loadPrinterNameList();
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call loadPrinterList action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new GetPrinterList(configListingPayload);
      printerConfigurationFacade.loadPrinterList(configListingPayload);

      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call addPrinter action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new AddPrinter(printerConfigDetails);
      printerConfigurationFacade.addPrinter(printerConfigDetails);

      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call deletePrinter action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new DeletePrinter(printerConfigDetails);
      printerConfigurationFacade.deletePrinter(printerConfigDetails);

      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call loadDocType action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new GetDocType();
      printerConfigurationFacade.loadDocType();

      expect(storeSpy).toHaveBeenCalledWith(action);
    }));



    it('should call clearResponse action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new ResetResponse();
      printerConfigurationFacade.clearResponse();
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));
  });

  describe('Access Selector action', () => {
    it('should get getTotalElements data', () => {
      expect(printerConfigurationFacade.getTotalElements()).toBeTruthy();
    });
    it('should get getHasError data', () => {
      expect(printerConfigurationFacade.getError()).toBeTruthy();
    });

    it('should get getIsLoading data', () => {
      expect(printerConfigurationFacade.getIsLoading()).toBeTruthy();
    });

    it('should get GetPrinterNames data', () => {
      expect(printerConfigurationFacade.GetPrinterNames()).toBeTruthy();
    });

    it('should get getTotalElements data', () => {
      expect(printerConfigurationFacade.getTotalElements()).toBeTruthy();
    });

    it('should get getDocTypeResponse data', () => {
      expect(printerConfigurationFacade.getDocTypeResponse()).toBeTruthy();
    });

    it('should get GetPrinterList data', () => {
      expect(printerConfigurationFacade.GetPrinterList()).toBeTruthy();
    });
  });
});
