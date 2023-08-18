import { CustomErrors, GlBoutiqueLocationList } from "@poss-web/shared/models";
import { GlBoutiqueLocationState } from './gl-boutique.state';
import { initialState } from './gl-boutique.reducer';
import * as selectors from './gl-boutique.selectors';
describe('OrderPaymentConfigState selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };

  describe('Testing OrderPaymentConfigState related Selectors', () => {
    it('selectOrderPaymentConfigList should return the list', () => {
      const glBoutiqueLocationList: GlBoutiqueLocationList[] = [{
        costCenter: 'costCenter',
        fitCode: 'fitCode',
        glCode: 'glCode',
        pifSeriesNo: 'num',
        locationCode: 'locationCode',
        isActive: false
      }]
      const state: GlBoutiqueLocationState = {
        ...initialState,
        glBoutiqueLocationList: glBoutiqueLocationList
      }
      expect(
        selectors.GlBoutiqueLocationSelectors.selectGlBoutiqueLocationListing.projector(
          state
        )
      ).toEqual(glBoutiqueLocationList);
    })
    it('selectTotalGlBoutiqueLocationCount should return the list', () => {
      const glBoutiqueLocationCount: number = 6;

      const state: GlBoutiqueLocationState = {
        ...initialState,
        totalGlBoutiqueLocation: glBoutiqueLocationCount
      }
      expect(
        selectors.GlBoutiqueLocationSelectors.selectTotalGlBoutiqueLocationCount.projector(
          state
        )
      ).toEqual(glBoutiqueLocationCount);
    })
    it('selectGlBoutiqueLocationByLocationCode should return the list', () => {
      const glBoutiqueLocationByCode: GlBoutiqueLocationList = {
        costCenter: 'costCenter',
        fitCode: 'fitCode',
        glCode: 'glCode',
        pifSeriesNo: 'num',
        locationCode: 'locationCode',
        isActive: false
      }
      const state: GlBoutiqueLocationState = {
        ...initialState,
        glBoutiqueLocationDetails: glBoutiqueLocationByCode
      }
      expect(
        selectors.GlBoutiqueLocationSelectors.selectGlBoutiqueLocationByLocationCode.projector(
          state
        )
      ).toEqual(glBoutiqueLocationByCode);
    })
    it('selectIsLoading should return the list', () => {
      const selectIsLoading: boolean = false;
        const state: GlBoutiqueLocationState = {
        ...initialState,
        isLoading: selectIsLoading
      }
      expect(
        selectors.GlBoutiqueLocationSelectors.selectIsLoading.projector(
          state
        )
      ).toEqual(selectIsLoading);
    })
    it('selectIsSaved should return the list', () => {
      const selectIsSaved: boolean = false;
        const state: GlBoutiqueLocationState = {
        ...initialState,
        hasSaved: selectIsSaved
      }
      expect(
        selectors.GlBoutiqueLocationSelectors.selectIsSaved.projector(
          state
        )
      ).toEqual(selectIsSaved);
    })
    it('selectIsEdited should return the list', () => {
      const selectIsEdited: boolean = false;
        const state: GlBoutiqueLocationState = {
        ...initialState,
        hasUpdated: selectIsEdited
      }
      expect(
        selectors.GlBoutiqueLocationSelectors.selectIsEdited.projector(
          state
        )
      ).toEqual(selectIsEdited);
    })
  })
  it('selectIsEdited should return the list', () => {
    const selectError: boolean = false;
      const state: GlBoutiqueLocationState = {
      ...initialState,
      error: error
    }
    expect(
      selectors.GlBoutiqueLocationSelectors.selectError.projector(
        state
      )
    ).toEqual(error);
  })
  it('selectSaveGlBoutiqueLocationResponse should return the list', () => {
    const selectSaveGlBoutiqueLocationResponse: GlBoutiqueLocationList = {
      costCenter: 'costCenter',
        fitCode: 'fitCode',
        glCode: 'glCode',
        pifSeriesNo: 'num',
        locationCode: 'locationCode',
        isActive: false
    };
      const state: GlBoutiqueLocationState = {
      ...initialState,
      saveGlBoutiqueLocation: selectSaveGlBoutiqueLocationResponse
    }
    expect(
      selectors.GlBoutiqueLocationSelectors.selectSaveGlBoutiqueLocationResponse.projector(
        state
      )
    ).toEqual(selectSaveGlBoutiqueLocationResponse);
  })
  it('selectEditGlBoutiqueLocationResponse should return the list', () => {
    const selectEditGlBoutiqueLocationResponse: GlBoutiqueLocationList = {
      costCenter: 'costCenter',
      fitCode: 'fitCode',
      glCode: 'glCode',
      pifSeriesNo: 'num',
      locationCode: 'locationCode',
      isActive: false
    };
      const state: GlBoutiqueLocationState = {
      ...initialState,
      editGlBoutiqueLocation: selectEditGlBoutiqueLocationResponse
    }
    expect(
      selectors.GlBoutiqueLocationSelectors.selectEditGlBoutiqueLocationResponse.projector(
        state
      )
    ).toEqual(selectEditGlBoutiqueLocationResponse);
  })
})
