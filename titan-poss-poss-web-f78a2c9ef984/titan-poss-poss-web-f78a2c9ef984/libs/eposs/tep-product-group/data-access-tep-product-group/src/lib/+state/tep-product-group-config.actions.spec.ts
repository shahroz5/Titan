import {
  AddTEPProductGroupsMapping,
  CustomErrors,
  TEPProductGroupConfigDetails,
  TEPProductGroupConfigListing,
  TEPProductGroupConfigListingPayload,
  TEPProductGroupMappingListing,
  TEPProductGroupMappingListingPayload
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LoadTepProductGroupConfigDetails,
  LoadTepProductGroupConfigDetailsFailure,
  LoadTepProductGroupConfigDetailsSuccess,
  LoadTepProductGroupConfigListing,
  LoadTepProductGroupConfigListingFailure,
  LoadTepProductGroupConfigListingSuccess,
  LoadTepProductGroupMappintListing,
  LoadTepProductGroupMappintListingFailure,
  LoadTepProductGroupMappintListingSuccess,
  SaveTepProductGroupConfigDetails,
  SaveTepProductGroupConfigDetailsFailure,
  SaveTepProductGroupConfigDetailsSuccess,
  SaveTepProductGroupMapping,
  SaveTepProductGroupMappingFailure,
  SaveTepProductGroupMappingSuccess,
  SearchTepProductConfigDetails,
  SearchTepProductConfigDetailsFailure,
  SearchTepProductConfigDetailsSuccess,
  SearchTepProductGroupMappintListing,
  SearchTepProductGroupMappintListingFailure,
  SearchTepProductGroupMappintListingSuccess,
  TepProductGroupConfigActionTypes,
  UpdateTepProductGroupConfigDetails,
  UpdateTepProductGroupConfigDetailsFailure,
  UpdateTepProductGroupConfigDetailsSuccess
} from './tep-product-group-config.actons';

