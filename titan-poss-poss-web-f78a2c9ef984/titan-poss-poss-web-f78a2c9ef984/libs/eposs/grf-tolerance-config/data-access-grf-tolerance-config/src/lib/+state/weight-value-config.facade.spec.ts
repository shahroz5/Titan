import {
  LoadWeightValueConfigListingPayload,
  BasedWeightValueConfig,
  DataWeightValueConfig,
  RuleDetailsWeightValueConfig,
  WeightValueConfigDetails
} from '@poss-web/shared/models';
import { Store } from '@ngrx/store';

import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { WeightValueConfigFacade } from './weight-value-config.facade';

import { WeightValueConfigState } from './weight-value-config.state';
import {
  LoadWeightValueConfigListing,
  SearchWeightValueConfigListing,
  LoadWeightValueConfigDetails,
  SaveWeightValueConfigDetails,
  EditWeightValueConfigDetails,
  LoadReset
} from './weight-value-config.actions';

describe(' WeightValueConfigFacade Testing Suite', () => {
  const initialState: WeightValueConfigState = {
    weightValueConfigListing: null,
    weightValueConfigDetails: null,
    weightValueConfigDetailsSaved: null,
    weightValueConfigDetailsEdited: null,
    totalWeightValueConfig: 0,
    error: null,
    isLoading: null
  };

  let weightValueConfigFacade: WeightValueConfigFacade;
  let store: MockStore<WeightValueConfigFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), WeightValueConfigFacade]
    });
    store = TestBed.inject<any>(Store);
    weightValueConfigFacade = TestBed.inject<any>(WeightValueConfigFacade);
  });

  describe('Dispatch Actions action', () => {
    it('should call LOAD_WEIGHT_VALUE_CONIG_LISTING action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: LoadWeightValueConfigListingPayload = {
        pageIndex: 1,
        pageSize: 10
      };

      const action = new LoadWeightValueConfigListing(payload);
      weightValueConfigFacade.loadWeightValueConfigListing(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SEARCH_WEIGHT_VALUE_CONIG_LISTING action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = 'test';
      const action = new SearchWeightValueConfigListing(payload);
      weightValueConfigFacade.searchWeightValueConfigListing(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_WEIGHT_VALUE_CONIG_DETAILS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = 'test';
      const action = new LoadWeightValueConfigDetails(payload);
      weightValueConfigFacade.loadWeightValueConfigDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_WEIGHT_VALUE_CONIG_DETAILS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const weightBased: BasedWeightValueConfig[] = [
        {
          rowId: '1',
          fromRange: '100',
          toRange: '200',
          toleranceAllowed: '1',
          tolerancePercent: '1',
          toleranceValue: '1'
        }
      ];
      const valueBased: BasedWeightValueConfig[] = [
        {
          rowId: '1',
          fromRange: '100',
          toRange: '200',
          toleranceAllowed: '1',
          tolerancePercent: '1',
          toleranceValue: '1'
        }
      ];
      const data: DataWeightValueConfig = {
        weightBased,
        valueBased
      };

      const ruleDetailsWeightValueConfig: RuleDetailsWeightValueConfig = {
        type: 'GRF_CONFIGURATION',
        data
      };

      const payload: WeightValueConfigDetails = {
        ruleDetails: ruleDetailsWeightValueConfig,
        description: 'description',
        ruleId: 1,
        ruleType: 'GRF_CONFIGURATION',
        isActive: true
      };

      const action = new SaveWeightValueConfigDetails(payload);
      weightValueConfigFacade.saveWeightValueConfigDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call EDIT_WEIGHT_VALUE_CONIG_DETAILS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const weightBased: BasedWeightValueConfig[] = [
        {
          rowId: '1',
          fromRange: '100',
          toRange: '200',
          toleranceAllowed: '1',
          tolerancePercent: '1',
          toleranceValue: '1'
        }
      ];
      const valueBased: BasedWeightValueConfig[] = [
        {
          rowId: '1',
          fromRange: '100',
          toRange: '200',
          toleranceAllowed: '1',
          tolerancePercent: '1',
          toleranceValue: '1'
        }
      ];
      const data: DataWeightValueConfig = {
        weightBased,
        valueBased
      };

      const ruleDetailsWeightValueConfig: RuleDetailsWeightValueConfig = {
        type: 'GRF_CONFIGURATION',
        data
      };

      const payload: WeightValueConfigDetails = {
        ruleDetails: ruleDetailsWeightValueConfig,
        description: 'description',
        ruleId: 1,
        ruleType: 'GRF_CONFIGURATION',
        isActive: true
      };

      const action = new EditWeightValueConfigDetails(payload);
      weightValueConfigFacade.editWeightValueConfigDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_RESET action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadReset();
      weightValueConfigFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    describe('Access Selector action', () => {
      it('should access the getWeightValueConfigListing selector action', () => {
        expect(weightValueConfigFacade.getWeightValueConfigListing()).toEqual(
          weightValueConfigFacade['weightValueConfigListing$']
        );
      });

      it('should access the getWeightValueConfigDetails selector action', () => {
        expect(weightValueConfigFacade.getWeightValueConfigDetails()).toEqual(
          weightValueConfigFacade['weightValueConfigDetails$']
        );
      });

      it('should access the getWeightValueConfigDetailsSaved selector action', () => {
        expect(
          weightValueConfigFacade.getWeightValueConfigDetailsSaved()
        ).toEqual(weightValueConfigFacade['weightValueConfigDetailsSaved$']);
      });

      it('should access the getWeightValueConfigDetailsEdited selector action', () => {
        expect(
          weightValueConfigFacade.getWeightValueConfigDetailsEdited()
        ).toEqual(weightValueConfigFacade['weightValueConfigDetailsEdited$']);
      });

      it('should access the getWeightValueConfigTotal selector action', () => {
        expect(weightValueConfigFacade.getWeightValueConfigTotal()).toEqual(
          weightValueConfigFacade['weightValueConfigTotal$']
        );
      });

      it('should access the getIsLoading selector action', () => {
        expect(weightValueConfigFacade.getIsLoading()).toEqual(
          weightValueConfigFacade['isLoading$']
        );
      });

      it('should access the getError selector action', () => {
        expect(weightValueConfigFacade.getError()).toEqual(
          weightValueConfigFacade['hasError$']
        );
      });
    });
  });
});
