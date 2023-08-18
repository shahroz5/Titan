import {
  BaseCurrencyTypes,
  BrandSummary,
  CopyDetailsPayload,
  CurrencyTypes,
  CustomErrors,
  LoadTaxClassListingSuccessPayload,
  LocationListingPage,
  LocationListingPayload,
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

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CopyDetails,
  CopyDetailsFailure,
  CopyDetailsSuccess,
  LoadBaseCurrency,
  LoadBaseCurrencyFailure,
  LoadBaseCurrencySuccess,
  LoadBrand,
  LoadBrandFailure,
  LoadBrandSuccess,
  LoadCFAList,
  LoadCFAListFailure,
  LoadCFAListSuccess,
  LoadCountryCode,
  LoadCountryCodeFailure,
  LoadCountryCodeSuccess,
  LoadCurrency,
  LoadCurrencyFailure,
  LoadCurrencySuccess,
  LoadInvoiceType,
  LoadInvoiceTypeFailure,
  LoadInvoiceTypeSuccess,
  LoadLocationDetails,
  LoadLocationDetailsFailure,
  LoadLocationDetailsSuccess,
  LoadLocationListing,
  LoadLocationListingFailure,
  LoadLocationListingSuccess,
  LoadLocationSize,
  LoadLocationSizeFailure,
  LoadLocationSizeSuccess,
  LoadLocationTypes,
  LoadLocationTypesFailure,
  LoadLocationTypesSuccess,
  LoadMarketCode,
  LoadMarketCodeFailure,
  LoadMarketCodeSuccess,
  LoadOwnerInfo,
  LoadOwnerInfoFailure,
  LoadOwnerInfoSuccess,
  LoadRefundMode,
  LoadRefundModeFailure,
  LoadRefundModeSuccess,
  LoadRegion,
  LoadRegionFailure,
  LoadRegionSuccess,
  LoadStates,
  LoadStatesFailure,
  LoadStatesSuccess,
  LoadSubBrand,
  LoadSubBrandFailure,
  LoadSubBrandSuccess,
  LoadSubRegion,
  LoadSubRegionFailure,
  LoadSubRegionSuccess,
  LoadTowns,
  LoadTownsFailure,
  LoadTownsSuccess,
  LocationMasterActionTypes,
  SaveLocationDetails,
  SaveLocationDetailsFailure,
  SaveLocationDetailsSuccess,
  SearchLocationByLocationCode,
  SearchLocationByLocationCodeFailure,
  SearchLocationByLocationCodeSuccess,
  UpdateLocationDetails,
  UpdateLocationDetailsFailure,
  UpdateLocationDetailsSuccess
} from './location-master.actions';

