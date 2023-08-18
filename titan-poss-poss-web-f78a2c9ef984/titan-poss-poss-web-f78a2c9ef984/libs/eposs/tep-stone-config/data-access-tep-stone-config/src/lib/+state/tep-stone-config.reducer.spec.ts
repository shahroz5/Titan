import {
  TEPStoneConfig,
  TEPStoneConfigDetailsListing,
  TEPStoneConfigListing,
  TEPStoneConfigListingPayload,
  TEPStoneConfigQualities,
  TEPStoneConfigRange,
  TEPStoneConfigStoneType,
  TEPStoneDetailsModify
} from '@poss-web/shared/models';
import * as actions from './tep-stone-config.actons';
import { TepStoneConfigState } from './tep-stone-config.state';
import {
  initialState as istate,
  tepStoneConfigReducer
} from './tep-stone-config.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('TEP Stone config Reducer Testing Suite', () => {
  const initialState: TepStoneConfigState = { ...istate };

  describe('Testing LoadTepStoneConfigListing Functionality', () => {
    it('LoadTepStoneConfigListing should be called', () => {
      const payload1: TEPStoneConfigListingPayload = {
        pageIndex: 0,
        pageSize: 1
      };
      const action = new actions.LoadTepStoneConfigListing(payload1);

      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadTepStoneConfigListingSuccess should return list', () => {
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

      const action = new actions.LoadTepStoneConfigListingSuccess(payload);
      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );

      expect(result.tepStoneConfiglist).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadTepStoneConfigListingFailure should return error', () => {
      const action = new actions.LoadTepStoneConfigListingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );

      expect(result.tepStoneConfigDetailslist.ids.length).toEqual(0);
    });
  });

  describe('Testing SearchTepStoneConfigDetails Functionality', () => {
    it('SearchTepStoneConfigDetails should be called', () => {
      const action = new actions.SearchTepStoneConfigDetails('payload');

      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('SearchTepStoneConfigDetailsSuccess should return list', () => {
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

      const action = new actions.SearchTepStoneConfigDetailsSuccess(payload);
      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );

      expect(result.tepStoneConfiglist).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('SearchTepStoneConfigDetailsFailure should return error', () => {
      const action = new actions.SearchTepStoneConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );

      expect(result.tepStoneConfigDetailslist.ids.length).toEqual(0);
    });
  });

  describe('Testing LoadTepStoneConfigDetails Functionality', () => {
    it('LoadTepStoneConfigDetails should be called', () => {
      const action = new actions.LoadTepStoneConfigDetails('Code');

      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadTepStoneConfigDetailsSuccess should return list', () => {
      const payload: TEPStoneConfig = {
        configId: '1',
        configType: 'Type',
        description: 'Desc',
        isActive: true
      };

      const action = new actions.LoadTepStoneConfigDetailsSuccess(payload);
      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );

      expect(result.tepStoneConfigDetails).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadTepStoneConfigDetailsFailure should return error', () => {
      const action = new actions.LoadTepStoneConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveTepValidationConfigDetails Functionality', () => {
    const payload: TEPStoneConfig = {
      configId: '1',
      configType: 'Type',
      description: 'Desc',
      isActive: true
    };
    it('SaveTepValidationConfigDetails should be called', () => {
      const action = new actions.SaveTepStoneConfig(payload);

      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('SaveTepStoneConfigSuccess should return list', () => {
      const action = new actions.SaveTepStoneConfigSuccess(payload);
      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );

      expect(result.hasSaved).toBe(true);
      expect(result.isLoading).toBe(false);
    });
    it('SaveTepStoneConfigFailure should return error', () => {
      const action = new actions.SaveTepStoneConfigFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateTepStoneConfigDetails Functionality', () => {
    const payload: TEPStoneConfig = {
      configId: '1',
      configType: 'Type',
      description: 'Desc',
      isActive: true
    };
    it('UpdateTepStoneConfigDetails should be called', () => {
      const action = new actions.UpdateTepStoneConfigDetails(payload);

      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('UpdateTepStoneConfigDetailsSuccess should return list', () => {
      const action = new actions.UpdateTepStoneConfigDetailsSuccess(payload);
      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );

      expect(result.hasUpdated).toBe(true);
      expect(result.isLoading).toBe(false);
    });
    it('UpdateTepStoneConfigDetailsFailure should return error', () => {
      const action = new actions.UpdateTepStoneConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateTepStoneConfigDetails Functionality', () => {
    it('LoadTepStoneConfigDataListing should be called', () => {
      const payload: string = 'Code';
      const action = new actions.LoadTepStoneConfigDataListing(payload);

      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadTepStoneConfigDataListingSuccess should return list', () => {
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
      const action = new actions.LoadTepStoneConfigDataListingSuccess(payload);
      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );

      expect(result.tepStoneConfigDetailslist).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadTepStoneConfigDataListingFailure should return error', () => {
      const action = new actions.LoadTepStoneConfigDataListingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchTepStoneConfigDataListing Functionality', () => {
    it('SearchTepStoneConfigDataListing should be called', () => {
      const payload: {
        configId: string;
        filter: string;
      } = {
        configId: '1',
        filter: '2'
      };
      const action = new actions.SearchTepStoneConfigDataListing(payload);

      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('SearchTepStoneConfigDataListingSuccess should return list', () => {
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
      const action = new actions.SearchTepStoneConfigDataListingSuccess(
        payload
      );
      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );

      expect(result.tepStoneConfigDetailslist).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('SearchTepStoneConfigDataListingFailure should return error', () => {
      const action = new actions.SearchTepStoneConfigDataListingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );

      expect(result.tepStoneConfigDetailslist.ids.length).toEqual(0);
    });
  });

  describe('Testing LoadTepStoneTypesListing Functionality', () => {
    it('LoadTepStoneTypesListing should be called', () => {
      const action = new actions.LoadTepStoneTypesListing();

      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadTepStoneTypesListingSuccess should return list', () => {
      const payload: TEPStoneConfigStoneType[] = [
        {
          stoneTypeCode: 'Code',
          description: 'Desc'
        }
      ];
      const action = new actions.LoadTepStoneTypesListingSuccess(payload);
      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );

      expect(result.tepStoneConfigStoneType).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('SearchTepStoneConfigDataListingFailure should return error', () => {
      const action = new actions.SearchTepStoneConfigDataListingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );

      expect(result.tepStoneConfigDetailslist.ids.length).toEqual(0);
    });
  });

  describe('Testing LoadTepStoneQualitiesListing Functionality', () => {
    it('LoadTepStoneQualitiesListing should be called', () => {
      const action = new actions.LoadTepStoneQualitiesListing();

      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadTepStoneQualitiesListingSuccess should return list', () => {
      const payload: TEPStoneConfigQualities[] = [
        {
          name: 'Name'
        }
      ];
      const action = new actions.LoadTepStoneQualitiesListingSuccess(payload);
      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );

      expect(result.tepStoneConfigQualities).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('SearchTepStoneConfigDataListingFailure should return error', () => {
      const action = new actions.SearchTepStoneConfigDataListingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );

      expect(result.tepStoneConfigDetailslist.ids.length).toEqual(0);
    });
  });

  describe('Testing LoadTepStoneRangeListing Functionality', () => {
    it('LoadTepStoneRangeListing should be called', () => {
      const action = new actions.LoadTepStoneRangeListing();

      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadTepStoneRangeListingSuccess should return list', () => {
      const payload: TEPStoneConfigRange[] = [
        {
          id: '1',
          range: '2'
        }
      ];
      const action = new actions.LoadTepStoneRangeListingSuccess(payload);
      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );

      expect(result.tepStoneConfigRange).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadTepStoneRangeListingFailure should return error', () => {
      const action = new actions.LoadTepStoneRangeListingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );

      expect(result.tepStoneConfigDetailslist.ids.length).toEqual(0);
    });
  });

  describe('Testing SaveTepStoneConfigDataDetails Functionality', () => {
    it('SaveTepStoneConfigDataDetails should be called', () => {
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
      const action = new actions.SaveTepStoneConfigDataDetails(payload);

      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('SaveTepStoneConfigDataDetailsSuccess should return list', () => {
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
      const action = new actions.SaveTepStoneConfigDataDetailsSuccess(payload);
      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );

      expect(result.tepStoneConfigDetailslist).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('SaveTepStoneConfigDataDetailsFailure should return error', () => {
      const action = new actions.SaveTepStoneConfigDataDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing EditTepStoneConfigDataDetails Functionality', () => {
    it('EditTepStoneConfigDataDetails should be called', () => {
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
      const action = new actions.EditTepStoneConfigDataDetails(payload);

      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('EditTepStoneConfigDataDetailsSuccess should return list', () => {
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
      const action = new actions.EditTepStoneConfigDataDetailsSuccess(payload);
      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );

      expect(result.tepStoneConfigDetailslist).toBeDefined();
      expect(result.hasSaved).toBe(true);
      expect(result.isLoading).toBe(false);
    });
    it('EditTepStoneConfigDataDetailsFailure should return error', () => {
      const action = new actions.EditTepStoneConfigDataDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing RemoveTepStoneConfigDataDetails Functionality', () => {
    it('RemoveTepStoneConfigDataDetails should be called', () => {
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
      const action = new actions.RemoveTepStoneConfigDataDetails(payload);

      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('RemoveTepStoneConfigDataDetailsSuccess should return list', () => {
      const payload: string[] = ['A'];
      const action = new actions.RemoveTepStoneConfigDataDetailsSuccess(
        payload
      );
      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );

      expect(result.tepStoneConfigDetailslist).toBeDefined();
      expect(result.hasSaved).toBe(true);
      expect(result.isLoading).toBe(false);
    });
    it('RemoveTepStoneConfigDataDetailsFailure should return error', () => {
      const action = new actions.RemoveTepStoneConfigDataDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: TepStoneConfigState = tepStoneConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });
});
