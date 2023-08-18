import {
  CustomErrors,
  TEPStoneConfig,
  TEPStoneConfigDetailsListing,
  TEPStoneConfigListing,
  TEPStoneConfigListingPayload,
  TEPStoneConfigQualities,
  TEPStoneConfigRange,
  TEPStoneConfigStoneType,
  TEPStoneDetailsModify
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  EditTepStoneConfigDataDetails,
  EditTepStoneConfigDataDetailsFailure,
  EditTepStoneConfigDataDetailsSuccess,
  LoadTepStoneConfigDataListing,
  LoadTepStoneConfigDataListingFailure,
  LoadTepStoneConfigDataListingSuccess,
  LoadTepStoneConfigDetails,
  LoadTepStoneConfigDetailsFailure,
  LoadTepStoneConfigDetailsSuccess,
  LoadTepStoneConfigListing,
  LoadTepStoneConfigListingFailure,
  LoadTepStoneConfigListingSuccess,
  LoadTepStoneQualitiesListing,
  LoadTepStoneQualitiesListingFailure,
  LoadTepStoneQualitiesListingSuccess,
  LoadTepStoneRangeListing,
  LoadTepStoneRangeListingFailure,
  LoadTepStoneRangeListingSuccess,
  LoadTepStoneTypesListing,
  LoadTepStoneTypesListingFailure,
  LoadTepStoneTypesListingSuccess,
  RemoveTepStoneConfigDataDetails,
  RemoveTepStoneConfigDataDetailsFailure,
  RemoveTepStoneConfigDataDetailsSuccess,
  SaveTepStoneConfig,
  SaveTepStoneConfigDataDetails,
  SaveTepStoneConfigDataDetailsFailure,
  SaveTepStoneConfigDataDetailsSuccess,
  SaveTepStoneConfigFailure,
  SaveTepStoneConfigSuccess,
  SearchTepStoneConfigDataListing,
  SearchTepStoneConfigDataListingFailure,
  SearchTepStoneConfigDataListingSuccess,
  SearchTepStoneConfigDetails,
  SearchTepStoneConfigDetailsFailure,
  SearchTepStoneConfigDetailsSuccess,
  TepStoneConfigActionTypes,
  UpdateTepStoneConfigDetails,
  UpdateTepStoneConfigDetailsFailure,
  UpdateTepStoneConfigDetailsSuccess
} from './tep-stone-config.actons';

