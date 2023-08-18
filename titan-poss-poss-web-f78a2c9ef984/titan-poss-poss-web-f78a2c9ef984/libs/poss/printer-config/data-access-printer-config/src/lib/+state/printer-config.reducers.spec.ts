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
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  printerConfigurationReducer,
  initialState
} from './printer-config.reducers';
import { PrinterConfigurationState } from './printer-config.state';
import {
  ConfigListingPayload,
  CustomErrors,
  Lov,
  PrinterConfigDetails,
  PrinterConfigList
} from '@poss-web/shared/models';
import { ErrorEnums } from '@poss-web/shared/util-error';

describe('Printer Config Reducer Testing Suite', () => {
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
    pageSize: 10
  };

  describe('Testing GetPrinterList Functionality', () => {
    it('GetPrinterList should be called', () => {
      const action = new GetPrinterList(configListingPayload);
      const result: PrinterConfigurationState = printerConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('GetPrinterListSuccess should be called', () => {
      const action = new GetPrinterListSuccess(printerConfigList);
      const result: PrinterConfigurationState = printerConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.printerList).toBeTruthy();
    });
    it('GetPrinterListFailure should be called', () => {
      const action = new GetPrinterListFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: PrinterConfigurationState = printerConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });


  describe('Testing GetPrinterNameList Functionality', () => {
    it('GetPrinterNameList should be called', () => {
      const action = new GetPrinterNameList();
      const result: PrinterConfigurationState = printerConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('GetPrinterNameListSuccess should be called', () => {
      const action = new GetPrinterNameListSuccess(['test']);
      const result: PrinterConfigurationState = printerConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.printernameList).toBeTruthy();
    });
    it('GetPrinterNameListFailure should be called', () => {
      const action = new GetPrinterNameListFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: PrinterConfigurationState = printerConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing AddPrinter Functionality', () => {
    it('AddPrinter should be called', () => {
      const action = new AddPrinter(printerConfigDetails);
      const result: PrinterConfigurationState = printerConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('AddPrinterSuccess should be called', () => {
      const action = new AddPrinterSuccess(printerConfigDetails);
      const result: PrinterConfigurationState = printerConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.printerList).toBeTruthy();
    });
    it('AddPrinterFailure should be called', () => {
      const action = new AddPrinterFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: PrinterConfigurationState = printerConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing DeletePrinter Functionality', () => {
    it('DeletePrinter should be called', () => {
      const action = new DeletePrinter(printerConfigDetails);
      const result: PrinterConfigurationState = printerConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('DeletePrinterSuccess should be called', () => {
      const action = new DeletePrinterSuccess(printerConfigDetails);
      const result: PrinterConfigurationState = printerConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.printerList).toBeTruthy();
    });
    it('DeletePrinterFailure should be called', () => {
      const action = new DeletePrinterFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: PrinterConfigurationState = printerConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });


  describe('Testing getDocType Functionality', () => {
    it('getDocType should be called', () => {
      const action = new GetDocType();
      const result: PrinterConfigurationState = printerConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('GetDocTypeSuccess should be called', () => {
      const action = new GetDocTypeSuccess(lov);
      const result: PrinterConfigurationState = printerConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.docType).toBeTruthy();
    });
    it('GetDocTypeFailure should be called', () => {
      const action = new GetDocTypeFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: PrinterConfigurationState = printerConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });



  describe('Testing ResetResponse Functionality', () => {
    it('ResetResponse should be called', () => {
      const action = new ResetResponse();
      const result: PrinterConfigurationState = printerConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    });
  });
});