describe('Tax Class Action Testing Suite', () => {
  describe('LoadLocationListing Action Test Cases', () => {
    it('should check correct type is used for LoadLocationListing action', () => {
      const payload: LocationListingPage = {
        pageIndex: 0,
        pageSize: 10
      };
      const action = new LoadLocationListing(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_LOCATION_LISTING,
        payload
      });
    });

    it('should check correct type is used for LoadLocationListingSuccess action', () => {
      const payload: LocationListingPayload = {
        results: [],
        pageNumber: 1,
        pageSize: 1,
        totalPages: 1,
        totalElements: 0
      };

      const action = new LoadLocationListingSuccess(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_LOCATION_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadLocationListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadLocationListingFailure(payload);

      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_LOCATION_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('SearchLocationByLocationCode Action Test Cases', () => {
    it('should check correct type is used for SearchLocationByLocationCode action', () => {
      const payload = '';

      const action = new SearchLocationByLocationCode(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.SEARCH_LOCATION_BY_LOCATIONCODE,
        payload
      });
    });

    it('should check correct type is used for SearchLocationByLocationCodeSuccess action', () => {
      const payload: LocationListingPayload = {
        results: [],
        pageNumber: 1,
        pageSize: 1,
        totalPages: 1,
        totalElements: 0
      };

      const action = new SearchLocationByLocationCodeSuccess(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.SEARCH_LOCATION_BY_LOCATIONCODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchLocationByLocationCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchLocationByLocationCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.SEARCH_LOCATION_BY_LOCATIONCODE_FAILURE,
        payload
      });
    });
  });

  describe('CopyDetails Action Test Cases', () => {
    it('should check correct type is used for CopyDetails action', () => {
      const payload: CopyDetailsPayload = {
        newLocationCode: 'ABC',
        oldLocationCode: 'XYZ'
      };

      const action = new CopyDetails(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.COPY_DETAILS,
        payload
      });
    });

    it('should check correct type is used for CopyDetailsSuccess action', () => {
      const action = new CopyDetailsSuccess();
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.COPY_DETAILS_SUCCESS
      });
    });
    it('should check correct type is used for CopyDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CopyDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.COPY_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadLocationDetails Action Test Cases', () => {
    it('should check correct type is used for LoadLocationDetails action', () => {
      const payload = 'Code';

      const action = new LoadLocationDetails(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_LOCATION_DETAILS,
        payload
      });
    });

    it('should check correct type is used for LoadLocationDetailsSuccess action', () => {
      const payload: LocationMasterDetails = {
        locationCode: 'Code'
      };

      const action = new LoadLocationDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_LOCATION_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadLocationDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadLocationDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_LOCATION_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('SaveLocationDetails Action Test Cases', () => {
    it('should check correct type is used for SaveLocationDetails action', () => {
      const payload: LocationMasterDetails = {
        locationCode: 'Code'
      };

      const action = new SaveLocationDetails(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.SAVE_LOCATION_DETAILS,
        payload
      });
    });

    it('should check correct type is used for SaveLocationDetailsSuccess action', () => {
      const payload: LocationMasterDetails = {
        locationCode: 'Code'
      };

      const action = new SaveLocationDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.SAVE_LOCATION_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SaveLocationDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveLocationDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.SAVE_LOCATION_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('UpdateLocationDetails Action Test Cases', () => {
    it('should check correct type is used for UpdateLocationDetails action', () => {
      const payload: LocationMasterDetails = {
        locationCode: 'Code'
      };

      const action = new UpdateLocationDetails(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.UPDATE_LOCATION_DETAILS,
        payload
      });
    });

    it('should check correct type is used for UpdateLocationDetailsSuccess action', () => {
      const payload: LocationMasterDetails = {
        locationCode: 'Code'
      };

      const action = new UpdateLocationDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.UPDATE_LOCATION_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for UpdateLocationDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateLocationDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.UPDATE_LOCATION_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadLocationTypes Action Test Cases', () => {
    it('should check correct type is used for LoadLocationTypes action', () => {
      const action = new LoadLocationTypes();
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_LOCATION_TYPES
      });
    });

    it('should check correct type is used for LoadLocationTypesSuccess action', () => {
      const payload: LocationTypes = {
        code: 'Code',
        value: 'Value'
      };

      const action = new LoadLocationTypesSuccess(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_LOCATION_TYPES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadLocationTypesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadLocationTypesFailure(payload);

      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_LOCAITON_TYPES_FAILURE,
        payload
      });
    });
  });

  describe('LoadTowns Action Test Cases', () => {
    it('should check correct type is used for LoadTowns action', () => {
      const payload = 'Code';
      const action = new LoadTowns(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_TOWNS,
        payload
      });
    });

    it('should check correct type is used for LoadTownsSuccess action', () => {
      const payload: Towns[] = [
        {
          id: '1',
          name: 'name',
          state_id: '2'
        }
      ];

      const action = new LoadTownsSuccess(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_TOWNS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadTownsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTownsFailure(payload);

      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_TOWNS_FAILURE,
        payload
      });
    });
  });

  describe('LoadStates Action Test Cases', () => {
    it('should check correct type is used for LoadStates action', () => {
      const payload = 'Code';
      const action = new LoadStates(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_STATES,
        payload
      });
    });

    it('should check correct type is used for LoadStatesSuccess action', () => {
      const payload: StateTypes[] = [
        {
          id: '1',
          name: 'name'
        }
      ];

      const action = new LoadStatesSuccess(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_STATES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadStatesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadStatesFailure(payload);

      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_STATES_FAILURE,
        payload
      });
    });
  });

  describe('LoadStates Action Test Cases', () => {
    it('should check correct type is used for LoadStates action', () => {
      const action = new LoadOwnerInfo();
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_OWNER_INFO
      });
    });

    it('should check correct type is used for LoadOwnerInfoSuccess action', () => {
      const payload: OwnerTypes = {
        id: '1',
        name: 'name'
      };

      const action = new LoadOwnerInfoSuccess(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_OWNER_INFO_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadOwnerInfoFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadOwnerInfoFailure(payload);

      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_OWNER_INFO_FAILURE,
        payload
      });
    });
  });

  describe('LoadRegion Action Test Cases', () => {
    it('should check correct type is used for LoadRegion action', () => {
      const action = new LoadRegion();
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_REGION
      });
    });

    it('should check correct type is used for LoadRegionSuccess action', () => {
      const payload: LocationMasterDropdownList[] = [
        {
          id: '1',
          name: 'name'
        }
      ];

      const action = new LoadRegionSuccess(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_REGION_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadRegionFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRegionFailure(payload);

      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_REGION_FAILURE,
        payload
      });
    });
  });

  describe('LoadSubRegion Action Test Cases', () => {
    it('should check correct type is used for LoadSubRegion action', () => {
      const payload = '';
      const action = new LoadSubRegion(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_SUB_REGION_DETAILS,
        payload
      });
    });

    it('should check correct type is used for LoadSubRegionSuccess action', () => {
      const payload: RegionSummary[] = [
        {
          description: 'Desc',
          regionCode: 'code'
        }
      ];

      const action = new LoadSubRegionSuccess(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_SUB_REGION_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadSubRegionFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSubRegionFailure(payload);

      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_SUB_REGION_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadBrand Action Test Cases', () => {
    it('should check correct type is used for LoadBrand action', () => {
      const action = new LoadBrand();
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_BRAND
      });
    });

    it('should check correct type is used for LoadBrandSuccess action', () => {
      const payload: LocationMasterDropdownList[] = [
        {
          id: '1',
          name: 'name'
        }
      ];

      const action = new LoadBrandSuccess(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_BRAND_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadBrandFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBrandFailure(payload);

      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_BRAND_FAILURE,
        payload
      });
    });
  });

  describe('LoadSubBrand Action Test Cases', () => {
    it('should check correct type is used for LoadSubBrand action', () => {
      const payload = '';
      const action = new LoadSubBrand(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_SUB_BRAND_DETAILS,
        payload
      });
    });

    it('should check correct type is used for LoadBrandSuccess action', () => {
      const payload: BrandSummary[] = [
        {
          brandCode: 'code',
          description: 'desc'
        }
      ];

      const action = new LoadSubBrandSuccess(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_SUB_BRAND_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadSubBrandFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSubBrandFailure(payload);

      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_SUB_BRAND_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadMarketCode Action Test Cases', () => {
    it('should check correct type is used for LoadMarketCode action', () => {
      const action = new LoadMarketCode();
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_MARKET_CODE
      });
    });

    it('should check correct type is used for LoadMarketCodeSuccess action', () => {
      const payload: MarketCodeTypes = {
        id: '1',
        name: 'Name'
      };
      const action = new LoadMarketCodeSuccess(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_MARKET_CODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadMarketCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadMarketCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_MARKET_CODE_FAILURE,
        payload
      });
    });
  });

  describe('LoadBaseCurrency Action Test Cases', () => {
    it('should check correct type is used for LoadBaseCurrency action', () => {
      const action = new LoadBaseCurrency();
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_BASE_CURRENCY
      });
    });

    it('should check correct type is used for LoadBaseCurrencySuccess action', () => {
      const payload: BaseCurrencyTypes[] = [
        {
          id: '1',
          name: 'Name'
        }
      ];
      const action = new LoadBaseCurrencySuccess(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_BASE_CURRENCY_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadBaseCurrencyFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBaseCurrencyFailure(payload);

      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_BASE_CURRENCY_FAILURE,
        payload
      });
    });
  });

  describe('LoadCurrency Action Test Cases', () => {
    it('should check correct type is used for LoadCurrency action', () => {
      const action = new LoadCurrency();
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_CURRENCY
      });
    });

    it('should check correct type is used for LoadCurrencySuccess action', () => {
      const payload: CurrencyTypes[] = [
        {
          id: '1',
          name: 'Name'
        }
      ];
      const action = new LoadCurrencySuccess(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_CURRENCY_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadCurrencyFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCurrencyFailure(payload);

      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_CURRENCY_FAILURE,
        payload
      });
    });
  });

  describe('LoadLocationSize Action Test Cases', () => {
    it('should check correct type is used for LoadLocationSize action', () => {
      const action = new LoadLocationSize();
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_LOCATION_SIZE
      });
    });

    it('should check correct type is used for LoadLocationSizeSuccess action', () => {
      const payload: StateTypes[] = [
        {
          id: '1',
          name: 'Name'
        }
      ];
      const action = new LoadLocationSizeSuccess(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_LOCATION_SIZE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadLocationSizeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadLocationSizeFailure(payload);

      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_LOCATION_SIZE_FAILURE,
        payload
      });
    });
  });

  describe('LoadInvoiceType Action Test Cases', () => {
    it('should check correct type is used for LoadInvoiceType action', () => {
      const action = new LoadInvoiceType();
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_INVOICE_TYPE
      });
    });

    it('should check correct type is used for LoadInvoiceTypeSuccess action', () => {
      const payload: StateTypes[] = [
        {
          id: '1',
          name: 'Name'
        }
      ];
      const action = new LoadInvoiceTypeSuccess(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_INVOICE_TYPE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadInvoiceTypeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadInvoiceTypeFailure(payload);

      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_INVOICE_TYPE_FAILURE,
        payload
      });
    });
  });

  describe('LoadRefundMode Action Test Cases', () => {
    it('should check correct type is used for LoadRefundMode action', () => {
      const action = new LoadRefundMode();
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_REFUND_MODE
      });
    });

    it('should check correct type is used for LoadRefundModeSuccess action', () => {
      const payload: StateTypes[] = [
        {
          id: '1',
          name: 'Name'
        }
      ];
      const action = new LoadRefundModeSuccess(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_REFUND_MODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadRefundModeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRefundModeFailure(payload);

      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_REFUND_MODE_FAILURE,
        payload
      });
    });
  });

  describe('LoadCountryCode Action Test Cases', () => {
    it('should check correct type is used for LoadCountryCode action', () => {
      const action = new LoadCountryCode();
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_COUNTRY_CODE
      });
    });

    it('should check correct type is used for LoadCountryCodeSuccess action', () => {
      const payload: { id: string; name: string }[] = [
        {
          id: 'IND',
          name: 'India'
        }
      ];
      const action = new LoadCountryCodeSuccess(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_COUNTRY_CODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadCountryCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCountryCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_COUNTRY_CODE_FAILURE,
        payload
      });
    });
  });

  describe('LoadCFAList Action Test Cases', () => {
    it('should check correct type is used for LoadCFAList action', () => {
      const action = new LoadCFAList();
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_CFA_LIST
      });
    });

    it('should check correct type is used for LoadCFAListSuccess action', () => {
      const payload: { id: string; name: string }[] = [
        {
          id: 'IND',
          name: 'India'
        }
      ];
      const action = new LoadCFAListSuccess(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_CFA_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadCFAListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCFAListFailure(payload);

      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.LOAD_CFA_LIST_FAILURE,
        payload
      });
    });
  });
