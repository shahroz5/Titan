import {
  CustomErrors,
  TcsList,
  TcsRequestParam
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LoadTcsDetails,
  LoadTcsDetailsFailure,
  LoadTcsDetailsSuccess,
  ViewTcsActionTypes
} from './view-tcs.actions';

import * as moment from 'moment';

describe('View TCS Action Testing suit', () => {
  describe('Get TCS Detail Action Test Cases', () => {
    it('should check correct type is used for  LoadTcsDetails action ', () => {
      const requestBody: TcsRequestParam = {
        id: '123245',
        txnType: 'CM',
        subTxnType: 'NEW CM'
      };

      const action = new LoadTcsDetails(requestBody);

      expect(action.type).toEqual(ViewTcsActionTypes.LOAD_TCS_DETAILS);
      expect(action.payload).toEqual(requestBody);
    });

    it('should check correct type is used for LoadTcsDetailsSuccess action ', () => {
      const tcsResult: TcsList[] = [
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
      const action = new LoadTcsDetailsSuccess(tcsResult);

      expect(action.type).toEqual(ViewTcsActionTypes.LOAD_TCS_DETAILS_SUCCESS);
      expect(action.payload).toEqual(tcsResult);
    });

    it('should check correct type is used for  LoadTcsDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTcsDetailsFailure(payload);

      expect(action.type).toEqual(ViewTcsActionTypes.LOAD_TCS_DETAILS_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });
});
