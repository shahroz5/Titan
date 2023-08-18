import { TcsList } from '@poss-web/shared/models';
import * as moment from 'moment';
import { initialState } from './view-tcs.reducer';
import * as selectors from './view-tcs.selectors';
import { ViewTcsState } from './view-tcs.state';

describe('Testing View TCS related Selectors', () => {
  const dummyTcsResponse = {
    customerTcsDetailsDtos: [
      {
        brandCode: 'Tanishq',
        ownerType: 'CPD',
        locationCode: 'CPD',
        docNo: 3453,
        transactionDate: 325363754757,
        fiscalYear: '2021',
        netInvoiceAmount: 2345,
        tcsApplicableAmount: 10000,
        tcsPercentage: 0.01,
        tcsAmountPaid: 100
      }
    ]
  };

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

  it('Should return  View TCS Details ', () => {
    const state: ViewTcsState = {
      ...initialState,
      tcsDetails: tcsResult
    };
    expect(
      selectors.ViewTcsSelectors.selectTcsDetails.projector(state)
    ).toEqual(tcsResult);
  });

  it('Should return  isLoading status ', () => {
    const state: ViewTcsState = {
      ...initialState,
      isLoading: false
    };
    expect(selectors.ViewTcsSelectors.selectIsLoading.projector(state)).toEqual(
      false
    );
  });

  it('Should return  error ', () => {
    const state: ViewTcsState = {
      ...initialState,
      error: null
    };
    expect(selectors.ViewTcsSelectors.selectError.projector(state)).toEqual(
      null
    );
  });
});
