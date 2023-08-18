import {
  CustomErrors,
  TcsList,
  TcsRequestParam
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
import { initialState, ViewTcsReducer } from './view-tcs.reducer';
import * as actions from './view-tcs.actions';
import { ViewTcsState } from './view-tcs.state';

describe('View TCS Reducer Testing Suite', () => {
  let testState = initialState;

  describe('Actions should update state properly', () => {
    it('should return the initial state', () => {
      const action: any = {};
      const state: ViewTcsState = ViewTcsReducer(undefined, action);

      expect(state).toBe(testState);
    });

    it('LOAD_TCS_DETAILS action', () => {
      testState = {
        ...testState,
        isLoading: false
      };
      const requestBody: TcsRequestParam = {
        id: '123245',
        txnType: 'CM',
        subTxnType: 'NEW CM'
      };
      const action = new actions.LoadTcsDetails(requestBody);

      const result: ViewTcsState = ViewTcsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('LOAD_TCS_DETAILS_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        tcsDetails: null
      };

      const payload: TcsList[] = [
        {
          brandCode: 'Tanishq',
          ownerType: 'CPD',
          locationCode: 'CPD',
          docNo: '3453',
          transactionDate: moment(325363754757),
          fiscalYear: 2021,
          netInvoiceValue: 2345,
          tcsApplicableAmount: 10000,
          tcsPercentage: 0.01,
          tcsAmountPaid: 100,
          currentTransaction: false,
          tcsToBeCollected: 1000,
          tcsCollected: 1000
        }
      ];
      const action = new actions.LoadTcsDetailsSuccess(payload);

      const result: ViewTcsState = ViewTcsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.tcsDetails).toBe(payload);
    });

    it('LOAD_TCS_DETAILS_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadTcsDetailsFailure(payload);

      const result: ViewTcsState = ViewTcsReducer(testState, action);

      expect(result.error).toBe(payload);
    });
  });
});
