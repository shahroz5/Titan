// Actions are not containing any business logic so this provides less value to
// test. They are only used to trigger a reducer or an effect, which is already
// covered by type-safety by using Typescript. You might anyway want to write tests
// for your action dispatchers for the sake of enforcing a specific coverage level
// and “double checking” that the right action is being dispatched.
import {
  GetBinRequestPayload,
  BinApprovalspayload,
  LoadBinRequestApprovalsCount,
  RequestApprovalsActionTypes,
  LoadBinRequestApprovalsCountSuccess,
  LoadBinRequestApprovalsCountFailure,
  LoadBinRequestApprovalsFailure,
  LoadBinRequestApprovals,
  LoadBinRequestApprovalsSuccess,
  ResetBinRequestApprovals,
  ResetBinRequestApprovalsCount,
  ResetRequestApprovalsItems,
  ResetRequestApprovalsItemsCount,
  ResetIBTRequestApprovals,
  ResetIBTRequestApprovalsCount,
  ResetEXHRequestApprovals,
  ResetEXHRequestApprovalsCount,
  ResetFOCRequestApprovals,
  ResetFOCRequestApprovalsCount,
  ResetLOSSRequestApprovals,
  ResetLOSSRequestApprovalsCount,
  ResetLOANRequestApprovals,
  ResetLOANRequestApprovalsCount,
  ResetADJRequestApprovals,
  ResetADJRequestApprovalsCount,
  ResetPSVRequestApprovals,
  ResetPSVRequestApprovalsCount,
  ResetError,
  ResetStatus,
  LoadStuddedProductGroups,
  LoadStuddedProductGroupsSuccess,
  LoadStuddedProductGroupsFailure,
  UpdateBinRequestApprovals,
  UpdateBinRequestApprovalsSuccess,
  UpdateBinRequestApprovalsFailure,
  IBTRequest,
  IbtRequestSuccess,
  IbtRequestFailure,
  IBTCancelRequest,
  IbtCancelRequestSuccess,
  IbtCancelRequestFailure,
  ClearItemList,
  LoadItemsTotalCount,
  LoadItemsTotalCountSuccess,
  LoadItemsTotalCountFailure,
  LoadIBtRequest,
  LoadIBtRequestFailure,
  LoadIBtRequestSuccess,
  LoadIBtCancellationRequest,
  LoadIBtCancellationRequestSuccess,
  LoadIBtCancellationRequestFailure,
  LoadLOANRequest,
  LoadLOANRequestSuccess,
  LoadLOANRequestFailure,
  LoadEXHRequest,
  LoadEXHRequestSuccess,
  LoadEXHRequestFailure,
  LoadSelectedCancelRequest,
  LoadSelectedRequestCancelSuccess,
  LoadSelectedCancelRequestFailure,
  LoadSelectedRequest,
  LoadSelectedRequestSuccess,
  LoadSelectedRequestFailure,
  LoadIBTCancelRequestApprovalsCount,
  LoadIBTCancelRequestApprovalsCountSuccess,
  LoadIBTCancelRequestApprovalsCountFailure,
  LoadFOCRequest,
  LoadFOCRequestSuccess,
  LoadFOCRequestFailure,
  LoadADJRequest,
  LoadADJRequestSuccess,
  LoadADJRequestFailure,
  LoadPSVRequest,
  LoadPSVRequestSuccess,
  LoadPSVRequestFailure,
  LoadLOSSRequest,
  LoadLOSSRequestSuccess,
  LoadLOSSRequestFailure
} from './request-approvals.actions';
import {
  BinRequestApprovalsItems,
  BinApprovals,
  LoadBinRequestResponse,
  LoadIbtRequestPayload
} from '@poss-web/shared/models';
import { CustomErrors } from '@poss-web/shared/models';
import {
  RequestApprovals,
  LoadRequestResponse,
  LoadRequestResponseItems,
  RequestApprovalsItems,
  ApprovalUpdatePayload
} from '@poss-web/shared/models';
import { LoadRequestTotalCountSuccessPayload } from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Request Approvals Action Testing Suite', () => {
  describe('Load  BinRequestApprovals Count Action Test Cases', () => {
    it('should check correct type is used for Load  BinRequestApprovals Count action ', () => {
      const action = new LoadBinRequestApprovalsCount();

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_BINREQUESTAPPROVALS_COUNT
      });
    });
    it('should check correct type is used for  Load  BinRequestApprovals Count Success action ', () => {
      const payload: any = 0;
      const action = new LoadBinRequestApprovalsCountSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          RequestApprovalsActionTypes.LOAD_BINREQUESTAPPROVALS_COUNT_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  Load  BinRequestApprovals CountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBinRequestApprovalsCountFailure(payload);

      expect({ ...action }).toEqual({
        type:
          RequestApprovalsActionTypes.LOAD_BINREQUESTAPPROVALS_COUNT_FAILURE,
        payload
      });
    });
  });

  describe('Load  LoadIBtRequest Action Test Cases', () => {
    it('should check correct type is used LoadIBtRequest action ', () => {
      const payload: LoadIbtRequestPayload = {
        requestType: 'IBT',
        pageIndex: 9,
        pageSize: 0
      };
      const action = new LoadIBtRequest(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_IBT_REQUEST,
        payload
      });
    });
    it('should check correct type is used for LoadIBtRequestSuccess Success action ', () => {
      const payload: any = 0;
      const action = new LoadIBtRequestSuccess(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_IBT_REQUEST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  Load  BinRequestApprovals CountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadIBtRequestFailure(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_IBT_REQUEST_FAILURE,
        payload
      });
    });
  });

  describe('Load  LoadIBtCancellationRequest Action Test Cases', () => {
    it('should check correct type is used LoadIBtCancellationRequestaction ', () => {
      const payload = {
        requestType: 'IBT',
        pageIndex: 9,
        pageSize: 0,
        status: 'tt'
      };
      const action = new LoadIBtCancellationRequest(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_IBT_CANCELLATION_REQUEST,
        payload
      });
    });
    it('should check correct type is used for LoadIBtRequestSuccess Success action ', () => {
      const payload: any = 0;
      const action = new LoadIBtCancellationRequestSuccess(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_IBT_REQUEST_CANCELLATION_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadIBtCancellationRequestFailure Failure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadIBtCancellationRequestFailure(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_IBT_REQUEST_CANCELLATION_FAILURE,
        payload
      });
    });
  });

  describe('Load  LoadLOANRequest Action Test Cases', () => {
    it('should check correct type is used LoadLOANRequesttaction ', () => {
      const payload = {
        requestType: 'IBT',
        pageIndex: 9,
        pageSize: 0,
        status: 'tt'
      };
      const action = new LoadLOANRequest(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_LOAN_REQUEST,
        payload
      });
    });
    it('should check correct type is used for LoadLOANRequestSuccess  Success action ', () => {
      const payload: any = 0;
      const action = new LoadLOANRequestSuccess(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_LOAN_REQUEST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for   LoadLOANRequestFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadLOANRequestFailure(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_LOAN_REQUEST_FAILURE,
        payload
      });
    });
  });

  describe('Load  LoadEXHRequest  Action Test Cases', () => {
    it('should check correct type is used LoadEXHRequest taction ', () => {
      const payload = {
        requestType: 'IBT',
        pageIndex: 9,
        pageSize: 0,
        status: 'tt'
      };
      const action = new LoadEXHRequest(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_EXH_REQUEST,
        payload
      });
    });
    it('should check correct type is used for LoadEXHRequestSuccess action ', () => {
      const payload: any = 0;
      const action = new LoadEXHRequestSuccess(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_EXH_REQUEST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadEXHRequestFailure Failure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadEXHRequestFailure(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_EXH_REQUEST_FAILURE,
        payload
      });
    });
  });

  describe('Load LoadSelectedCancelRequest  Action Test Cases', () => {
    it('should check correct type is usedLoadSelectedCancelRequesttaction ', () => {
      const payload = {
        id: 123,
        requestType: 'IBT',
        pageIndex: 9,
        pageSize: 0,
        status: 'tt'
      };
      const action = new LoadSelectedCancelRequest(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_SELECTED_CANCELLATION_REQUEST,
        payload
      });
    });
    it('should check correct type is used forLoadSelectedRequestCancelSuccesaction ', () => {
      const payload: any = 0;
      const action = new LoadSelectedRequestCancelSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          RequestApprovalsActionTypes.LOAD_SELECTED_CANCELLATION_REQUEST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadSelectedCancelRequestFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedCancelRequestFailure(payload);

      expect({ ...action }).toEqual({
        type:
          RequestApprovalsActionTypes.LOAD_SELECTED_CANCELLATION_REQUEST_FAILURE,
        payload
      });
    });
  });

  describe('Load  s LoadSelectedRequest  Action Test Cases', () => {
    it('should check correct type is used s LoadSelectedRequesttaction ', () => {
      const payload = {
        id: 123,
        requestType: 'IBT',
        pageIndex: 9,
        pageSize: 0,
        status: 'tt'
      };
      const action = new LoadSelectedRequest(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_SELECTED_REQUEST,
        payload
      });
    });
    it('should check correct type is used for LOAD_SELECTED_REQUEST action ', () => {
      const payload: any = 0;
      const action = new LoadSelectedRequestSuccess(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_SELECTED_REQUEST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadSelectedRequestFailure Failure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedRequestFailure(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_SELECTED_REQUEST_FAILURE,
        payload
      });
    });
  });
  describe('Load LoadIBTCancelRequestApprovalsCount Action Test Cases', () => {
    it('should check correct type is used LoadIBTCancelRequestApprovalsCounttaction ', () => {
      const payload = {
        requestType: 'IBT',
        pageIndex: 9,
        pageSize: 0,
        status: 'tt'
      };
      const action = new LoadIBTCancelRequestApprovalsCount();

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_IBTREQUESTAPPROVALS_CANCEL_COUNT
      });
    });
    it('should check correct type is used for LoadIBTCancelRequestApprovalsCountSuccess action ', () => {
      const payload: any = 0;
      const action = new LoadIBTCancelRequestApprovalsCountSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          RequestApprovalsActionTypes.LOAD_IBTREQUESTAPPROVALS_CANCEL_COUNT_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadEXHRequestFailure Failure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadIBTCancelRequestApprovalsCountFailure(payload);

      expect({ ...action }).toEqual({
        type:
          RequestApprovalsActionTypes.LOAD_IBTREQUESTAPPROVALS_CANCEL_COUNT_FAILURE,
        payload
      });
    });
  });
  describe('Load   LoadFOCRequest Action Test Cases', () => {
    it('should check correct type is used L LoadFOCRequesttaction ', () => {
      const payload = {
        requestType: 'IBT',
        pageIndex: 9,
        pageSize: 0,
        status: 'tt'
      };
      const action = new LoadFOCRequest(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_FOC_REQUEST,
        payload
      });
    });
    it('should check correct type is used for LoadFOCRequestSuccessaction ', () => {
      const payload: any = 0;
      const action = new LoadFOCRequestSuccess(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_FOC_REQUEST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadFOCRequestFailure Failure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadFOCRequestFailure(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_FOC_REQUEST_FAILURE,
        payload
      });
    });
  });
  describe('Load  LoadADJRequest  Action Test Cases', () => {
    it('should check correct type is used LoadADJRequesttaction ', () => {
      const payload = {
        requestType: 'IBT',
        pageIndex: 9,
        pageSize: 0,
        status: 'tt'
      };
      const action = new LoadADJRequest(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_ADJ_REQUEST,
        payload
      });
    });
    it('should check correct type is used for LoadEXHRequestSuccess action ', () => {
      const payload: any = 0;
      const action = new LoadADJRequestSuccess(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_ADJ_REQUEST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used forLoadADJRequestFailure  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadADJRequestFailure(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_ADJ_REQUEST_FAILURE,
        payload
      });
    });
  });

  describe('Load LoadPSVRequest Action Test Cases', () => {
    it('should check correct type is used LoadPSVRequest taction ', () => {
      const payload = {
        requestType: 'IBT',
        pageIndex: 9,
        pageSize: 0,
        status: 'tt'
      };
      const action = new LoadPSVRequest(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_PSV_REQUEST,
        payload
      });
    });
    it('should check correct type is used for LoadPSVRequestSuccess action ', () => {
      const payload: any = 0;
      const action = new LoadPSVRequestSuccess(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_PSV_REQUEST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used forLoadPSVRequestFailure  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPSVRequestFailure(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_PSV_REQUEST_FAILURE,
        payload
      });
    });
  });

  describe('Load LoadLOSSRequest Action Test Cases', () => {
    it('should check correct type is used LoadLOSSRequest taction ', () => {
      const payload = {
        requestType: 'IBT',
        pageIndex: 9,
        pageSize: 0,
        status: 'tt'
      };
      const action = new LoadLOSSRequest(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_LOSS_REQUEST,
        payload
      });
    });
    it('should check correct type is used for LoadLOSSRequestSuccess action ', () => {
      const payload: any = 0;
      const action = new LoadLOSSRequestSuccess(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_LOSS_REQUEST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used  LoadLOSSRequestFailure  action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadLOSSRequestFailure(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_LOSS_REQUEST_FAILURE,
        payload
      });
    });
  });

  describe('Load  BinRequestApprovals  Action Test Cases', () => {
    it('should check correct type is used for Load  BinRequestApprovals action ', () => {
      const payload: GetBinRequestPayload = {
        reqDocNo: 0,
        locationCode: '',
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadBinRequestApprovals(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_BINREQUESTAPPROVALS,
        payload
      });
    });
    it('should check correct type is used for  Load  BinRequestApprovals Success action ', () => {
      const payload: LoadBinRequestResponse = {
        count: 0,
        items: []
      };
      const action = new LoadBinRequestApprovalsSuccess(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_BINREQUESTAPPROVALS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  Load  BinRequestApprovals Failure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBinRequestApprovalsFailure(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_BINREQUESTAPPROVALS_FAILURE,
        payload
      });
    });
  });

  describe('Reset BinRequestApprovals Action Test Cases', () => {
    it('should check correct type is used for Reset  BinRequestApprovals action ', () => {
      const action = new ResetBinRequestApprovals();

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.RESET_BINREQUESTAPPROVALS
      });
    });
  });

  describe('Reset BinRequestApprovals Count Action Test Cases', () => {
    it('should check correct type is used for Reset  BinRequestApprovals Count action ', () => {
      const action = new ResetBinRequestApprovalsCount();

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.RESET_BINREQUESTAPPROVALS_COUNT
      });
    });
  });

  describe(' ResetRequestApprovalsItems Action Test Cases', () => {
    it('should check correct type is used for ResetRequestApprovalsItems action ', () => {
      const action = new ResetRequestApprovalsItems();

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.RESET_REQUESTAPPROVALSITEMS
      });
    });
  });

  describe(' ResetRequestApprovalsItemsCount Action Test Cases', () => {
    it('should check correct type is used for ResetRequestApprovalsItemsCount action ', () => {
      const action = new ResetRequestApprovalsItemsCount();

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.RESET_REQUESTAPPROVALSITEMS_COUNT
      });
    });
  });

  describe(' ResetIBTRequestApprovals Action Test Cases', () => {
    it('should check correct type is used for ResetIBTRequestApprovals action ', () => {
      const action = new ResetIBTRequestApprovals();

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.RESET_IBTREQUESTAPPROVALS
      });
    });
  });

  describe(' ResetIBTRequestApprovalsCount Action Test Cases', () => {
    it('should check correct type is used forResetIBTRequestApprovalsCount   action ', () => {
      const action = new ResetIBTRequestApprovalsCount();

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.RESET_IBTREQUESTAPPROVALS_COUNT
      });
    });
  });

  describe('  ResetEXHRequestApprovals Action Test Cases', () => {
    it('should check correct type is used for  ResetEXHRequestApprovals   action ', () => {
      const action = new ResetEXHRequestApprovals();

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.RESET_EXHREQUESTAPPROVALS
      });
    });
  });

  describe('ResetEXHRequestApprovalsCount Action Test Cases', () => {
    it('should check correct type is used for  ResetEXHRequestApprovalsCount    action ', () => {
      const action = new ResetEXHRequestApprovalsCount();

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.RESET_EXHREQUESTAPPROVALS_COUNT
      });
    });
  });

  describe(' ResetFOCRequestApprovals Action Test Cases', () => {
    it('should check correct type is used for   ResetFOCRequestApprovals   action ', () => {
      const action = new ResetFOCRequestApprovals();

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.RESET_FOCREQUESTAPPROVALS
      });
    });
  });

  describe(' ResetFOCRequestApprovalsCount Action Test Cases', () => {
    it('should check correct type is used for  ResetFOCRequestApprovalsCount action ', () => {
      const action = new ResetFOCRequestApprovalsCount();

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.RESET_FOCREQUESTAPPROVALS_COUNT
      });
    });
  });

  describe('ResetLOSSRequestApprovals  Action Test Cases', () => {
    it('should check correct type is used for  ResetLOSSRequestApprovals action ', () => {
      const action = new ResetLOSSRequestApprovals();

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.RESET_LOSSREQUESTAPPROVALS
      });
    });
  });

  describe('ResetLOSSRequestApprovalsCount  Action Test Cases', () => {
    it('should check correct type is used for  ResetLOSSRequestApprovalsCount action ', () => {
      const action = new ResetLOSSRequestApprovalsCount();

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.RESET_LOSSREQUESTAPPROVALS_COUNT
      });
    });
  });

  describe(' ResetLOANRequestApprovals Action Test Cases', () => {
    it('should check correct type is used for   ResetLOANRequestApprovals action ', () => {
      const action = new ResetLOANRequestApprovals();

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.RESET_LOANREQUESTAPPROVALS
      });
    });
  });

  describe(' ResetLOANRequestApprovalsCount Action Test Cases', () => {
    it('should check correct type is used for   ResetLOANRequestApprovalsCount action ', () => {
      const action = new ResetLOANRequestApprovalsCount();

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.RESET_LOANREQUESTAPPROVALS_COUNT
      });
    });
  });

  describe('ResetLOANRequestApprovals Action Test Cases', () => {
    it('should check correct type is used for  ResetLOANRequestApprovals action ', () => {
      const action = new ResetLOANRequestApprovals();

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.RESET_LOANREQUESTAPPROVALS
      });
    });
  });

  describe('ResetLOANRequestApprovals  Count Action Test Cases', () => {
    it('should check correct type is used for  ResetLOANRequestApprovals Count action ', () => {
      const action = new ResetLOANRequestApprovalsCount();

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.RESET_LOANREQUESTAPPROVALS_COUNT
      });
    });
  });

  describe('ResetADJRequestApprovals Action Test Cases', () => {
    it('should check correct type is used for  ResetADJRequestApprovals action ', () => {
      const action = new ResetADJRequestApprovals();

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.RESET_ADJREQUESTAPPROVALS
      });
    });
  });

  describe('ResetADJRequestApprovals count Action Test Cases', () => {
    it('should check correct type is used for  ResetADJRequestApprovals count action ', () => {
      const action = new ResetADJRequestApprovalsCount();

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.RESET_ADJREQUESTAPPROVALS_COUNT
      });
    });
  });

  describe('  ResetPSVRequestApprovals Action Test Cases', () => {
    it('should check correct type is used for  ResetPSVRequestApprovals  action ', () => {
      const action = new ResetPSVRequestApprovals();

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.RESET_PSVREQUESTAPPROVALS
      });
    });
  });

  describe('  ResetPSVRequestApprovalsCount Action Test Cases', () => {
    it('should check correct type is used for  ResetPSVRequestApprovalsCount  action ', () => {
      const action = new ResetPSVRequestApprovalsCount();

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.RESET_PSVREQUESTAPPROVALS_COUNT
      });
    });
  });

  describe('   ResetError Action Test Cases', () => {
    it('should check correct type is used for  ResTError  action ', () => {
      const action = new ResetError();

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.RESET_ERROR
      });
    });
  });

  describe('    ResetStatus Action Test Cases', () => {
    it('should check correct type is used for  ResetStatus  action ', () => {
      const action = new ResetStatus();

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.RESET_UPDATE
      });
    });
  });

  describe('    ResetStatus Action Test Cases', () => {
    it('should check correct type is used for  ResetStatus  action ', () => {
      const action = new ResetStatus();

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.RESET_UPDATE
      });
    });
  });

  describe(' LoadStuddedProductGroups Action Test Cases', () => {
    it('should check correct type is used for  LoadStuddedProductGroups action ', () => {
      const action = new LoadStuddedProductGroups();

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_STUDDED_PRODUCT_GROUPS
      });
    });
    it('should check correct type is used for  LoadStuddedProductGroups Success action ', () => {
      const payload: string[] = ['a', 'b', 'c'];
      const action = new LoadStuddedProductGroupsSuccess(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadStuddedProductGroups Failure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadStuddedProductGroupsFailure(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE,
        payload
      });
    });
  });

  describe('UpdateBinRequestApprovals Action Test Cases', () => {
    it('should check correct type is used for  UpdateBinRequestApprovals action ', () => {
      const payload: BinApprovalspayload = {
        binRequestUpdateDto: {
          remarks: 'pp',
          status: 'io'
        },
        id: 45
      };
      const action = new UpdateBinRequestApprovals(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.UPDATE_BINREQUESTAPPROVALS,
        payload
      });
    });
    it('should check correct type is used for  UpdateBinRequestApprovals Success action ', () => {
      const payload = {
        binName: 'ii',
        id: 90,
        reqLocationCode: 'io',
        reqDocDate: null,
        reqDocNo: 89,
        status: 'yui',
        requestedRemarks: 'opu',
        binGroupCode: 'poip'
      };
      const action = new UpdateBinRequestApprovalsSuccess(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.UPDATE_BINREQUESTAPPROVALS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  UpdateBinRequestApprovals Failure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateBinRequestApprovalsFailure(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.UPDATE_BINREQUESTAPPROVALS_FAILURE,
        payload
      });
    });
  });

  describe('IBTRequest  Action Test Cases', () => {
    it('should check correct type is used for  IBTRequest  action ', () => {
      const payload = {
        id: 45,
        requestType: 'op',
        requestUpdateDto: {
          itemIds: ['7'],
          remarks: 'yu',
          status: 'io'
        }
      };
      const action = new IBTRequest(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.IBTREQUESTAPPROVALS,
        payload
      });
    });
    it('should check correct type is used for  IBTRequest  Success action ', () => {
      const payload = {
        createdDate:null,
        id: 123,
        reqDocNo: 123,
        srcLocationCode: 'abo',
        destLocationCode: 'abo',
        totalAcceptedQuantity: 123,
        totalAcceptedValue: 123,
        totalAcceptedWeight: 123,
        totalRequestedWeight: 123,
        totalRequestedQuantity: 123,
        totalRequestedValue: 123,
        weightUnit: 'abo',
        currencyCode: 'abo',
        srcDocNo: 123,
        totalIssuedQuantity: 123,
        status: 'abo',
        reqDocDate: null,
        requestType: 'abo',
        totalIssuedValue: 123,
        totalIssuedWeight: 123,
        srcDocDate: null,

        otherDetails: {
          type: 'abo',
          data: {
            approvedCode: 'abo',
            approvedBy: 'abo'
          }
        },
        carrierDetails: {
          type: 'abo',
          data: {
            employeeName: 'abo',
            employeeId: 'abo',
            emailId: 'abo'
          }
        }
      };
      const action = new IbtRequestSuccess(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.IBTREQUESTAPPROVALS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  UpdateBinRequestApprovals Failure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new IbtRequestFailure(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.IBTREQUESTAPPROVALS_FAILURE,
        payload
      });
    });
  });

  describe('IBTCancelRequest  Action Test Cases', () => {
    it('should check correct type is used for  IBTCancelRequest  action ', () => {
      const payload = {
        id: 89,
        stUpdateDto: {
          remarks: 'string',
          status: 'string'
        },
        transferType: 'string'
      };
      const action = new IBTCancelRequest(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.IBTCANCELREQUESTAPPROVALS,
        payload
      });
    });
    it('should check correct type is used for  IBTRequest  Success action ', () => {
      const payload = {
        id: 123,
        reqDocNo: 123,
        srcLocationCode: 'abo',
        destLocationCode: 'abo',
        totalAcceptedQuantity: 123,
        totalAcceptedValue: 123,
        totalAcceptedWeight: 123,
        totalRequestedWeight: 123,
        totalRequestedQuantity: 123,
        totalRequestedValue: 123,
        createdDate:null,
        weightUnit: 'abo',
        currencyCode: 'abo',
        srcDocNo: 123,
        totalIssuedQuantity: 123,
        status: 'abo',
        reqDocDate: null,
        requestType: 'abo',
        totalIssuedValue: 123,
        totalIssuedWeight: 123,
        srcDocDate: null,

        otherDetails: {
          type: 'abo',
          data: {
            approvedCode: 'abo',
            approvedBy: 'abo'
          }
        },
        carrierDetails: {
          type: 'abo',
          data: {
            employeeName: 'abo',
            employeeId: 'abo',
            emailId: 'abo'
          }
        }
      };
      const action = new IbtCancelRequestSuccess(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.IBTCANCELREQUESTAPPROVALS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  UpdateBinRequestApprovals Failure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new IbtCancelRequestFailure(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.IBTCANCELREQUESTAPPROVALS_FAILURE,
        payload
      });
    });
  });

  describe('Clear Search  Action Test Cases', () => {
    it('should check correct type is used for  Clear Search   action ', () => {
      const action = new ClearItemList();

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.CLEAR_ITEM_LIST
      });
    });
  });
  describe('LoadItemsTotalCount   Action Test Cases', () => {
    it('should check correct type is used for LoadItemsTotalCount   action ', () => {
      const action = new LoadItemsTotalCount();

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_ItEMS_COUNT
      });
    });
    it('should check correct type is used for  LoadItemsTotalCount  Success action ', () => {
      const payload = {
        adjRequestCount: 123,
        psvRequestCount: 123,
        focRequestCount: 123,
        exhRequestCount: 123,
        lossRequestCount: 123,
        loanRequestCount: 123
      };
      const action = new LoadItemsTotalCountSuccess(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_ItEMS_COUNT_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadItemsTotalCount  Failure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadItemsTotalCountFailure(payload);

      expect({ ...action }).toEqual({
        type: RequestApprovalsActionTypes.LOAD_ItEMS_COUNT_FAILURE,
        payload
      });
    });
  });
});
