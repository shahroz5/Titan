import * as selectors from './customer.selectors';
import { initialState } from './customer.reducer';
import { CustomerState } from './customer.state';
import {
  CountrySummary,
  StateSummary,
  TownSummary,
  PincodeSummary,
  CustomerLov,
  CustomErrors,
  CustomerInfo,
  CreatedCustomerResponse,
  Zone
} from '@poss-web/shared/models';
import {
  CountryEntity,
  countryAdapter,
  StateEntity,
  stateAdapter,
  ZoneEntity,
  zoneAdapter
} from './customer.entity';

describe('Customer selector Testing Suite', () => {
  const getCountryList = (
    countryCode: string,
    description: string,
    isdCode: string
  ): CountrySummary => ({
    countryCode,
    description,
    isdCode
  });

  const getStateList = (stateId: string, description: string) => ({
    stateId,
    description
  });

  const getZoneList = (zoneCode: number, description: string): Zone => ({
    zoneCode,
    description
  });

  const countryList1 = getCountryList('IND', 'India', '+91');
  const countryList2 = getCountryList('UK', 'United Kingdom', '+44');

  const stateList1 = getStateList('1', 'Karnataka');
  const stateList2 = getStateList('2', 'Tamilnadu');

  const zoneList1 = getZoneList(1, 'Zone1');
  const zoneList2 = getZoneList(2, 'Zone2');

  const addElementToCountryEntities = <T extends CountrySummary>(
    payload: T[]
  ): { [description: string]: T } => {
    const reducedEntities = payload.reduce(
      (entities: { [description: string]: T }, element: T) => {
        return {
          ...entities,
          [element.description]: element
        };
      },
      {}
    );

    return reducedEntities;
  };

  const addElementToStateEntities = (
    payload: any[]
  ): { [description: string]: any } => {
    const reducedEntities = payload.reduce(
      (entities: { [description: string]: any }, element: any) => {
        return {
          ...entities,
          [element.description]: element
        };
      },
      {}
    );

    return reducedEntities;
  };

  const addElementToZoneEntities = <T extends Zone>(
    payload: T[]
  ): { [zoneCode: number]: T } => {
    const reducedEntities = payload.reduce(
      (entities: { [zoneCode: number]: T }, element: T) => {
        return {
          ...entities,
          [element.zoneCode]: element
        };
      },
      {}
    );

    return reducedEntities;
  };

  const countryListArray = [countryList1, countryList2];
  const stateListArray = [stateList1, stateList2];
  const zoneListArray = [zoneList1, zoneList2];

  const townListArray: TownSummary[] = [
    {
      description: 'Banglore',
      townCode: 1
    }
  ];

  const countryList: CountryEntity = {
    ids: [countryList1.description, countryList2.description],
    entities: addElementToCountryEntities(countryListArray)
  };

  const stateList: StateEntity = {
    ids: [stateList1.description, stateList2.description],
    entities: addElementToStateEntities(stateListArray)
  };

  const zoneList: ZoneEntity = {
    ids: [zoneList1.zoneCode, zoneList2.zoneCode],
    entities: addElementToZoneEntities(zoneListArray)
  };

  describe('Testing country related Selectors', () => {
    it('Should return the list of country', () => {
      const listOfCountry = countryAdapter.setAll(countryListArray, {
        ...countryAdapter.getInitialState()
      });

      const state: CustomerState = {
        ...initialState,
        countries: countryList
      };
      expect(selectors.selectCountries.projector(state)).toEqual(listOfCountry);
    });
  });

  describe('Testing state related Selectors', () => {
    it('Should return the list of state', () => {
      const listOfState = stateAdapter.setAll(stateListArray, {
        ...stateAdapter.getInitialState()
      });

      const state: CustomerState = {
        ...initialState,
        states: stateList
      };
      expect(selectors.selectStates.projector(state)).toEqual(listOfState);
    });
  });

  describe('Testing town related Selectors', () => {
    it('Should return the list of towns', () => {
      const state: CustomerState = {
        ...initialState,
        city: townListArray
      };
      expect(selectors.selectTowns.projector(state)).toEqual(townListArray);
    });
  });

  describe('Testing pincode related Selectors', () => {
    it('Should return the pincode summary', () => {
      const pincodeSummary: PincodeSummary = {
        townName: 'Banglore',
        stateName: 'Karnataka',
        cachementArea: ['Rajajinagar']
      };
      const state: CustomerState = {
        ...initialState,
        pincode: pincodeSummary
      };
      expect(selectors.selectPincode.projector(state)).toEqual(pincodeSummary);
    });
  });

  describe('Testing is unique mobile related Selectors', () => {
    it('Should return the uniqueness of mobile number', () => {
      const isUniqueMobile = false;
      const state: CustomerState = {
        ...initialState,
        isUniqueCustomer: isUniqueMobile
      };
      expect(selectors.selectIsUniqueMobile.projector(state)).toEqual(
        isUniqueMobile
      );
    });
  });

  describe('Testing is unique PAN related Selectors', () => {
    it('Should return the uniqueness of PAN number', () => {
      const isUniquePan = false;
      const state: CustomerState = {
        ...initialState,
        isUniquePan: isUniquePan
      };
      expect(selectors.selectIsUniquePan.projector(state)).toEqual(isUniquePan);
    });
  });

  describe('Testing is unique GST related Selectors', () => {
    it('Should return the uniqueness of GST number', () => {
      const isUniqueGst = false;
      const state: CustomerState = {
        ...initialState,
        isUniqueGst: isUniqueGst
      };
      expect(selectors.selectIsUniqueGst.projector(state)).toEqual(isUniqueGst);
    });
  });

  describe('Testing is country code related Selectors', () => {
    it('Should return the country code', () => {
      const countryCode = 'IND';
      const state: CustomerState = {
        ...initialState,
        countryCode: countryCode
      };
      expect(selectors.selectCountryCode.projector(state)).toEqual(countryCode);
    });
  });

  describe('Testing is unique Email related Selectors', () => {
    it('Should return the uniqueness of Email number', () => {
      const isUniqueEmail = false;
      const state: CustomerState = {
        ...initialState,
        isUniqueEmail: isUniqueEmail
      };
      expect(selectors.selectIsUniqueEmail.projector(state)).toEqual(
        isUniqueEmail
      );
    });
  });

  describe('Testing is Salutations related Selectors', () => {
    it('Should return the list of salutation', () => {
      const salutationList: CustomerLov[] = [
        {
          code: 'Mr',
          value: 'Mr',
          isActive: true
        }
      ];
      const state: CustomerState = {
        ...initialState,
        salutations: salutationList
      };
      expect(selectors.selectSalutations.projector(state)).toEqual(
        salutationList
      );
    });
  });

  describe('Testing is error related Selectors', () => {
    it('Should return the error', () => {
      const error: CustomErrors = {
        code: '503',
        traceId: 'E-303',
        timeStamp: '',
        error: null,
        message: 'Some error'
      };
      const state: CustomerState = {
        ...initialState,
        error: error
      };

      const searchState: CustomerState = {
        ...initialState,
        searchError: error
      };
      expect(selectors.selectError.projector(state)).toEqual(error);
      expect(selectors.selectSearchError.projector(searchState)).toEqual(error);
    });
  });

  describe('Testing is searching related Selectors', () => {
    it('Should return the is searching flag', () => {
      const isSearching = false;
      const state: CustomerState = {
        ...initialState,
        isSearchingCustomer: isSearching
      };
      expect(selectors.selectIsSearchingCustomer.projector(state)).toEqual(
        isSearching
      );
    });
  });

  describe('Testing is customer saving related Selectors', () => {
    it('Should return the is customer saving flag', () => {
      const isCustomerSaving = false;
      const state: CustomerState = {
        ...initialState,
        isCustomerSaving: isCustomerSaving
      };
      expect(selectors.selectIsCustomerSaving.projector(state)).toEqual(
        isCustomerSaving
      );
    });
  });

  describe('Testing has customer result related Selectors', () => {
    it('Should return the has customer result flag', () => {
      const hasCustomerResult = false;
      const state: CustomerState = {
        ...initialState,
        hasCustomerResult: hasCustomerResult
      };

      expect(selectors.selectHasCustomerResult.projector(state)).toEqual(
        hasCustomerResult
      );
    });
  });

  describe('Testing has search customer results related Selectors', () => {
    it('Should return the search customer result', () => {
      const searchCustomerResult: CustomerInfo = null;
      const selectedCustomerDetail: CreatedCustomerResponse = null;
      const state: CustomerState = {
        ...initialState,
        searchCustomerResult: searchCustomerResult
      };

      const pointBalance = 0;
      const ulpId = null;

      expect(selectors.selectSearchCustomerResult.projector(state)).toEqual(
        searchCustomerResult
      );
      expect(selectors.selectSelectedCustomer.projector(state)).toEqual(
        searchCustomerResult
      );
      expect(selectors.selectedCustomerDetail.projector(state)).toEqual(
        selectedCustomerDetail
      );
      expect(selectors.selectCustomerEncirclePoints.projector(state)).toEqual(
        pointBalance
      );
      expect(selectors.selectCustomerUlpID.projector(state)).toEqual(ulpId);
    });
  });

  describe('Testing is zone related Selectors', () => {
    it('Should return the list of zones', () => {
      const listOfZone = zoneAdapter.setAll(zoneListArray, {
        ...zoneAdapter.getInitialState()
      });

      const state: CustomerState = {
        ...initialState,
        zones: zoneList
      };
      expect(selectors.zones.projector(state)).toEqual(listOfZone);
    });
  });

  describe('Testing is AllowedTransactionTypes related Selectors', () => {
    it('Should return the AllowedTransactionTypes', () => {
      const allwedTransactionTpe = null;

      const state: CustomerState = {
        ...initialState,
        allowedTransactionTypes: allwedTransactionTpe
      };
      expect(selectors.selectAllowedTransactionTypes.projector(state)).toEqual(
        allwedTransactionTpe
      );
    });
  });

  describe('Testing is unique Passport related Selectors', () => {
    it('Should return the uniqueness of Passport Id', () => {
      const isUniquePassport = false;
      const state: CustomerState = {
        ...initialState,
        isUniquePassport: isUniquePassport
      };
      expect(selectors.selectIsUniquePassport.projector(state)).toEqual(
        isUniquePassport
      );
    });
  });

  describe('Testing is Idproof related Selectors', () => {
    it('Should return the list of ID proof', () => {
      const idProofList: CustomerLov[] = [];
      const state: CustomerState = {
        ...initialState,
        idProofList: idProofList
      };
      expect(selectors.selectIdProofs.projector(state)).toEqual(idProofList);
    });
  });

  describe('Testing is created customer related Selectors', () => {
    it('Should return the created customer status', () => {
      const createdCustomerStatus = {
        customerId: '703',
        customerType: 'REGULAR',
        ulpId: '34959596'
      };
      const state: CustomerState = {
        ...initialState,
        createdCustomerStatus: createdCustomerStatus
      };
      expect(selectors.selectCreatedCustomerStatus.projector(state)).toEqual(
        createdCustomerStatus
      );
    });
  });

  describe('Testing is updated customer related Selectors', () => {
    it('Should return the updated customer status', () => {
      const updatedCustomerStatus = true;
      const state: CustomerState = {
        ...initialState,
        updatedCustomerStatus: updatedCustomerStatus
      };
      expect(selectors.selectUpdatedCustomerStatus.projector(state)).toEqual(
        updatedCustomerStatus
      );
    });
  });

  describe('Testing is hasClear related Selectors', () => {
    it('Should return the hasClear status', () => {
      const hasClearStatus = false;
      const state: CustomerState = {
        ...initialState,
        enableClear: hasClearStatus
      };
      expect(selectors.selectEnableClear.projector(state)).toEqual(
        hasClearStatus
      );
    });
  });

  describe('Testing is is customer selected Selectors', () => {
    it('Should return the is customer selected status', () => {
      const selectedCustomer = null;
      const isCustomerSlected = true;
      const state: CustomerState = {
        ...initialState,
        selectedCustomer: selectedCustomer
      };
      expect(selectors.selectIsCustomerSelected.projector(state)).toEqual(
        isCustomerSlected
      );
    });
  });

  describe('Testing is loading Selectors', () => {
    it('Should return the isLoading status', () => {
      const state: CustomerState = {
        ...initialState,
        isLoading: true
      };
      expect(selectors.selectIsLoading.projector(state)).toEqual(true);
    });
  });

  describe('Testing ClearUpdatedCustomer Selectors', () => {
    it('Should return the ClearUpdatedCustomer status', () => {
      const state: CustomerState = {
        ...initialState,
        updatedCustomerStatus: true
      };
      expect(selectors.selectClearUpdatedCustomer.projector(state)).toEqual(
        true
      );
    });
  });

  describe('Testing catchmentList Selectors', () => {
    it('Should return the catchmentList status', () => {
      const catchmentList: any = [];
      const state: CustomerState = {
        ...initialState,
        catchmentList: catchmentList
      };
      expect(selectors.selectCatchmentArea.projector(state)).toEqual(
        catchmentList
      );
    });
  });

  describe('Testing brandDetails Selectors', () => {
    it('Should return the brandDetails status', () => {
      const brandDetails: any = null;
      const state: CustomerState = {
        ...initialState,
        brandDetails: brandDetails
      };
      expect(selectors.selectBrandDetail.projector(state)).toEqual(
        brandDetails
      );
    });
  });

  describe('Testing panVerificationResponse Selectors', () => {
    it('Should return the panVerificationResponse status', () => {
      const panVerificationResponse = null;
      const state: CustomerState = {
        ...initialState,
        panVerificationResponse: panVerificationResponse
      };
      expect(selectors.selectPanVerificationStatus.projector(state)).toEqual(
        panVerificationResponse
      );
    });
  });

  describe('Testing gstVerificationResponse Selectors', () => {
    it('Should return the gstVerificationResponse status', () => {
      const gstVerificationResponse = null;
      const state: CustomerState = {
        ...initialState,
        gstVerificationResponse: gstVerificationResponse
      };
      expect(selectors.selectGstVerificationStatus.projector(state)).toEqual(
        gstVerificationResponse
      );
    });
  });

  describe('Testing rivaahCouponDetail Selectors', () => {
    it('Should return the rivaahCouponDetail status', () => {
      const rivaahCouponDetail = null;
      const state: CustomerState = {
        ...initialState,
        rivaahCouponDetail: rivaahCouponDetail
      };
      expect(selectors.selectRivaahCouponDetails.projector(state)).toEqual(
        rivaahCouponDetail
      );
    });
  });

  describe('Testing customerDetails Selectors', () => {
    it('Should return the customerDetails status', () => {
      const customerDetails = null;
      const state: CustomerState = {
        ...initialState,
        customerDetails: customerDetails
      };
      expect(selectors.selectGetCustomerDetails.projector(state)).toEqual(
        customerDetails
      );
    });
  });

  describe('Testing enableCreate Selectors', () => {
    it('Should return the enableCreate status', () => {
      const enableCreate = true;
      const state: CustomerState = {
        ...initialState,
        enableCreate: enableCreate
      };
      expect(selectors.selectEnableCreate.projector(state)).toEqual(
        enableCreate
      );
    });
  });

  describe('Testing enableEdit Selectors', () => {
    it('Should return the enableEdit status', () => {
      const enableEdit = true;
      const state: CustomerState = {
        ...initialState,
        enableEdit: enableEdit
      };
      expect(selectors.selectEnableEdit.projector(state)).toEqual(enableEdit);
    });
  });

  describe('Testing enableEdit Selectors', () => {
    it('Should return the enableEdit status', () => {
      const enableEdit = true;
      const state: CustomerState = {
        ...initialState,
        enableEdit: enableEdit
      };
      expect(selectors.selectEnableEdit.projector(state)).toEqual(enableEdit);
    });
  });
});
