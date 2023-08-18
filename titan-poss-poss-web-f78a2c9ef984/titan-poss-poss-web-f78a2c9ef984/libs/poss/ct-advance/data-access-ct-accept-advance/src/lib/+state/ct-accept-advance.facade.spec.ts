import { Store } from '@ngrx/store';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { CtAcceptAdvanceFacade } from './ct-accept-advance.facade';
import { CtAcceptAdvanceState } from './ct-accept-advance.state';

import {
  DeleteAdvanceTransactionDetails,
  InitiateAdvance,
  LoadAdvanceHistory,
  LoadRSODetails,
  PartiallyUpdateAdvance,
  ResetAcceptAdvance,
  SetHistoryAdvanceSearchParamDetails,
  SetOrderNumber,
  SetRemarks,
  SetSelectedRsoName,
  SetTotalAmount,
  UpdateAdvance,
  ViewAdvance
} from './ct-accept-advance.actions';
import {
  PartialUpdateAdvanceRequestPayload,
  UpdateAdvanceRequestPayload
} from '@poss-web/shared/models';
import { SetHistoryGrfSearchParamDetails } from 'libs/poss/grf/data-access-grf/src/lib/+state/grf.actions';

describe('Ct Accept Advance Facade Testing Suite', () => {
  const initialState: CtAcceptAdvanceState = {
    errors: null,
    isLoading: false,
    selectedRsoName: null,
    totalAmt: 0,
    initiateAdvanceResponse: null,
    updateAdvanceResponse: null,
    partiallyAdvanceResponse: null,
    rsoDetails: [],
    remarks: '',
    viewAdvanceResponse: null,
    advanceHistoryItems: null,
    historySearchParamDetails: null,
    orderNumber: null,
    deleteAdvanceTransactionResponse: null
  };

  let ctAcceptAdvanceFacade: CtAcceptAdvanceFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), CtAcceptAdvanceFacade]
    });

    ctAcceptAdvanceFacade = TestBed.inject(CtAcceptAdvanceFacade);
  });

  describe('Set Total Amount', () => {
    it('should dispatch SetTotalAmount action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const totalAmount = 22345;
      const expectedAction = new SetTotalAmount(totalAmount);
      ctAcceptAdvanceFacade.setTotalAmount(totalAmount);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Initiate Advance', () => {
    it('should dispatch initiateAdvance action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new InitiateAdvance();
      ctAcceptAdvanceFacade.initiateAdvance();
      ctAcceptAdvanceFacade.getInitiateAdvanceResponse();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Update Advance', () => {
    it('should dispatch updateAdvance action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const updateAdvanceRequestPayload: UpdateAdvanceRequestPayload = {
        customerId: 0,
        paidValue: 10000,
        remarks: '',
        weightAgreed: 2.5
      };
      const expectedAction = new UpdateAdvance('', updateAdvanceRequestPayload);
      ctAcceptAdvanceFacade.updateAdvance('', updateAdvanceRequestPayload);
      ctAcceptAdvanceFacade.getUpdateAdvanceResponse();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('ViewAdvance', () => {
    it('should dispatch ViewAdvance action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ViewAdvance('123');
      ctAcceptAdvanceFacade.getViewAdvanceDetails('123');
      ctAcceptAdvanceFacade.getViewAdvanceResponse();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('DeleteAdvanceTransactionDetails', () => {
    it('should dispatch deleteAdvanceTransactionDetails action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new DeleteAdvanceTransactionDetails('123');
        ctAcceptAdvanceFacade.deleteAdvanceTransactionDetails('123');
        ctAcceptAdvanceFacade.getDeleteAdvanceTransactionResponse();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('Partially Update Advance', () => {
    it('should dispatch partiallyUpdateAdvance action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const partiallyUpdateAdvancePayload: PartialUpdateAdvanceRequestPayload = {
          customerId: 0
        };
        const expectedAction = new PartiallyUpdateAdvance(
          '',
          partiallyUpdateAdvancePayload
        );
        ctAcceptAdvanceFacade.partiallyUpdateAdvance(
          '',
          partiallyUpdateAdvancePayload
        );
        ctAcceptAdvanceFacade.getPartiallyUpdateAdvanceResponse();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('Set Selected Rso Name', () => {
    it('should dispatch SetSelectedRsoName action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SetSelectedRsoName({
        value: '',
        description: ''
      });
      ctAcceptAdvanceFacade.setSelectedRsoName({ value: '', description: '' });
      ctAcceptAdvanceFacade.getSelectedRsoName();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Load Rso Details', () => {
    it('should dispatch LoadRsoDetails action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadRSODetails('RSO');
      ctAcceptAdvanceFacade.loadRsoDetails('RSO');
      ctAcceptAdvanceFacade.getRsoDetails();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Set Remarks', () => {
    it('should dispatch SetRemarks action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SetRemarks('Test Remarks');
      ctAcceptAdvanceFacade.setRemarks('Test Remarks');
      ctAcceptAdvanceFacade.getRemarks();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Reset Grf', () => {
    it('should dispatch Rest Grf action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ResetAcceptAdvance();
      ctAcceptAdvanceFacade.resetAcceptAdvance();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('SetHistorySearchParamDetails', () => {
    it('should dispatch SetHistorySearchParamDetails action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SetHistoryAdvanceSearchParamDetails({
          docNo: 123
        });
        ctAcceptAdvanceFacade.setHistorySearchParamDetails({
          docNo: 123
        });
        ctAcceptAdvanceFacade.getHistorySearchParamDetails();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('SetOrderNumber', () => {
    it('should dispatch SetOrderNumber action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SetOrderNumber(123, 'OPEN');
      ctAcceptAdvanceFacade.setOrderNumber(123, 'OPEN');
      ctAcceptAdvanceFacade.getOrderNumber();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('getError and getIsLoading Testing', () => {
    it('should get Error and isLoading observable', () => {
      ctAcceptAdvanceFacade.getError();
      ctAcceptAdvanceFacade.getIsLoading();
    });
  });

  describe('loadAdvanceHistory', () => {
    it('should dispatch loadAdvanceHistory action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadAdvanceHistory(
        {
          docNo: 123
        },
        '123',
        'docNo',
        'CONFIRMED',
        0,
        10
      );
      ctAcceptAdvanceFacade.loadAdvanceHistory(
        {
          docNo: 123
        },
        '123',
        'docNo',
        'CONFIRMED',
        0,
        10
      );
      ctAcceptAdvanceFacade.getAdvanceHistoryItems();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
