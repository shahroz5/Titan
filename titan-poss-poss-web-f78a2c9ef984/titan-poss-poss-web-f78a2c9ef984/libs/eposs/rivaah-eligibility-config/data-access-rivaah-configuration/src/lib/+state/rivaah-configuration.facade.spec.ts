import { RivaahConfigurationFacade } from './rivaah-configuration.facade';
import { Store} from '@ngrx/store';
import { RivaahConfigurationState } from './rivaah-configuration.state'
import { TestBed } from '@angular/core/testing';
import { initialState } from './rivaah-configuration.reducer';
import { provideMockStore } from '@ngrx/store/testing';
import { CreateRivaahEligibilityConfiguration, DeleteRivaahEligibilityConfiguration, DeleteRivaahLocations, LoadCouponConfiguration, LoadMappedProductCategory, LoadMappedProductGroupsByProductId, LoadProductCategory, LoadReset, LoadRivaahEligibilityConfiguration, LoadRivaahMappedLocationList, LoadSelectedLocations, SaveRivaahLocations, ToggleRivaahEligibilityConfigurationStatus, UpdateCouponConfiguration, UpdateProductGroupByProductId, UpdateRivaahEligibilityConfiguration, UpdateRivaahLocations } from './rivaah-configuration.actions';
import { LoadProductGroupsPayload, RivaahConfigurationResponse, RivaahEligibilityConfigRequest, RivaahLocationListPayload, SaveProductGroups, SaveRivaahLocationsPayload } from 'libs/shared/models/src/lib/configuration/rivaah-configuration/rivaah-configuration.model';

