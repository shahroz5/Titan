import { CustomErrors, MappedLocDetails, ProductCategory, ProductGroupMappingOption, RivaahConfigurationResponse, RivaahEligibilityConfig, RivaahLocationList } from "@poss-web/shared/models"
import { initialState } from "./rivaah-configuration.reducer"
import { RivaahConfigurationState } from "./rivaah-configuration.state"
import * as selectors from './rivaah-configuration.selector';
import * as moment from "moment";

describe('RivaahConfigurationState selector Testing suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  }

  describe('Testing RivaahConfigurationState related Selectors', () => {
    it('selectIsloading should return isLoading', () => {
      const state: RivaahConfigurationState = {
        ...initialState,
        isLoading: false
      }
      expect(
        selectors.RivaahConfigurationSelectors.selectIsloading.projector(
          state
        )
      ).toEqual(false)
    })
  })

  it('selectError should return error', () => {
    const state: RivaahConfigurationState = {
      ...initialState,
      error: error
    }
    expect(
      selectors.RivaahConfigurationSelectors.selectError.projector(
        state
      )
    ).toEqual(error)
  })

  it('selectHasUpdated should return hasUpdated', () => {
    const state: RivaahConfigurationState = {
      ...initialState,
      hasUpdated: false
    }
    expect(
      selectors.RivaahConfigurationSelectors.selectHasUpdated.projector(
        state
      )
    ).toEqual(false)
  })

  it('selectIsCouponSaved should return isCouponSaved', () => {
    const state: RivaahConfigurationState = {
      ...initialState,
      isCouponSaved: false
    }
    expect(
      selectors.RivaahConfigurationSelectors.selectIsCouponSaved.projector(
        state
      )
    ).toEqual(false)
  })

  it('selectCouponConfig  should return couponConfig', () => {
    const payload: RivaahConfigurationResponse = {
      ruleType: 'Config'
    }
    const state: RivaahConfigurationState = {
      ...initialState,
      couponConfig: payload
    }
    expect(
      selectors.RivaahConfigurationSelectors.selectCouponConfig.projector(
        state
      )
    ).toEqual(payload)
  })

  it('selectTotalElements should return couponConfig', () => {
    const state: RivaahConfigurationState = {
      ...initialState,
      totalElements: 10
    }
    expect(
      selectors.RivaahConfigurationSelectors.selectTotalElements.projector(
        state
      )
    ).toEqual(10)
  })

  it('selectisRivaElibilityCreated should return isRivaElibilityCreated', () => {
    const state: RivaahConfigurationState = {
      ...initialState,
      isRivaElibilityCreated: false
    }
    expect(
      selectors.RivaahConfigurationSelectors.selectisRivaElibilityCreated.projector(
        state
      )
    ).toEqual(false)
  })

  it('selectisRivaElibilityUpdated should return isRivaElibilityCreated', () => {
    const state: RivaahConfigurationState = {
      ...initialState,
      isRivaElibilityUpdated: false
    }
    expect(
      selectors.RivaahConfigurationSelectors.selectisRivaElibilityUpdated.projector(
        state
      )
    ).toEqual(false)
  })

  it('selectisRivaElibilityDeleted should return isRivaElibilityCreated', () => {
    const state: RivaahConfigurationState = {
      ...initialState,
      isRivaElibilityDeleted: false
    }
    expect(
      selectors.RivaahConfigurationSelectors.selectisRivaElibilityDeleted.projector(
        state
      )
    ).toEqual(false)
  })

  it('selectisRivaElibilityToggled should return isRivaElibilityCreated', () => {
    const state: RivaahConfigurationState = {
      ...initialState,
      isRivaElibilityToggled: false
    }
    expect(
      selectors.RivaahConfigurationSelectors.selectisRivaElibilityToggled.projector(
        state
      )
    ).toEqual(false)
  })

  it('selectRivaahEligibilityConfig should return rivaahEligibilityRes', () => {
    const payload: RivaahEligibilityConfig[] = [{}]
    const state: RivaahConfigurationState = {
      ...initialState,
      rivaahEligibilityRes: payload
    }
    expect(
      selectors.RivaahConfigurationSelectors.selectRivaahEligibilityConfig.projector(
        state
      )
    ).toEqual(payload)
  })

  it('selectProductGroups should return rivaahEligibilityRes', () => {
    const payload: ProductGroupMappingOption[] = [{
      id: 'id'
    }]
    const state: RivaahConfigurationState = {
      ...initialState,
      productGroups: payload
    }
    expect(
      selectors.RivaahConfigurationSelectors.selectProductGroups.projector(
        state
      )
    ).toEqual(payload)
  })

  it('selectProductCategory should return productCategory', () => {
    const payload: ProductCategory[] = [{
      description: 'Description',
      productCategoryCode: 'prodGroup'
    }]
    const state: RivaahConfigurationState = {
      ...initialState,
      productCategory: payload
    }
    expect(
      selectors.RivaahConfigurationSelectors.selectProductCategory.projector(
        state
      )
    ).toEqual(payload)
  })

  it('selectMappedProductCategory should return mappedProductCategory', () => {
    const payload: ProductCategory[] = [{
      description: 'Description',
      productCategoryCode: 'prodGroup'
    }]
    const state: RivaahConfigurationState = {
      ...initialState,
      mappedProductCategory: payload
    }
    expect(
      selectors.RivaahConfigurationSelectors.selectMappedProductCategory.projector(
        state
      )
    ).toEqual(payload)
  })

  it('selectSavedLocations should return savedLocations', () => {
    const state: RivaahConfigurationState = {
      ...initialState,
      savedLocations: false
    }
    expect(
      selectors.RivaahConfigurationSelectors.selectSavedLocations.projector(
        state
      )
    ).toEqual(false)
  })

  it('selectUpdatedLocations should return updatedLocations', () => {
    const state: RivaahConfigurationState = {
      ...initialState,
      updatedLocations: false
    }
    expect(
      selectors.RivaahConfigurationSelectors.selectUpdatedLocations.projector(
        state
      )
    ).toEqual(false)
  })

  it('selectDeletedLocations should return deletedLocations', () => {
    const state: RivaahConfigurationState = {
      ...initialState,
      deletedLocations: false
    }
    expect(
      selectors.RivaahConfigurationSelectors.selectDeletedLocations.projector(
        state
      )
    ).toEqual(false)
  })

  it('selectLocationCount should return locationCount', () => {
    const state: RivaahConfigurationState = {
      ...initialState,
      locationCount: 6
    }
    expect(
      selectors.RivaahConfigurationSelectors.selectLocationCount.projector(
        state
      )
    ).toEqual(6)
  })

  it('selectRivaahLocations should return rivaahLocations', () => {
    const payload: RivaahLocationList[] = [{
      description: 'Description',
      ruleId: 'ruleId',
      locationCode: 'locationCode',
      offerEndDate: moment(1672425000000),
      offerStartDate: moment(1655145000000),
      subBrandCode: 'subBrand'
    }]
    const state: RivaahConfigurationState = {
      ...initialState,
      rivaahLocations: payload
    }
    expect(
      selectors.RivaahConfigurationSelectors.selectRivaahLocations.projector(
        state
      )
    ).toEqual(payload)
  })

  it('selectMappedLocations should return selectedLocations', () => {
    const payload: MappedLocDetails[] = [{
      ruleId: 'ruleId',
      id: 'id',
      description: 'Description'
    }]
    const state: RivaahConfigurationState = {
      ...initialState,
      selectedLocations: payload
    }
    expect(
      selectors.RivaahConfigurationSelectors.selectMappedLocations.projector(
        state
      )
    ).toEqual(payload)
  })

  it('selectHasProductsUpdated should return hasProductsUpdated', () => {
    const state: RivaahConfigurationState = {
      ...initialState,
      hasProductsUpdated: false
    }
    expect(
      selectors.RivaahConfigurationSelectors.selectHasProductsUpdated.projector(
        state
      )
    ).toEqual(false)
  })
})