/* 
  describe('UpdateTransaction Action Test Cases', () => {
    it('should check correct type is used for UpdateTransaction action', () => {
      const payload: LocationMasterDetails = {
        locationCode: 'Code'
      };
      const action = new UpdateTransaction(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.UPDATE_TRANSACTION_TYPE_DETAILS,
        payload
      });
    });

    it('should check correct type is used for UpdateTransactionSuccess action', () => {
      const payload: LocationMasterDetails = {
        locationCode: 'Code'
      };
      const action = new UpdateTransactionSuccess(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.UPDATE_TRANSACTION_TYPE_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for UpdateTransactionFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateTransactionFailure(payload);

      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.UPDATE_TRANSACTION_TYPE_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('UpdateGHS Action Test Cases', () => {
    it('should check correct type is used for UpdateGHS action', () => {
      const payload: LocationMasterDetails = {
        locationCode: 'Code'
      };
      const action = new UpdateGHS(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.UPDATE_GHS_DETAILS,
        payload
      });
    });

    it('should check correct type is used for UpdateGHSSuccess action', () => {
      const payload: LocationMasterDetails = {
        locationCode: 'Code'
      };
      const action = new UpdateGHSSuccess(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.UPDATE_GHS_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for UpdateGHSFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateGHSFailure(payload);

      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.UPDATE_GHS_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('UpdateInventory Action Test Cases', () => {
    it('should check correct type is used for UpdateInventory action', () => {
      const payload: LocationMasterDetails = {
        locationCode: 'Code'
      };
      const action = new UpdateInventory(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.UPDATE_INVENTORY_DETAILS,
        payload
      });
    });

    it('should check correct type is used for UpdateInventorySuccess action', () => {
      const payload: LocationMasterDetails = {
        locationCode: 'Code'
      };
      const action = new UpdateInventorySuccess(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.UPDATE_INVENTORY_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for UpdateInventoryFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateInventoryFailure(payload);

      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.UPDATE_INVENTORY_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('UpdateBanking Action Test Cases', () => {
    it('should check correct type is used for UpdateBanking action', () => {
      const payload: LocationMasterDetails = {
        locationCode: 'Code'
      };
      const action = new UpdateBanking(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.UPDATE_BANKING_DETAILS,
        payload
      });
    });

    it('should check correct type is used for UpdateBankingSuccess action', () => {
      const payload: LocationMasterDetails = {
        locationCode: 'Code'
      };
      const action = new UpdateBankingSuccess(payload);
      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.UPDATE_BANKING_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for UpdateBankingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateBankingFailure(payload);

      expect({ ...action }).toEqual({
        type: LocationMasterActionTypes.UPDATE_BANKING_DETAILS_FAILURE,
        payload
      });
    });
  }); */
});
