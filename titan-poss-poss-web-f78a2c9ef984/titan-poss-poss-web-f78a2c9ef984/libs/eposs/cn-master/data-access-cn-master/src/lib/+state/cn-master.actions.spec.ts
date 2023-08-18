import {
  CnMasterListResponse,
  CnMasterRequestPayload,
  CustomErrors,
  PaginatePayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CreditNoteMasterActionTypes,
  LoadCreditNoteMasterDetailByCNType,
  LoadCreditNoteMasterDetailByCNTypeFailure,
  LoadCreditNoteMasterDetailByCNTypeSuccess,
  LoadCreditNoteMasterList,
  LoadCreditNoteMasterListFailure,
  LoadCreditNoteMasterListSuccess,
  LoadReset,
  SearchCreditNoteMasterList,
  SearchCreditNoteMasterListFailure,
  SearchCreditNoteMasterListSuccess,
  UpdateCreditNoteMasterDetail,
  UpdateCreditNoteMasterDetailFailure,
  UpdateCreditNoteMasterDetailSuccess
} from './cn-master.actions';

describe('credit-note-master Action Testing suit', () => {
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

  const cnMasterListApiResponse = {
    results: [
      {
        creditNoteType: 'Advance',
        description: 'advance booking description',
        configDetails: {
          data: {
            IsAllowedForGHSGrammageAccount: false,
            IsAllowedforEghs: false
          }
        },
        isActive: false
      },
      {
        creditNoteType: 'BillCancellation',
        description: 'BillCancellation',
        configDetails: {
          data: { IsAllowedForGHSGrammageAccount: true, IsAllowedforEghs: true }
        },
        isActive: true
      },
      {
        creditNoteType: 'CNIntBTQ',
        description: 'InterBoutique CN',
        configDetails: {
          data: {
            IsAllowedForGHSGrammageAccount: true,
            IsAllowedforEghs: false
          }
        },
        isActive: true
      },
      {
        creditNoteType: 'GEP',
        description: 'Gold Exchange',
        configDetails: {
          data: { IsAllowedForGHSGrammageAccount: true, IsAllowedforEghs: true }
        },
        isActive: true
      },
      {
        creditNoteType: 'GHS',
        description: 'Golden Harvest Scheme',
        configDetails: {
          data: { IsAllowedForGHSGrammageAccount: true, IsAllowedforEghs: true }
        },
        isActive: true
      },
      {
        creditNoteType: 'GRN',
        description: 'GRN',
        configDetails: {
          data: { IsAllowedForGHSGrammageAccount: true, IsAllowedforEghs: true }
        },
        isActive: true
      },
      {
        creditNoteType: 'TEP',
        description: 'TEP',
        configDetails: {
          data: { IsAllowedForGHSGrammageAccount: true, IsAllowedforEghs: true }
        },
        isActive: true
      }
    ],
    pageNumber: 0,
    pageSize: 10,
    totalPages: 1,
    totalElements: 7
  };

  const cnMasterDetailAPIresponse = {
    creditNoteType: 'BillCancellation',
    description: 'BillCancellation',
    configDetails: {
      data: { IsAllowedForGHSGrammageAccount: true, IsAllowedforEghs: true }
    },
    isActive: true
  };

  const cnMasterDetailResponse = {
    creditNoteType: 'GEP',
    description: 'GEP',
    isActive: true,
    IsAllowedForGHSGrammageAccount: false,
    IsAllowedforEghs: false
  };

  describe('Load Credit Note Master List Action Test Cases', () => {
    it('should check correct type is used for  LoadCreditNoteMasterList action ', () => {
      const payload: CnMasterRequestPayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const action = new LoadCreditNoteMasterList(payload);

      expect(action.type).toEqual(
        CreditNoteMasterActionTypes.LOAD_CREDIT_NOTE_MASTER_LIST
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  LoadCreditNoteMasterListSuccess action ', () => {
      const action = new LoadCreditNoteMasterListSuccess(cnMasterListResponse);

      expect(action.type).toEqual(
        CreditNoteMasterActionTypes.LOAD_CREDIT_NOTE_MASTER_LIST_SUCCESS
      );
      expect(action.payload).toEqual(cnMasterListResponse);
    });

    it('should check correct type is used for  LoadCreditNoteMasterListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCreditNoteMasterListFailure(payload);

      expect(action.type).toEqual(
        CreditNoteMasterActionTypes.LOAD_CREDIT_NOTE_MASTER_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load Credit Note Details by CN Type Action Test Cases', () => {
    it('should check correct type is used for  LoadCreditNoteMasterDetailByCNType action ', () => {
      const cnType = 'GEP';

      const action = new LoadCreditNoteMasterDetailByCNType(cnType);

      expect(action.type).toEqual(
        CreditNoteMasterActionTypes.LOAD_CREDIT_NOTE_MASTER_DETAIL_BY_CNTYPE
      );
      expect(action.payload).toEqual(cnType);
    });

    it('should check correct type is used for LoadCreditNoteMasterDetailByCNTypeSuccess action ', () => {
      const action = new LoadCreditNoteMasterDetailByCNTypeSuccess(
        cnMasterDetailResponse
      );

      expect(action.type).toEqual(
        CreditNoteMasterActionTypes.LOAD_CREDIT_NOTE_MASTER_DETAIL_BY_CNTYPE_SUCCESS
      );
      expect(action.payload).toEqual(cnMasterDetailResponse);
    });

    it('should check correct type is used for  LoadCreditNoteMasterDetailByCNTypeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCreditNoteMasterDetailByCNTypeFailure(payload);

      expect(action.type).toEqual(
        CreditNoteMasterActionTypes.LOAD_CREDIT_NOTE_MASTER_DETAIL_BY_CNTYPE_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Update Credit Note Master Details Action Test Cases', () => {
    it('should check correct type is used for UpdateCreditNoteMasterDetail action ', () => {
      const payload = {
        cnType: 'GEP',
        cnDetail: cnMasterDetailAPIresponse
      };

      const action = new UpdateCreditNoteMasterDetail(payload);

      expect(action.type).toEqual(
        CreditNoteMasterActionTypes.UPDATE_CREDIT_NOTE_MASTER_DETAIL
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for UpdateCreditNoteMasterDetailSuccess action ', () => {
      const action = new UpdateCreditNoteMasterDetailSuccess(
        cnMasterDetailResponse
      );

      expect(action.type).toEqual(
        CreditNoteMasterActionTypes.UPDATE_CREDIT_NOTE_MASTER_DETAIL_SUCCESS
      );
      expect(action.payload).toEqual(cnMasterDetailResponse);
    });

    it('should check correct type is used for  UpdateCreditNoteMasterDetailFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateCreditNoteMasterDetailFailure(payload);

      expect(action.type).toEqual(
        CreditNoteMasterActionTypes.UPDATE_CREDIT_NOTE_MASTER_DETAIL_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Search Credit Note Master List By CN Type Action Test Cases', () => {
    it('should check correct type is used for SearchCreditNoteMasterList action ', () => {
      const payload = 'GEP';

      const action = new SearchCreditNoteMasterList(payload);

      expect(action.type).toEqual(
        CreditNoteMasterActionTypes.SEARCH_CREDIT_NOTE_MASTER_LIST
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  SearchCreditNoteMasterListSuccess action ', () => {
      const action = new SearchCreditNoteMasterListSuccess(
        cnMasterListResponse
      );

      expect(action.type).toEqual(
        CreditNoteMasterActionTypes.SEARCH_CREDIT_NOTE_MASTER_LIST_SUCCESS
      );
      expect(action.payload).toEqual(cnMasterListResponse);
    });

    it('should check correct type is used for  SearchCreditNoteMasterListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchCreditNoteMasterListFailure(payload);

      expect(action.type).toEqual(
        CreditNoteMasterActionTypes.SEARCH_CREDIT_NOTE_MASTER_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Other Action Test Cases', () => {
    it('should check correct type is used for LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: CreditNoteMasterActionTypes.LOAD_RESET
      });
    });
  });
});
