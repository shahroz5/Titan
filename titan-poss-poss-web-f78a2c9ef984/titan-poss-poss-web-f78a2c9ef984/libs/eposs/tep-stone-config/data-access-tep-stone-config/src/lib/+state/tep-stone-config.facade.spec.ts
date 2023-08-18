import { provideMockStore } from '@ngrx/store/testing';

import { TestBed, inject } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import {
  TEPStoneConfig,
  TEPStoneConfigListingPayload,
  TEPStoneDetailsModify} from '@poss-web/shared/models';
import { TepStoneConfigFacade } from './tep-stone-config.facade';
import { TepStoneConfigState } from './tep-stone-config.state';
import { initialState as istate } from './tep-stone-config.reducer';
import {
  EditTepStoneConfigDataDetails,
  LoadTepStoneConfigDataListing,
  LoadTepStoneConfigDetails,
  LoadTepStoneConfigListing,
  LoadTepStoneQualitiesListing,
  LoadTepStoneRangeListing,
  LoadTepStoneTypesListing,
  RemoveTepStoneConfigDataDetails,
  SaveTepStoneConfig,
  SaveTepStoneConfigDataDetails,
  SearchTepStoneConfigDataListing,
  SearchTepStoneConfigDetails,
  UpdateTepStoneConfigDetails
} from './tep-stone-config.actons';

