import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { DataPersistence } from '@nrwl/angular';
import { hot, cold } from 'jasmine-marbles';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
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
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import { TepStoneConfigService } from '../tep-stone-config.service';
import { TepStoneConfigEffect } from './tep-stone-config.effect';
import { TEP_STONE_CONFIG_FEATURE_NAME } from './tep-stone-config.reducer';

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
  UpdateTepStoneConfigDetails,
  UpdateTepStoneConfigDetailsFailure,
  UpdateTepStoneConfigDetailsSuccess
} from './tep-stone-config.actons';

describe('TEP Stone Config  Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: TepStoneConfigEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};

  const tepStoneConfigServiceSpy = jasmine.createSpyObj<
    TepStoneConfigService
  >([
    'getTepStoneConfigList',
    'searchTepStoneConfigList',
    'saveTepStoneConfig',
    'updateTepStoneConfig',
    'getTepStoneConfig',
    'getTepStoneConfigDetailsList',
    'searchTepStoneConfigDetailsList',
    'getStoneQualitiesList',
    'getStoneTypesList',
    'getRangesList',
    'addTepStoneConfigDetails',
    'removeTepStoneConfigDetails'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TepStoneConfigEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [TEP_STONE_CONFIG_FEATURE_NAME]: initialState
          }
        }),
        provideMockActions(() => actions$),
        {
          provide: POSS_WEB_API_URL,
          useValue: ''
        },
        {
          provide: POSS_WEB_CACHING_STRATEGY,
          useValue: []
        },
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: TepStoneConfigService,
          useValue: tepStoneConfigServiceSpy
        }
      ]
    });

    effect = TestBed.inject(TepStoneConfigEffect);
  });

  describe('LoadTepStoneConfigListing', () => {
    it('should return LoadTepStoneConfigListingSuccess', () => {
      const payload1: TEPStoneConfigListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const action = new LoadTepStoneConfigListing(payload1);

      const payload2: TEPStoneConfigListing = {
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

      const outcome = new LoadTepStoneConfigListingSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      tepStoneConfigServiceSpy.getTepStoneConfigList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTepStoneConfigListing$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload1: TEPStoneConfigListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const action = new LoadTepStoneConfigListing(payload1);
      const error = new Error('some error');
      const outcome = new LoadTepStoneConfigListingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepStoneConfigServiceSpy.getTepStoneConfigList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadTepStoneConfigListing$).toBeObservable(expected);
    });
  });

  describe('SearchTepStoneConfigDetails Details', () => {
    it('should return a details of TEP Stone Config for SearchTepStoneConfigDetailsSuccess', () => {
      const payload2: TEPStoneConfigListing = {
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

      const payload1: string = 'Code';
      const action = new SearchTepStoneConfigDetails(payload1);
      const outcome = new SearchTepStoneConfigDetailsSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      tepStoneConfigServiceSpy.searchTepStoneConfigList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchTepStoneConfigDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for SearchTepStoneConfigDetailsFailure', () => {
      const payload1: string = 'Code';
      const action = new SearchTepStoneConfigDetails(payload1);

      const error = new Error('some error');
      const outcome = new SearchTepStoneConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepStoneConfigServiceSpy.searchTepStoneConfigList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.searchTepStoneConfigDetails$).toBeObservable(expected);
    });
  });

  describe('LoadTepStoneConfigDetails Details', () => {
    it('should return a details of TEP Stone Config for LoadTepStoneConfigDetailsSuccess', () => {
      const payload1: string = 'Code';
      const action = new LoadTepStoneConfigDetails(payload1);

      const payload2: TEPStoneConfig = {
        configId: '1',
        configType: 'Type',
        description: 'Desc',
        isActive: true
      };
      const outcome = new LoadTepStoneConfigDetailsSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      tepStoneConfigServiceSpy.getTepStoneConfig.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTepStoneConfigDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for LoadTepStoneConfigDetailsFailure', () => {
      const payload1: string = 'Code';

      const action = new LoadTepStoneConfigDetails(payload1);
      const error = new Error('some error');
      const outcome = new LoadTepStoneConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepStoneConfigServiceSpy.getTepStoneConfig.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadTepStoneConfigDetails$).toBeObservable(expected);
    });
  });

  /* describe('SaveTepStoneConfig Details', () => {
    it('should return a details of TEP Stone Config for SaveTepStoneConfigSuccess', () => {
      const payload: TEPStoneConfig = {
        configId: '1',
        configType: 'Type',
        description: 'Desc',
        isActive: true
      };

      const action = new SaveTepStoneConfig(payload);
      const outcome = new SaveTepStoneConfigSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      tepStoneConfigServiceSpy.addTepStoneConfigDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveTepStoneConfigDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for SaveTepStoneConfigFailure', () => {
      const payload: TEPStoneConfig = {
        configId: '1',
        configType: 'Type',
        description: 'Desc',
        isActive: true
      };

      const action = new SaveTepStoneConfig(payload);
      const error = new Error('some error');
      const outcome = new SaveTepStoneConfigFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepStoneConfigServiceSpy.addTepStoneConfigDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.saveTepStoneConfigDetails$).toBeObservable(expected);
    });
  }); */

  describe('UpdateTepStoneConfigDetails Details', () => {
    it('should return a details of TEP Stone Config for UpdateTepStoneConfigDetailsSuccess', () => {
      const payload: TEPStoneConfig = {
        configId: '1',
        configType: 'Type',
        description: 'Desc',
        isActive: true
      };

      const action = new UpdateTepStoneConfigDetails(payload);
      const outcome = new UpdateTepStoneConfigDetailsSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      tepStoneConfigServiceSpy.updateTepStoneConfig.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateTepStoneConfigDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for UpdateTepStoneConfigDetailsFailure', () => {
      const payload: TEPStoneConfig = {
        configId: '1',
        configType: 'Type',
        description: 'Desc',
        isActive: true
      };

      const action = new UpdateTepStoneConfigDetails(payload);
      const error = new Error('some error');
      const outcome = new UpdateTepStoneConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepStoneConfigServiceSpy.updateTepStoneConfig.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.updateTepStoneConfigDetails$).toBeObservable(expected);
    });
  });

  describe('LoadTepStoneConfigDataListing Details', () => {
    it('should return a details of TEP Stone Config for LoadTepStoneConfigDataListingSuccess', () => {
      const payload1 = 'payload';
      const action = new LoadTepStoneConfigDataListing(payload1);

      const payload2: TEPStoneConfigDetailsListing = {
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
      const outcome = new LoadTepStoneConfigDataListingSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      tepStoneConfigServiceSpy.getTepStoneConfigDetailsList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTepStoneConfigDetailsListing$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error for LoadTepStoneConfigDataListingFailure', () => {
      const payload1 = 'payload';
      const action = new LoadTepStoneConfigDataListing(payload1);
      const error = new Error('some error');
      const outcome = new LoadTepStoneConfigDataListingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepStoneConfigServiceSpy.getTepStoneConfigDetailsList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadTepStoneConfigDetailsListing$).toBeObservable(expected);
    });
  });

  describe('SearchTepStoneConfigDataListing Details', () => {
    it('should return a details of TEP Stone Config for SearchTepStoneConfigDataListingSuccess', () => {
      const payload1: {
        configId: string;
        filter: string;
      } = {
        configId: '1',
        filter: '2'
      };
      const action = new SearchTepStoneConfigDataListing(payload1);

      const payload2: TEPStoneConfigDetailsListing = {
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
      const outcome = new SearchTepStoneConfigDataListingSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      tepStoneConfigServiceSpy.searchTepStoneConfigDetailsList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchTepStoneConfigDatalist$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for SearchTepStoneConfigDataListingFailure', () => {
      const payload1: {
        configId: string;
        filter: string;
      } = {
        configId: '1',
        filter: '2'
      };
      const action = new SearchTepStoneConfigDataListing(payload1);
      const error = new Error('some error');
      const outcome = new SearchTepStoneConfigDataListingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepStoneConfigServiceSpy.searchTepStoneConfigDetailsList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.searchTepStoneConfigDatalist$).toBeObservable(expected);
    });
  });

  describe('LoadTepStoneTypesListing Details', () => {
    it('should return a details of TEP Stone Config for LoadTepStoneTypesListingSuccess', () => {
      const action = new LoadTepStoneTypesListing();

      const payload2: TEPStoneConfigStoneType[] = [
        {
          stoneTypeCode: 'Code',
          description: 'Desc'
        }
      ];
      const outcome = new LoadTepStoneTypesListingSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      tepStoneConfigServiceSpy.getStoneTypesList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTepStoneConfigStoneType$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for LoadTepStoneTypesListingFailure', () => {
      const action = new LoadTepStoneTypesListing();
      const error = new Error('some error');
      const outcome = new LoadTepStoneTypesListingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepStoneConfigServiceSpy.getStoneTypesList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadTepStoneConfigStoneType$).toBeObservable(expected);
    });
  });

  describe('LoadTepStoneQualitiesListing Details', () => {
    it('should return a details of TEP Stone Config for LoadTepStoneQualitiesListingSuccess', () => {
      const action = new LoadTepStoneQualitiesListing();

      const payload2: TEPStoneConfigQualities[] = [
        {
          name: 'Name'
        }
      ];

      const outcome = new LoadTepStoneQualitiesListingSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      tepStoneConfigServiceSpy.getStoneQualitiesList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTepStoneQualitiesListing$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for LoadTepStoneQualitiesListingFailure', () => {
      const action = new LoadTepStoneQualitiesListing();
      const error = new Error('some error');
      const outcome = new LoadTepStoneQualitiesListingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepStoneConfigServiceSpy.getStoneQualitiesList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadTepStoneQualitiesListing$).toBeObservable(expected);
    });
  });

  describe('LoadTepStoneRangeListing Details', () => {
    it('should return a details of TEP Stone Config for LoadTepStoneRangeListingSuccess', () => {
      const action = new LoadTepStoneRangeListing();

      const payload2: TEPStoneConfigRange[] = [
        {
          id: '1',
          range: '2'
        }
      ];

      const outcome = new LoadTepStoneRangeListingSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      tepStoneConfigServiceSpy.getRangesList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTepStoneRangeListing$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for LoadTepStoneRangeListingFailure', () => {
      const action = new LoadTepStoneRangeListing();
      const error = new Error('some error');
      const outcome = new LoadTepStoneRangeListingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepStoneConfigServiceSpy.getRangesList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadTepStoneRangeListing$).toBeObservable(expected);
    });
  });

  describe('SaveTepStoneConfigDataDetails Details', () => {
    it('should return a details of TEP Stone Config for SaveTepStoneConfigDataDetailsSuccess', () => {
      const payload1: {
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

      const action = new SaveTepStoneConfigDataDetails(payload1);

      const payload2: TEPStoneConfigDetailsListing = {
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

      const outcome = new SaveTepStoneConfigDataDetailsSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      tepStoneConfigServiceSpy.addTepStoneConfigDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveTepStoneConfigDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for SaveTepStoneConfigDataDetailsFailure', () => {
      const payload1: {
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

      const action = new SaveTepStoneConfigDataDetails(payload1);

      const error = new Error('some error');
      const outcome = new SaveTepStoneConfigDataDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepStoneConfigServiceSpy.addTepStoneConfigDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.saveTepStoneConfigDetails$).toBeObservable(expected);
    });
  });

  describe('EditTepStoneConfigDataDetails Details', () => {
    it('should return a details of TEP Stone Config for EditTepStoneConfigDataDetailsSuccess', () => {
      const payload1: {
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

      const action = new EditTepStoneConfigDataDetails(payload1);

      const payload2: TEPStoneConfigDetailsListing = {
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

      const outcome = new EditTepStoneConfigDataDetailsSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      tepStoneConfigServiceSpy.addTepStoneConfigDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.editTepStoneConfigDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for EditTepStoneConfigDataDetailsFailure', () => {
      const payload1: {
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

      const action = new EditTepStoneConfigDataDetails(payload1);

      const error = new Error('some error');
      const outcome = new EditTepStoneConfigDataDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepStoneConfigServiceSpy.addTepStoneConfigDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.editTepStoneConfigDetails$).toBeObservable(expected);
    });
  });

  describe('RemoveTepStoneConfigDataDetails Details', () => {
    it('should return a details of TEP Stone Config for RemoveTepStoneConfigDataDetailsSuccess', () => {
      const payload1: {
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

      const action = new RemoveTepStoneConfigDataDetails(payload1);

      const payload2: string[] = ['A'];

      const outcome = new RemoveTepStoneConfigDataDetailsSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      tepStoneConfigServiceSpy.removeTepStoneConfigDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.removeTepStoneConfigDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for RemoveTepStoneConfigDataDetailsFailure', () => {
      const payload1: {
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

      const action = new RemoveTepStoneConfigDataDetails(payload1);

      const error = new Error('some error');
      const outcome = new RemoveTepStoneConfigDataDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      tepStoneConfigServiceSpy.removeTepStoneConfigDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.removeTepStoneConfigDetails$).toBeObservable(expected);
    });
  });
});