describe('LoadTepProductGroupConfigListing Action Testing Suite', () => {
  describe('LoadTepProductGroupConfigListing Action Test Cases', () => {
    it('should check correct type is used for LoadTepProductGroupConfigListing action', () => {
      const payload: TEPProductGroupConfigListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const action = new LoadTepProductGroupConfigListing(payload);

      expect({ ...action }).toEqual({
        type:
          TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_CONFIG_LISTING,
        payload
      });
    });

    it('should check correct type is used for LoadTepProductGroupConfigListingSuccess action', () => {
      const payload: TEPProductGroupConfigListing = {
        results: [
          {
            configDetails: {
              data: 'Data',
              type: 'Type'
            },
            configId: 'ConfigId',
            configType: 'ConfigType',
            customerMobileNos: ['123', '456'],
            description: 'Desc',
            isActive: true,
            offerDetails: {
              data: 'Data',
              type: 'Type'
            }
          }
        ],
        totalElements: 1
      };

      const action = new LoadTepProductGroupConfigListingSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_CONFIG_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadTepProductGroupConfigListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTepProductGroupConfigListingFailure(payload);

      expect({ ...action }).toEqual({
        type:
          TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_CONFIG_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('SearchTepProductConfigDetails Action Test Cases', () => {
    it('should check correct type is used for SearchTepProductConfigDetails action', () => {
      const action = new SearchTepProductConfigDetails('payload');
      expect({ ...action }).toEqual({
        type:
          TepProductGroupConfigActionTypes.SEARCH_TEP_PRODUCT_GROUP_CONFIG_DETAILS,
        payload: 'payload'
      });
    });

    it('should check correct type is used for SearchTepProductConfigDetailsSuccess action', () => {
      const payload: TEPProductGroupConfigListing = {
        results: [
          {
            configDetails: {
              data: 'Data',
              type: 'Type'
            },
            configId: 'ConfigId',
            configType: 'ConfigType',
            customerMobileNos: ['123', '456'],
            description: 'Desc',
            isActive: true,
            offerDetails: {
              data: 'Data',
              type: 'Type'
            }
          }
        ],
        totalElements: 1
      };

      const action = new SearchTepProductConfigDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          TepProductGroupConfigActionTypes.SEARCH_TEP_PRODUCT_GROUP_CONFIG_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchTepProductConfigDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchTepProductConfigDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          TepProductGroupConfigActionTypes.SEARCH_TEP_PRODUCT_GROUP_CONFIG_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadTepProductGroupConfigDetails Action Test Cases', () => {
    it('should check correct type is used for LoadTepProductGroupConfigDetails action', () => {
      const action = new LoadTepProductGroupConfigDetails('payload');
      expect({ ...action }).toEqual({
        type:
          TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_CONFIG_DETAILS,
        payload: 'payload'
      });
    });

    it('should check correct type is used for LoadTepProductGroupConfigDetailsSuccess action', () => {
      const payload: TEPProductGroupConfigDetails = {
        configDetails: {
          data: 'Data',
          type: 'Type'
        },
        configId: 'ConfigId',
        configType: 'ConfigType',
        customerMobileNos: ['123', '456'],
        description: 'Desc',
        isActive: true,
        offerDetails: {
          data: 'Data',
          type: 'Type'
        }
      };

      const action = new LoadTepProductGroupConfigDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_CONFIG_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadTepProductGroupConfigDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTepProductGroupConfigDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_CONFIG_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('SaveTepValidationConfigDetails Action Test Cases', () => {
    it('should check correct type is used for SaveTepValidationConfigDetails action', () => {
      const payload: TEPProductGroupConfigDetails = {
        configDetails: {
          data: 'Data',
          type: 'Type'
        },
        configId: 'ConfigId',
        configType: 'ConfigType',
        customerMobileNos: ['123', '456'],
        description: 'Desc',
        isActive: true,
        offerDetails: {
          data: 'Data',
          type: 'Type'
        }
      };

      const action = new SaveTepProductGroupConfigDetails(payload);
      expect({ ...action }).toEqual({
        type:
          TepProductGroupConfigActionTypes.SAVE_TEP_PRODUCT_GROUP_CONFIG_DETAILS,
        payload
      });
    });

    it('should check correct type is used for SaveTepProductGroupConfigDetailsSuccess action', () => {
      const payload: TEPProductGroupConfigDetails = {
        configDetails: {
          data: 'Data',
          type: 'Type'
        },
        configId: 'ConfigId',
        configType: 'ConfigType',
        customerMobileNos: ['123', '456'],
        description: 'Desc',
        isActive: true,
        offerDetails: {
          data: 'Data',
          type: 'Type'
        }
      };

      const action = new SaveTepProductGroupConfigDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          TepProductGroupConfigActionTypes.SAVE_TEP_PRODUCT_GROUP_CONFIG_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SaveTepProductGroupConfigDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveTepProductGroupConfigDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          TepProductGroupConfigActionTypes.SAVE_TEP_PRODUCT_GROUP_CONFIG_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('UpdateTepProductGroupConfigDetails Action Test Cases', () => {
    it('should check correct type is used for UpdateTepProductGroupConfigDetails action', () => {
      const payload: TEPProductGroupConfigDetails = {
        configDetails: {
          data: 'Data',
          type: 'Type'
        },
        configId: 'ConfigId',
        configType: 'ConfigType',
        customerMobileNos: ['123', '456'],
        description: 'Desc',
        isActive: true,
        offerDetails: {
          data: 'Data',
          type: 'Type'
        }
      };

      const action = new UpdateTepProductGroupConfigDetails(payload);
      expect({ ...action }).toEqual({
        type:
          TepProductGroupConfigActionTypes.UPDATE_TEP_PRODUCT_GROUP_CONFIG_DETAILS,
        payload
      });
    });

    it('should check correct type is used for UpdateTepProductGroupConfigDetailsSuccess action', () => {
      const payload: TEPProductGroupConfigDetails = {
        configDetails: {
          data: 'Data',
          type: 'Type'
        },
        configId: 'ConfigId',
        configType: 'ConfigType',
        customerMobileNos: ['123', '456'],
        description: 'Desc',
        isActive: true,
        offerDetails: {
          data: 'Data',
          type: 'Type'
        }
      };

      const action = new UpdateTepProductGroupConfigDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          TepProductGroupConfigActionTypes.UPDATE_TEP_PRODUCT_GROUP_CONFIG_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for UpdateTepProductGroupConfigDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateTepProductGroupConfigDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          TepProductGroupConfigActionTypes.UPDATE_TEP_PRODUCT_GROUP_CONFIG_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('UpdateTepProductGroupConfigDetails Action Test Cases', () => {
    it('should check correct type is used for LoadTepProductGroupMappintListing action', () => {
      const payload: TEPProductGroupMappingListingPayload = {
        configId: '123',
        pageIndex: 0,
        pageSize: 10,
        sort: []
      };

      const action = new LoadTepProductGroupMappintListing(payload);
      expect({ ...action }).toEqual({
        type:
          TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_MAPPING_LISTING,
        payload
      });
    });

    it('should check correct type is used for LoadTepProductGroupMappintListingSuccess action', () => {
      const payload: TEPProductGroupMappingListing = {
        results: [
          {
            id: '1',
            configId: 'cId',
            productGroupCode: 'PGCode',
            configDetails: {
              data: {
                isTepAllowed: true,
                goldDeductionPercent: 10,
                silverDeductionPercent: 10,
                platinumDeductionPercent: 10,
                ucpDeductionPercent: 10,
                ucpDeductionFlatValue: 10,
                isStoneChargesApplicable: true,
                stoneDeductionPercent: 10,
                isCMMandatory: true,
                cmUnavailableDeductionPercent: 10,
                isFVTAllowed: true,
                fvtDeductionPercent: 10,
                isCutPieceTepAllowed: true,
                isInterBrandTepAllowed: true,
                typeOfExchange: 'Type',
                recoverDiscountPercent: 1,
                refundDeductionPercent: 2,
                isTEPSaleBin: true,
                weightTolerancePercent: 3,
                isProportionedValue: true
              },
              type: 'Type'
            }
          }
        ],
        totalElements: 1
      };

      const action = new LoadTepProductGroupMappintListingSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_MAPPING_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadTepProductGroupMappintListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTepProductGroupMappintListingFailure(payload);

      expect({ ...action }).toEqual({
        type:
          TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_MAPPING_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('SearchTepProductGroupMappintListing Action Test Cases', () => {
    it('should check correct type is used for SearchTepProductGroupMappintListing action', () => {
      const payload: {
        configId: string;
        filter: string;
      } = {
        configId: 'configId',
        filter: 'filter'
      };

      const action = new SearchTepProductGroupMappintListing(payload);
      expect({ ...action }).toEqual({
        type:
          TepProductGroupConfigActionTypes.SEARCH_TEP_PRODUCT_GROUP_MAPPING_LISTING,
        payload
      });
    });

    it('should check correct type is used for SearchTepProductGroupMappintListingSuccess action', () => {
      const payload: TEPProductGroupMappingListing = {
        results: [
          {
            id: '1',
            configId: 'cId',
            productGroupCode: 'PGCode',
            configDetails: {
              data: {
                isTepAllowed: true,
                goldDeductionPercent: 10,
                silverDeductionPercent: 10,
                platinumDeductionPercent: 10,
                ucpDeductionPercent: 10,
                ucpDeductionFlatValue: 10,
                isStoneChargesApplicable: true,
                stoneDeductionPercent: 10,
                isCMMandatory: true,
                cmUnavailableDeductionPercent: 10,
                isFVTAllowed: true,
                fvtDeductionPercent: 10,
                isCutPieceTepAllowed: true,
                isInterBrandTepAllowed: true,
                typeOfExchange: 'Type',
                recoverDiscountPercent: 1,
                refundDeductionPercent: 2,
                isTEPSaleBin: true,
                weightTolerancePercent: 3,
                isProportionedValue: true
              },
              type: 'Type'
            }
          }
        ],
        totalElements: 1
      };

      const action = new SearchTepProductGroupMappintListingSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          TepProductGroupConfigActionTypes.SEARCH_TEP_PRODUCT_GROUP_MAPPING_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchTepProductGroupMappintListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchTepProductGroupMappintListingFailure(payload);

      expect({ ...action }).toEqual({
        type:
          TepProductGroupConfigActionTypes.SEARCH_TEP_PRODUCT_GROUP_MAPPING_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('SaveTepProductGroupMapping Action Test Cases', () => {
    it('should check correct type is used for SaveTepProductGroupMapping action', () => {
      const payload: {
        configId: string;
        addTEPProductGroupsMapping: AddTEPProductGroupsMapping;
      } = {
        configId: 'configId',
        addTEPProductGroupsMapping: {
          addProductGroups: [
            {
              productGroupCode: 'productGroupCode',
              configDetails: {
                data: {
                  uuid: 'uuid',
                  productGroups: 'product group',
                  isTepAllowed: true,
                  goldDeductionPercent: 10,
                  silverDeductionPercent: 10,
                  platinumDeductionPercent: 10,
                  ucpDeductionPercent: 20,
                  ucpDeductionFlatValue: 30,
                  isStoneChargesApplicable: true,
                  stoneDeductionPercent: 1,
                  isCMMandatory: true,
                  cmUnavailableDeductionPercent: 10,
                  isFVTAllowed: true,
                  fvtDeductionPercent: 1,
                  isCutPieceTepAllowed: true,
                  isInterBrandTepAllowed: true,
                  typeOfExchange: 'typeOfExchange',
                  recoverDiscountPercent: 10,
                  refundDeductionPercent: 1,
                  isTEPSaleBin: true,
                  weightTolerancePercent: 50,
                  isProportionedValue: true
                },
                type: 'type'
              }
            }
          ]
        }
      };

      const action = new SaveTepProductGroupMapping(payload);
      expect({ ...action }).toEqual({
        type: TepProductGroupConfigActionTypes.SAVE_TEP_PRODUCT_GROUP_MAPPING,
        payload
      });
    });

    it('should check correct type is used for SaveTepProductGroupMappingSuccess action', () => {
      const payload: TEPProductGroupMappingListing = {
        results: [
          {
            id: '1',
            configId: 'cId',
            productGroupCode: 'PGCode',
            configDetails: {
              data: {
                isTepAllowed: true,
                goldDeductionPercent: 10,
                silverDeductionPercent: 10,
                platinumDeductionPercent: 10,
                ucpDeductionPercent: 10,
                ucpDeductionFlatValue: 10,
                isStoneChargesApplicable: true,
                stoneDeductionPercent: 10,
                isCMMandatory: true,
                cmUnavailableDeductionPercent: 10,
                isFVTAllowed: true,
                fvtDeductionPercent: 10,
                isCutPieceTepAllowed: true,
                isInterBrandTepAllowed: true,
                typeOfExchange: 'Type',
                recoverDiscountPercent: 1,
                refundDeductionPercent: 2,
                isTEPSaleBin: true,
                weightTolerancePercent: 3,
                isProportionedValue: true
              },
              type: 'Type'
            }
          }
        ],
        totalElements: 1
      };

      const action = new SaveTepProductGroupMappingSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          TepProductGroupConfigActionTypes.SAVE_TEP_PRODUCT_GROUP_MAPPING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SaveTepProductGroupMappingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveTepProductGroupMappingFailure(payload);

      expect({ ...action }).toEqual({
        type:
          TepProductGroupConfigActionTypes.SAVE_TEP_PRODUCT_GROUP_MAPPING_FAILURE,
        payload
      });
    });
  });
});
