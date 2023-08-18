import {
  AddTEPProductGroupsMapping,
  TEPProductGroupConfigDetails,
  TEPProductGroupConfigListing,
  TEPProductGroupConfigListingPayload,
  TEPProductGroupMappingListing,
  TEPProductGroupMappingListingPayload,
  TEPStoneConfig,
  TEPStoneConfigDetailsListing,
  TEPStoneConfigListing,
  TEPStoneConfigListingPayload,
  TEPStoneConfigQualities,
  TEPStoneConfigRange,
  TEPStoneConfigStoneType,
  TEPStoneDetailsModify
} from '@poss-web/shared/models';
import * as actions from './tep-product-group-config.actons';
import { TepProductGroupConfigState } from './tep-product-group-config.state';
import {
  initialState as istate,
  tepProductGroupConfigReducer
} from './tep-product-group-config.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('TEP Product Group config Reducer Testing Suite', () => {
  const initialState: TepProductGroupConfigState = { ...istate };

  describe('Testing LoadTepProductGroupConfigListing Functionality', () => {
    it('LoadTepProductGroupConfigListing should be called', () => {
      const payload: TEPProductGroupConfigListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const action = new actions.LoadTepProductGroupConfigListing(payload);

      const result: TepProductGroupConfigState = tepProductGroupConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadTepProductGroupConfigListingSuccess should return list', () => {
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

      const action = new actions.LoadTepProductGroupConfigListingSuccess(
        payload
      );
      const result: TepProductGroupConfigState = tepProductGroupConfigReducer(
        initialState,
        action
      );

      expect(result.tepProductGroupConfiglist).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadTepProductGroupConfigListingFailure should return error', () => {
      const action = new actions.LoadTepProductGroupConfigListingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepProductGroupConfigState = tepProductGroupConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchTepStoneConfigDetails Functionality', () => {
    it('SearchTepStoneConfigDetails should be called', () => {
      const action = new actions.SearchTepProductConfigDetails('payload');

      const result: TepProductGroupConfigState = tepProductGroupConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('SearchTepProductConfigDetailsSuccess should return list', () => {
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

      const action = new actions.SearchTepProductConfigDetailsSuccess(payload);
      const result: TepProductGroupConfigState = tepProductGroupConfigReducer(
        initialState,
        action
      );

      expect(result.tepProductGroupConfigDetails).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('SearchTepStoneConfigDetailsFailure should return error', () => {
      const action = new actions.SearchTepProductConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepProductGroupConfigState = tepProductGroupConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadTepProductGroupConfigDetails Functionality', () => {
    it('LoadTepProductGroupConfigDetails should be called', () => {
      const action = new actions.LoadTepProductGroupConfigDetails('Code');

      const result: TepProductGroupConfigState = tepProductGroupConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadTepProductGroupConfigDetailsSuccess should return list', () => {
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

      const action = new actions.LoadTepProductGroupConfigDetailsSuccess(
        payload
      );
      const result: TepProductGroupConfigState = tepProductGroupConfigReducer(
        initialState,
        action
      );

      expect(result.tepProductGroupConfigDetails).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadTepProductGroupConfigDetailsFailure should return error', () => {
      const action = new actions.LoadTepProductGroupConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepProductGroupConfigState = tepProductGroupConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveTepProductGroupConfigDetails Functionality', () => {
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
    it('SaveTepProductGroupConfigDetails should be called', () => {
      const action = new actions.SaveTepProductGroupConfigDetails(payload);

      const result: TepProductGroupConfigState = tepProductGroupConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('SaveTepStoneConfigSuccess should return list', () => {
      const action = new actions.SaveTepProductGroupConfigDetailsSuccess(
        payload
      );
      const result: TepProductGroupConfigState = tepProductGroupConfigReducer(
        initialState,
        action
      );

      expect(result.hasSaved).toBe(true);
      expect(result.isLoading).toBe(false);
    });
    it('SaveTepStoneConfigFailure should return error', () => {
      const action = new actions.SaveTepProductGroupConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepProductGroupConfigState = tepProductGroupConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateTepProductGroupConfigDetails Functionality', () => {
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
    it('UpdateTepProductGroupConfigDetails should be called', () => {
      const action = new actions.UpdateTepProductGroupConfigDetails(payload);

      const result: TepProductGroupConfigState = tepProductGroupConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('UpdateTepStoneConfigDetailsSuccess should return list', () => {
      const action = new actions.UpdateTepProductGroupConfigDetailsSuccess(
        payload
      );
      const result: TepProductGroupConfigState = tepProductGroupConfigReducer(
        initialState,
        action
      );

      expect(result.hasUpdated).toBe(true);
      expect(result.isLoading).toBe(false);
    });
    it('UpdateTepProductGroupConfigDetailsFailure should return error', () => {
      const action = new actions.UpdateTepProductGroupConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepProductGroupConfigState = tepProductGroupConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadTepProductGroupMappintListing Functionality', () => {
    it('LoadTepProductGroupMappintListing should be called', () => {
      const payload: TEPProductGroupMappingListingPayload = {
        configId: '123',
        pageIndex: 0,
        pageSize: 10,
        sort: []
      };
      const action = new actions.LoadTepProductGroupMappintListing(payload);

      const result: TepProductGroupConfigState = tepProductGroupConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadTepProductGroupMappintListingSuccess should return list', () => {
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
      const action = new actions.LoadTepProductGroupMappintListingSuccess(
        payload
      );
      const result: TepProductGroupConfigState = tepProductGroupConfigReducer(
        initialState,
        action
      );

      expect(result.tepProductGroupMappinglist).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadTepProductGroupMappintListingFailure should return error', () => {
      const action = new actions.LoadTepProductGroupMappintListingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepProductGroupConfigState = tepProductGroupConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchTepProductGroupMappintListing Functionality', () => {
    it('SearchTepProductGroupMappintListing should be called', () => {
      const payload: {
        configId: string;
        filter: string;
      } = {
        configId: 'configId',
        filter: 'filter'
      };
      const action = new actions.SearchTepProductGroupMappintListing(payload);

      const result: TepProductGroupConfigState = tepProductGroupConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('SearchTepProductGroupMappintListingSuccess should return list', () => {
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
      const action = new actions.SearchTepProductGroupMappintListingSuccess(
        payload
      );
      const result: TepProductGroupConfigState = tepProductGroupConfigReducer(
        initialState,
        action
      );

      expect(result.tepProductGroupMappinglist).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('SearchTepProductGroupMappintListingFailure should return error', () => {
      const action = new actions.SearchTepProductGroupMappintListingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepProductGroupConfigState = tepProductGroupConfigReducer(
        initialState,
        action
      );

      expect(result.tepProductGroupMappinglist.ids.length).toEqual(0);
    });
  });

  describe('Testing SaveTepProductGroupMapping Functionality', () => {
    it('SaveTepProductGroupMapping should be called', () => {
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
      const action = new actions.SaveTepProductGroupMapping(payload);

      const result: TepProductGroupConfigState = tepProductGroupConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('SaveTepProductGroupMappingSuccess should return list', () => {
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
      const action = new actions.SaveTepProductGroupMappingSuccess(payload);
      const result: TepProductGroupConfigState = tepProductGroupConfigReducer(
        initialState,
        action
      );

      expect(result.tepProductGroupMappingDetails).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('SaveTepProductGroupMappingFailure should return error', () => {
      const action = new actions.SaveTepProductGroupMappingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepProductGroupConfigState = tepProductGroupConfigReducer(
        initialState,
        action
      );

      expect(result.tepProductGroupMappinglist.ids.length).toEqual(0);
    });
  });
});
