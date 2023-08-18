import {
  CPGProductGroupConfigForQCGCDetails,
  CPGProductGroupConfigForQCGCListingResult,
  CPGProductGroupConfigForQCGCMapping,
  InstrumentType,
  LoadCPGProductGroupConfigForQCGCListingPayload,
  PaymentCode,
  ProductGroupMappingOption,
  RedemptionType,
  TEPProductGroupConfigListingPayload
} from '@poss-web/shared/models';
import * as actions from './cpg-product-group-config-for-qcgc.actions';
import { CPGProductGroupConfigForQCGCState } from './cpg-product-group-config-for-qcgc.state';
import {
  initialState as istate,
  CPGProductGroupConfigForQCGCReducer
} from './cpg-product-group-config-for-qcgc.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('TEP Product Group config Reducer Testing Suite', () => {
  const initialState: CPGProductGroupConfigForQCGCState = { ...istate };

  describe('Testing LoadTepProductGroupConfigListing Functionality', () => {
    it('LoadTepProductGroupConfigListing should be called', () => {
      const payload: LoadCPGProductGroupConfigForQCGCListingPayload = {
        pageIndex: 0,
        pageSize: 10,
        searchData: ''
      };
      const action = new actions.LoadCPGProductGroupConfigForQCGCListing(
        payload
      );

      const result: CPGProductGroupConfigForQCGCState = CPGProductGroupConfigForQCGCReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadCPGProductGroupConfigForQCGCListingSuccess should return list', () => {
      const payload: CPGProductGroupConfigForQCGCListingResult = {
        results: [],
        pageNumber: 0,
        pageSize: 0,
        totalPages: 0,
        totalElements: 0
      };

      const action = new actions.LoadCPGProductGroupConfigForQCGCListingSuccess(
        payload
      );
      const result: CPGProductGroupConfigForQCGCState = CPGProductGroupConfigForQCGCReducer(
        initialState,
        action
      );

      expect(result.cpgProductGroupConfigListing).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadCPGProductGroupConfigForQCGCListingFailure should return error', () => {
      const action = new actions.LoadCPGProductGroupConfigForQCGCListingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CPGProductGroupConfigForQCGCState = CPGProductGroupConfigForQCGCReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchCPGProductGroupConfigForQCGCListing Functionality', () => {
    it('SearchCPGProductGroupConfigForQCGCListing should be called', () => {
      const action = new actions.SearchCPGProductGroupConfigForQCGCListing(
        'payload'
      );

      const result: CPGProductGroupConfigForQCGCState = CPGProductGroupConfigForQCGCReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('SearchCPGProductGroupConfigForQCGCListingSuccess should return list', () => {
      const payload: CPGProductGroupConfigForQCGCDetails =
      {
        description: 'desc',
        instrumentType: InstrumentType.InstrumentTypeEVoucherCard,
        isActive: true,
        minimumAmount: 0,
        paymentCategoryName: 'name',
        paymentCode: PaymentCode.Qcgc,
        redemptionType: RedemptionType.Full
      }

      const action = new actions.SearchCPGProductGroupConfigForQCGCListingSuccess(
        payload
      );
      const result: CPGProductGroupConfigForQCGCState = CPGProductGroupConfigForQCGCReducer(
        initialState,
        action
      );

      expect(result.cpgProductGroupConfigListing).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('SearchCPGProductGroupConfigForQCGCListingFailure should return error', () => {
      const action = new actions.SearchCPGProductGroupConfigForQCGCListingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CPGProductGroupConfigForQCGCState = CPGProductGroupConfigForQCGCReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadTepProductGroupConfigDetails Functionality', () => {
    it('LoadTepProductGroupConfigDetails should be called', () => {
      const action = new actions.LoadCPGProductGroupConfigForQCGCDetails(
        'Code'
      );

      const result: CPGProductGroupConfigForQCGCState = CPGProductGroupConfigForQCGCReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadCPGProductGroupConfigForQCGCDetailsSuccess should return list', () => {
      const payload: CPGProductGroupConfigForQCGCDetails = {
        description: 'desc',
        instrumentType: InstrumentType.InstrumentTypeEVoucherCard,
        isActive: true,
        minimumAmount: 0,
        paymentCategoryName: 'name',
        paymentCode: PaymentCode.Qcgc,
        redemptionType: RedemptionType.Full
      };

      const action = new actions.LoadCPGProductGroupConfigForQCGCDetailsSuccess(
        payload
      );
      const result: CPGProductGroupConfigForQCGCState = CPGProductGroupConfigForQCGCReducer(
        initialState,
        action
      );

      expect(result.cpgProductGroupConfigDetails).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadCPGProductGroupConfigForQCGCDetailsFailure should return error', () => {
      const action = new actions.LoadCPGProductGroupConfigForQCGCDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CPGProductGroupConfigForQCGCState = CPGProductGroupConfigForQCGCReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveTepProductGroupConfigDetails Functionality', () => {
    const payload: CPGProductGroupConfigForQCGCDetails = {
      description: 'desc',
      instrumentType: InstrumentType.InstrumentTypeEVoucherCard,
      isActive: true,
      minimumAmount: 0,
      paymentCategoryName: 'name',
      paymentCode: PaymentCode.Qcgc,
      redemptionType: RedemptionType.Full
    };
    it('SaveCPGProductGroupConfigForQCGCDetails should be called', () => {
      const action = new actions.SaveCPGProductGroupConfigForQCGCDetails(
        payload
      );

      const result: CPGProductGroupConfigForQCGCState = CPGProductGroupConfigForQCGCReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('SaveCPGProductGroupConfigForQCGCDetailsSuccess should return list', () => {
      const action = new actions.SaveCPGProductGroupConfigForQCGCDetailsSuccess(
        payload
      );
      const result: CPGProductGroupConfigForQCGCState = CPGProductGroupConfigForQCGCReducer(
        initialState,
        action
      );

      expect(result.cpgProductGroupConfigDetailsSavedResponse).toBe(payload);
      expect(result.isLoading).toBe(false);
    });
    it('SaveCPGProductGroupConfigForQCGCDetailsFailure should return error', () => {
      const action = new actions.SaveCPGProductGroupConfigForQCGCDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CPGProductGroupConfigForQCGCState = CPGProductGroupConfigForQCGCReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing EditCPGProductGroupConfigForQCGCDetails Functionality', () => {
    const payload: CPGProductGroupConfigForQCGCDetails = {
      description: 'desc',
      instrumentType: InstrumentType.InstrumentTypeEVoucherCard,
      isActive: true,
      minimumAmount: 0,
      paymentCategoryName: 'name',
      paymentCode: PaymentCode.Qcgc,
      redemptionType: RedemptionType.Full
    };
    it('EditCPGProductGroupConfigForQCGCDetails should be called', () => {
      const action = new actions.EditCPGProductGroupConfigForQCGCDetails(
        payload
      );

      const result: CPGProductGroupConfigForQCGCState = CPGProductGroupConfigForQCGCReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('EditCPGProductGroupConfigForQCGCDetailsSuccess should return list', () => {
      const action = new actions.EditCPGProductGroupConfigForQCGCDetailsSuccess(
        payload
      );
      const result: CPGProductGroupConfigForQCGCState = CPGProductGroupConfigForQCGCReducer(
        initialState,
        action
      );

      expect(result.cpgProductGroupConfigDetailsEditedResponse).toBe(payload);
      expect(result.isLoading).toBe(false);
    });
    it('EditCPGProductGroupConfigForQCGCDetailsFailure should return error', () => {
      const action = new actions.EditCPGProductGroupConfigForQCGCDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CPGProductGroupConfigForQCGCState = CPGProductGroupConfigForQCGCReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadCPGProductGroupConfigForQCGCMapping Functionality', () => {
    it('LoadCPGProductGroupConfigForQCGCMapping should be called', () => {
      const payload = 'Code';
      const action = new actions.LoadCPGProductGroupConfigForQCGCMapping(
        payload
      );

      const result: CPGProductGroupConfigForQCGCState = CPGProductGroupConfigForQCGCReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadCPGProductGroupConfigForQCGCMappingSuccess should return list', () => {
      const payload: ProductGroupMappingOption[] = [
        {
          description: 'desc',
          id: '1',
          uuid: '2'
        }
      ];
      const action = new actions.LoadCPGProductGroupConfigForQCGCMappingSuccess(
        payload
      );
      const result: CPGProductGroupConfigForQCGCState = CPGProductGroupConfigForQCGCReducer(
        initialState,
        action
      );

      expect(result.cpgProductGroupMapping).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadCPGProductGroupConfigForQCGCMappingFailure should return error', () => {
      const action = new actions.LoadCPGProductGroupConfigForQCGCMappingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CPGProductGroupConfigForQCGCState = CPGProductGroupConfigForQCGCReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveCPGProductGroupConfigForQCGCMapping Functionality', () => {
    it('SaveCPGProductGroupConfigForQCGCMapping should be called', () => {
      const payload: {
        data: CPGProductGroupConfigForQCGCMapping;
        id: string;
      } = {
        data: {
          addProductGroupCode: [],
          removeProductMappingIds: []
        },
        id: '1'
      };
      const action = new actions.SaveCPGProductGroupConfigForQCGCMapping(
        payload
      );

      const result: CPGProductGroupConfigForQCGCState = CPGProductGroupConfigForQCGCReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('SaveCPGProductGroupConfigForQCGCMappingSuccess should return list', () => {
      const payload: ProductGroupMappingOption[] = [
        {
          id: '1',
          uuid: '2',
          description: 'desc'
        }
      ];
      const action = new actions.SaveCPGProductGroupConfigForQCGCMappingSuccess(
        payload
      );
      const result: CPGProductGroupConfigForQCGCState = CPGProductGroupConfigForQCGCReducer(
        initialState,
        action
      );

      expect(result.cpgProductGroupMapping).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('SaveCPGProductGroupConfigForQCGCMappingFailure should return error', () => {
      const action = new actions.SaveCPGProductGroupConfigForQCGCMappingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CPGProductGroupConfigForQCGCState = CPGProductGroupConfigForQCGCReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });
});
