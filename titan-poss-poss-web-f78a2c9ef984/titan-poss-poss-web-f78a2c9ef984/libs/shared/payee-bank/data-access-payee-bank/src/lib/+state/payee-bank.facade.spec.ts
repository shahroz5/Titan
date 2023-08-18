import { TestBed } from "@angular/core/testing";
import { Store } from "@ngrx/store";
import { provideMockStore } from "@ngrx/store/testing";
import {
  GlCodeDefaultsPayload,
  LoadPayeeBankListingPayload,
  PayeeBankGLCodePayload,
  SaveGLcodeDetails,
  SavePayeeBankFormPayload
} from "libs/shared/models/src/lib/company-related/payee-bank.model";
import {
  DeleteGlCodeDetails,
  EditPayeeBankFormDetails,
  GetGlCodeIsDefaults,
  GetLocationCodes,
  LoadMappedLocations,
  LoadPayeeBankByPayeeBankName,
  LoadPayeeBankDetails,
  LoadPayeeBankGlCodeDetails,
  LoadStates,
  LoadTowns,
  ResetBankDetails,
  ResetGlCodeDetails,
  SavePayeeBankFormDetails,
  SavePayeeBankGlCodeDetails,
  SearchPayeebankName,
  UpdateGlCodeDetails
} from "./payee-bank.action";
import { PayeeBankFacade } from "./payee-bank.facade"
import { initialState } from "./payee-bank.reducer";