describe('TEP Stone Action Testing Suite', () => {
  describe('LoadTepStoneConfigListing Action Test Cases', () => {
    it('should check correct type is used for LoadTepStoneConfigListing action', () => {
      const payload: TEPStoneConfigListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const action = new LoadTepStoneConfigListing(payload);

      expect({ ...action }).toEqual({
        type: TepStoneConfigActionTypes.LOAD_TEP_STONE_CONFIG_LISTING,
        payload
      });
    });

    it('should check correct type is used for LoadTepStoneConfigListingSuccess action', () => {
      const payload: TEPStoneConfigListing = {
        results: [
          {
            configId: '1',
            configType: 'Type',
            description: 'Desc',
            isActive: true
          }
        ],
        totalElements: 1
      };

      const action = new LoadTepStoneConfigListingSuccess(payload);
      expect({ ...action }).toEqual({
        type: TepStoneConfigActionTypes.LOAD_TEP_STONE_CONFIG_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadTepStoneConfigListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTepStoneConfigListingFailure(payload);

      expect({ ...action }).toEqual({
        type: TepStoneConfigActionTypes.LOAD_TEP_STONE_CONFIG_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('SearchTepStoneConfigDetails Action Test Cases', () => {
    it('should check correct type is used for SearchTepStoneConfigDetails action', () => {
      const action = new SearchTepStoneConfigDetails('payload');
      expect({ ...action }).toEqual({
        type: TepStoneConfigActionTypes.SEARCH_TEP_STONE_CONFIG,
        payload: 'payload'
      });
    });

    it('should check correct type is used for SearchTepStoneConfigDetailsSuccess action', () => {
      const payload: TEPStoneConfigListing = {
        results: [
          {
            configId: '1',
            configType: 'Type',
            description: 'Desc',
            isActive: true
          }
        ],
        totalElements: 1
      };

      const action = new SearchTepStoneConfigDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type: TepStoneConfigActionTypes.SEARCH_TEP_STONE_CONFIG_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchTepStoneConfigDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchTepStoneConfigDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: TepStoneConfigActionTypes.SEARCH_TEP_STONE_CONFIG_FAILURE,
        payload
      });
    });
  });

  describe('LoadTepStoneConfigDetails Action Test Cases', () => {
    it('should check correct type is used for LoadTepStoneConfigDetails action', () => {
      const action = new LoadTepStoneConfigDetails('payload');
      expect({ ...action }).toEqual({
        type: TepStoneConfigActionTypes.LOAD_TEP_STONE_CONFIG,
        payload: 'payload'
      });
    });

    it('should check correct type is used for LoadTepStoneConfigDetailsSuccess action', () => {
      const payload: TEPStoneConfig = {
        configId: '1',
        configType: 'Type',
        description: 'Desc',
        isActive: true
      };

      const action = new LoadTepStoneConfigDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type: TepStoneConfigActionTypes.LOAD_TEP_STONE_CONFIG_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadTepStoneConfigDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTepStoneConfigDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: TepStoneConfigActionTypes.LOAD_TEP_STONE_CONFIG_FAILURE,
        payload
      });
    });
  });

  describe('SaveTepStoneConfig Action Test Cases', () => {
    it('should check correct type is used for SaveTepStoneConfig action', () => {
      const payload: TEPStoneConfig = {
        configId: '1',
        configType: 'Type',
        description: 'Desc',
        isActive: true
      };

      const action = new SaveTepStoneConfig(payload);
      expect({ ...action }).toEqual({
        type: TepStoneConfigActionTypes.SAVE_TEP_STONE_CONFIG,
        payload
      });
    });

    it('should check correct type is used for SaveTepStoneConfigSuccess action', () => {
      const payload: TEPStoneConfig = {
        configId: '1',
        configType: 'Type',
        description: 'Desc',
        isActive: true
      };

      const action = new SaveTepStoneConfigSuccess(payload);
      expect({ ...action }).toEqual({
        type: TepStoneConfigActionTypes.SAVE_TEP_STONE_CONFIG_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SaveTepStoneConfigFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveTepStoneConfigFailure(payload);

      expect({ ...action }).toEqual({
        type: TepStoneConfigActionTypes.SAVE_TEP_STONE_CONFIG_FAILURE,
        payload
      });
    });
  });

  describe('UpdateTepStoneConfigDetails Action Test Cases', () => {
    it('should check correct type is used for UpdateTepStoneConfigDetails action', () => {
      const payload: TEPStoneConfig = {
        configId: '1',
        configType: 'Type',
        description: 'Desc',
        isActive: true
      };

      const action = new UpdateTepStoneConfigDetails(payload);
      expect({ ...action }).toEqual({
        type: TepStoneConfigActionTypes.UPDATE_TEP_STONE_CONFIG,
        payload
      });
    });

    it('should check correct type is used for UpdateTepStoneConfigDetailsSuccess action', () => {
      const payload: TEPStoneConfig = {
        configId: '1',
        configType: 'Type',
        description: 'Desc',
        isActive: true
      };

      const action = new UpdateTepStoneConfigDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type: TepStoneConfigActionTypes.UPDATE_TEP_STONE_CONFIG_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for UpdateTepStoneConfigDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateTepStoneConfigDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: TepStoneConfigActionTypes.UPDATE_TEP_STONE_CONFIG_FAILURE,
        payload
      });
    });
  });

  //
  describe('LoadTepStoneConfigDataListing Action Test Cases', () => {
    it('should check correct type is used for LoadTepStoneConfigDataListing action', () => {
      const payload = 'payload';
      const action = new LoadTepStoneConfigDataListing(payload);

      expect({ ...action }).toEqual({
        type: TepStoneConfigActionTypes.LOAD_TEP_STONE_CONFIG_DATA_LISTING,
        payload
      });
    });

    it('should check correct type is used for LoadTepStoneConfigDataListingSuccess action', () => {
      const payload: TEPStoneConfigDetailsListing = {
        results: [
          {
            id: '1',
            rowId: 1,
            configId: '1',
            dedutionPercent: 10,
            range: '1',
            rangeId: '2',
            stoneQuality: 'A',
            stoneTypeCode: 'Type',
            description: 'Desc'
          }
        ],
        totalElements: 1
      };

      const action = new LoadTepStoneConfigDataListingSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          TepStoneConfigActionTypes.LOAD_TEP_STONE_CONFIG_DATA_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadTepStoneConfigDataListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTepStoneConfigDataListingFailure(payload);

      expect({ ...action }).toEqual({
        type:
          TepStoneConfigActionTypes.LOAD_TEP_STONE_CONFIG_DATA_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('SearchTepStoneConfigDataListing Action Test Cases', () => {
    it('should check correct type is used for SearchTepStoneConfigDataListing action', () => {
      const payload: {
        configId: string;
        filter: string;
      } = {
        configId: '1',
        filter: '2'
      };
      const action = new SearchTepStoneConfigDataListing(payload);
      expect({ ...action }).toEqual({
        type: TepStoneConfigActionTypes.SEARCH_TEP_STONE_CONFIG_DATA_LISTING,
        payload
      });
    });

    it('should check correct type is used for SearchTepStoneConfigDataListingSuccess action', () => {
      const payload: TEPStoneConfigDetailsListing = {
        results: [
          {
            id: '1',
            rowId: 1,
            configId: '1',
            dedutionPercent: 10,
            range: '1',
            rangeId: '2',
            stoneQuality: 'A',
            stoneTypeCode: 'Type',
            description: 'Desc'
          }
        ],
        totalElements: 1
      };

      const action = new SearchTepStoneConfigDataListingSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          TepStoneConfigActionTypes.SEARCH_TEP_STONE_CONFIG_DATA_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchTepStoneConfigDataListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchTepStoneConfigDataListingFailure(payload);

      expect({ ...action }).toEqual({
        type:
          TepStoneConfigActionTypes.SEARCH_TEP_STONE_CONFIG_DATA_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('LoadTepStoneTypesListing Action Test Cases', () => {
    it('should check correct type is used for LoadTepStoneTypesListing action', () => {
      const action = new LoadTepStoneTypesListing();
      expect({ ...action }).toEqual({
        type: TepStoneConfigActionTypes.LOAD_TEP_STONE_TYPES_LIST
      });
    });

    it('should check correct type is used for LoadTepStoneTypesListingSuccess action', () => {
      const payload: TEPStoneConfigStoneType[] = [
        {
          stoneTypeCode: 'Code',
          description: 'Desc'
        }
      ];

      const action = new LoadTepStoneTypesListingSuccess(payload);
      expect({ ...action }).toEqual({
        type: TepStoneConfigActionTypes.LOAD_TEP_STONE_TYPES_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadTepStoneTypesListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTepStoneTypesListingFailure(payload);

      expect({ ...action }).toEqual({
        type: TepStoneConfigActionTypes.LOAD_TEP_STONE_TYPES_LIST_FAILURE,
        payload
      });
    });
  });

  describe('LoadTepStoneQualitiesListing Action Test Cases', () => {
    it('should check correct type is used for LoadTepStoneQualitiesListing action', () => {
      const action = new LoadTepStoneQualitiesListing();
      expect({ ...action }).toEqual({
        type: TepStoneConfigActionTypes.LOAD_TEP_STONE_QUALITIES_LIST
      });
    });

    it('should check correct type is used for LoadTepStoneQualitiesListingSuccess action', () => {
      const payload: TEPStoneConfigQualities[] = [
        {
          name: 'Name'
        }
      ];

      const action = new LoadTepStoneQualitiesListingSuccess(payload);
      expect({ ...action }).toEqual({
        type: TepStoneConfigActionTypes.LOAD_TEP_STONE_QUALITIES_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadTepStoneQualitiesListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTepStoneQualitiesListingFailure(payload);

      expect({ ...action }).toEqual({
        type: TepStoneConfigActionTypes.LOAD_TEP_STONE_QUALITIES_LIST_FAILURE,
        payload
      });
    });
  });

  describe('LoadTepStoneRangeListing Action Test Cases', () => {
    it('should check correct type is used for LoadTepStoneRangeListing action', () => {
      const action = new LoadTepStoneRangeListing();
      expect({ ...action }).toEqual({
        type: TepStoneConfigActionTypes.LOAD_TEP_STONE_RANGE_LIST
      });
    });

    it('should check correct type is used for LoadTepStoneRangeListingSuccess action', () => {
      const payload: TEPStoneConfigRange[] = [
        {
          id: '1',
          range: '2'
        }
      ];

      const action = new LoadTepStoneRangeListingSuccess(payload);
      expect({ ...action }).toEqual({
        type: TepStoneConfigActionTypes.LOAD_TEP_STONE_RANGE_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadTepStoneRangeListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTepStoneRangeListingFailure(payload);

      expect({ ...action }).toEqual({
        type: TepStoneConfigActionTypes.LOAD_TEP_STONE_RANGE_LIST_FAILURE,
        payload
      });
    });
  });

  describe('SaveTepStoneConfigDataDetails Action Test Cases', () => {
    it('should check correct type is used for SaveTepStoneConfigDataDetails action', () => {
      const payload: {
        configId: string;
        tepStoneDetails: TEPStoneDetailsModify;
      } = {
        configId: '1',
        tepStoneDetails: {
          addStones: [
            {
              dedutionPercent: 10,
              rangeId: '2',
              stoneQuality: '2',
              stoneTypeCode: 'StoneType'
            }
          ]
        }
      };
      const action = new SaveTepStoneConfigDataDetails(payload);
      expect({ ...action }).toEqual({
        type: TepStoneConfigActionTypes.SAVE_TEP_STONE_CONFIG_DATA_DETAILS,
        payload
      });
    });

    it('should check correct type is used for SaveTepStoneConfigDataDetailsSuccess action', () => {
      const payload: TEPStoneConfigDetailsListing = {
        results: [
          {
            id: '1',
            rowId: 1,
            configId: '1',
            dedutionPercent: 10,
            range: '1',
            rangeId: '2',
            stoneQuality: 'A',
            stoneTypeCode: 'Type',
            description: 'Desc'
          }
        ],
        totalElements: 1
      };

      const action = new SaveTepStoneConfigDataDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          TepStoneConfigActionTypes.SAVE_TEP_STONE_CONFIG_DATA_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SaveTepStoneConfigDataDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveTepStoneConfigDataDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          TepStoneConfigActionTypes.SAVE_TEP_STONE_CONFIG_DATA_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('EditTepStoneConfigDataDetails Action Test Cases', () => {
    it('should check correct type is used for EditTepStoneConfigDataDetails action', () => {
      const payload: {
        configId: string;
        tepStoneDetails: TEPStoneDetailsModify;
      } = {
        configId: '1',
        tepStoneDetails: {
          addStones: [
            {
              dedutionPercent: 10,
              rangeId: '2',
              stoneQuality: '2',
              stoneTypeCode: 'StoneType'
            }
          ]
        }
      };
      const action = new EditTepStoneConfigDataDetails(payload);
      expect({ ...action }).toEqual({
        type: TepStoneConfigActionTypes.EDIT_TEP_STONE_CONFIG_DATA_DETAILS,
        payload
      });
    });

    it('should check correct type is used for EditTepStoneConfigDataDetailsSuccess action', () => {
      const payload: TEPStoneConfigDetailsListing = {
        results: [
          {
            id: '1',
            rowId: 1,
            configId: '1',
            dedutionPercent: 10,
            range: '1',
            rangeId: '2',
            stoneQuality: 'A',
            stoneTypeCode: 'Type',
            description: 'Desc'
          }
        ],
        totalElements: 1
      };

      const action = new EditTepStoneConfigDataDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          TepStoneConfigActionTypes.EDIT_TEP_STONE_CONFIG_DATA_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for EditTepStoneConfigDataDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new EditTepStoneConfigDataDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          TepStoneConfigActionTypes.EDIT_TEP_STONE_CONFIG_DATA_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('RemoveTepStoneConfigDataDetails Action Test Cases', () => {
    it('should check correct type is used for RemoveTepStoneConfigDataDetails action', () => {
      const payload: {
        configId: string;
        tepStoneDetails: TEPStoneDetailsModify;
      } = {
        configId: '1',
        tepStoneDetails: {
          addStones: [
            {
              dedutionPercent: 10,
              rangeId: '2',
              stoneQuality: '2',
              stoneTypeCode: 'StoneType'
            }
          ]
        }
      };
      const action = new RemoveTepStoneConfigDataDetails(payload);
      expect({ ...action }).toEqual({
        type: TepStoneConfigActionTypes.REMOVE_TEP_STONE_CONFIG_DATA_DETAILS,
        payload
      });
    });

    it('should check correct type is used for RemoveTepStoneConfigDataDetailsSuccess action', () => {
      const payload: string[] = ['A'];

      const action = new RemoveTepStoneConfigDataDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          TepStoneConfigActionTypes.REMOVE_TEP_STONE_CONFIG_DATA_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for RemoveTepStoneConfigDataDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new RemoveTepStoneConfigDataDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          TepStoneConfigActionTypes.REMOVE_TEP_STONE_CONFIG_DATA_DETAILS_FAILURE,
        payload
      });
    });
  });
});
