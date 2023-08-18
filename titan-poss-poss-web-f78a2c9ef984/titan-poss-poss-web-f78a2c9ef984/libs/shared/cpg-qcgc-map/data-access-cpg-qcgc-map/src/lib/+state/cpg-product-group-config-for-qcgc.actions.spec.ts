import {
  CPGProductGroupConfigForQCGCDetails,
  CPGProductGroupConfigForQCGCListingResult,
  CustomErrors,
  LoadCPGProductGroupConfigForQCGCListingPayload,
  PaymentCode,
  RedemptionType,
  InstrumentType,
  ProductGroupMappingOption,
  CPGProductGroupConfigForQCGCMapping
} from '@poss-web/shared/models';
import {
  CPGProductGroupConfigForQCGCActionTypes,
  EditCPGProductGroupConfigForQCGCDetails,
  EditCPGProductGroupConfigForQCGCDetailsFailure,
  EditCPGProductGroupConfigForQCGCDetailsSuccess,
  LoadCPGProductGroupConfigForQCGCDetails,
  LoadCPGProductGroupConfigForQCGCDetailsFailure,
  LoadCPGProductGroupConfigForQCGCDetailsSuccess,
  LoadCPGProductGroupConfigForQCGCListing,
  LoadCPGProductGroupConfigForQCGCListingFailure,
  LoadCPGProductGroupConfigForQCGCListingSuccess,
  LoadCPGProductGroupConfigForQCGCMapping,
  LoadCPGProductGroupConfigForQCGCMappingFailure,
  LoadCPGProductGroupConfigForQCGCMappingSuccess,
  SaveCPGProductGroupConfigForQCGCDetails,
  SaveCPGProductGroupConfigForQCGCDetailsFailure,
  SaveCPGProductGroupConfigForQCGCDetailsSuccess,
  SaveCPGProductGroupConfigForQCGCMapping,
  SaveCPGProductGroupConfigForQCGCMappingFailure,
  SaveCPGProductGroupConfigForQCGCMappingSuccess,
  SearchCPGProductGroupConfigForQCGCListing,
  SearchCPGProductGroupConfigForQCGCListingFailure,
  SearchCPGProductGroupConfigForQCGCListingSuccess
} from './cpg-product-group-config-for-qcgc.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('CPG Product Group Config Action Testing Suite', () => {
  const responsePayload: CPGProductGroupConfigForQCGCDetails = {
    description: 'desc',
    instrumentType: InstrumentType.InstrumentTypeEVoucherCard,
    isActive: true,
    minimumAmount: 0,
    paymentCategoryName: 'name',
    paymentCode: PaymentCode.Qcgc,
    redemptionType: RedemptionType.Full
  };

  describe('LoadCPGProductGroupConfigForQCGCListing Action Test Cases', () => {
    it('should check correct type is used for LoadCPGProductGroupConfigForQCGCListing action', () => {
      const payload: LoadCPGProductGroupConfigForQCGCListingPayload = {
        pageIndex: 0,
        pageSize: 10,
        searchData: ''
      };
      const action = new LoadCPGProductGroupConfigForQCGCListing(payload);
      expect({ ...action }).toEqual({
        type:
          CPGProductGroupConfigForQCGCActionTypes.LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_LISTING,
        payload
      });
    });

    it('should check correct type is used for LoadCPGProductGroupConfigForQCGCListingSuccess action', () => {
      const payload: CPGProductGroupConfigForQCGCListingResult = {
        results: [],
        pageNumber: 0,
        pageSize: 0,
        totalPages: 0,
        totalElements: 0
      };

      const action = new LoadCPGProductGroupConfigForQCGCListingSuccess(
        payload
      );
      expect({ ...action }).toEqual({
        type:
          CPGProductGroupConfigForQCGCActionTypes.LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadTaxClassListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCPGProductGroupConfigForQCGCListingFailure(
        payload
      );

      expect({ ...action }).toEqual({
        type:
          CPGProductGroupConfigForQCGCActionTypes.LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('SearchCPGProductGroupConfigForQCGCListing Action Test Cases', () => {
    it('should check correct type is used for SearchCPGProductGroupConfigForQCGCListing action', () => {
      const payload = '';
      const action = new SearchCPGProductGroupConfigForQCGCListing(payload);
      expect({ ...action }).toEqual({
        type:
          CPGProductGroupConfigForQCGCActionTypes.SEARCH_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_LISTING,
        payload
      });
    });

    it('should check correct type is used for SearchCPGProductGroupConfigForQCGCListingSuccess action', () => {
      const payload = responsePayload;

      const action = new SearchCPGProductGroupConfigForQCGCListingSuccess(
        payload
      );
      expect({ ...action }).toEqual({
        type:
          CPGProductGroupConfigForQCGCActionTypes.SEARCH_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchCPGProductGroupConfigForQCGCListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchCPGProductGroupConfigForQCGCListingFailure(
        payload
      );

      expect({ ...action }).toEqual({
        type:
          CPGProductGroupConfigForQCGCActionTypes.SEARCH_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('LoadCPGProductGroupConfigForQCGCDetails Action Test Cases', () => {
    it('should check correct type is used for LoadCPGProductGroupConfigForQCGCDetails action', () => {
      const payload = '';

      const action = new LoadCPGProductGroupConfigForQCGCDetails(payload);
      expect({ ...action }).toEqual({
        type:
          CPGProductGroupConfigForQCGCActionTypes.LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS,
        payload
      });
    });

    it('should check correct type is used for LoadCPGProductGroupConfigForQCGCDetailsSuccess action', () => {
      const payload = responsePayload;

      const action = new LoadCPGProductGroupConfigForQCGCDetailsSuccess(
        payload
      );
      expect({ ...action }).toEqual({
        type:
          CPGProductGroupConfigForQCGCActionTypes.LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadCPGProductGroupConfigForQCGCDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCPGProductGroupConfigForQCGCDetailsFailure(
        payload
      );

      expect({ ...action }).toEqual({
        type:
          CPGProductGroupConfigForQCGCActionTypes.LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('SaveCPGProductGroupConfigForQCGCDetails Action Test Cases', () => {
    it('should check correct type is used for SaveCPGProductGroupConfigForQCGCDetails action', () => {
      const payload = responsePayload;

      const action = new SaveCPGProductGroupConfigForQCGCDetails(payload);
      expect({ ...action }).toEqual({
        type:
          CPGProductGroupConfigForQCGCActionTypes.SAVE_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS,
        payload
      });
    });

    it('should check correct type is used for SaveCPGProductGroupConfigForQCGCDetailsSuccess action', () => {
      const payload = responsePayload;

      const action = new SaveCPGProductGroupConfigForQCGCDetailsSuccess(
        payload
      );
      expect({ ...action }).toEqual({
        type:
          CPGProductGroupConfigForQCGCActionTypes.SAVE_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SaveCPGProductGroupConfigForQCGCDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveCPGProductGroupConfigForQCGCDetailsFailure(
        payload
      );

      expect({ ...action }).toEqual({
        type:
          CPGProductGroupConfigForQCGCActionTypes.SAVE_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('EditCPGProductGroupConfigForQCGCDetails Action Test Cases', () => {
    it('should check correct type is used for EditCPGProductGroupConfigForQCGCDetails action', () => {
      const payload = responsePayload;

      const action = new EditCPGProductGroupConfigForQCGCDetails(payload);
      expect({ ...action }).toEqual({
        type:
          CPGProductGroupConfigForQCGCActionTypes.EDIT_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS,
        payload
      });
    });

    it('should check correct type is used for EditCPGProductGroupConfigForQCGCDetailsSuccess action', () => {
      const payload = responsePayload;

      const action = new EditCPGProductGroupConfigForQCGCDetailsSuccess(
        payload
      );
      expect({ ...action }).toEqual({
        type:
          CPGProductGroupConfigForQCGCActionTypes.EDIT_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for EditCPGProductGroupConfigForQCGCDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new EditCPGProductGroupConfigForQCGCDetailsFailure(
        payload
      );

      expect({ ...action }).toEqual({
        type:
          CPGProductGroupConfigForQCGCActionTypes.EDIT_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadCPGProductGroupConfigForQCGCMapping Action Test Cases', () => {
    it('should check correct type is used for LoadCPGProductGroupConfigForQCGCMapping action', () => {
      const payload = '';

      const action = new LoadCPGProductGroupConfigForQCGCMapping(payload);
      expect({ ...action }).toEqual({
        type:
          CPGProductGroupConfigForQCGCActionTypes.LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_MAPPING,
        payload
      });
    });

    it('should check correct type is used for LoadCPGProductGroupConfigForQCGCMappingSuccess action', () => {
      const payload: ProductGroupMappingOption[] = [
        {
          description: 'desc',
          id: '1',
          uuid: '2'
        }
      ];

      const action = new LoadCPGProductGroupConfigForQCGCMappingSuccess(
        payload
      );
      expect({ ...action }).toEqual({
        type:
          CPGProductGroupConfigForQCGCActionTypes.LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_MAPPING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadCPGProductGroupConfigForQCGCMappingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCPGProductGroupConfigForQCGCMappingFailure(
        payload
      );

      expect({ ...action }).toEqual({
        type:
          CPGProductGroupConfigForQCGCActionTypes.LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_MAPPING_FAILURE,
        payload
      });
    });
  });

  describe('SaveCPGProductGroupConfigForQCGCMapping Action Test Cases', () => {
    it('should check correct type is used for SaveCPGProductGroupConfigForQCGCMapping action', () => {
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

      const action = new SaveCPGProductGroupConfigForQCGCMapping(payload);
      expect({ ...action }).toEqual({
        type:
          CPGProductGroupConfigForQCGCActionTypes.SAVE_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_MAPPING,
        payload
      });
    });

    it('should check correct type is used for SaveCPGProductGroupConfigForQCGCMappingSuccess action', () => {
      const payload: ProductGroupMappingOption[] = [
        {
          id: '1',
          uuid: '2',
          description: 'desc'
        }
      ];

      const action = new SaveCPGProductGroupConfigForQCGCMappingSuccess(
        payload
      );
      expect({ ...action }).toEqual({
        type:
          CPGProductGroupConfigForQCGCActionTypes.SAVE_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_MAPPING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SaveCPGProductGroupConfigForQCGCMappingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveCPGProductGroupConfigForQCGCMappingFailure(
        payload
      );

      expect({ ...action }).toEqual({
        type:
          CPGProductGroupConfigForQCGCActionTypes.SAVE_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_MAPPING_FAILURE,
        payload
      });
    });
  });
});
