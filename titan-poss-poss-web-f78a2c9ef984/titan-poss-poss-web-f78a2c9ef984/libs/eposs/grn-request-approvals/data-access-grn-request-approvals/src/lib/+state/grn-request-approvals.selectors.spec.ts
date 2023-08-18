// you will need to assert that the store is calling the right selector function.

import {
  CustomErrors,
  GrnRequestApprovalListResponse
} from '@poss-web/shared/models';

import { initialState } from './grn-request-approvals.reducer';
import * as selectors from './grn-request-approvals.selectors';

import { GrnRequestApprovalState } from './grn-request-approvals.state';
import {
  GrnRequestListEntity,
  grnRequestListAdaptor
} from './grn-request-approvals.entity';

describe('GrnRequestApprovalState selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };

  const createReqResponse = (
    srcBoutiqueCode: string,
    destBoutiqueCode: string,
    variantCode: string,
    lotNumber: string,
    fiscalYear: string,
    cmDocNumber: string,
    isCmGoldRate: boolean,
    grnComments: string,
    grnReasons: string,
    approvedBy: string,
    approvalCode: string,
    approvalMailDated: any,
    returnedQty: number,
    itemWeight: string,
    pricePerUnit: number,
    grnTotalPrice: number,
    grnNumber: string,
    processId: string,
    taskId: string,
    taskName: string,
    remarks: string,
    cancelType: string
  ): GrnRequestApprovalListResponse => {
    return {
      srcBoutiqueCode,
      destBoutiqueCode,
      variantCode,
      lotNumber,
      fiscalYear,
      cmDocNumber,
      isCmGoldRate,
      grnComments,
      grnReasons,
      approvedBy,
      approvalCode,
      approvalMailDated,
      returnedQty,
      itemWeight,
      pricePerUnit,
      grnTotalPrice,
      grnNumber,
      processId,
      taskId,
      taskName,
      remarks,
      cancelType,
      totalElements: 1
    };
  };

  const req1 = createReqResponse(
    'URB',
    'CPD',
    '100',
    '001',
    '2020',
    '1',
    true,
    'test',
    'dont want',
    'SM',
    '11',
    '',
    1,
    '0.01',
    100,
    100,
    '10',
    '1',
    '11',
    't',
    'remarks',
    'cancelType'
  );

  const req2 = createReqResponse(
    'URB',
    'CPD',
    '100',
    '001',
    '2020',
    '1',
    true,
    'test',
    'dont want',
    'SM',
    '11',
    '',
    1,
    '0.01',
    100,
    100,
    '10',
    '2',
    '11',
    't',
    'remarks',
    'cancelType'
  );
  const grnRequestListArray = [req1, req2];
  const addElementToEntities = <T extends GrnRequestApprovalListResponse>(
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
  const grnRequestListState: GrnRequestListEntity = {
    ids: ['1', '2'],
    entities: addElementToEntities(grnRequestListArray)
  };
  describe('Testing GrnRequestApprovalState related Selectors', () => {
    it('selectGrnRequestApprovalList Should return the GRN request list', () => {
      const grnRequestList = grnRequestListAdaptor.setAll(grnRequestListArray, {
        ...grnRequestListAdaptor.getInitialState()
      });
      const state: GrnRequestApprovalState = {
        ...initialState,
        grnRequestList: grnRequestListState
      };
      expect(selectors.grnRequestApprovalList.projector(state)).toEqual(
        grnRequestList
      );
    });
    it('Should return the list of  GRN request list', () => {
      expect(
        selectors.grnRequestApprovalSelector.selectGrnRequestApprovalList.projector(
          grnRequestListState
        )
      ).toEqual(grnRequestListArray);
    });

    it('selectIsLoading Should return the true or false', () => {
      const state: GrnRequestApprovalState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.grnRequestApprovalSelector.selectIsLoading.projector(state)
      ).toEqual(true);
    });

    it('selectError Should return the error object', () => {
      const state: GrnRequestApprovalState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(
        selectors.grnRequestApprovalSelector.selectError.projector(state)
      ).toEqual(error);
    });

    it('selectHasSaved  Should return true or false', () => {
      const state: GrnRequestApprovalState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.grnRequestApprovalSelector.selectHasSaved.projector(state)
      ).toEqual(true);
    });

    it('selectHasUpdated  Should return true or false', () => {
      const state: GrnRequestApprovalState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.grnRequestApprovalSelector.selectHasUpdated.projector(state)
      ).toEqual(true);
    });
  });
});
