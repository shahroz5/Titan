import { CnValidationListPayload, CnValidation } from '@poss-web/shared/models';
import { Store } from '@ngrx/store';

import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import {
  LoadCnTypeList,
  LoadCnValidationByRuleId,
  LoadCnValidationList,
  LoadNewCnValidationByRuleId,
  LoadReset,
  SaveCnValidation,
  SearchCnValidationByCnType,
  UpdateCnValidation
} from './cn-validation.actions';

import { CnValidationState } from './cn-validation.state';
import { CnValidationFacade } from './cn-validation.facade';

describe('CnValidation facade Testing Suite', () => {
  const initialState: CnValidationState = {
    cnValidationList: null,
    isLoading: null,
    error: null,
    cnValidation: null,
    hasSaved: null,
    hasUpdated: null,
    totalElements: null,
    cnTypeList: null
  };
  let cnValidationFacade: CnValidationFacade;
  let store: MockStore<CnValidationFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), CnValidationFacade]
    });
    store = TestBed.inject<any>(Store);
    cnValidationFacade = TestBed.inject<any>(CnValidationFacade);
  });

  describe('Dispatch Actions action', () => {
    const cnValidationListPayload: CnValidationListPayload = {
      pageIndex: 0,
      pageSize: 100,
      length: 0
    };
    const cnValidation: CnValidation = {
      description: 'GEP',
      ruleDetails: {
        data: {
          maxProductsPerStn: '',
          maxReqPerMonth: '',
          maxValPerStn: '',
          validRequestTime: ''
        },
        type: 'GEP'
      },
      isActive: true
    };

    it('should call LOAD_CN_VALIDATION_LIST action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadCnValidationList(cnValidationListPayload);
      cnValidationFacade.loadCnValidationList(cnValidationListPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_CN_TYPE_LIST action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadCnTypeList();
      cnValidationFacade.loadCnTypeList();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_CN_VALIDATION action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new SaveCnValidation(cnValidation);
      cnValidationFacade.saveCnValidation(cnValidation);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UPDATE_CN_VALIDATION action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new UpdateCnValidation(cnValidation);
      cnValidationFacade.updateCnValidation(cnValidation);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_CN_VALIDATION_BY_RULE_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = '1';
      const action = new LoadCnValidationByRuleId(payload, 'GEP');
      cnValidationFacade.loadCnValidationByRuleId(payload, 'GEP');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SEARCH_CN_VALIDATION_BY_CN_TYPE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = 'GEP';
      const action = new SearchCnValidationByCnType(payload);
      cnValidationFacade.searchCnType(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_RESET action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadReset();
      cnValidationFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  it('should call LOAD_NEW_CN_VALIDATION_BY_RULE_ID action', () => {
    spyOn(store, 'dispatch').and.returnValue({});
    const action = new LoadNewCnValidationByRuleId();

    cnValidationFacade.loadNewCnValidationByRuleId();
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  describe('Access Selector action', () => {
    it('should access the getCnValidationList selector action', () => {
      expect(cnValidationFacade.getCnValidationList()).toEqual(
        cnValidationFacade['cnValidationList$']
      );
    });

    it('should access the getCnValidation selector action', () => {
      expect(cnValidationFacade.getCnValidation()).toEqual(
        cnValidationFacade['cnValidation$']
      );
    });

    it('should access the getHasSaved selector action', () => {
      expect(cnValidationFacade.getHasSaved()).toEqual(
        cnValidationFacade['hasSaved$']
      );
    });

    it('should access the getHasUpdated selector action', () => {
      expect(cnValidationFacade.getHasUpdated()).toEqual(
        cnValidationFacade['hasUpdated$']
      );
    });

    it('should access the getIsloading selector action', () => {
      expect(cnValidationFacade.getIsloading()).toEqual(
        cnValidationFacade['isLoading$']
      );
    });

    it('should access the getError selector action', () => {
      expect(cnValidationFacade.getError()).toEqual(
        cnValidationFacade['error$']
      );
    });

    it('should access the getTotalElement selector action', () => {
      expect(cnValidationFacade.getTotalElement()).toEqual(
        cnValidationFacade['totalElements$']
      );
    });

    it('should access the getCnTypeList selector action', () => {
      expect(cnValidationFacade.getCnTypeList()).toEqual(
        cnValidationFacade['cnTypeList$']
      );
    });
  });
});
