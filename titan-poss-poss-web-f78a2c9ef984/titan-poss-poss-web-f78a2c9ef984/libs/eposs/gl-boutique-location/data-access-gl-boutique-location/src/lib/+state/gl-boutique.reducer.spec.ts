import * as actions from './gl-botique.action';
import { GlBoutiqueLocationList, GlBoutiqueLocationListingPayload, GlBoutiqueLocationSuccessPayload } from "@poss-web/shared/models";
import { GlBoutiqueLocationReducer, initialState } from "./gl-boutique.reducer";
import { GlBoutiqueLocationState } from './gl-boutique.state';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('GlBoutiqueLocationReducer Testing suite', () => {
  it('should return initial state', () => {
    const action: any = {};
    const state = GlBoutiqueLocationReducer(null, action);
    expect(initialState).toBe(initialState);
  })

  describe('Testing loadGlBoutiqueLocation List', () => {
    beforeEach(() => {});
    it('loadGlBoutiqueLocationList should be called', () => {
      const payload: GlBoutiqueLocationListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const action = new actions.LoadGlBoutiqueList(payload);
      const result: GlBoutiqueLocationState = GlBoutiqueLocationReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.hasSaved).toBe(false);
      expect(result.hasUpdated).toBe(false);
    })

    it('loadGlBoutiqueLocationListSuccess should return list of boutiques', () => {
      const payload: GlBoutiqueLocationSuccessPayload = {
        glBoutiqueLocationListing: [{
          costCenter: 'costCenter',
          fitCode: 'fitCode',
          glCode: 'glCode',
          pifSeriesNo: 'number',
          locationCode: 'locationCode',
          isActive: false
        }],
        totalElements: 10
      }
      const action = new actions.LoadGlBoutiqueListSuccess(payload);
      const result: GlBoutiqueLocationState = GlBoutiqueLocationReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.hasSaved).toBe(false);
      expect(result.hasUpdated).toBe(false);
    })

    it('loadGlBoutiqueLocationListFailure should return error', () => {
      const action = new actions.LoadGlBoutiqueListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: GlBoutiqueLocationState = GlBoutiqueLocationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.hasSaved).toBe(false);
      expect(result.hasUpdated).toBe(false);
    })
  })

  describe('Testing loadGlBtqLocationByLocationCode', () => {
    it('loadGlBtqLocationByLocationCode should be called', () => {
      const action = new actions.LoadGlBoutiqueListByLocationCode('CPD');
      const result: GlBoutiqueLocationState = GlBoutiqueLocationReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.hasSaved).toBe(false);
      expect(result.hasUpdated).toBe(false);
    })

    it('loadGlBtqLocationByLocationCodeSuccess should return list', () => {
      const payload: GlBoutiqueLocationList = {
        costCenter: 'costCenter',
        fitCode: 'fitCode',
        glCode: 'glCode',
        pifSeriesNo: 'number',
        locationCode: 'locationCode',
        isActive: false
      }
      const action = new actions.LoadGlBoutiqueListByLocationCodeSuccess(payload);
      const result: GlBoutiqueLocationState = GlBoutiqueLocationReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.hasSaved).toBe(false);
      expect(result.hasUpdated).toBe(false);
    })
  })

  describe('Testing SearchByLocationCodeSuccess', () => {
    it('SearchByLocationCodeSuccess should return list', () => {
      const payload: GlBoutiqueLocationList[] = [{
        costCenter: 'costCenter',
        fitCode: 'fitCode',
        glCode: 'glCode',
        pifSeriesNo: 'number',
        locationCode: 'locationCode',
        isActive: false
      }]
      const action = new actions.SearchByLocationCodeSuccess(payload);
      const result: GlBoutiqueLocationState = GlBoutiqueLocationReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.hasSaved).toBe(false);
      expect(result.hasUpdated).toBe(false);
    })
  })

  describe('Testing ResetGlBoutique', () => {
    it('ResetGlBoutique should be called', () => {
      const action = new actions.ResetGlBoutiqueDetails();
      const result: GlBoutiqueLocationState = GlBoutiqueLocationReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.hasSaved).toBe(false);
      expect(result.hasUpdated).toBe(false);
    })
  })

  describe('Testing EditGlLocationDetailsSuccess', () => {
    it('EditGlLocationDetailsSuccess should return list', () => {
      const payload: GlBoutiqueLocationList = {
        costCenter: 'costCenter',
        fitCode: 'fitCode',
        glCode: 'glCode',
        pifSeriesNo: 'number',
        locationCode: 'locationCode',
        isActive: false
      }
      const action = new actions.EditGlBoutqueLocationDetailsSuccess(payload);
      const result: GlBoutiqueLocationState = GlBoutiqueLocationReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.hasSaved).toBe(false);
      expect(result.hasUpdated).toBe(true);
    })
  })
})
