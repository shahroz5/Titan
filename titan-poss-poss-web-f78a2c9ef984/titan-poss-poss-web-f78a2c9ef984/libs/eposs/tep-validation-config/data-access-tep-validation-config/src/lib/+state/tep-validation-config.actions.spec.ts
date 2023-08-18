import {
  CustomErrors,
  TEPValidationConfigListing,
  TEPValidationConfigListingPayload,
  TEPValidationConfigResult
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LoadTepValidationConfigDetails,
  LoadTepValidationConfigDetailsFailure,
  LoadTepValidationConfigDetailsSuccess,
  LoadTepValidationConfigListing,
  LoadTepValidationConfigListingFailure,
  LoadTepValidationConfigListingSuccess,
  SaveTepValidationConfigDetails,
  SaveTepValidationConfigDetailsFailure,
  SaveTepValidationConfigDetailsSuccess,
  SearchTepValidationConfigDetails,
  SearchTepValidationConfigDetailsFailure,
  SearchTepValidationConfigDetailsSuccess,
  TepValidationConfigActionTypes,
  UpdateTepValidationConfigDetails,
  UpdateTepValidationConfigDetailsFailure,
  UpdateTepValidationConfigDetailsSuccess
} from './tep-validation-config.actons';

describe('LoadTepValidationConfigListing Action Testing Suite', () => {
  describe('LoadTepValidationConfigListing Action Test Cases', () => {
    it('should check correct type is used for LoadTepValidationConfigListing action', () => {
      const payload: TEPValidationConfigListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const action = new LoadTepValidationConfigListing(payload);

      expect({ ...action }).toEqual({
        type: TepValidationConfigActionTypes.LOAD_TEP_VALIDATION_CONFIG_LISTING,
        payload
      });
    });

    it('should check correct type is used for LoadTepValidationConfigListingSuccess action', () => {
      const payload: TEPValidationConfigListing = {
        results: [
          {
            configDetails: {
              data: {
                fvtCNCancellationDeductionPercent: 10,
                isAnnexurePrintingAllowed: true,
                isFVTCNCancellationAllowed: true,
                isInterBrandCashRefundAllowed: true,
                tepCancellationDays: 1
              },
              type: 'TYPE'
            },
            configId: '1',
            configType: 'Type',
            description: 'Desc',
            isActive: true,
            offerDetails: null
          }
        ],
        totalElements: 1
      };

      const action = new LoadTepValidationConfigListingSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          TepValidationConfigActionTypes.LOAD_TEP_VALIDATION_CONFIG_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadTepValidationConfigListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTepValidationConfigListingFailure(payload);

      expect({ ...action }).toEqual({
        type:
          TepValidationConfigActionTypes.LOAD_TEP_VALIDATION_CONFIG_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('SearchTepValidationConfigDetails Action Test Cases', () => {
    it('should check correct type is used for SearchTepValidationConfigDetails action', () => {
      const action = new SearchTepValidationConfigDetails('payload');
      expect({ ...action }).toEqual({
        type:
          TepValidationConfigActionTypes.SEARCH_TEP_VALIDATION_CONFIG_DETAILS,
        payload: 'payload'
      });
    });

    it('should check correct type is used for SearchTepValidationConfigDetailsSuccess action', () => {
      const payload: TEPValidationConfigListing = {
        results: [
          {
            configDetails: {
              data: {
                fvtCNCancellationDeductionPercent: 10,
                isAnnexurePrintingAllowed: true,
                isFVTCNCancellationAllowed: true,
                isInterBrandCashRefundAllowed: true,
                tepCancellationDays: 1
              },
              type: 'TYPE'
            },
            configId: '1',
            configType: 'Type',
            description: 'Desc',
            isActive: true,
            offerDetails: null
          }
        ],
        totalElements: 1
      };

      const action = new SearchTepValidationConfigDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          TepValidationConfigActionTypes.SEARCH_TEP_VALIDATION_CONFIG_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchTepValidationConfigDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchTepValidationConfigDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          TepValidationConfigActionTypes.SEARCH_TEP_VALIDATION_CONFIG_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadTepValidationConfigDetails Action Test Cases', () => {
    it('should check correct type is used for LoadTepValidationConfigDetails action', () => {
      const action = new LoadTepValidationConfigDetails('payload');
      expect({ ...action }).toEqual({
        type: TepValidationConfigActionTypes.LOAD_TEP_VALIDATION_CONFIG_DETAILS,
        payload: 'payload'
      });
    });

    it('should check correct type is used for LoadTepValidationConfigDetailsSuccess action', () => {
      const payload: TEPValidationConfigResult = {
        configDetails: {
          data: {
            fvtCNCancellationDeductionPercent: 10,
            isAnnexurePrintingAllowed: true,
            isFVTCNCancellationAllowed: true,
            isInterBrandCashRefundAllowed: true,
            tepCancellationDays: 1
          },
          type: 'TYPE'
        },
        configId: '1',
        configType: 'Type',
        description: 'Desc',
        isActive: true,
        offerDetails: null
      };

      const action = new LoadTepValidationConfigDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          TepValidationConfigActionTypes.LOAD_TEP_VALIDATION_CONFIG_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadTepValidationConfigDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTepValidationConfigDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          TepValidationConfigActionTypes.LOAD_TEP_VALIDATION_CONFIG_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('SaveTepValidationConfigDetails Action Test Cases', () => {
    it('should check correct type is used for SaveTepValidationConfigDetails action', () => {
      const payload: TEPValidationConfigResult = {
        configDetails: {
          data: {
            fvtCNCancellationDeductionPercent: 10,
            isAnnexurePrintingAllowed: true,
            isFVTCNCancellationAllowed: true,
            isInterBrandCashRefundAllowed: true,
            tepCancellationDays: 1
          },
          type: 'TYPE'
        },
        configId: '1',
        configType: 'Type',
        description: 'Desc',
        isActive: true,
        offerDetails: null
      };

      const action = new SaveTepValidationConfigDetails(payload);
      expect({ ...action }).toEqual({
        type: TepValidationConfigActionTypes.SAVE_TEP_VALIDATION_CONFIG_DETAILS,
        payload
      });
    });

    it('should check correct type is used for SaveTepValidationConfigDetailsSuccess action', () => {
      const payload: TEPValidationConfigResult = {
        configDetails: {
          data: {
            fvtCNCancellationDeductionPercent: 10,
            isAnnexurePrintingAllowed: true,
            isFVTCNCancellationAllowed: true,
            isInterBrandCashRefundAllowed: true,
            tepCancellationDays: 1
          },
          type: 'TYPE'
        },
        configId: '1',
        configType: 'Type',
        description: 'Desc',
        isActive: true,
        offerDetails: null
      };

      const action = new SaveTepValidationConfigDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          TepValidationConfigActionTypes.SAVE_TEP_VALIDATION_CONFIG_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SaveTepValidationConfigDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveTepValidationConfigDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          TepValidationConfigActionTypes.SAVE_TEP_VALIDATION_CONFIG_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('UpdateTepValidationConfigDetails Action Test Cases', () => {
    it('should check correct type is used for UpdateTepValidationConfigDetails action', () => {
      const payload: TEPValidationConfigResult = {
        configDetails: {
          data: {
            fvtCNCancellationDeductionPercent: 10,
            isAnnexurePrintingAllowed: true,
            isFVTCNCancellationAllowed: true,
            isInterBrandCashRefundAllowed: true,
            tepCancellationDays: 1
          },
          type: 'TYPE'
        },
        configId: '1',
        configType: 'Type',
        description: 'Desc',
        isActive: true,
        offerDetails: null
      };

      const action = new UpdateTepValidationConfigDetails(payload);
      expect({ ...action }).toEqual({
        type:
          TepValidationConfigActionTypes.UPDATE_TEP_VALIDATION_CONFIG_DETAILS,
        payload
      });
    });

    it('should check correct type is used for UpdateTepExceptionConfigDetailsSuccess action', () => {
      const payload: TEPValidationConfigResult = {
        configDetails: {
          data: {
            fvtCNCancellationDeductionPercent: 10,
            isAnnexurePrintingAllowed: true,
            isFVTCNCancellationAllowed: true,
            isInterBrandCashRefundAllowed: true,
            tepCancellationDays: 1
          },
          type: 'TYPE'
        },
        configId: '1',
        configType: 'Type',
        description: 'Desc',
        isActive: true,
        offerDetails: null
      };

      const action = new UpdateTepValidationConfigDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          TepValidationConfigActionTypes.UPDATE_TEP_VALIDATION_CONFIG_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for UpdateTepValidationConfigDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateTepValidationConfigDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          TepValidationConfigActionTypes.UPDATE_TEP_VALIDATION_CONFIG_DETAILS_FAILURE,
        payload
      });
    });
  });
});
