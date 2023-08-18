import {
  BaseCurrencyTypes,
  BrandSummary,
  CurrencyTypes,
  LoadTaxClassListingPayload,
  LocationMasterDetails,
  LocationMasterDropdownList,
  LocationTypes,
  MarketCodeTypes,
  OwnerTypes,
  RegionSummary,
  StateTypes,
  TaxClassDetails,
  Towns
} from '@poss-web/shared/models';
import * as actions from './location-master.actions';
import { LocationMasterState } from './location-master.state';
import {
  initialState as istate,
  LocationMasterReducer
} from './location-master.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Location Master Reducer Testing Suite', () => {
  const initialState: LocationMasterState = {
    ...istate,
    locationDetails: {
      locationCode: 'Code'
    }
  };

  const responsePayload: LocationMasterDetails = {
    locationCode: 'Code'
  };

  describe('Testing LoadLocationDetails Functionality', () => {
    it('LoadLocationDetails should be called', () => {
      const payload = 'Code';

      const action = new actions.LoadLocationDetails(payload);

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadLocationDetailsSuccess should return list', () => {
      const action = new actions.LoadLocationDetailsSuccess(responsePayload);
      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );

      expect(result.locationDetails).toBe(responsePayload);
      expect(result.isLoading).toBe(false);
    });
    it('LoadLocationDetailsFailure should return error', () => {
      const action = new actions.LoadLocationDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveLocationDetails Functionality', () => {
    it('SaveLocationDetails should be called', () => {
      const payload: LocationMasterDetails = {
        locationCode: 'Code'
      };

      const action = new actions.SaveLocationDetails(payload);

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('SaveLocationDetailsSuccess should return list', () => {
      const payload: LocationMasterDetails = {
        locationCode: 'Code'
      };

      const action = new actions.SaveLocationDetailsSuccess(payload);
      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );

      expect(result.locationDetails).toBe(payload);
      expect(result.isLoading).toBe(false);
    });
    it('SaveLocationDetailsFailure should return error', () => {
      const action = new actions.SaveLocationDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateLocationDetails Functionality', () => {
    it('UpdateLocationDetails should be called', () => {
      const payload: LocationMasterDetails = {
        locationCode: 'Code'
      };

      const action = new actions.UpdateLocationDetails(payload);

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('UpdateLocationDetailsSuccess should return list', () => {
      const payload: LocationMasterDetails = {
        locationCode: 'Code'
      };

      const action = new actions.UpdateLocationDetailsSuccess(payload);
      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );

      expect(result.locationDetails).toBe(payload);
      expect(result.isLoading).toBe(false);
    });
    it('UpdateLocationDetailsFailure should return error', () => {
      const action = new actions.UpdateLocationDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadLocationTypes Functionality', () => {
    it('LoadLocationTypes should be called', () => {
      const action = new actions.LoadLocationTypes();

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadLocationTypesSuccess should be called', () => {
      const payload: LocationTypes = {
        code: 'Code',
        value: 'Value'
      };

      const action = new actions.LoadLocationTypesSuccess(payload);

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.locationTypes).toEqual(payload);
      expect(result.error).toEqual(null);
    });
    it('UpdateLocationDetailsFailure should return error', () => {
      const action = new actions.LoadLocationTypesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadTowns Functionality', () => {
    it('LoadTowns should be called', () => {
      const payload = 'Code';
      const action = new actions.LoadTowns(payload);

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadTownsSuccess should be called', () => {
      const payload: Towns[] = [
        {
          id: '1',
          name: 'name',
          state_id: '2'
        }
      ];

      const action = new actions.LoadTownsSuccess(payload);

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.towns).toEqual(payload);
      expect(result.error).toEqual(null);
    });
    it('LoadTownsFailure should return error', () => {
      const action = new actions.LoadTownsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadStates Functionality', () => {
    it('LoadStates should be called', () => {
      const payload = 'Code';
      const action = new actions.LoadStates(payload);

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadStatesSuccess should be called', () => {
      const payload: StateTypes[] = [
        {
          id: '1',
          name: 'name'
        }
      ];

      const action = new actions.LoadStatesSuccess(payload);

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.stateTypes).toEqual(payload);
      expect(result.error).toEqual(null);
    });
    it('LoadStatesFailure should return error', () => {
      const action = new actions.LoadStatesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadOwnerInfo Functionality', () => {
    it('LoadOwnerInfo should be called', () => {
      const payload = 'Code';
      const action = new actions.LoadOwnerInfo();

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadOwnerInfoSuccess should be called', () => {
      const payload: OwnerTypes = {
        id: '1',
        name: 'name'
      };

      const action = new actions.LoadOwnerInfoSuccess(payload);

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.ownerInfo).toEqual(payload);
      expect(result.error).toEqual(null);
    });
    it('LoadStatesFailure should return error', () => {
      const action = new actions.LoadOwnerInfoFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadRegion Functionality', () => {
    it('LoadRegion should be called', () => {
      const payload = 'Code';
      const action = new actions.LoadRegion();

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadRegionSuccess should be called', () => {
      const payload: LocationMasterDropdownList[] = [
        {
          id: '1',
          name: 'name'
        }
      ];

      const action = new actions.LoadRegionSuccess(payload);

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.regions).toEqual(payload);
      expect(result.error).toEqual(null);
    });
    it('LoadRegionFailure should return error', () => {
      const action = new actions.LoadRegionFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadSubRegion Functionality', () => {
    it('LoadSubRegion should be called', () => {
      const payload = 'Code';
      const action = new actions.LoadSubRegion(payload);

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadSubRegionSuccess should be called', () => {
      const payload: RegionSummary[] = [
        {
          description: 'Desc',
          regionCode: 'code'
        }
      ];

      const action = new actions.LoadSubRegionSuccess(payload);

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.subRegions).toEqual(payload);
      expect(result.error).toEqual(null);
    });
    it('LoadSubRegionFailure should return error', () => {
      const action = new actions.LoadSubRegionFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadBrand Functionality', () => {
    it('LoadBrand should be called', () => {
      const payload = 'Code';
      const action = new actions.LoadBrand();

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadBrandSuccess should be called', () => {
      const payload: LocationMasterDropdownList[] = [
        {
          id: '1',
          name: 'name'
        }
      ];

      const action = new actions.LoadBrandSuccess(payload);

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.brands).toEqual(payload);
      expect(result.error).toEqual(null);
    });
    it('LoadBrandFailure should return error', () => {
      const action = new actions.LoadBrandFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadSubBrand Functionality', () => {
    it('LoadSubBrand should be called', () => {
      const payload = 'Code';
      const action = new actions.LoadSubBrand(payload);

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadSubBrandSuccess should be called', () => {
      const payload: BrandSummary[] = [
        {
          brandCode: 'code',
          description: 'desc'
        }
      ];

      const action = new actions.LoadSubBrandSuccess(payload);

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.subBrands).toEqual(payload);
      expect(result.error).toEqual(null);
    });
    it('LoadSubBrandFailure should return error', () => {
      const action = new actions.LoadSubBrandFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadMarketCode Functionality', () => {
    it('LoadMarketCode should be called', () => {
      const payload = 'Code';
      const action = new actions.LoadMarketCode();

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadMarketCodeSuccess should be called', () => {
      const payload: MarketCodeTypes = {
        id: '1',
        name: 'Name'
      };

      const action = new actions.LoadMarketCodeSuccess(payload);

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.marketTypes).toEqual(payload);
      expect(result.error).toEqual(null);
    });
    it('LoadMarketCodeFailure should return error', () => {
      const action = new actions.LoadMarketCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadBaseCurrency Functionality', () => {
    it('LoadBaseCurrency should be called', () => {
      const payload = 'Code';
      const action = new actions.LoadBaseCurrency();

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadBaseCurrencySuccess should be called', () => {
      const payload: BaseCurrencyTypes[] = [
        {
          id: '1',
          name: 'Name'
        }
      ];
      const action = new actions.LoadBaseCurrencySuccess(payload);

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.baseCurrencyTypes).toEqual(payload);
      expect(result.error).toEqual(null);
    });
    it('LoadBaseCurrencyFailure should return error', () => {
      const action = new actions.LoadBaseCurrencyFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadCurrency Functionality', () => {
    it('LoadCurrency should be called', () => {
      const payload = 'Code';
      const action = new actions.LoadCurrency();

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadCurrencySuccess should be called', () => {
      const payload: CurrencyTypes[] = [
        {
          id: '1',
          name: 'Name'
        }
      ];
      const action = new actions.LoadCurrencySuccess(payload);

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.currencyTypes).toEqual(payload);
      expect(result.error).toEqual(null);
    });
    it('LoadCurrencyFailure should return error', () => {
      const action = new actions.LoadCurrencyFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadLocationSize Functionality', () => {
    it('LoadLocationSize should be called', () => {
      const payload = 'Code';
      const action = new actions.LoadLocationSize();

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadLocationSizeSuccess should be called', () => {
      const payload: StateTypes[] = [
        {
          id: '1',
          name: 'Name'
        }
      ];
      const action = new actions.LoadLocationSizeSuccess(payload);

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.locationSize).toEqual(payload);
      expect(result.error).toEqual(null);
    });
    it('LoadLocationSizeFailure should return error', () => {
      const action = new actions.LoadLocationSizeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadInvoiceType Functionality', () => {
    it('LoadInvoiceType should be called', () => {
      const payload = 'Code';
      const action = new actions.LoadInvoiceType();

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadInvoiceTypeSuccess should be called', () => {
      const payload: StateTypes[] = [
        {
          id: '1',
          name: 'Name'
        }
      ];
      const action = new actions.LoadInvoiceTypeSuccess(payload);

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.invoicetype).toEqual(payload);
      expect(result.error).toEqual(null);
    });
    it('LoadInvoiceTypeFailure should return error', () => {
      const action = new actions.LoadInvoiceTypeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadRefundMode Functionality', () => {
    it('LoadRefundMode should be called', () => {
      const payload = 'Code';
      const action = new actions.LoadRefundMode();

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadRefundModeSuccess should be called', () => {
      const payload: StateTypes[] = [
        {
          id: '1',
          name: 'Name'
        }
      ];
      const action = new actions.LoadRefundModeSuccess(payload);

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.refundMode).toEqual(payload);
      expect(result.error).toEqual(null);
    });
    it('LoadRefundModeFailure should return error', () => {
      const action = new actions.LoadRefundModeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadCountryCode Functionality', () => {
    it('LoadCountryCode should be called', () => {
      const payload = 'Code';
      const action = new actions.LoadCountryCode();

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadCountryCodeSuccess should be called', () => {
      const payload: { id: string; name: string }[] = [
        {
          id: 'IND',
          name: 'India'
        }
      ];
      const action = new actions.LoadCountryCodeSuccess(payload);

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.countryCode).toEqual(payload);
      expect(result.error).toEqual(null);
    });
    it('LoadCountryCodeFailure should return error', () => {
      const action = new actions.LoadCountryCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadCFAList Functionality', () => {
    it('LoadCFAList should be called', () => {
      const payload = 'Code';
      const action = new actions.LoadCFAList();

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.error).toEqual(null);
    });
    it('LoadCFAListSuccess should be called', () => {
      const payload: { id: string; name: string }[] = [
        {
          id: 'IND',
          name: 'India'
        }
      ];
      const action = new actions.LoadCFAListSuccess(payload);

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );
      expect(result.LocationCFATypes).toEqual(payload);
      expect(result.error).toEqual(null);
    });
    it('LoadCFAListFailure should return error', () => {
      const action = new actions.LoadCFAListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: LocationMasterState = LocationMasterReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });
});
