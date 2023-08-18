import { Store } from '@ngrx/store';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { CtGrfFacade } from './grf.facade';
import { CtGrfState } from './grf.state';

import {
  GenerateOTP,
  InitiateGrf,
  LoadFrozenCNs,
  LoadRsoDetails,
  MergeCNs,
  PartiallyUpdateGrf,
  RemoveALLGRFCNs,
  RemoveGRFCN,
  ResetGrf,
  SearchGRF,
  SetGoldWeight,
  SetRemarks,
  SetSelectedRsoName,
  SetTotalAmount,
  UpdateGrf,
  ValidateOTP
} from './grf.actions';
import {
  MergeCNPayload,
  PartialUpdateGrfRequestPayload,
  UpdateGrfRequestPayload
} from '@poss-web/shared/models';
import { creditNoteAdaptor } from './grf.entity';

describe('Ct Grf Facade Testing Suite', () => {
  const initialState: CtGrfState = {
    errors: null,
    isLoading: false,
    selectedRsoName: { value: '', description: '' },
    totalAmt: 0,
    initiateGrfResponse: null,
    updateGrfResponse: null,
    partiallyGrfResponse: null,
    rsoDetails: [],
    remarks: '',
    goldWeight: 0.0,
    viewGrfResponse: null,
    frozenCNs: [],
    creditNote: creditNoteAdaptor.getInitialState(),
    mergeCNsResponse: null,
    hasOtpGenerated: false,
    hasOtpValidated: false,
    anotherCustomerCN: null,
    grfHistoryItems: null,
    historySearchParamDetails: null,
    orderNumber: { order: 0, status: null },
    cnValidationDetails: null
  };

  let ctGrfFacade: CtGrfFacade;
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), CtGrfFacade]
    });

    ctGrfFacade = TestBed.inject(CtGrfFacade);
    store = TestBed.inject(Store);
  });

  describe('Set Total Amount', () => {
    it('should dispatch SetTotalAmount action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const totalAmount = 22345;
      const expectedAction = new SetTotalAmount(totalAmount);
      ctGrfFacade.setTotalAmount(totalAmount);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('Initiate Grf', () => {
    it('should dispatch initiateGrf action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new InitiateGrf('NEW_GRF', null);
      ctGrfFacade.initiateGrf('NEW_GRF', null);
      ctGrfFacade.getInitiateGrfResponse();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('Update Grf', () => {
    it('should dispatch updateGrf action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const updateGrfRequestPayload: UpdateGrfRequestPayload = {
        customerId: 0,
        paidValue: 10000,
        remarks: '',
        metalRateList: {
          metalRates: {
            J: {
              metalTypeCode: 'J',
              purity: 92,
              ratePerUnit: 1540,
              applicableDate: Number(new Date().toTimeString()),
              currency: 'INR'
            }
          }
        },
        weightAgreed: 2.5
      };
      const expectedAction = new UpdateGrf(
        'NEW_GRF',
        '',
        updateGrfRequestPayload
      );
      ctGrfFacade.updateGrf('NEW_GRF', '', updateGrfRequestPayload);
      ctGrfFacade.getUpdateGrfResponse();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('Partially Update Grf', () => {
    it('should dispatch partiallyUpdateGrf action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const partiallyUpdateGrfPayload: PartialUpdateGrfRequestPayload = {
        customerId: 0
      };
      const expectedAction = new PartiallyUpdateGrf(
        'NEW_GRF',
        '',
        partiallyUpdateGrfPayload
      );
      ctGrfFacade.partiallyUpdateGrf('NEW_GRF', '', partiallyUpdateGrfPayload);
      ctGrfFacade.getPartiallyUpdateGrfResponse();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('Set Selected Rso Name', () => {
    it('should dispatch SetSelectedRsoName action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SetSelectedRsoName({
        value: '123',
        description: 'RSO'
      });
      ctGrfFacade.setSelectedRsoName({ value: '123', description: 'RSO' });
      ctGrfFacade.getSelectedRsoName();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('Load Rso Details', () => {
    it('should dispatch LoadRsoDetails action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadRsoDetails('RSO');
      ctGrfFacade.loadRsoDetails('RSO');
      ctGrfFacade.getRsoDetails();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('Set Gold Weight', () => {
    it('should dispatch SetGoldWeight action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SetGoldWeight(2.5);
      ctGrfFacade.setGoldWeight(2.5);
      ctGrfFacade.getGoldWeight();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('Set Remarks', () => {
    it('should dispatch SetRemarks action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SetRemarks('Test Remarks');
      ctGrfFacade.setRemarks('Test Remarks');
      ctGrfFacade.getRemarks();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('Reset Grf', () => {
    it('should dispatch Rest Grf action', () => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ResetGrf();
      ctGrfFacade.resetGrf();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('getError and getIsLoading Testing', () => {
    it('should get Error and isLoading observable', () => {
      ctGrfFacade.getError();
      ctGrfFacade.getIsLoading();
    });
  });
  //merging CN
  describe('Dispatch Merge GRF Actions', () => {
    it('should call LOAD_FROZEN_CNS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadFrozenCNs('12');
      ctGrfFacade.loadFrozenCNs('12');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SEARCH_GRF', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SearchGRF({ docNo: '12', fiscalYear: '2021' });
      ctGrfFacade.searchGRF({ docNo: '12', fiscalYear: '2021' });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call MERGE_CNS', () => {
      const mergeCNPayload: MergeCNPayload = {
        tempFileIds: { others: ['abc123'] },
        customerId: '12',
        employeeCode: 'URB',
        ids: ['12'],
        remarks: 'abc'
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new MergeCNs(mergeCNPayload);
      ctGrfFacade.mergeCNs(mergeCNPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call GENERATE_OTP', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new GenerateOTP('12');
      ctGrfFacade.generateOTP('12');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call VALIDATE_OTP', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ValidateOTP({ token: 'abc123', id: 'abc123' });
      ctGrfFacade.validateOTP({ token: 'abc123', id: 'abc123' });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call REMOVE_GRF_CN', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new RemoveGRFCN('12');
      ctGrfFacade.removeGRFCN('12');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call REMOVE_ALL_GRF_CNS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new RemoveALLGRFCNs();
      ctGrfFacade.removeAllGEFCNs();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });
  //merging CN
  describe('Access Selectors', () => {
    it('should access the get frozenCNs', () => {
      expect(ctGrfFacade.getFrozenCNs()).toEqual(ctGrfFacade['frozenCNs$']);
    });

    it('should access the get GRF CN', () => {
      expect(ctGrfFacade.getGRFCN()).toEqual(ctGrfFacade['grfCN$']);
    });
    it('should access the get merge CN Response', () => {
      expect(ctGrfFacade.getMergeCNs()).toEqual(
        ctGrfFacade['mergeCNsResponse$']
      );
    });

    it('should access the get hasOtpValidated', () => {
      expect(ctGrfFacade.getHasOtpValidated()).toEqual(
        ctGrfFacade['hasValidateOTP$']
      );
    });

    it('should access the get anotherCustomerGRFCNs', () => {
      expect(ctGrfFacade.getAnotherCustomerGRFCN()).toEqual(
        ctGrfFacade['anotherCustomerGRFCN$']
      );
    });
  });
});