describe('PayeeBank Facade Testing Suite', () => {
  let payeeBankFacade: PayeeBankFacade;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({initialState}), PayeeBankFacade]
    });
    payeeBankFacade = TestBed.inject(PayeeBankFacade);
    store = TestBed.inject(Store);
  });
  describe('Dispatch Actions', () => {
    it('should call LOAD_PAYEE_BANK_DETAILS_BY_PAYEE_BANK_NAME action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadPayeeBankByPayeeBankName('ICICI');
      payeeBankFacade.loadPayeeBankDetailsByPayeeBankName('ICICI');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })
    it('should call LOAD_PAYEE_BANK_DETAILS_LISTING action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: LoadPayeeBankListingPayload = {
        pageIndex: 0,
        pageSize: 10
      }
      const action = new LoadPayeeBankDetails(payload);
      payeeBankFacade.loadPayeeBankDetailsListing(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })
    it('should call EDIT_PAYEE_BANK_FORM_DETAILS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: SavePayeeBankFormPayload = {
        bankName: 'ICICI',
        bankCode: '123rc',
        address: 'addr1',
        mailId: null,
        ownerType: "L1,L2",
        contactPerson: null,
        isActive: true
      }
      const action = new EditPayeeBankFormDetails(payload);
      payeeBankFacade.editPayeeBankFormDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })
    it('should call SAVE_PAYEE_BANK_FORM_DETAILS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: SavePayeeBankFormPayload = {
        bankName: 'ICICI',
        bankCode: '123rc',
        address: 'addr1',
        mailId: null,
        ownerType: "L1,L2",
        contactPerson: null,
        isActive: true
      }
      const action = new SavePayeeBankFormDetails(payload);
      payeeBankFacade.savePayeeBankFormDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })
    it('should call SEARCH_PAYEE_BANK action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new SearchPayeebankName('ICICI');
      payeeBankFacade.searchPayeeBank('ICICI');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })
    it('should call LOAD_GL_CODE_DETAILS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: PayeeBankGLCodePayload = {
        payloadData: {
          bankName: 'AMEX',
          locationCode: ['CPD'],
          paymentCode: ['CASH']
        },
        pageEvent: {
          pageIndex: 0,
          pageSize: 10
        },
        isPageable: false
      }
      const action = new LoadPayeeBankGlCodeDetails(payload);
      payeeBankFacade.loadGlCodeDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })
    it('should call SAVE_GL_CODE_DETAILS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: SaveGLcodeDetails = {
        bankName: 'ICICI',
        addLocations: [],
        addPaymentCodes: [],
        removeLocations: [],
        removePaymentCodes: [],
        updateConfigs: []
      }
      const action = new SavePayeeBankGlCodeDetails(payload);
      payeeBankFacade.saveGlCodeDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })
    it('should call RESET_GL_CODE_DETAILS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetGlCodeDetails();
      payeeBankFacade.resetGlCodeDetails();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })
    it('should call RESET_BANK_DETAILS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetBankDetails();
      payeeBankFacade.resetBankDetails();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })
    it('should call LOAD_LOCATIONS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new GetLocationCodes();
      payeeBankFacade.loadLocations();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })
    it('should call LOAD_GL_CODE_DEFAULTS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: GlCodeDefaultsPayload = {
        defaultList: [
          {
            locationCode: 'DELHI',
            paymentCode: 'CASH'
          }
        ]
      };
      const action = new GetGlCodeIsDefaults(payload);
      payeeBankFacade.loadGlCodeDefaults(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })
    it('should call LOAD_GL_CODE_MAPPED_LOCATIONS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: PayeeBankGLCodePayload = {
        payloadData: {
          bankName: 'AMEX',
          locationCode: ['CPD'],
          paymentCode: ['CASH']
        },
        pageEvent: {
          pageIndex: 0,
          pageSize: 10
        },
        isPageable: false
      };
      const action = new LoadMappedLocations(payload);
      payeeBankFacade.loadGlCodeMappedLocations(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })
    it('should call DELETE_GL_ROW_DATA action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new DeleteGlCodeDetails('23456');
      payeeBankFacade.deleteGlRowData('23456');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })
    it('should call LOAD_TOWNS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadTowns('A74E2071-A737-4835-865B-3CFAFFCD118B');
      payeeBankFacade.loadTowns('A74E2071-A737-4835-865B-3CFAFFCD118B');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })
    it('should call LOAD_STATES action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadStates('IND');
      payeeBankFacade.loadStates('IND');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })
    it('should call UPDATE_GL_ROW_DATA action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload =  {
        id: '1',
        glCode: 22,
        isDefault: false
      }
      const action = new UpdateGlCodeDetails(payload);
      payeeBankFacade.updateGlRowData(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    })
  })

  describe('Access Selector Action', () => {
    it('should access the payeeBankSaveResponse', () => {
      expect(payeeBankFacade.getPayeeBankSaveResponse()).toEqual(
        payeeBankFacade['isPayeeBankSaved$']
      )
    })
    it('should access the payeeBankEditResponse', () => {
      expect(payeeBankFacade.getPayeeBankEditResponse()).toEqual(
        payeeBankFacade['isPayeeBankEdited$']
      )
    })
    it('should access the saveBankDetailsSuccess', () => {
      expect(payeeBankFacade.getIsSaveBankDetailsSuccess()).toEqual(
        payeeBankFacade['isSaveBankDetailsSuccess$']
      )
    })
    it('should access the editBankDetailsSuccess', () => {
      expect(payeeBankFacade.getIsEditBankDetailsSuccess()).toEqual(
        payeeBankFacade['isEditBankDetailsSuccess$']
      )
    })
    it('should access the totalPayeeBankDetails', () => {
      expect(payeeBankFacade.getTotalPayeeBankDetails()).toEqual(
        payeeBankFacade['totalPayeeBankDetails$']
      )
    })
    it('should access the payeeBankDetailsListing', () => {
      expect(payeeBankFacade.getPayeeBankDetailsListing()).toEqual(
        payeeBankFacade['payeeBankListing$']
      )
    })
    it('should access the payeeBankDetailsByPayeeBankName', () => {
      expect(payeeBankFacade.getPayeeBankDetailsByPayeeBankName()).toEqual(
        payeeBankFacade['PayeeBankDetailsByPayeeBankName$']
      )
    })
    it('should access the glCodeDetails', () => {
      expect(payeeBankFacade.getGlCodeDetails()).toEqual(
        payeeBankFacade['glCodeDetail$']
      )
    })
    it('should access the locationCodes', () => {
      expect(payeeBankFacade.getLocationCodes()).toEqual(
        payeeBankFacade['locationCodes$']
      )
    })
    it('should access the saveGlCodeSuccess', () => {
      expect(payeeBankFacade.getSaveGlCodeSuccess()).toEqual(
        payeeBankFacade['glCodeDetailsSuccess$']
      )
    })
    it('should access the glCodeDefaults', () => {
      expect(payeeBankFacade.getGlCodeDefaults()).toEqual(
        payeeBankFacade['glCodeDefaults$']
      )
    })
    it('should access the glCodeListCount', () => {
      expect(payeeBankFacade.getGlCodeListCount()).toEqual(
        payeeBankFacade['glCodeListCount$']
      )
    })
    it('should access the glCodeMappedLocations', () => {
      expect(payeeBankFacade.getGlCodeMappedLocations()).toEqual(
        payeeBankFacade['glCodeMappedLocations$']
      )
    })
    it('should access the towns', () => {
      expect(payeeBankFacade.getTowns()).toEqual(
        payeeBankFacade['towns$']
      )
    })
    it('should access the states', () => {
      expect(payeeBankFacade.getStates()).toEqual(
        payeeBankFacade['states$']
      )
    })
    it('should access the error', () => {
      expect(payeeBankFacade.getError()).toEqual(
        payeeBankFacade['hasError$']
      )
    })
    it('should access the loading', () => {
      expect(payeeBankFacade.getisLoading()).toEqual(
        payeeBankFacade['isLoading$']
      )
    })
  })
})
