import {
  CustomErrors,
  TEPExceptionConfig,
  TEPExceptionConfigFilter,
  TEPExceptionConfigListingPayload,
  TEPExceptiononfigListing
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LoadTepExceptionConfigDetails,
  LoadTepExceptionConfigDetailsFailure,
  LoadTepExceptionConfigDetailsSuccess,
  LoadTepExceptionConfigListing,
  LoadTepExceptionConfigListingFailure,
  LoadTepExceptionConfigListingSuccess,
  LoadTepGlobalConfigListing,
  LoadTepGlobalConfigListingFailure,
  LoadTepGlobalConfigListingSuccess,
  SaveTepExceptionConfigDetails,
  SaveTepExceptionConfigDetailsFailure,
  SaveTepExceptionConfigDetailsSuccess,
  SearchTepExceptionConfigDetails,
  SearchTepExceptionConfigDetailsFailure,
  SearchTepExceptionConfigDetailsSuccess,
  TepExceptionConfigActionTypes,
  UpdateTepExceptionConfigDetails,
  UpdateTepExceptionConfigDetailsFailure,
  UpdateTepExceptionConfigDetailsSuccess
} from './tep-exception-config.actons';

describe('LoadTepExceptionConfigListing Action Testing Suite', () => {
  describe('LoadTepExceptionConfigListing Action Test Cases', () => {
    it('should check correct type is used for LoadTepExceptionConfigListing action', () => {
      const payload: TEPExceptionConfigListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const action = new LoadTepExceptionConfigListing(payload);

      expect({ ...action }).toEqual({
        type: TepExceptionConfigActionTypes.LOAD_TEP_EXCEPTION_CONFIG_LISTING,
        payload
      });
    });

    it('should check correct type is used for LoadTepExceptionConfigListingSuccess action', () => {
      const payload: TEPExceptiononfigListing = {
        results: [
          {
            configId: '1',
            isActive: true,
            configDetails: {
              data: null,
              type: 'TYPE'
            },
            configType: 'TYPE',
            createdDate: 222222,
            customerMobileNos: ['3333333'],
            description: 'Desc',
            endDate: 444444,
            isOfferEnabled: true,
            itemCode: 'Code',
            offerDetails: {
              data: null,
              type: 'TYPE'
            },
            startDate: 111111
          }
        ],
        totalElements: 1
      };

      const action = new LoadTepExceptionConfigListingSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          TepExceptionConfigActionTypes.LOAD_TEP_EXCEPTION_CONFIG_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadTepExceptionConfigListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTepExceptionConfigListingFailure(payload);

      expect({ ...action }).toEqual({
        type:
          TepExceptionConfigActionTypes.LOAD_TEP_EXCEPTION_CONFIG_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('SearchTepExceptionConfigDetails Action Test Cases', () => {
    it('should check correct type is used for SearchTepExceptionConfigDetails action', () => {
      const payload: TEPExceptionConfigFilter = {
        configName: 'Name',
        variantCode: 'Code'
      };

      const action = new SearchTepExceptionConfigDetails(payload);
      expect({ ...action }).toEqual({
        type: TepExceptionConfigActionTypes.SEARCH_TEP_EXCEPTION_CONFIG_DETAILS,
        payload
      });
    });

    it('should check correct type is used for SearchTepExceptionConfigDetailsSuccess action', () => {
      const payload: TEPExceptiononfigListing = {
        results: [
          {
            configId: '1',
            isActive: true,
            configDetails: {
              data: null,
              type: 'TYPE'
            },
            configType: 'TYPE',
            createdDate: 222222,
            customerMobileNos: ['3333333'],
            description: 'Desc',
            endDate: 444444,
            isOfferEnabled: true,
            itemCode: 'Code',
            offerDetails: {
              data: null,
              type: 'TYPE'
            },
            startDate: 111111
          }
        ],
        totalElements: 1
      };

      const action = new SearchTepExceptionConfigDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          TepExceptionConfigActionTypes.SEARCH_TEP_EXCEPTION_CONFIG_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchTepExceptionConfigDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchTepExceptionConfigDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          TepExceptionConfigActionTypes.SEARCH_TEP_EXCEPTION_CONFIG_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadTepExceptionConfigDetails Action Test Cases', () => {
    it('should check correct type is used for LoadTepExceptionConfigDetails action', () => {
      const action = new LoadTepExceptionConfigDetails('payload');
      expect({ ...action }).toEqual({
        type: TepExceptionConfigActionTypes.LOAD_TEP_EXCEPTION_CONFIG_DETAILS,
        payload: 'payload'
      });
    });

    it('should check correct type is used for LoadTepExceptionConfigDetailsSuccess action', () => {
      const payload: TEPExceptionConfig = {
        configId: '1',
        isActive: true,
        configDetails: {
          data: null,
          type: 'TYPE'
        },
        configType: 'TYPE',
        createdDate: 222222,
        customerMobileNos: ['3333333'],
        description: 'Desc',
        endDate: 444444,
        isOfferEnabled: true,
        itemCode: 'Code',
        offerDetails: {
          data: null,
          type: 'TYPE'
        },
        startDate: 111111
      };

      const action = new LoadTepExceptionConfigDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          TepExceptionConfigActionTypes.LOAD_TEP_EXCEPTION_CONFIG_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadTepExceptionConfigDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTepExceptionConfigDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          TepExceptionConfigActionTypes.LOAD_TEP_EXCEPTION_CONFIG_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('SaveTepExceptionConfigDetails Action Test Cases', () => {
    it('should check correct type is used for SaveTepExceptionConfigDetails action', () => {
      const payload: TEPExceptionConfig = {
        configId: '1',
        isActive: true,
        configDetails: {
          data: null,
          type: 'TYPE'
        },
        configType: 'TYPE',
        createdDate: 222222,
        customerMobileNos: ['3333333'],
        description: 'Desc',
        endDate: 444444,
        isOfferEnabled: true,
        itemCode: 'Code',
        offerDetails: {
          data: null,
          type: 'TYPE'
        },
        startDate: 111111
      };

      const action = new SaveTepExceptionConfigDetails(payload);
      expect({ ...action }).toEqual({
        type: TepExceptionConfigActionTypes.SAVE_TEP_EXCEPTION_CONFIG_DETAILS,
        payload
      });
    });

    it('should check correct type is used for SaveTepExceptionConfigDetailsSuccess action', () => {
      const payload: TEPExceptionConfig = {
        configId: '1',
        isActive: true,
        configDetails: {
          data: null,
          type: 'TYPE'
        },
        configType: 'TYPE',
        createdDate: 222222,
        customerMobileNos: ['3333333'],
        description: 'Desc',
        endDate: 444444,
        isOfferEnabled: true,
        itemCode: 'Code',
        offerDetails: {
          data: null,
          type: 'TYPE'
        },
        startDate: 111111
      };

      const action = new SaveTepExceptionConfigDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          TepExceptionConfigActionTypes.SAVE_TEP_EXCEPTION_CONFIG_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SaveTepExceptionConfigDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveTepExceptionConfigDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          TepExceptionConfigActionTypes.SAVE_TEP_EXCEPTION_CONFIG_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('UpdateTepExceptionConfigDetails Action Test Cases', () => {
    it('should check correct type is used for UpdateTepExceptionConfigDetails action', () => {
      const payload: TEPExceptionConfig = {
        configId: '1',
        isActive: true,
        configDetails: {
          data: null,
          type: 'TYPE'
        },
        configType: 'TYPE',
        createdDate: 222222,
        customerMobileNos: ['3333333'],
        description: 'Desc',
        endDate: 444444,
        isOfferEnabled: true,
        itemCode: 'Code',
        offerDetails: {
          data: null,
          type: 'TYPE'
        },
        startDate: 111111
      };

      const action = new UpdateTepExceptionConfigDetails(payload);
      expect({ ...action }).toEqual({
        type: TepExceptionConfigActionTypes.UPDATE_TEP_EXCEPTION_CONFIG_DETAILS,
        payload
      });
    });

    it('should check correct type is used for UpdateTepExceptionConfigDetailsSuccess action', () => {
      const payload: TEPExceptionConfig = {
        configId: '1',
        isActive: true,
        configDetails: {
          data: null,
          type: 'TYPE'
        },
        configType: 'TYPE',
        createdDate: 222222,
        customerMobileNos: ['3333333'],
        description: 'Desc',
        endDate: 444444,
        isOfferEnabled: true,
        itemCode: 'Code',
        offerDetails: {
          data: null,
          type: 'TYPE'
        },
        startDate: 111111
      };

      const action = new UpdateTepExceptionConfigDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          TepExceptionConfigActionTypes.UPDATE_TEP_EXCEPTION_CONFIG_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for UpdateTepExceptionConfigDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateTepExceptionConfigDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          TepExceptionConfigActionTypes.UPDATE_TEP_EXCEPTION_CONFIG_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadTepGlobalConfigListing Action Test Cases', () => {
    it('should check correct type is used for LoadTepGlobalConfigListing action', () => {
      const action = new LoadTepGlobalConfigListing();
      expect({ ...action }).toEqual({
        type: TepExceptionConfigActionTypes.LOAD_TEP_GLOBAL_CONFIG_LISTING
      });
    });

    it('should check correct type is used for LoadTepGlobalConfigListingSuccess action', () => {
      const action = new LoadTepGlobalConfigListingSuccess(1);
      expect({ ...action }).toEqual({
        type:
          TepExceptionConfigActionTypes.LOAD_TEP_GLOBAL_CONFIG_LISTING_SUCCESS,
        payload: 1
      });
    });
    it('should check correct type is used for LoadTepGlobalConfigListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTepGlobalConfigListingFailure(payload);

      expect({ ...action }).toEqual({
        type:
          TepExceptionConfigActionTypes.LOAD_TEP_GLOBAL_CONFIG_LISTING_FAILURE,
        payload
      });
    });
  });
});
