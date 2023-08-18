// you will need to assert that the store is calling the right selector function.

import { CustomErrors, CnApprovalListResponse } from '@poss-web/shared/models';

import { initialState } from './cn-approvals.reducer';
import * as selectors from './cn-approvals.selectors';

import { CnApprovalState } from './cn-approvals.state';
import {
  cnRequestListAdaptor,
  CnRequestListEntity
} from './cn-approvals.entity';

describe('cnApprovalSelector selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  const cn1 = {
    locationCode: 'CPD',
    cnNumber: '1',
    fiscalYear: '2020',
    cnType: 'ACTIVATE',
    cnDate: '21/06/2021',
    customerName: 'ABC',
    customerMobileNumber: '8976542378',
    amount: '1000',
    requestedBy: 'CPD',
    requestedType: 'ACTIVATE',
    suspendedDate: '20/06/2021',
    requestorRemarks: 11,
    remarks: 'OK',
    processId: '22',
    taskId: '33',
    taskName: 'TEST',
    totalElements: 10
  };
  const cn2 = {
    locationCode: 'CPD',
    cnNumber: '1',
    fiscalYear: '2020',
    cnType: 'ACTIVATE',
    cnDate: '21/06/2021',
    customerName: 'ABC',
    customerMobileNumber: '8976542378',
    amount: '1000',
    requestedBy: 'CPD',
    requestedType: 'ACTIVATE',
    suspendedDate: '20/06/2021',
    requestorRemarks: 11,
    remarks: 'OK',
    processId: '23',
    taskId: '33',
    taskName: 'TEST',
    totalElements: 10
  };
  const cnListArray = [cn1, cn2];
  const addElementToEntities = <T extends CnApprovalListResponse>(
    payload: T[]
  ): { [id: string]: T } => {
    const reducedEntities = payload.reduce(
      (entities: { [id: string]: T }, element: T) => {
        return {
          ...entities,
          [element.processId]: element
        };
      },
      {}
    );

    return reducedEntities;
  };
  const cnState: CnRequestListEntity = {
    ids: [cn1.processId, cn2.processId],
    entities: addElementToEntities(cnListArray)
  };

  describe('Testing CnApprovalState related Selectors', () => {
    it('cnApprovalsList Should return  cn request list', () => {
      const cnList = cnRequestListAdaptor.setAll(cnListArray, {
        ...cnRequestListAdaptor.getInitialState()
      });

      const state: CnApprovalState = {
        ...initialState,
        cnApprovalsList: cnState
      };
      expect(selectors.cnRequestApprovalList.projector(state)).toEqual(cnList);
    });
    it('cnApprovalsList Should return cn request list', () => {
      expect(
        selectors.cnApprovalSelector.selectCnRequestApprovalList.projector(
          cnState
        )
      ).toEqual(cnListArray);
    });

    it('selectIsLoading Should return the true or false', () => {
      const state: CnApprovalState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.cnApprovalSelector.selectIsLoading.projector(state)
      ).toEqual(true);
    });

    it('selectHasUpdated Should return the true or false', () => {
      const state: CnApprovalState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.cnApprovalSelector.selectHasUpdated.projector(state)
      ).toEqual(true);
    });

    it('selectError Should return the error object', () => {
      const state: CnApprovalState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(selectors.cnApprovalSelector.selectError.projector(state)).toEqual(
        error
      );
    });
  });
});
