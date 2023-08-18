import { Store } from '@ngrx/store';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { CustomerFacade } from './customer.facade';
import { CustomerState } from './customer.state';
import { countryAdapter, stateAdapter, zoneAdapter } from './customer.entity';
import {
  LoadCountries,
  LoadStates,
  LoadTowns,
  SearchCustomer,
  SelectCustomer,
  ClearCustomerSearch,
  ClearSelectedCustomer,
  LoadCountryCode,
  LoadPincode,
  LoadCustomerUniqueMobile,
  LoadCustomerUniqueEmail,
  LoadCustomerUniquePan,
  LoadCustomerUniqueGst,
  LoadSalutations,
  SaveCustomerFormDetails,
  UpdateCustomer,
  SelectedCustomerDetail,
  LoadSelectedCustomer,
  LoadZones,
  LoadCustomerUniquePassport,
  LoadIdProofs,
  LoadAllowedTransactionTypes,
  SelectInternationalCustomer,
  ClearUpdatedCustomer,
  GstCardVerificationStatus,
  PanCardVerificationStatus,
  LoadBrandDetails,
  GetGhsCustomerDetails,
  EnableCustomerCreate,
  DisableCustomerCreate,
  EnableCustomerEdit,
  DisableCustomerEdit
} from './customer.actions';
import {
  CustomerInfo,
  Customers,
  UpdateCustomerDetail,
  SEARCH_BY_ENUM
} from '@poss-web/shared/models';

