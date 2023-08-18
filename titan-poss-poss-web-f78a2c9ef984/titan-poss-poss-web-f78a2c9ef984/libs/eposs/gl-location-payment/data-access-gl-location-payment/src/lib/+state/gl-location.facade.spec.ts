import { Store } from '@ngrx/store';
import {
  LoadGlLocationPaymentList,
  SaveGlLocationPayment,
  LoadPaymentCodes,
  GetLocationCodes,
  DeleteGlLocationPayment,
  UpdateGlLocationPayment,
  ResetGlPaymentDetails
} from './gl-location.actions';
import {
  SaveGlLocationPayments,
  GLLocationPaymentListPayload
} from '@poss-web/shared/models';
import { GlLocationPaymentState } from './gl-location.state';
import { GlLocationPaymentFacade } from './gl-location.facade';
import { glLocPaymentAdapter } from './gl-location.entity';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

describe('Country facade Testing Suite', () => {
  const initialState: GlLocationPaymentState = {
    error: null,
    glLocationList: glLocPaymentAdapter.getInitialState(),
    isLoading: false,
    hasSaved: null,
    totalCount: 0,
    saveGlLocationPayment: null,
    paymentCodes: null,
    locationData: null
  };

  let glLocationPaymentFacade: GlLocationPaymentFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), GlLocationPaymentFacade]
    });

    glLocationPaymentFacade = TestBed.inject(GlLocationPaymentFacade);
  });

  describe('Access Selector action', () => {
    it('should access  getError() selector action', () => {
      expect(glLocationPaymentFacade.getError()).toEqual(
        glLocationPaymentFacade['hasError$']
      );
    });
    it('should access  getIsLoading() selector action', () => {
      expect(glLocationPaymentFacade.getIsLoading()).toEqual(
        glLocationPaymentFacade['isLoading$']
      );
    });
    it('should access  getGlLocationPaymentList() selector action', () => {
      expect(glLocationPaymentFacade.getGlLocationPaymentList()).toEqual(
        glLocationPaymentFacade['glLocationPaymentListing$']
      );
    });
    it('should access  getIsSaved() selector action', () => {
      expect(glLocationPaymentFacade.getIsSaved()).toEqual(
        glLocationPaymentFacade['isSaved$']
      );
    });
    it('should access  getPaymentCodes() selector action', () => {
      expect(glLocationPaymentFacade.getPaymentCodes()).toEqual(
        glLocationPaymentFacade['paymentCodes$']
      );
    });
    it('should access  getLocationData() selector action', () => {
      expect(glLocationPaymentFacade.getLocationData()).toEqual(
        glLocationPaymentFacade['locationCodes$']
      );
    });
    it('should access  getTotalElements() selector action', () => {
      expect(glLocationPaymentFacade.getTotalElements()).toEqual(
        glLocationPaymentFacade['totalElements$']
      );
    });
  });

  describe('loadGlLocationPaymentListing ', () => {
    it('should dispatch LoadGlLocationPaymentList  action', inject(
      [Store],
      store => {
        const parameters: GLLocationPaymentListPayload = {
          pageIndex: 0,
          pageSize: 100
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadGlLocationPaymentList(parameters);
        glLocationPaymentFacade.loadGlLocationPaymentListing(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe(' loadPaymentCodes ', () => {
    it('should dispatch loadPaymentCodes  action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadPaymentCodes();
      glLocationPaymentFacade.loadPaymentCodes();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe(' loadLocations ', () => {
    it('should dispatch loadLocations  action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new GetLocationCodes();
      glLocationPaymentFacade.loadLocations();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe(' SaveGlLocationPayment ', () => {
    it('should dispatch SaveGlLocationPayment  action', inject(
      [Store],
      store => {
        const parameters: SaveGlLocationPayments = {
          locationCode: 'URB',
          addLocations: ['URB', 'BGR'],
          addPaymentCodes: ['CASH'],
          removeLocations: ['ADH'],
          removePaymentCodes: ['CHEQUE']
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SaveGlLocationPayment(parameters);
        glLocationPaymentFacade.saveGlLocationPaymentListing(parameters);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe(' ResetGlPaymentDetails ', () => {
    it('should dispatch ResetGlPaymentDetails  action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetGlPaymentDetails();
        glLocationPaymentFacade.resetGlPaymentDetails();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe(' UpdateGlLocationPayment ', () => {
    it('should dispatch UpdateGlLocationPayment  action', inject(
      [Store],
      store => {
        const payload = {
          id: '3456789',
          glCode: 456780,
          paymentCode: 'CASH'
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new UpdateGlLocationPayment(payload);
        glLocationPaymentFacade.updateRowData(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe(' DeleteGlLocationPayment ', () => {
    it('should dispatch DeleteGlLocationPayment  action', inject(
      [Store],
      store => {
        const id = '345678';
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new DeleteGlLocationPayment(id);
        glLocationPaymentFacade.deleteRowData(id);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
});
