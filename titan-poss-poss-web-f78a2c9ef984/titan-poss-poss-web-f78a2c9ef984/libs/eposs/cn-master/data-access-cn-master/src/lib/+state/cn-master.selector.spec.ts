import { CnMasterListResponse } from '@poss-web/shared/models';
import { initialState } from './cn-master.reducer';
import * as selectors from './cn-master.selector';
import { CreditNoteMasterState } from './cn-master.state';

describe('Testing Credit Note Master related Selectors', () => {
  const cnMasterListResponse: CnMasterListResponse = {
    cnMasterList: [
      {
        creditNoteType: 'Advance',
        description: 'advance booking description',
        isActive: true,
        IsAllowedForGHSGrammageAccount: false,
        IsAllowedforEghs: false
      },
      {
        creditNoteType: 'BillCancellation',
        description: 'BillCancellation',
        isActive: true,
        IsAllowedForGHSGrammageAccount: false,
        IsAllowedforEghs: false
      },
      {
        creditNoteType: 'CNIntBTQ',
        description: 'InterBoutique CN',
        isActive: true,
        IsAllowedForGHSGrammageAccount: false,
        IsAllowedforEghs: false
      }
    ],
    totalElements: 3
  };

  const cnMasterDetailResponse = {
    creditNoteType: 'GEP',
    description: 'GEP',
    isActive: true,
    IsAllowedForGHSGrammageAccount: false,
    IsAllowedforEghs: false
  };

  it('Should return Credit Note Master List ', () => {
    const state: CreditNoteMasterState = {
      ...initialState,
      creditNoteMasterlist: cnMasterListResponse.cnMasterList
    };
    expect(
      selectors.CreditNoteMasterSelectors.selectCreditNoteMasterList.projector(
        state
      )
    ).toEqual(cnMasterListResponse.cnMasterList);
  });

  it('Should return Total Elements ', () => {
    const state: CreditNoteMasterState = {
      ...initialState,
      totalElements: cnMasterListResponse.totalElements
    };
    expect(
      selectors.CreditNoteMasterSelectors.selectTotalElements.projector(state)
    ).toEqual(cnMasterListResponse.totalElements);
  });

  it('Should return creditNoteMasterDetails ', () => {
    const state: CreditNoteMasterState = {
      ...initialState,
      creditNoteMasterDetails: cnMasterDetailResponse
    };
    expect(
      selectors.CreditNoteMasterSelectors.selectCreditNoteDetailByCnType.projector(
        state
      )
    ).toEqual(cnMasterDetailResponse);
  });

  it('Should return  isLoading status ', () => {
    const state: CreditNoteMasterState = {
      ...initialState,
      isLoading: false
    };
    expect(
      selectors.CreditNoteMasterSelectors.selectIsloading.projector(state)
    ).toEqual(false);
  });

  it('Should return  hasUpdated status ', () => {
    const state: CreditNoteMasterState = {
      ...initialState,
      hasUpdated: true
    };
    expect(
      selectors.CreditNoteMasterSelectors.selectHasUpdated.projector(state)
    ).toEqual(true);
  });

  it('Should return  error ', () => {
    const state: CreditNoteMasterState = {
      ...initialState,
      error: null
    };
    expect(
      selectors.CreditNoteMasterSelectors.selectError.projector(state)
    ).toEqual(null);
  });
});
