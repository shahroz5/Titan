import { provideMockStore } from '@ngrx/store/testing';

import { TestBed, inject } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { CashPaymentConfiguration, LovMaster } from '@poss-web/shared/models';
import { LovMasterFacade } from './lovmaster.facade';
import { LovMasterState } from './lovmaster.state';
import { initialState as istate } from './lovmaster.reducer';
import {
  EditLovFormDetails,
  LoadLovListing,
  LoadLovTypes,
  ResetLovMasterData,
  SaveLovFormDetails
} from './lovmaster.actons';

describe('LovMasterFacade', () => {
  let lovMasterFacade: LovMasterFacade;
  const initialState: LovMasterState = { ...istate };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), LovMasterFacade]
    });

    lovMasterFacade = TestBed.inject(LovMasterFacade);
  });

  it('should create facade', () => {
    expect(lovMasterFacade).toBeDefined();
  });

  describe('#getLovMasterTypes', () => {
    it('should get getLovMasterTypes', () => {
      expect(lovMasterFacade.getLovMasterTypes()).toBeTruthy();
    });
  });

  describe('#getLovMasterListing', () => {
    it('should get getLovMasterListing', () => {
      expect(lovMasterFacade.getLovMasterListing()).toBeTruthy();
    });
  });

  describe('#getLovMasterDetails', () => {
    it('should get getLovMasterDetails', () => {
      expect(lovMasterFacade.getLovMasterDetails()).toBeTruthy();
    });
  });

  describe('#getTotalLovMasterDetails', () => {
    it('should get getTotalLovMasterDetails', () => {
      expect(lovMasterFacade.getTotalLovMasterDetails()).toBeTruthy();
    });
  });

  describe('#getIsLoading', () => {
    it('should get getIsLoading', () => {
      expect(lovMasterFacade.getIsLoading()).toBeTruthy();
    });
  });

  describe('#getError', () => {
    it('should getError', () => {
      expect(lovMasterFacade.getError()).toBeTruthy();
    });
  });

  describe('#getLovDetailsSaveResponse', () => {
    it('should getLovDetailsSaveResponse', () => {
      expect(lovMasterFacade.getLovDetailsSaveResponse()).toBeTruthy();
    });
  });

  describe('#getLovDetailsEditResponse', () => {
    it('should getLovDetailsEditResponse', () => {
      expect(lovMasterFacade.getLovDetailsEditResponse()).toBeTruthy();
    });
  });

  describe('#LoadLovTypes', () => {
    it('should LoadLovTypes', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new LoadLovTypes();
      lovMasterFacade.loadLovMasterTypes();

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadLovMasterListing', () => {
    it('should loadLovMasterListing', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new LoadLovListing('LOV');
      lovMasterFacade.loadLovMasterListing('LOV');

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#SaveLovFormDetails', () => {
    it('should SaveLovFormDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: LovMaster = {
        lovName: 'LOV_Name',
        description: 'Desc',
        isActive: true,
        lovType: 'LOV_Type'
      };

      const expectedAction = new SaveLovFormDetails(payload);
      lovMasterFacade.saveLovFormDetails(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#EditLovFormDetails', () => {
    it('should EditLovFormDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: LovMaster = {
        lovName: 'LOV_Name',
        description: 'Desc',
        isActive: true,
        lovType: 'LOV_Type'
      };

      const expectedAction = new EditLovFormDetails(payload);
      lovMasterFacade.editLovFormDetails(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#resetLovMasterData', () => {
    it('should resetLovMasterData', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new ResetLovMasterData();
      lovMasterFacade.resetLovMasterData();

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
