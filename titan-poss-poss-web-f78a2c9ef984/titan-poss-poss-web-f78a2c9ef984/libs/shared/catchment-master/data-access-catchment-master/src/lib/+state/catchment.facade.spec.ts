import { provideMockStore } from '@ngrx/store/testing';

import { TestBed, inject } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import {
  CatchmentDetails,
  ConfigListingPayload,
  GrnInterboutiqueConfig,
  LoadCatchmentListingPayload,
  LoadStateTaxConfigurationListingPayload,
  SortItem,
  StateTaxConfigurationStateDetails,
  TaxDetailsSelect,
  TaxDetailsSubmit
} from '@poss-web/shared/models';
import { CatchmentFacade } from './catchment.facade';
import { CatchmentState } from './catchment.state';
import { initialState as istate } from './catchment.reducer';
import {
  EditCatchmentFormDetails,
  LoadCatchmentDetails,
  LoadCatchmentListing,
  SaveCatchmentFormDetails,
  SearchCatchmentCode
} from './catchment.actions';

describe('CatchmentFacade', () => {
  let catchmentFacade: CatchmentFacade;
  const initialState: CatchmentState = { ...istate };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), CatchmentFacade]
    });

    catchmentFacade = TestBed.inject(CatchmentFacade);
  });

  it('should create facade', () => {
    expect(catchmentFacade).toBeDefined();
  });

  describe('#getisLoading', () => {
    it('should get getisLoading', () => {
      expect(catchmentFacade.getisLoading()).toBeTruthy();
    });
  });

  describe('#getTotalcatchmentDetails', () => {
    it('should get getTotalcatchmentDetails', () => {
      expect(catchmentFacade.getTotalcatchmentDetails()).toBeTruthy();
    });
  });

  describe('#getCatchmentListing', () => {
    it('should get getCatchmentListing', () => {
      expect(catchmentFacade.getCatchmentListing()).toBeTruthy();
    });
  });

  describe('#getCatchmentDetails', () => {
    it('should get getCatchmentDetails', () => {
      expect(catchmentFacade.getCatchmentDetails()).toBeTruthy();
    });
  });

  describe('#getCatchmentSaveResponse', () => {
    it('should get getCatchmentSaveResponse', () => {
      expect(catchmentFacade.getCatchmentSaveResponse()).toBeTruthy();
    });
  });

  describe('#getCatchmentEditResponse', () => {
    it('should get getCatchmentEditResponse', () => {
      expect(catchmentFacade.getCatchmentEditResponse()).toBeTruthy();
    });
  });

  describe('#getError', () => {
    it('should get getError', () => {
      expect(catchmentFacade.getError()).toBeTruthy();
    });
  });

  describe('#loadCatchmentListing', () => {
    it('should loadCatchmentListing', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: LoadCatchmentListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const expectedAction = new LoadCatchmentListing(payload);
      catchmentFacade.loadCatchmentListing(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#searchCatchment', () => {
    it('should searchCatchment', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload = '';
      const expectedAction = new SearchCatchmentCode(payload);
      catchmentFacade.searchCatchment(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadCatchmentDetails', () => {
    it('should loadCatchmentDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload = '';
      const expectedAction = new LoadCatchmentDetails(payload);
      catchmentFacade.loadCatchmentDetails(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#editCatchmentFormDetails', () => {
    it('should editCatchmentFormDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: CatchmentDetails = {
        catchmentCode: 'Code',
        description: 'Desc',
        isActive: true
      };
      const expectedAction = new EditCatchmentFormDetails(payload);
      catchmentFacade.editCatchmentFormDetails(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#saveCatchmentFormDetails', () => {
    it('should saveCatchmentFormDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: CatchmentDetails = {
        catchmentCode: 'Code',
        description: 'Desc',
        isActive: true
      };
      const expectedAction = new SaveCatchmentFormDetails(payload);
      catchmentFacade.saveCatchmentFormDetails(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