describe('LovMasterFacade', () => {
  let tepStoneConfigFacade: TepStoneConfigFacade;
  const initialState: TepStoneConfigState = { ...istate };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), TepStoneConfigFacade]
    });

    tepStoneConfigFacade = TestBed.inject(TepStoneConfigFacade);
  });

  it('should create facade', () => {
    expect(tepStoneConfigFacade).toBeDefined();
  });

  describe('#getTepStoneConfigList', () => {
    it('should get getTepStoneConfigList', () => {
      expect(tepStoneConfigFacade.getTepStoneConfigList()).toBeTruthy();
    });
  });

  describe('#getTepStoneConfigDetailsList', () => {
    it('should get getTepStoneConfigDetailsList', () => {
      expect(tepStoneConfigFacade.getTepStoneConfigDetailsList()).toBeTruthy();
    });
  });

  describe('#getTepStoneConfigDetails', () => {
    it('should get getTepStoneConfigDetails', () => {
      expect(tepStoneConfigFacade.getTepStoneConfigDetails()).toBeTruthy();
    });
  });

  describe('#getTotalElements', () => {
    it('should get getTotalElements', () => {
      expect(tepStoneConfigFacade.getTotalElements()).toBeTruthy();
    });
  });

  describe('#getIsloading', () => {
    it('should get getIsloading', () => {
      expect(tepStoneConfigFacade.getIsloading()).toBeTruthy();
    });
  });

  describe('#getError', () => {
    it('should getError', () => {
      expect(tepStoneConfigFacade.getError()).toBeTruthy();
    });
  });

  describe('#getTotalElements', () => {
    it('should getTotalElements', () => {
      expect(tepStoneConfigFacade.getTotalElements()).toBeTruthy();
    });
  });

  describe('#getTepStoneConfigStoneType', () => {
    it('should getTepStoneConfigStoneType', () => {
      expect(tepStoneConfigFacade.getTepStoneConfigStoneType()).toBeTruthy();
    });
  });

  describe('#getHasUpdated', () => {
    it('should getHasUpdated', () => {
      expect(tepStoneConfigFacade.getHasUpdated()).toBeTruthy();
    });
  });

  describe('#getHasSaved', () => {
    it('should getHasSaved', () => {
      expect(tepStoneConfigFacade.getHasSaved()).toBeTruthy();
    });
  });

  describe('#getTepStoneConfigQualities', () => {
    it('should getTepStoneConfigQualities', () => {
      expect(tepStoneConfigFacade.getTepStoneConfigQualities()).toBeTruthy();
    });
  });

  describe('#getTepStoneConfigRange', () => {
    it('should getTepStoneConfigRange', () => {
      expect(tepStoneConfigFacade.getTepStoneConfigRange()).toBeTruthy();
    });
  });

  describe('#loadTepStoneConfigList', () => {
    it('should loadTepStoneConfigList', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: TEPStoneConfigListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const expectedAction = new LoadTepStoneConfigListing(payload);
      tepStoneConfigFacade.loadTepStoneConfigList(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadTepStoneConfigDetails', () => {
    it('should loadTepStoneConfigDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: string = 'Code';
      const expectedAction = new LoadTepStoneConfigDetails(payload);
      tepStoneConfigFacade.loadTepStoneConfigDetails(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadTepStoneConfigDetailsList', () => {
    it('should loadTepStoneConfigDetailsList', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: string = 'Code';

      const expectedAction = new LoadTepStoneConfigDataListing(payload);
      tepStoneConfigFacade.loadTepStoneConfigDetailsList(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('#LoadTepStoneQualitiesListing', () => {
    it('should LoadTepStoneQualitiesListing', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new LoadTepStoneQualitiesListing();
      tepStoneConfigFacade.LoadTepStoneQualitiesListing();

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#LoadTepStoneTypesListing', () => {
    it('should LoadTepStoneTypesListing', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new LoadTepStoneTypesListing();
      tepStoneConfigFacade.LoadTepStoneTypesListing();

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#LoadTepStoneRangeListing', () => {
    it('should LoadTepStoneRangeListing', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new LoadTepStoneRangeListing();
      tepStoneConfigFacade.LoadTepStoneRangeListing();

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#saveTepStoneConfigDetails', () => {
    it('should saveTepStoneConfigDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

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

      const expectedAction = new SaveTepStoneConfigDataDetails(payload);

      tepStoneConfigFacade.saveTepStoneConfigDetails(
        payload.configId,
        payload.tepStoneDetails
      );

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#editTepStoneConfigDetails', () => {
    it('should editTepStoneConfigDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

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

      const expectedAction = new EditTepStoneConfigDataDetails(payload);

      tepStoneConfigFacade.editTepStoneConfigDetails(
        payload.configId,
        payload.tepStoneDetails
      );

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#removeTepStoneConfigDetails', () => {
    it('should removeTepStoneConfigDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

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

      const expectedAction = new RemoveTepStoneConfigDataDetails(payload);

      tepStoneConfigFacade.removeTepStoneConfigDetails(
        payload.configId,
        payload.tepStoneDetails
      );

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#saveTepStoneConfig', () => {
    it('should saveTepStoneConfig', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: TEPStoneConfig = {
        configId: '1',
        configType: 'Type',
        description: 'Desc',
        isActive: true
      };

      const expectedAction = new SaveTepStoneConfig(payload);

      tepStoneConfigFacade.saveTepStoneConfig(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#updateTepStoneConfigDetails', () => {
    it('should updateTepStoneConfigDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: TEPStoneConfig = {
        configId: '1',
        configType: 'Type',
        description: 'Desc',
        isActive: true
      };

      const expectedAction = new UpdateTepStoneConfigDetails(payload);

      tepStoneConfigFacade.updateTepStoneConfigDetails(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#searchTepStoneConfig', () => {
    it('should searchTepStoneConfig', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: string = 'code';

      const expectedAction = new SearchTepStoneConfigDetails(payload);

      tepStoneConfigFacade.searchTepStoneConfig(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#searchTepStoneConfig', () => {
    it('should searchTepStoneConfig', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: {
        configId: string;
        filter: string;
      } = {
        configId: '1',
        filter: '2'
      };

      const expectedAction = new SearchTepStoneConfigDataListing(payload);

      tepStoneConfigFacade.searchTepStoneConfigDetails(
        payload.configId,
        payload.filter
      );

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