describe('Customer facade Testing Suite', () => {
  const initialState: CustomerState = {
    error: null,
    isLoading: false,
    countries: countryAdapter.getInitialState(),
    states: stateAdapter.getInitialState(),
    city: [],
    salutations: [],
    idProofList: [],
    isSearchingCustomer: false,
    hasCustomerResult: null,
    searchCustomerResult: null,
    selectedCustomer: null,
    searchError: null,
    pincode: null,
    selectedCustomerDetail: null,
    zones: zoneAdapter.getInitialState(),
    isUniqueCustomer: null,
    isUniqueEmail: null,
    isUniquePan: null,
    isUniqueGst: null,
    isUniquePassport: null,
    countryCode: null,
    createdCustomerStatus: null,
    updatedCustomerStatus: null,
    isCustomerSaving: false,
    enableClear: true,
    allowedTransactionTypes: null,
    enableEdit: true,
    brandDetails: null,
    enableCreate: true,
    customerDetails: null,
    panVerificationResponse: null,
    gstVerificationResponse: null,
    rivaahCouponDetail: null,
    catchmentList: [],
    emailValidationResponse: null
  };

  let customerFacade: CustomerFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), CustomerFacade]
    });

    customerFacade = TestBed.inject(CustomerFacade);
  });

  describe(' Country list', () => {
    it('should dispatch load country list action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadCountries();

      customerFacade.loadCountries();
      customerFacade.getCountries();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe(' Country list', () => {
    it('should dispatch load country list action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadCountries();

      customerFacade.loadCountries();
      customerFacade.getCountries();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe(' State list', () => {
    it('should dispatch load state list action', inject([Store], store => {
      const countryCode = 'IND';
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadStates(countryCode);

      customerFacade.loadStates(countryCode);
      customerFacade.getStates();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe(' Town list', () => {
    it('should dispatch load town list action', inject([Store], store => {
      const stateId = '1';
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadTowns(stateId);

      customerFacade.loadTowns(stateId);
      customerFacade.getTowns();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('searchCustomer', () => {
    it('should dispatch load searchCustomer action', inject([Store], store => {
      const searchBy = SEARCH_BY_ENUM.MOBILE_NO;
      const searchValue = '8970420911';
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SearchCustomer({ searchBy, searchValue });

      customerFacade.searchCustomer(searchBy, searchValue);
      customerFacade.getSearchCustomerResult();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('selectCustomer', () => {
    it('should dispatch load selectCustomer action', inject([Store], store => {
      const customer: CustomerInfo = null;
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SelectCustomer(customer);

      customerFacade.selectCustomer(customer);
      customerFacade.getSelectSelectedCustomer();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('clearCustomerSearch', () => {
    it('should dispatch load clearCustomerSearch action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ClearCustomerSearch();

        customerFacade.clearCustomerSearch();

        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('clearSelectedCustomer', () => {
    it('should dispatch load clearSelectedCustomer action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ClearSelectedCustomer();

        customerFacade.clearSelectedCustomer();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('loadCountryCode', () => {
    it('should dispatch load loadCountryCode action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadCountryCode();

      customerFacade.loadCountryCode();
      customerFacade.getCountryCode();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('loadPincode', () => {
    it('should dispatch load loadPincode action', inject([Store], store => {
      const countryCode = 'IND';
      const pincode = '571313';
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadPincode({ countryCode, pincode });

      customerFacade.loadPincode(countryCode, pincode);
      customerFacade.getPincode();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('loadIsUniqueMobile', () => {
    it('should dispatch load loadIsUniqueMobile action', inject(
      [Store],
      store => {
        const searchType = 'MOBILE_NO';
        const value = '8970420911';
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadCustomerUniqueMobile({
          searchType,
          value
        });

        customerFacade.loadIsUniqueMobile(searchType, value);
        customerFacade.getIsUniqueMobile();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('loadIsUniqueEmail', () => {
    it('should dispatch load loadIsUniqueEmail action', inject(
      [Store],
      store => {
        const searchType = 'EMAIL_ID';
        const value = 'customer@gmail.com';
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadCustomerUniqueEmail({
          searchType,
          value
        });

        customerFacade.loadIsUniqueEmail(searchType, value);
        customerFacade.getIsUniqueEmail();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('loadIsUniquePan', () => {
    it('should dispatch load loadIsUniquePan action', inject([Store], store => {
      const searchType = 'CUSTOMER_TAX_NO';
      const value = 'BLOPJ2603A';
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadCustomerUniquePan({
        searchType,
        value
      });

      customerFacade.loadIsUniquePan(searchType, value);
      customerFacade.getIsUniquePan();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('loadIsUniqueGst', () => {
    it('should dispatch load loadIsUniqueGst action', inject([Store], store => {
      const searchType = 'INSTITUTIONAL_TAX_NO';
      const value = 'BLOPJ2603A';
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadCustomerUniqueGst({
        searchType,
        value
      });

      customerFacade.loadIsUniqueGst(searchType, value);
      customerFacade.getIsUniqueGst();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('loadSalutations', () => {
    it('should dispatch load loadSalutations action', inject([Store], store => {
      const lovType = 'SALUTATION';
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadSalutations(lovType);

      customerFacade.loadSalutations(lovType);
      customerFacade.getSalutations();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('saveCustomer', () => {
    it('should dispatch load saveCustomer action', inject([Store], store => {
      const customerData: Customers = null;
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SaveCustomerFormDetails(customerData);

      customerFacade.saveCustomer(customerData);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('updateCustomer', () => {
    it('should dispatch load updateCustomer action', inject([Store], store => {
      const customerData: UpdateCustomerDetail = null;
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new UpdateCustomer(customerData);

      customerFacade.updateCustomer(customerData);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('loadSelectedCustomerDetail', () => {
    it('should dispatch load loadSelectedCustomerDetail action', inject(
      [Store],
      store => {
        const customerId = '702';
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SelectedCustomerDetail({ customerId });

        customerFacade.loadSelectedCustomerDetail(customerId);
        customerFacade.getSelectedCustomerDetail();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('loadSelectedCustomer', () => {
    it('should dispatch load loadSelectedCustomer action', inject(
      [Store],
      store => {
        const customerId = '702';
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadSelectedCustomer({
          customerId: customerId,
          enableClear: true,
          enableEdit: true,
          enableCreate: true
        });

        customerFacade.loadSelectedCustomer(customerId);
        customerFacade.getSelectSelectedCustomer();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('loadZones', () => {
    it('should dispatch load loadZones action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadZones();

      customerFacade.loadZones();
      customerFacade.getZones();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('getError', () => {
    it('should get stored error', () => {
      expect(customerFacade.getError()).toBeTruthy();
    });
  });

  describe('getIsSearchingCustomer', () => {
    it('should get stored isSearchingCustomer value', () => {
      expect(customerFacade.getIsSearchingCustomer()).toBeTruthy();
    });
  });

  describe('getIsCustomerSaving', () => {
    it('should get stored isCustomerSaving value', () => {
      expect(customerFacade.getIsCustomerSaving()).toBeTruthy();
    });
  });

  describe('getHasCustomerResult', () => {
    it('should get stored hasCustomerResult value', () => {
      expect(customerFacade.getHasCustomerResult()).toBeTruthy();
    });
  });

  describe('getCustomerEncirclePoints', () => {
    it('should get stored customerEncirclePoints value', () => {
      expect(customerFacade.getCustomerEncirclePoints()).toBeTruthy();
    });
  });
  describe('getCustomerUlpId', () => {
    it('should get stored customerUlpId value', () => {
      expect(customerFacade.getCustomerUlpID()).toBeTruthy();
    });
  });

  describe('getSearchError', () => {
    it('should get stored searchError value', () => {
      expect(customerFacade.getSearchError()).toBeTruthy();
    });
  });

  describe('Get selectors', () => {
    it('should get stored getHasClear value', () => {
      expect(customerFacade.getEnableClear()).toEqual(
        customerFacade['enableClear$']
      );
    });

    it('should get stored getAllowedTransactionTypes value', () => {
      expect(customerFacade.getAllowedTransactionTypes()).toEqual(
        customerFacade['allowedTransactionTypes$']
      );
    });

    it('should get stored getCreatedCustomerStatus value', () => {
      expect(customerFacade.getCreatedCustomerStatus()).toEqual(
        customerFacade['createdCustomerStatus$']
      );
    });

    it('should get stored getUpdatedCustomerStatus value', () => {
      expect(customerFacade.getUpdatedCustomerStatus()).toEqual(
        customerFacade['updatedCustomerStatus$']
      );
    });

    it('should get stored getIsUniquePassport value', () => {
      expect(customerFacade.getIsUniquePassport()).toEqual(
        customerFacade['isUniquePassport$']
      );
    });

    it('should get stored getIdProofs value', () => {
      expect(customerFacade.getIdProofs()).toEqual(customerFacade['idProofs$']);
    });

    it('should get stored getIsCustomerSelected value', () => {
      expect(customerFacade.getIsCustomerSelected()).toEqual(
        customerFacade['isCustomerSelected$']
      );
    });

    it('should get stored getGhsCustomerDetails value', () => {
      expect(customerFacade.getGhsCustomerDetails()).toEqual(
        customerFacade['getCustomerDetails$']
      );
    });

    it('should get stored getBrandDetails value', () => {
      expect(customerFacade.getBrandDetails()).toEqual(
        customerFacade['brandDetails$']
      );
    });

    it('should get stored getIsLoading value', () => {
      expect(customerFacade.getIsLoading()).toEqual(
        customerFacade['isLoading$']
      );
    });

    it('should get stored getpanVerificationStatus value', () => {
      expect(customerFacade.getpanVerificationStatus()).toEqual(
        customerFacade['panVerificationStatus$']
      );
    });

    it('should get stored getgstVerificationStatus value', () => {
      expect(customerFacade.getgstVerificationStatus()).toEqual(
        customerFacade['gstVerificationStatus$']
      );
    });

    it('should get stored getCustomerLoyaltyDetail value', () => {
      expect(customerFacade.getCustomerLoyaltyDetail()).toEqual(
        customerFacade['customerLoyaltyDetail$']
      );
    });

    it('should get stored getEnableCreate value', () => {
      expect(customerFacade.getEnableCreate()).toEqual(
        customerFacade['enableCreate$']
      );
    });

    it('should get stored getEnableEdit value', () => {
      expect(customerFacade.getEnableEdit()).toEqual(
        customerFacade['enableEdit$']
      );
    });
  });

  describe('Dispatch actions', () => {
    it('should dispatch load loadIsUniquePassport action', inject(
      [Store],
      store => {
        const requestParam = {
          searchType: 'PASSPORT_ID',
          value: 'ACJDIEEFLF'
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadCustomerUniquePassport(requestParam);

        customerFacade.loadIsUniquePassport('PASSPORT_ID', 'ACJDIEEFLF');
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));

    it('should dispatch load loadIdProofs action', inject([Store], store => {
      const requestParam = 'ID_PROOF';
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadIdProofs(requestParam);

      customerFacade.loadIdProofs(requestParam);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));

    it('should dispatch load loadAllowedTransactionTypes action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadAllowedTransactionTypes();

        customerFacade.loadAllowedTransactionTypes();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));

    it('should dispatch load selectInternationalCustomer action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SelectInternationalCustomer('ASS123');

        customerFacade.selectInternationalCustomer('ASS123');
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));

    it('should dispatch load clearUpdatedCustomerStatus action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ClearUpdatedCustomer();

        customerFacade.clearUpdatedCustomerStatus();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));

    it('should dispatch load loadPanVerificationStatus action', inject(
      [Store],
      store => {
        const requestPayload = null;
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new PanCardVerificationStatus(requestPayload);

        customerFacade.loadPanVerificationStatus(requestPayload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));

    it('should dispatch load loadGstVerificationStatus action', inject(
      [Store],
      store => {
        const requestPayload = null;
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new GstCardVerificationStatus(requestPayload);

        customerFacade.loadGstVerificationStatus(requestPayload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));

    it('should dispatch load loadBrandDetails action', inject(
      [Store],
      store => {
        const requestPayload = 'TAN';
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadBrandDetails(requestPayload);

        customerFacade.loadBrandDetails(requestPayload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));

    it('should dispatch load loadGhsCustomerDetails action', inject(
      [Store],
      store => {
        const requestParam = {
          searchType: 'PASSPORT_ID',
          value: 'ACJDIEEFLF'
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new GetGhsCustomerDetails({
          searchBy: SEARCH_BY_ENUM.PASSPORT_ID,
          searchValue: 'ACJDIEEFLF'
        });

        customerFacade.loadGhsCustomerDetails(
          SEARCH_BY_ENUM.PASSPORT_ID,
          'ACJDIEEFLF'
        );
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));

    it('should dispatch load enableCustomerCreate action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new EnableCustomerCreate();

        customerFacade.enableCustomerCreate();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));

    it('should dispatch load disableCustomerCreate action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new DisableCustomerCreate();

        customerFacade.disableCustomerCreate();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));

    it('should dispatch load enableCustomerEdit action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new EnableCustomerEdit();

        customerFacade.enableCustomerEdit();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));

    it('should dispatch load disableCustomerEdit action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new DisableCustomerEdit();

        customerFacade.disableCustomerEdit();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
});