describe('RivaahConfigurationFacade', () => {
  let rivaahConfigurationFacade: RivaahConfigurationFacade;

  let store: Store<RivaahConfigurationState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), RivaahConfigurationFacade]
    });

    rivaahConfigurationFacade = TestBed.inject(RivaahConfigurationFacade);
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.returnValue({});
  });
  const rivaahEligibilityConfigRequest: RivaahEligibilityConfigRequest = {
    addProducts: [{
      productCategoryCode: 'prodCategory',
      productGroupCode: 'prodGroup',

      ruleDetails: {
        data: {
          grammage: 'grams',
          eleventhDigit: [''],
          occasion: 'Birthday',
          isActive: false
        },
        type: 'RIVAAH_CARD_ELIGIBILITY',
      },
    }],
    removeProducts: '',
    updateProducts: [{
      id: 'id',
      productCategoryCode: 'prodCategory',
      productGroupCode: 'prodGroup',

      ruleDetails: {
        data: {
          isActive: false
        },
        type: 'RIVAAH_CARD_ELIGIBILITY',
      }
    }]
  }

  const saveRivaahLocationsPayload: SaveRivaahLocationsPayload = {
    payload: {}
  }

  describe('Dispatch actions', () => {
    it('should call loadCouponConfiguration', () => {
      const payload = {
        configId: 'configId',
        ruleType: 'Config'
      }
      const action = new LoadCouponConfiguration(payload);
      rivaahConfigurationFacade.loadCouponConfiguration(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })

    it('should call updateCouponConfiguration', () => {
      const payload: RivaahConfigurationResponse = {
        ruleType: 'Config'
      }
      const action = new UpdateCouponConfiguration(payload);
      rivaahConfigurationFacade.updateCouponConfiguration(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })

    it('should call loadRivaahEligibilityConfiguration', () => {
      const payload = {
        configId: 'configId',
        ruleType: 'Config'
      }
      const action = new LoadRivaahEligibilityConfiguration(payload);
      rivaahConfigurationFacade.loadRivaahEligibilityConfiguration(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })

    it('should call createRivaahEligibilityConfiguration', () => {
      const action = new CreateRivaahEligibilityConfiguration(rivaahEligibilityConfigRequest);
      rivaahConfigurationFacade.createRivaahEligibilityConfiguration(rivaahEligibilityConfigRequest);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })

    it('should call updateRivaahEligibilityConfiguration', () => {
      const action = new UpdateRivaahEligibilityConfiguration(rivaahEligibilityConfigRequest);
      rivaahConfigurationFacade.updateRivaahEligibilityConfiguration(rivaahEligibilityConfigRequest);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })

    it('should call deleteRivaahEligibilityConfiguration', () => {
      const action = new DeleteRivaahEligibilityConfiguration(rivaahEligibilityConfigRequest);
      rivaahConfigurationFacade.deleteRivaahEligibilityConfiguration(rivaahEligibilityConfigRequest);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })

    it('should call toggleRivaahEligibilityConfigurationStatus', () => {
      const action = new ToggleRivaahEligibilityConfigurationStatus(rivaahEligibilityConfigRequest);
      rivaahConfigurationFacade.toggleRivaahEligibilityConfigurationStatus(rivaahEligibilityConfigRequest);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })

    it('should call loadReset', () => {
      const action = new LoadReset();
      rivaahConfigurationFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })

    it('should call loadMappedProductGroupsByProductId', () => {
      const payload: LoadProductGroupsPayload = {
        ruleType: 'Config'
      }
      const action = new LoadMappedProductGroupsByProductId(payload);
      rivaahConfigurationFacade.loadMappedProductGroupsByProductId(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })

    it('should call updateProductGroupsByProductId', () => {
      const payload: SaveProductGroups = {
        addProducts: [],
        removeProducts: [],
        ruleType: 'Config'
      }
      const action = new UpdateProductGroupByProductId(payload);
      rivaahConfigurationFacade.updateProductGroupByProductId(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })

    it('should call loadProductCategory', () => {
      const action = new LoadProductCategory();
      rivaahConfigurationFacade.loadProductCategory();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })

    it('should call loadMappedProductCategory', () => {
      const payload = {
        ruleId: 'ruleId',
        ruleType: 'Config'
      }
      const action = new LoadMappedProductCategory(payload);
      rivaahConfigurationFacade.loadMappedProductCategory(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })

    it('should call loadRivaahLocationList', () => {
      const payload: RivaahLocationListPayload = {}
      const action = new LoadRivaahMappedLocationList(payload);
      rivaahConfigurationFacade.loadRivaahLocationList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })

    it('should call saveRivaahLocations', () => {
      const action = new SaveRivaahLocations(saveRivaahLocationsPayload);
      rivaahConfigurationFacade.saveRivaahLocations(saveRivaahLocationsPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })

    it('should call updateRivaahLocations', () => {
      const action = new UpdateRivaahLocations(saveRivaahLocationsPayload);
      rivaahConfigurationFacade.updateRivaahLocations(saveRivaahLocationsPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })

    it('should call deleteRivaahLocations', () => {
      const action = new DeleteRivaahLocations(saveRivaahLocationsPayload);
      rivaahConfigurationFacade.deleteRivaahLocations(saveRivaahLocationsPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })

    it('should call loadSelectedLocations', () => {
      const action = new LoadSelectedLocations(saveRivaahLocationsPayload);
      rivaahConfigurationFacade.loadSelectedLocations(saveRivaahLocationsPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })
  })

  describe('Access Selector', () => {
    it('should access isLoading', () => {
      expect(rivaahConfigurationFacade.getIsloading()).toEqual(
        rivaahConfigurationFacade['isLoading$']
      )
    })
    it('should access hasUpdated', () => {
      expect(rivaahConfigurationFacade.getHasUpdated()).toEqual(
        rivaahConfigurationFacade['hasUpdated$']
      )
    })
    it('should access error', () => {
      expect(rivaahConfigurationFacade.getError()).toEqual(
        rivaahConfigurationFacade['error$']
      )
    })
    it('should access isCouponSaved', () => {
      expect(rivaahConfigurationFacade.getIsCouponSaved()).toEqual(
        rivaahConfigurationFacade['isCouponSaved$']
      )
    })
    it('should access couponDetails', () => {
      expect(rivaahConfigurationFacade.getCouponConfiguration()).toEqual(
        rivaahConfigurationFacade['couponDetails$']
      )
    })
    it('should access totalElements', () => {
      expect(rivaahConfigurationFacade.getTotalElements()).toEqual(
        rivaahConfigurationFacade['totalElements$']
      )
    })
    it('should access isRivaahEligibilityCreated', () => {
      expect(rivaahConfigurationFacade.getIsRivaahCreated()).toEqual(
        rivaahConfigurationFacade['isRivaahEligibilityCreated$']
      )
    })
    it('should access isRivaahEligibilityDeleted', () => {
      expect(rivaahConfigurationFacade.getIsRivaahDeleted()).toEqual(
        rivaahConfigurationFacade['isRivaahEligibilityDeleted$']
      )
    })
    it('should access isRivaahEligibilityUpdated', () => {
      expect(rivaahConfigurationFacade.getIsRivaahUpdated()).toEqual(
        rivaahConfigurationFacade['isRivaahEligibilityUpdated$']
      )
    })
    it('should access getIsRivaahToggled', () => {
      expect(rivaahConfigurationFacade.getIsRivaahToggled()).toEqual(
        rivaahConfigurationFacade['isRivaahEligibilityToggled$']
      )
    })
    it('should access rivaahEligibiltyRes', () => {
      expect(rivaahConfigurationFacade.getRivaahEligibilityConfiguration()).toEqual(
        rivaahConfigurationFacade['rivaahEligibiltyRes$']
      )
    })
    it('should access selectProductGroups', () => {
      expect(rivaahConfigurationFacade.getProductGroups()).toEqual(
        rivaahConfigurationFacade['selectProductGroups$']
      )
    })
    it('should access selectHasProductsUpdated', () => {
      expect(rivaahConfigurationFacade.getHasProductsUpdated()).toEqual(
        rivaahConfigurationFacade['selectHasProductsUpdated$']
      )
    })
    it('should access productCategory', () => {
      expect(rivaahConfigurationFacade.getProductCategory()).toEqual(
        rivaahConfigurationFacade['productCategory$']
      )
    })
    it('should access mappedProductCategory', () => {
      expect(rivaahConfigurationFacade.getMappedProductCategory()).toEqual(
        rivaahConfigurationFacade['mappedProductCategory$']
      )
    })
    it('should access isLocationsSaved', () => {
      expect(rivaahConfigurationFacade.getIsLocationSaved()).toEqual(
        rivaahConfigurationFacade['isLocationsSaved$']
      )
    })
    it('should access isLocationsUpdated', () => {
      expect(rivaahConfigurationFacade.getIsLocationUpdated()).toEqual(
        rivaahConfigurationFacade['isLocationsUpdated$']
      )
    })
    it('should access isLocationsDeleted', () => {
      expect(rivaahConfigurationFacade.getIsLocationDeleted()).toEqual(
        rivaahConfigurationFacade['isLocationsDeleted$']
      )
    })
    it('should access totalDiscountLocations', () => {
      expect(rivaahConfigurationFacade.getTotalRivaahLocations()).toEqual(
        rivaahConfigurationFacade['totalDiscountLocations$']
      )
    })
    it('should access discountLocationList', () => {
      expect(rivaahConfigurationFacade.getRivaahLocationDetails()).toEqual(
        rivaahConfigurationFacade['discountLocationList$']
      )
    })
    it('should access mappedLocations', () => {
      expect(rivaahConfigurationFacade.getSelectedLocations()).toEqual(
        rivaahConfigurationFacade['mappedLocations$']
      )
    })
  })
})
