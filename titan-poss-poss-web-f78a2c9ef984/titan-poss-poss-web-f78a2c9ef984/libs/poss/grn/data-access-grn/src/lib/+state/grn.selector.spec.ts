// you will need to assert that the store is calling the right selector function.

import { CustomErrors } from '@poss-web/shared/models';

import { initialState } from './grn.reducer';
import * as selectors from './grn.selector';

import { GrnSate } from './grn.state';
import * as moment from 'moment';

describe('GrnSate selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };

  describe('Testing GrnSate related Selectors', () => {
    it('selectTotalReturnProduct Should return the total return products', () => {
      const state: GrnSate = {
        ...initialState,
        totalReturnProduct: 10
      };
      expect(
        selectors.grnSelectors.selectTotalReturnProduct.projector(state)
      ).toEqual(10);
    });

    it('selectError Should return the error object', () => {
      const state: GrnSate = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(selectors.grnSelectors.selectError.projector(state)).toEqual(
        error
      );
    });

    it('selectTotalReturnGrn  Should return true or false', () => {
      const state: GrnSate = {
        ...initialState,
        totalReturnGrn: 10
      };
      expect(
        selectors.grnSelectors.selectTotalReturnGrn.projector(state)
      ).toEqual(10);
    });

    it('selectHasUpdated  Should return true or false', () => {
      const state: GrnSate = {
        ...initialState,
        hasUpdated: true
      };
      expect(selectors.grnSelectors.selectHasUpdated.projector(state)).toEqual(
        true
      );
    });

    it('selectCustomerId  Should return true or false', () => {
      const state: GrnSate = {
        ...initialState,
        customerId: '1'
      };
      expect(selectors.grnSelectors.selectCustomerId.projector(state)).toEqual(
        '1'
      );
    });

    it('selectHassaved  Should return true or false', () => {
      const state: GrnSate = {
        ...initialState,
        hasSaved: true
      };
      expect(selectors.grnSelectors.selectHassaved.projector(state)).toEqual(
        true
      );
    });

    it('selectIsLoading  Should return true or false', () => {
      const state: GrnSate = {
        ...initialState,
        isLoading: true
      };
      expect(selectors.grnSelectors.selectIsLoading.projector(state)).toEqual(
        true
      );
    });

    it('selectTotalElement  Should return total elements', () => {
      const state: GrnSate = {
        ...initialState,
        totalElements: 1
      };
      expect(
        selectors.grnSelectors.selectTotalElement.projector(state)
      ).toEqual(1);
    });

    it('selectGrnConfirmResponse  Should return confirmResponse', () => {
      const state: GrnSate = {
        ...initialState,
        grnConfirmResponse: {
          cnAmt: 1000,
          cndocNos: [1],
          id: '1',
          docNo: 2,
          loyaltyReversalPoint: 1
        }
      };
      expect(
        selectors.grnSelectors.selectGrnConfirmResponse.projector(state)
      ).toEqual({
        cnAmt: 1000,
        cndocNos: [1],
        id: '1',
        docNo: 2,
        loyaltyReversalPoint: 1
      });
    });

    // it('selectGrnInitResponse  Should return init response', () => {
    //   const state: GrnSate = {
    //     ...initialState,
    //     grnInitiateResponse: {
    //       refCustomerId: 10,
    //       refDocDate: moment(),
    //       refFiscalYear: 10,
    //       refDocNo: 10,
    //       focValue: '33',
    //       grnCustomerId: 10,
    //       cmNetAmount: '33',
    //       id: '33',
    //       invoicedGoldRate: '33',
    //       invoicedPlatinumRate: '33',
    //       invoicedSilverRate: '33',
    //       items: null,
    //       loyaltyPoints: 10,
    //       otherCharges: 10,
    //       status: '33',
    //       totalValue: 10,
    //       returnableItemIds: ['1', '2'],
    //       returnedItemIds: ['1', '2'],
    //       txnType: '33',
    //       subTxnType: '33',
    //       tcsTobeRefund: '33'
    //     }
    //   };
    //   expect(
    //     selectors.grnSelectors.selectGrnInitResponse.projector(state)
    //   ).toEqual({
    //     refCustomerId: 10,
    //     refDocDate: moment(),
    //     refFiscalYear: 10,
    //     refDocNo: 10,
    //     focValue: '33',
    //     grnCustomerId: 10,
    //     cmNetAmount: '33',
    //     id: '33',
    //     invoicedGoldRate: '33',
    //     invoicedPlatinumRate: '33',
    //     invoicedSilverRate: '33',
    //     items: null,
    //     loyaltyPoints: 10,
    //     otherCharges: 10,
    //     status: '33',
    //     totalValue: 10,
    //     returnableItemIds: ['1', '2'],
    //     returnedItemIds: ['1', '2'],
    //     txnType: '33',
    //     subTxnType: '33',
    //     tcsTobeRefund: '33'
    //   });
    // });

    it('selectApprovers  Should return aprovers', () => {
      const state: GrnSate = {
        ...initialState,
        approvers: []
      };
      expect(selectors.grnSelectors.selectApprovers.projector(state)).toEqual(
        []
      );
    });

    it('selectLocationCodes  Should return location codes', () => {
      const state: GrnSate = {
        ...initialState,
        locationCodes: ['URB']
      };
      expect(
        selectors.grnSelectors.selectLocationCodes.projector(state)
      ).toEqual(['URB']);
    });

    // it('selectReqId  Should returns req id', () => {
    //   const state: GrnSate = {
    //     ...initialState,
    //     sendForApprovalResponse: {
    //       requestNo: 1,
    //       docNo: 1,
    //       id: '1'
    //     }
    //   };
    //   expect(selectors.grnSelectors.selectReqId.projector(state)).toBe({
    //     requestNo: 1,
    //     docNo: 1,
    //     id: '1'
    //   });
    // });

    it('selectGrnHistoryDetails  Should return true or false', () => {
      const state: GrnSate = {
        ...initialState,
        grnHistory: [
          {
            customerName: 'abc',
            createdDate: 28 - 1 - 2021,
            createdBy: 'abc',
            grnNo: 10,
            cnNumber: 10,
            fiscalYear: 10,
            netAmount: 10,
            cmLocation: 'abc',
            status: 'abc',
            creditNoteType: 'GRN'
          }
        ]
      };
      expect(
        selectors.grnSelectors.selectGrnHistoryDetails.projector(state)
      ).toEqual([
        {
          customerName: 'abc',
          createdDate: 28 - 1 - 2021,
          createdBy: 'abc',
          grnNo: 10,
          cnNumber: 10,
          fiscalYear: 10,
          netAmount: 10,
          cmLocation: 'abc',
          status: 'abc',
          creditNoteType: 'GRN'
        }
      ]);
    });

    it('selectTotalGrnHistoryReq  Should return true or false', () => {
      const state: GrnSate = {
        ...initialState,
        totalGrnHistoryReq: 10
      };

      expect(
        selectors.grnSelectors.selectTotalGrnHistoryReq.projector(state)
      ).toEqual(10);
    });

    it('selectGrnReasons  Should return true or false', () => {
      const state: GrnSate = {
        ...initialState,
        grnReasons: [
          {
            value: 'other reason',
            code: 'other reasons',
            isActive: true
          }
        ]
      };
      expect(selectors.grnSelectors.selectGrnReasons.projector(state)).toEqual([
        {
          value: 'other reason',
          code: 'other reasons',
          isActive: true
        }
      ]);
    });
  });
});
