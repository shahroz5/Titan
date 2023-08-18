import { AmendmentConfigState } from './amendment-config.state';
import { AmendmentConfigFacade } from './amendment-config.facade'
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { saveDiscountExcludeSchemesUrl } from '@poss-web/shared/util-api-service';
import { LoadAmendmentConfigurationFiledValue, LoadReset, SaveAmendmentConfiguration } from './amendment-config.actions';
import { UpdateFieldValuePayload } from '@poss-web/shared/models';

describe('AmendmentConfigFacade Testing Suite', () => {
  const initialState: AmendmentConfigState = {
  amendmentConfigValue: 0,
  error: null,
  isLoading: false,
  hasUpdated: false
  }

  let amendmentConfigFacade: AmendmentConfigFacade;
  let store: MockStore<AmendmentConfigFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), AmendmentConfigFacade]
    });
    store = TestBed.inject<any>(Store);
    amendmentConfigFacade = TestBed.inject<any>(AmendmentConfigFacade);
  })

  describe('Dispatch Actions action', () => {
    it('should call saveGlobalConfiguration action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: UpdateFieldValuePayload = {
        ruleDetails: {
          data: {},
          type: 'AMENDMENT_CONFIGURATION'
        }
      }
      const action = new SaveAmendmentConfiguration(payload);
      amendmentConfigFacade.saveGlobalConfiguration(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })
    it('should call loadAmendmentConfigFieldValue action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadAmendmentConfigurationFiledValue();
      amendmentConfigFacade.loadAmendmentConfigFieldValue();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })
    it('should call loadReset action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadReset();
      amendmentConfigFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })
  })

  describe('Access Selector action', () => {
    it('should access the getAmendmentConfigValue selector action', () => {
      expect(amendmentConfigFacade.getAmendmentConfigValue()).toEqual(
        amendmentConfigFacade['globalConfiguration$']
      )
    })
    it('should access the getError selector action', () => {
      expect(amendmentConfigFacade.getError()).toEqual(
        amendmentConfigFacade['error$']
      )
    })
    it('should access the getHasUpdated selector action', () => {
      expect(amendmentConfigFacade.getHasUpdated()).toEqual(
        amendmentConfigFacade['hasUpdated$']
      )
    })
    it('should access the getIsloading selector action', () => {
      expect(amendmentConfigFacade.getIsloading()).toEqual(
        amendmentConfigFacade['isLoading$']
      )
    })
  })
})
