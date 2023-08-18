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
  ConfigListingPayload,
  CustomErrors,
  PrinterConfigList,
  PrinterConfigDetails,
  Lov
} from '@poss-web/shared/models';

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

const configListingPayload: ConfigListingPayload = {
  pageIndex: 0,
  pageSize: 8
};

describe('Printer Config Action Testing Suite', () => {
  describe('Printer List Action Test Cases', () => {
    it('should check correct type is used for  GetPrinterList action ', () => {
      const action = new GetPrinterList(configListingPayload);

      expect(action.type).toEqual(PrinterConfigActionTypes.GET_PRINTER_LIST);

      expect(action.payload).toEqual(configListingPayload);
    });
    it('should check correct type is used for GetPrinterListSuccess action ', () => {
      const action = new GetPrinterListSuccess(printerConfigList);

      expect(action.type).toEqual(
        PrinterConfigActionTypes.GET_PRINTER_LIST_SUCCESS
      );
      expect(action.payload).toEqual(printerConfigList);
    });
    it('should check correct type is used for GetPrinterListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetPrinterListFailure(payload);

      expect(action.type).toEqual(
        PrinterConfigActionTypes.GET_PRINTER_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('get printer names Action Test Cases', () => {
    it('should check correct type is used for  GetPrinterNameList action ', () => {
      const action = new GetPrinterNameList();

      expect(action.type).toEqual(
        PrinterConfigActionTypes.GET_PRINTER_NAME_LIST
      );
    });

    it('should check correct type is used for GetPrinterNameListSuccess action ', () => {
      const action = new GetPrinterNameListSuccess(['print1', 'print2']);

      expect(action.type).toEqual(
        PrinterConfigActionTypes.GET_PRINTER_NAME_LIST_SUCCESS
      );
      expect(action.payload).toEqual(['print1', 'print2']);
    });
    it('should check correct type is used for GetPrinterNameListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetPrinterNameListFailure(payload);

      expect(action.type).toEqual(
        PrinterConfigActionTypes.GET_PRINTER_NAME_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Add printer Action Test Cases', () => {
    it('should check correct type is used for  AddPrinter action ', () => {
      const action = new AddPrinter(printerConfigDetails);

      expect(action.type).toEqual(PrinterConfigActionTypes.ADD_PRINTER);

      expect(action.payload).toEqual(printerConfigDetails);
    });

    it('should check correct type is used for AddPrinterSuccess action ', () => {
      const action = new AddPrinterSuccess(printerConfigDetails);

      expect(action.type).toEqual(PrinterConfigActionTypes.ADD_PRINTER_SUCCESS);
      expect(action.payload).toEqual(printerConfigDetails);
    });
    it('should check correct type is used for AddPrinterFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new AddPrinterFailure(payload);

      expect(action.type).toEqual(PrinterConfigActionTypes.ADD_PRINTER_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('DeletePrinter Action Test Cases', () => {
    it('should check correct type is used for  DeletePrinter action ', () => {
      const action = new DeletePrinter(printerConfigDetails);

      expect(action.type).toEqual(PrinterConfigActionTypes.DELETE_PRINTER);

      expect(action.payload).toEqual(printerConfigDetails);
    });

    it('should check correct type is used for DeletePrinter action ', () => {
      const action = new DeletePrinterSuccess(printerConfigDetails);

      expect(action.type).toEqual(
        PrinterConfigActionTypes.DELETE_PRINTER_SUCCESS
      );
      expect(action.payload).toEqual(printerConfigDetails);
    });
    it('should check correct type is used for DeletePrinterFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new DeletePrinterFailure(payload);

      expect(action.type).toEqual(
        PrinterConfigActionTypes.DELETE_PRINTER_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('get GetDocType Action Test Cases', () => {
    it('should check correct type is used for  GetDocType action ', () => {
      const action = new GetDocType();

      expect(action.type).toEqual(PrinterConfigActionTypes.GET_DOC_TYPE);
    });

    it('should check correct type is used for GetDocTypeSuccess action ', () => {
      const action = new GetDocTypeSuccess(lov);

      expect(action.type).toEqual(
        PrinterConfigActionTypes.GET_DOC_TYPE_SUCCESS
      );
      expect(action.payload).toEqual(lov);
    });
    it('should check correct type is used for GetDocTypeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetDocTypeFailure(payload);

      expect(action.type).toEqual(
        PrinterConfigActionTypes.GET_DOC_TYPE_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ResetResponse Action Test Cases', () => {
    it('should check correct type is used for  ResetResponse action ', () => {
      const action = new ResetResponse();

      expect(action.type).toEqual(PrinterConfigActionTypes.RESET_RESPONSE);
    });
  });
});
