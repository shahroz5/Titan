import {
  CustomErrors,
  GSTMappingDetails,
  Tax,
  LoadGSTMappingListPayload,
  GSTMappingResponse,
  GSTMappingPayload,
  Lov
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LoadGSTMappingList,
  GSTMappingActionTypes,
  LoadGSTMappingListFailure,
  LoadGSTMappingListSuccess,
  AddGSTMapping,
  AddGSTMappingSuccess,
  AddGSTMappingFailure,
  EditGSTMapping,
  EditGSTMappingSuccess,
  EditGSTMappingFailure,
  LoadTransactionTypes,
  LoadTransactionTypesSuccess,
  LoadTransactionTypesFailure,
  LoadTaxes,
  LoadTaxesSuccess,
  LoadTaxesFailure,
  ResetData
} from './gst-mapping.action';


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



describe('GST Mapping Action Testing ', () => {
  describe('Load GST Mapping List Action Test Cases', () => {
    it('should check correct type and payload is used for  LoadGSTMappingList action ', () => {
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
      const action = new LoadGSTMappingList(payload);

      expect(action.type).toEqual(GSTMappingActionTypes.LOAD_GST_MAPPING_LIST);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type  and payload is used for  LoadGSTMappingListSuccess action ', () => {
      const payload: GSTMappingResponse = {
        gstMappingList: [gstMappingDetails],
        totalElements: 1
      };
      const action = new LoadGSTMappingListSuccess(payload);

      expect(action.type).toEqual(
        GSTMappingActionTypes.LOAD_GST_MAPPING_LIST_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type  and payload is used for  LoadGSTMappingListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadGSTMappingListFailure(payload);

      expect(action.type).toEqual(
        GSTMappingActionTypes.LOAD_GST_MAPPING_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Add GST Mapping List Action Test Cases', () => {
    it('should check correct type and payload is used for  AddGSTMapping action ', () => {
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
      const action = new AddGSTMapping(payload);

      expect(action.type).toEqual(GSTMappingActionTypes.ADD_GST_MAPPING);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type  and payload is used for  AddGSTMappingSuccess action ', () => {
      const payload = gstMappingDetails;
      const action = new AddGSTMappingSuccess(payload);

      expect(action.type).toEqual(
        GSTMappingActionTypes.ADD_GST_MAPPING_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type  and payload is used for  AddGSTMappingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new AddGSTMappingFailure(payload);

      expect(action.type).toEqual(
        GSTMappingActionTypes.ADD_GST_MAPPING_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Edit GST Mapping List Action Test Cases', () => {
    it('should check correct type and payload is used for  EditGSTMapping action ', () => {
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
      const action = new EditGSTMapping(payload);

      expect(action.type).toEqual(GSTMappingActionTypes.EDIT_GST_MAPPING);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type  and payload is used for  EditGSTMappingSuccess action ', () => {
      const payload = gstMappingDetails;
      const action = new EditGSTMappingSuccess(payload);

      expect(action.type).toEqual(
        GSTMappingActionTypes.EDIT_GST_MAPPING_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type  and payload is used for  EditGSTMappingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new EditGSTMappingFailure(payload);

      expect(action.type).toEqual(
        GSTMappingActionTypes.EDIT_GST_MAPPING_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load Transaction Types Action Test Cases', () => {
    it('should check correct type and payload is used for  LoadTransactionTypes action ', () => {
      const action = new LoadTransactionTypes();

      expect(action.type).toEqual(GSTMappingActionTypes.LOAD_TRANSACTION_TYPES);
    });
    it('should check correct type  and payload is used for  EditGSTMappingSuccess action ', () => {
      const payload: Lov[] = [
        {
          code: 'TYPE 1',
          value: 'TYPE 1',
          isActive: true
        }
      ];
      const action = new LoadTransactionTypesSuccess(payload);

      expect(action.type).toEqual(
        GSTMappingActionTypes.LOAD_TRANSACTION_TYPES_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type  and payload is used for  LoadTransactionTypesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTransactionTypesFailure(payload);

      expect(action.type).toEqual(
        GSTMappingActionTypes.LOAD_TRANSACTION_TYPES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load Taxes Action Test Cases', () => {
    it('should check correct type and payload is used for  LoadTaxes action ', () => {
      const action = new LoadTaxes();

      expect(action.type).toEqual(GSTMappingActionTypes.LOAD_TAXES);
    });
    it('should check correct type  and payload is used for  LoadTaxesSuccess action ', () => {
      const payload: Tax[] = [
        {
          taxCode: 'TAX-1',
          description: 'TAX DESC 1'
        }
      ];
      const action = new LoadTaxesSuccess(payload);

      expect(action.type).toEqual(GSTMappingActionTypes.LOAD_TAXES_SUCCESS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type  and payload is used for  LoadTaxesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTaxesFailure(payload);

      expect(action.type).toEqual(GSTMappingActionTypes.LOAD_TAXES_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Reset Data Action Test Cases', () => {
    it('should check correct type and payload is used for  ResetData action ', () => {
      const action = new ResetData();

      expect(action.type).toEqual(GSTMappingActionTypes.RESET_DATA);
    });
  });
});
