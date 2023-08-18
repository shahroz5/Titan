import {
  CnMasterDetail,
  CnMasterListResponse,
  CustomErrors,
  PaginatePayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { initialState, creditNoteMasterReducer } from './cn-master.reducer';
import * as actions from './cn-master.actions';
import { CreditNoteMasterState } from './cn-master.state';

describe('Credit Note Master Reducer Testing Suite', () => {
  let testState = initialState;

  describe('Actions should update state properly', () => {
    it('should return the initial state', () => {
      const action: any = {};
      const state: CreditNoteMasterState = creditNoteMasterReducer(
        undefined,
        action
      );

      expect(state).toEqual(testState);
    });

    it('LOAD_CREDIT_NOTE_MASTER_LIST action', () => {
      testState = {
        ...testState,
        isLoading: false
      };
      const payload: PaginatePayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const action = new actions.LoadCreditNoteMasterList(payload);

      const result: CreditNoteMasterState = creditNoteMasterReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeTruthy();
    });

    it('LOAD_CREDIT_NOTE_MASTER_LIST_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        creditNoteMasterlist: null,
        totalElements: null
      };

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

      const action = new actions.LoadCreditNoteMasterListSuccess(
        cnMasterListResponse
      );

      const result: CreditNoteMasterState = creditNoteMasterReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.creditNoteMasterlist).toBe(
        cnMasterListResponse.cnMasterList
      );
      expect(result.totalElements).toBe(cnMasterListResponse.totalElements);
    });

    it('LOAD_CREDIT_NOTE_MASTER_LIST_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadCreditNoteMasterListFailure(payload);

      const result: CreditNoteMasterState = creditNoteMasterReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });

    it('SEARCH_CREDIT_NOTE_MASTER_LIST action', () => {
      testState = {
        ...testState,
        isLoading: false
      };
      const payload = 'GEP';

      const action = new actions.SearchCreditNoteMasterList(payload);

      const result: CreditNoteMasterState = creditNoteMasterReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeTruthy();
    });

    it('SEARCH_CREDIT_NOTE_MASTER_LIST_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        creditNoteMasterlist: null,
        totalElements: null
      };

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

      const action = new actions.SearchCreditNoteMasterListSuccess(
        cnMasterListResponse
      );

      const result: CreditNoteMasterState = creditNoteMasterReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.creditNoteMasterlist).toBe(
        cnMasterListResponse.cnMasterList
      );
      expect(result.totalElements).toBe(cnMasterListResponse.totalElements);
    });

    it('SEARCH_CREDIT_NOTE_MASTER_LIST_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.SearchCreditNoteMasterListFailure(payload);

      const result: CreditNoteMasterState = creditNoteMasterReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });

    it('LOAD_CREDIT_NOTE_MASTER_DETAIL_BY_CNTYPE action', () => {
      testState = {
        ...testState,
        isLoading: false
      };
      const payload = 'GEP';

      const action = new actions.LoadCreditNoteMasterDetailByCNType(payload);

      const result: CreditNoteMasterState = creditNoteMasterReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeTruthy();
    });

    it('LOAD_CREDIT_NOTE_MASTER_DETAIL_BY_CNTYPE_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        creditNoteMasterDetails: null
      };

      const cnMasterDetailResponse: CnMasterDetail = {
        creditNoteType: 'BillCancellation',
        description: 'BillCancellation',
        isActive: true,
        IsAllowedForGHSGrammageAccount: false,
        IsAllowedforEghs: false
      };

      const action = new actions.LoadCreditNoteMasterDetailByCNTypeSuccess(
        cnMasterDetailResponse
      );

      const result: CreditNoteMasterState = creditNoteMasterReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.creditNoteMasterDetails).toBe(cnMasterDetailResponse);
    });

    it('LOAD_CREDIT_NOTE_MASTER_DETAIL_BY_CNTYPE_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadCreditNoteMasterDetailByCNTypeFailure(
        payload
      );

      const result: CreditNoteMasterState = creditNoteMasterReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });

    it('UPDATE_CREDIT_NOTE_MASTER_DETAIL action', () => {
      testState = {
        ...testState,
        isLoading: false,
        hasUpdated: true
      };
      const payload = {
        cnType: 'GEP',
        cnDetail: {
          creditNoteType: 'BillCancellation',
          description: 'BillCancellation',
          configDetails: {
            data: {
              IsAllowedForGHSGrammageAccount: true,
              IsAllowedforEghs: true
            }
          },
          isActive: true
        }
      };

      const action = new actions.UpdateCreditNoteMasterDetail(payload);

      const result: CreditNoteMasterState = creditNoteMasterReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeTruthy();
      expect(result.hasUpdated).toBeFalsy();
    });

    it('UPDATE_CREDIT_NOTE_MASTER_DETAIL_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasUpdated: false,
        creditNoteMasterDetails: null
      };

      const cnMasterDetailResponse: CnMasterDetail = {
        creditNoteType: 'BillCancellation',
        description: 'BillCancellation',
        isActive: true,
        IsAllowedForGHSGrammageAccount: false,
        IsAllowedforEghs: false
      };

      const action = new actions.UpdateCreditNoteMasterDetailSuccess(
        cnMasterDetailResponse
      );

      const result: CreditNoteMasterState = creditNoteMasterReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.hasUpdated).toBeTruthy();
      expect(result.creditNoteMasterDetails).toBe(cnMasterDetailResponse);
    });

    it('UPDATE_CREDIT_NOTE_MASTER_DETAIL_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.UpdateCreditNoteMasterDetailFailure(payload);

      const result: CreditNoteMasterState = creditNoteMasterReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });

    it('LOAD_RESET action', () => {
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

      testState = {
        ...testState,
        creditNoteMasterlist: cnMasterListResponse.cnMasterList,
        hasUpdated: true,
        isLoading: false,
        error: null,
        totalElements: cnMasterListResponse.totalElements,
        creditNoteMasterDetails: cnMasterListResponse.cnMasterList[0]
      };

      const action = new actions.LoadReset();

      const result: CreditNoteMasterState = creditNoteMasterReducer(
        testState,
        action
      );

      expect(result.creditNoteMasterlist).toEqual([]);
    });
  });
});
