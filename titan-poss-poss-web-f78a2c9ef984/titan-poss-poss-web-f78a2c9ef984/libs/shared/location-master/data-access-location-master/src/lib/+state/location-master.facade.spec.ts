import { LocationMasterFacade } from './location-master.facade';
import { LocationMasterState } from './location-master.state';
import { provideMockStore } from '@ngrx/store/testing';

import { TestBed, inject } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import {
  CopyDetailsPayload,
  LocationListingPage
} from '@poss-web/shared/models';
import {
  CopyDetails,
  LoadBaseCurrency,
  LoadBrand,
  LoadCFAList,
  LoadCountryCode,
  LoadCurrency,
  LoadInvoiceType,
  LoadLocationDetails,
  LoadLocationListing,
  LoadLocationSize,
  LoadLocationTypes,
  LoadMarketCode,
  LoadOwnerInfo,
  LoadRefundMode,
  LoadRegion,
  LoadStates,
  LoadSubBrand,
  LoadSubRegion,
  LoadTowns,
  SaveLocationDetails,
  SearchLocationByLocationCode,
  UpdateLocationDetails
} from './location-master.actions';

describe('TaxClassFacade', () => {
  let locationMasterFacade: LocationMasterFacade;
  const initialState: LocationMasterState = {
    locationListing: null,
    locationDetails: {
      locationCode: 'Code'
    },
    locationTypes: {
      code: 'Code',
      value: 'value'
    },
    towns: [
      {
        id: '1',
        name: 'name',
        state_id: '2'
      }
    ],
    stateTypes: [
      {
        id: '1',
        name: 'Name'
      }
    ],
    locationSize: [
      {
        id: '1',
        name: 'Name'
      }
    ],
    invoicetype: [
      {
        id: '1',
        name: 'Name'
      }
    ],
    refundMode: [
      {
        id: '1',
        name: 'Name'
      }
    ],
    ownerInfo: {
      id: '1',
      name: 'name'
    },
    regions: [
      {
        id: '1',
        name: 'Name'
      }
    ],
    subRegions: [
      {
        description: 'Desc',
        regionCode: 'Code'
      }
    ],
    brands: [
      {
        id: '1',
        name: 'Name'
      }
    ],
    subBrands: [
      {
        brandCode: 'Code',
        description: 'Desc'
      }
    ],
    marketTypes: {
      id: '1',
      name: 'Name'
    },
    baseCurrencyTypes: [
      {
        id: '1',
        name: 'Name'
      }
    ],
    currencyTypes: [
      {
        id: '1',
        name: 'Name'
      }
    ],
    LocationCFATypes: [
      {
        id: '1',
        name: 'Name'
      }
    ],
    isSaved: true,
    error: null,
    isCopySuccess: false,
    isLoading: false,
    totalCount: 0,
    countryCode: [{ id: 'IND', name: 'INDIA' }]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), LocationMasterFacade]
    });

    locationMasterFacade = TestBed.inject(LocationMasterFacade);
  });

  it('should create facade', () => {
    expect(locationMasterFacade).toBeDefined();
  });

  describe('#getLocationListing', () => {
    it('should get getLocationListing', () => {
      expect(locationMasterFacade.getLocationListing()).toBeTruthy();
    });
  });

  describe('#getIsCopySuccess', () => {
    it('should get getIsCopySuccess', () => {
      expect(locationMasterFacade.getIsCopySuccess()).toBeTruthy();
    });
  });

  describe('#getLocationDetails', () => {
    it('should get getLocationDetails', () => {
      expect(locationMasterFacade.getLocationDetails()).toBeTruthy();
    });
  });

  describe('#getIsLoading', () => {
    it('should get getIsLoading', () => {
      expect(locationMasterFacade.getIsLoading()).toBeTruthy();
    });
  });

  describe('#getTotalCount', () => {
    it('should get getTotalCount', () => {
      expect(locationMasterFacade.getTotalCount()).toBeTruthy();
    });
  });

  describe('#getError', () => {
    it('should getError', () => {
      expect(locationMasterFacade.getError()).toBeTruthy();
    });
  });

  describe('#getTowns', () => {
    it('should getTowns', () => {
      expect(locationMasterFacade.getTowns()).toBeTruthy();
    });
  });

  describe('#getStates', () => {
    it('should getStates', () => {
      expect(locationMasterFacade.getStates()).toBeTruthy();
    });
  });

  describe('#getOwnerInfo', () => {
    it('should getOwnerInfo', () => {
      expect(locationMasterFacade.getOwnerInfo()).toBeTruthy();
    });
  });

  describe('#getRegions', () => {
    it('should getRegions', () => {
      expect(locationMasterFacade.getRegions()).toBeTruthy();
    });
  });

  describe('#getSubRegions', () => {
    it('should getSubRegions', () => {
      expect(locationMasterFacade.getSubRegions()).toBeTruthy();
    });
  });

  describe('#getBrandName', () => {
    it('should getBrandName', () => {
      expect(locationMasterFacade.getBrandName()).toBeTruthy();
    });
  });

  describe('#getSubBrand', () => {
    it('should getSubBrand', () => {
      expect(locationMasterFacade.getSubBrand()).toBeTruthy();
    });
  });

  describe('#getMarketCode', () => {
    it('should getMarketCode', () => {
      expect(locationMasterFacade.getMarketCode()).toBeTruthy();
    });
  });

  describe('#getBaseCurrencyTypes', () => {
    it('should getBaseCurrencyTypes', () => {
      expect(locationMasterFacade.getBaseCurrencyTypes()).toBeTruthy();
    });
  });

  describe('#getCurrencyTypes', () => {
    it('should getCurrencyTypes', () => {
      expect(locationMasterFacade.getCurrencyTypes()).toBeTruthy();
    });
  });

  describe('#getLocationTypes', () => {
    it('should getLocationTypes', () => {
      expect(locationMasterFacade.getLocationTypes()).toBeTruthy();
    });
  });

  describe('#getLocationSize', () => {
    it('should getLocationSize', () => {
      expect(locationMasterFacade.getLocationSize()).toBeTruthy();
    });
  });

  describe('#getInvoiceType', () => {
    it('should getInvoiceType', () => {
      expect(locationMasterFacade.getInvoiceType()).toBeTruthy();
    });
  });

  describe('#getRefundMode', () => {
    it('should getRefundMode', () => {
      expect(locationMasterFacade.getRefundMode()).toBeTruthy();
    });
  });

  describe('#getIsSaved', () => {
    it('should getIsSaved', () => {
      expect(locationMasterFacade.getIsSaved()).toBeTruthy();
    });
  });

  describe('#getCountryCode', () => {
    it('should getCountryCode', () => {
      expect(locationMasterFacade.getCountryCode()).toBeTruthy();
    });
  });

  describe('#getLocationCFATypes', () => {
    it('should getLocationCFATypes', () => {
      expect(locationMasterFacade.getLocationCFATypes()).toBeTruthy();
    });
  });

  describe('#loadLocationListing', () => {
    it('should loadLocationListing', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: LocationListingPage = {
        pageIndex: 0,
        pageSize: 10
      };

      const expectedAction = new LoadLocationListing(payload);
      locationMasterFacade.loadLocationListing(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#searchLocation', () => {
    it('should searchLocation', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload = 'test';

      const expectedAction = new SearchLocationByLocationCode(payload);
      locationMasterFacade.searchLocation(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#copyLocationDetails', () => {
    it('should copyLocationDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: CopyDetailsPayload = {
        newLocationCode: 'ABC',
        oldLocationCode: 'XYZ'
      };

      const expectedAction = new CopyDetails(payload);
      locationMasterFacade.copyLocationDetails(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadLocationDetails', () => {
    it('should loadLocationDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload = 'Code';

      const expectedAction = new LoadLocationDetails(payload);
      locationMasterFacade.loadLocationDetails(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#saveLocationDetails', () => {
    it('should saveLocationDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new SaveLocationDetails(
        initialState.locationDetails
      );
      locationMasterFacade.saveLocationDetails(initialState.locationDetails);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#updateLocationDetails', () => {
    it('should updateLocationDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new UpdateLocationDetails(
        initialState.locationDetails
      );
      locationMasterFacade.updateLocationDetails(initialState.locationDetails);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadlocationTypes', () => {
    it('should loadlocationTypes', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new LoadLocationTypes();
      locationMasterFacade.loadlocationTypes();

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadTowns', () => {
    it('should loadTowns', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new LoadTowns('id');
      locationMasterFacade.loadTowns('id');

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadStates', () => {
    it('should loadStates', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new LoadStates('id');
      locationMasterFacade.loadStates('id');

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadOwnerInfo', () => {
    it('should loadOwnerInfo', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new LoadOwnerInfo();
      locationMasterFacade.loadOwnerInfo();

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadRegion', () => {
    it('should loadRegion', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new LoadRegion();
      locationMasterFacade.loadRegion();

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadCountryCode', () => {
    it('should loadCountryCode', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new LoadCountryCode();
      locationMasterFacade.loadCountryCode();

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadSubRegion', () => {
    it('should loadSubRegion', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new LoadSubRegion('');
      locationMasterFacade.loadSubRegion('');

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadBrands', () => {
    it('should loadBrands', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new LoadBrand();
      locationMasterFacade.loadBrands();

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadSubBrand', () => {
    it('should loadSubBrand', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new LoadSubBrand('');
      locationMasterFacade.loadSubBrand('');

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadMarketCode', () => {
    it('should loadSubBrand', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new LoadMarketCode();
      locationMasterFacade.loadMarketCode();

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadBaseCurrency', () => {
    it('should loadBaseCurrency', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new LoadBaseCurrency();
      locationMasterFacade.loadBaseCurrency();

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadCurrency', () => {
    it('should loadBaseCurrency', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new LoadCurrency();
      locationMasterFacade.loadCurrency();

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadLocationSize', () => {
    it('should loadBaseCurrency', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new LoadLocationSize();
      locationMasterFacade.loadLocationSize();

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadInvoiceType', () => {
    it('should loadBaseCurrency', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new LoadInvoiceType();
      locationMasterFacade.loadInvoiceType();

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadRefundMode', () => {
    it('should loadBaseCurrency', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new LoadRefundMode();
      locationMasterFacade.loadRefundMode();

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadLocationCFATypes', () => {
    it('should loadLocationCFATypes', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new LoadCFAList();
      locationMasterFacade.loadLocationCFATypes();

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
