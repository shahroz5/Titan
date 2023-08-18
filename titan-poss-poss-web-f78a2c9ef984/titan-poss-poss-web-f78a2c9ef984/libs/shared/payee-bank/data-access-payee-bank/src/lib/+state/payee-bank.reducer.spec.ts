import * as actions from './payee-bank.action';
import { PayeeBankState } from './payee-bank.state';
import { initialState, PayeeBankReducer } from './payee-bank.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  GlCodeDefaultsPayload,
  GlSelectMappedLocations,
  LoadPayeeBankListingPayload,
  LoadPayeeBankListingSuccessPayload,
  LocationCodeDetails,
  PayeeBankDetails,
  PayeeBankGLCodeDetails,
  PayeeBankGLCodePayload,
  PayeeGLCodeDetailsSuccessList,
  SavePayeeBankFormPayload,
  StateSummary,
  TownSummary
} from '@poss-web/shared/models';

describe('Stone Type reducer Testing Suite', () => {
  const createPayeeBank = (
    bankName: string,
    bankCode: string,
    addressOne: string,
    addressTwo: string,
    townName: string,
    stateName: string,
    mailId: string,
    contactPerson: string,
    ownerType: string,
    isActive: boolean
  ): PayeeBankDetails => {
    return {
      bankName,
      bankCode,
      addressOne,
      addressTwo,
      townName,
      stateName,
      mailId,
      contactPerson,
      ownerType,
      isActive
    };
  };

  const payeeBank1 = createPayeeBank(
    'AMERICAN EXPRESS',
    'AMEX',
    '1/278',
    'KK NAGAR',
    'BANGALORE',
    'KARNATAKA',
    'arun@gmail.com',
    'Arun',
    'L1',
    true
  );

  const payeeBank2 = createPayeeBank(
    'STATE  BANK',
    'SBI',
    '1/278',
    'RR NAGAR',
    'BANGALORE',
    'KARNATAKA',
    'arjun@gmail.com',
    'Arjun',
    'L1',
    true
  );

  it('should return the initial state', () => {
    const action: any = {};
    const state = PayeeBankReducer(null, action);

    expect(initialState).toBe(initialState);
  })

  describe('Testing LoadPayeeBankDetails list', () => {
    beforeEach(() => {});
    it('LoadPayeeBankDetails should return list of stone types', () => {
      const payload: LoadPayeeBankListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new actions.LoadPayeeBankDetails(payload);
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('LoadPayeeBankDetailsSuccess should return list of stone types', () => {
      const payload: LoadPayeeBankListingSuccessPayload = {
        payeeBankListing: [payeeBank1],
        totalElements: 1
      };
      const action = new actions.LoadPayeeBankDetailsSuccess(payload);
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.totalPayeeBankDetails).toBe([payeeBank1].length);
      expect(result.saveBankDetailsSuccess).toBe(false);
      expect(result.editBankDetailsSuccess).toBe(false);
      expect(result.saveGlCodeDetailSuccess).toBe(false);
    });

    it('LoadPayeeBankDetailsFailure should return list of stone types', () => {
      const action = new actions.LoadPayeeBankDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  // stonetype by stone type code

  describe('Testing LoadPayeeBankByPayeeBankName list', () => {
    beforeEach(() => {});
    it('LoadPayeeBankByPayeeBankName should return list of stone types', () => {
      const payload = 'AZ';
      const action = new actions.LoadPayeeBankByPayeeBankName(payload);
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('LoadStoneTypeDetailsSuccess should return list of stone types', () => {
      const payload: PayeeBankDetails = payeeBank1;
      const action = new actions.LoadPayeeBankByPayeeBankNameSuccess(payload);
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.payeeBankDetails).toBe(payeeBank1);
    });

    it('LoadPayeeBankByPayeeBankNameFailure should return list of stonetypecode', () => {
      const action = new actions.LoadPayeeBankByPayeeBankNameFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  //save
  describe('Testing SavePayeeBankFormDetails', () => {
    beforeEach(() => {});
    it('SavePayeeBankFormDetails should return list of stone types', () => {
      const payload: SavePayeeBankFormPayload = {
        bankName: 'AMERICAN EXPRESS',
        bankCode: 'AMEX',
        address: '1/278, KK NAGAR',
        townName: 'BANGALORE',
        stateName: 'KARNATAKA',
        mailId: 'arun@gmail.com',
        contactPerson: 'Arun',
        ownerType: 'L1',
        isActive: true
      };
      const action = new actions.SavePayeeBankFormDetails(payload);
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('SavePayeeBankFormDetailsSuccess should return list of stone types', () => {
      const payload: PayeeBankDetails = payeeBank1;
      const action = new actions.SavePayeeBankFormDetailsSuccess(payload);
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.saveBankDetailsSuccess).toBe(true);
    });

    it('SavePayeeBankFormDetailsFailure should return list of stonetypecode', () => {
      const action = new actions.SavePayeeBankFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  //edit

  describe('Testing EditPayeeBankFormDetails', () => {
    beforeEach(() => {});
    it('EditPayeeBankFormDetails should return list of stone types', () => {
      const payload: SavePayeeBankFormPayload = {
        bankName: 'AMERICAN EXPRESS',
        bankCode: 'AMEX',
        address: '1/278, KK NAGAR',
        townName: 'BANGALORE',
        stateName: 'KARNATAKA',
        mailId: 'arun@gmail.com',
        contactPerson: 'Arun',
        ownerType: 'L1',
        isActive: true
      };
      const action = new actions.EditPayeeBankFormDetails(payload);
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('EditPayeeBankFormDetailsSuccess should return list of stone types', () => {
      const payload: PayeeBankDetails = payeeBank1;
      const action = new actions.EditPayeeBankFormDetailsSuccess(payload);
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.editPayeeBankResponses).toBe(payeeBank1);
    });

    it('EditPayeeBankFormDetailsFailure should return list of stonetypecode', () => {
      const action = new actions.EditPayeeBankFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  //search

  describe('Testing Search Payee bank details by stone type code list', () => {
    beforeEach(() => {});
    it('Search Payee bank  should return Payee bank', () => {
      const payload = 'AMEX';
      const action = new actions.SearchPayeebankName(payload);
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('SearchPayeebankNameSuccess should return list of stone types', () => {
      const payload: PayeeBankDetails[] = [payeeBank1];
      const action = new actions.SearchPayeebankNameSuccess(payload);
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.isLoading).toBe(false);
    });

    it('SearchPayeebankNameFailure should return list of stonetypecode', () => {
      const action = new actions.SearchPayeebankNameFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });
  // Reset bank details
  describe('Testing ResetBankDetails ', () => {
    beforeEach(() => {});
    it('ResetBankDetails should reset the store', () => {
      const action = new actions.ResetBankDetails();
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result).toEqual(initialState);
    });
  });
  // Reset GL Code details
  describe('Testing ResetGlCodeDetails ', () => {
    beforeEach(() => {});
    it('ResetGlCodeDetails should reset the store', () => {
      const action = new actions.ResetGlCodeDetails();
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result).toEqual(initialState);
    });
  });
  // Load Gl code details

  describe('Testing LoadPayeeBankGlCodeDetails list', () => {
    beforeEach(() => {});
    it('LoadPayeeBankGlCodeDetails should return list of stone types', () => {
      const payload: PayeeBankGLCodePayload = {
        payloadData: {
          bankName: 'AMEX',
          locationCode: ['CPD'],
          paymentCode: ['CASH']
        },
        pageEvent: { pageIndex: 0, pageSize: 100 },
        isPageable: true
      };
      const action = new actions.LoadPayeeBankGlCodeDetails(payload);
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('LoadPayeeBankGlCodeDetailsSuccess should return list of stone types', () => {
      const payload: PayeeGLCodeDetailsSuccessList = {
        locationList: [],
        count: 0
      };
      const action = new actions.LoadPayeeBankGlCodeDetailsSuccess(payload);
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.saveGlCodeDetailSuccess).toBe(false);
    });

    it('LoadPayeeBankGlCodeDetailsFailure should return list of stone types', () => {
      const action = new actions.LoadPayeeBankGlCodeDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadTowns list', () => {
    beforeEach(() => {});
    it('LoadTowns should return list of stone types', () => {
      const action = new actions.LoadTowns('');
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    })

    it('LoadTownsSuccess should return list of stone types', () => {
      const payload: TownSummary[] = [{
        description: 'Description',
        townCode: 234
      }]
      const action = new actions.LoadTownsSuccess(payload)
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.isLoading).toBe(false);
    })
  })

  describe('Testing LoadStates list', () => {
    beforeEach(() => {});
    it('LoadStates should return list of stone types', () => {
      const action = new actions.LoadStates('');
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    })

    it('LoadStatesSuccess should return list of stone types', () => {
      const payload: StateSummary[] = [{
        stateId: 1,
        description: 'Description'
      }]
      const action = new actions.LoadStatesSuccess(payload);
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.isLoading).toBe(false);
    })
  })

  describe('Testing GetLocations list', () => {
    beforeEach(() => {});
    it('GetLocations should return list of stone types', () => {
      const action = new actions.GetLocationCodes();
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    })

    it('GetLocationsSuccess should return list of stone types', () => {
      const payload: LocationCodeDetails[] = [{
        locationCode: '123',
        description: 'Description'
      }]
      const action = new actions.GetLocationCodesSuccess(payload);
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.isLoading).toBe(false);
    })
  })

  describe('Testing GetMappedLocations list', () => {
    beforeEach(() => {});
    it('GetMappedLocations should return list of stone types', () => {
      const payload: PayeeBankGLCodePayload = {
        payloadData: {
          bankName: 'ICICI',
          paymentCode: ['CASH'],
        },
      }
      const action = new actions.LoadMappedLocations(payload);
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    })

    it('GetMappedLocationsSuccess should return list of stone types', () => {
      const payload: GlSelectMappedLocations[] = [{
        id: '123',
        description: 'Description'
      }]
      const action = new actions.LoadMappedLocationsSuccess(payload);
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.isLoading).toBe(false);
    })
  })

  describe('Testing DeleteGlCodeDetails list', () => {
    beforeEach(() => {});
    it('DeleteGlCodeDetails should return list of stone types', () => {
      const action = new actions.DeleteGlCodeDetails('');
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.isLoading).toBe(false);
    })
  })

  describe('Testing UpdateGlCodeDetails list', () => {
    beforeEach(() => {});
    const payload = {
      id: '1',
      glCode: 234,
      isDefault: false
    }
    it('UpdateGlCodeDetails should return list of stone types', () => {
      const action = new actions.UpdateGlCodeDetails(payload);
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.isLoading).toBe(false);
    })
  })

  describe('Testing CheckGlCodeDetails list', () => {
    beforeEach(() => {});
    it('CheckGlCodeDetails should return list of stone types', () => {
      const payload: GlCodeDefaultsPayload = {
        defaultList: [{
          locationCode: 'l1',
          paymentCode: 'CASH'
        }]
      }
      const action = new actions.GetGlCodeIsDefaults(payload);
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.isLoading).toBe(false);
    })

    it('CheckGlCodeDetailsSuccess should return list of stone types', () => {
      const payload: PayeeBankGLCodeDetails[] = [{
        id: '1',
        bankName: 'ICICI',
        locationCode: 'loc123',
        paymentCode: 'cash123',
        glCode: 1,
        isDefault: false
      }]
      const action = new actions.GetGlCodeIsDefaultsSuccess(payload);
      const result: PayeeBankState = PayeeBankReducer(initialState, action);
      expect(result.isLoading).toBe(false);
    })
  })
});
