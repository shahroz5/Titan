import {
  ABRequestStatusDownValues,
  AdvanceHistoryItemsRequestPayload,
 CustomErrors,
 GEPSearchResponse
} from '@poss-web/shared/models';
import { GepReducer, initialState } from './gep.reducer';
import * as moment from 'moment';
import { GepState } from './gep.state';
import * as actions from './gep.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { gepDetailsAdapter } from './gep.entity';
import { ClearSearchList } from './gep.actions';

const aBRequestStatusDownValues: ABRequestStatusDownValues = {
  status: '',
  type: ''
};

const advanceHistoryItemsRequestPayload : AdvanceHistoryItemsRequestPayload = { docNo:4 }

const  gepSearchResponse : GEPSearchResponse = { GEPList:[], totalElements:8 };

describe('Gep Reducer Testing Suite', () => {
  let testState = initialState;

  describe('Actions should update state properly', () => {
    it('should return the initial state', () => {
      const action: any = {};
      const state: GepState = GepReducer(undefined, action);

      expect(state).toBe(testState);
    });

    it(' action', () => {
      testState = {
        ...testState,
        isLoading: true
      };

      const action = new actions.GepInit(
      {
        data:null,
        subTxnType:'NEW_GEP'
      }
      );

      const result: GepState = GepReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('Init_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: false,

      };

      const action = new actions.GepInitSuccess(
        null
      );

      const result: GepState=GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      // expect(result.productDetails).toBe([dummyCmItemDetailsResponse]);
    });

    it('Init_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.GepInitFailure(payload);

      const result: GepState=GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it(' action', () => {
      testState = {
        ...testState,
        isLoading: true
      };

      const action = new actions.LoadGepItem(
      {
        id:'56789',
        itemId:'ertyui',
        subTxnType:'NEW_GEP'
      }
      );

      const result: GepState = GepReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('LoadGepItem_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadGepItemFailure(payload);

      const result: GepState=GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it(' action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.LoadGepItemPriceSuccess(
      {
        id:'56789',
        itemId:'ertyui',
        subTxnType:'NEW_GEP'
      }
      );

      const result: GepState = GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
    });

    it('LoadGepItemSuccess action', () => {
      testState = {
        ...testState,
        isLoading: false,
        rso:{
          id:'jjjj'
        }

      };

      const action = new actions.SaveRso(
        null
      );

      const result: GepState=GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.loadGepItem).toBe(null);
    });

    it('Save Reason action', () => {
      testState = {
        ...testState,
        isLoading: false,
      reason:'test'
      };

      const payload='test'

      const action = new actions.SaveReason(payload);

      const result: GepState=GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.reason).toBe(payload);
    });

    it('UPDATE_PRICE_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: false,
      gepResponse:{
  id:'4567890-RTYUI',
  totalValue:45678,
  weight:56,
  purity:67
      }
      };

      const payload={
        id:'4567890-RTYUI',
        totalValue:45678,
        weight:56,
        purity:67
            }

      const action = new actions.UpdatePriceSuccess(payload);

      const result: GepState=GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.gepResponse).toBe(payload);
    });

    it('.GET_GEP_ITEM_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.GetGepITEMFailure(payload);

      const result: GepState=GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('GEP_INIT_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.GepInitFailure(payload);

      const result: GepState=GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('Hold/confirm_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.HoldConfirmFailure(payload);

      const result: GepState=GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('Post gep_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.PostGepItemsFailure(payload);

      const result: GepState=GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });
    
    it('Update rso_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.PostRSOFailure(payload);

      const result: GepState=GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('Total BreakUp_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.TotalValueBreakupFailure(payload);

      const result: GepState=GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('Metal Rate_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.GepMetalRateFailure(payload);

      const result: GepState=GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('Load metal FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadMetalFailure(payload);

      const result: GepState=GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('Load item FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadITEMFailure(payload);

      const result: GepState=GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('Load Cancel gep action', () => {
      testState = {
        ...testState,
        isLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadCancelGepFailure(payload);

      const result: GepState=GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('Load Onhold FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadOnHoldFailure(payload);

      const result: GepState=GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('Save Cancel gep FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.SaveCanceleGepFailure(payload);

      const result: GepState=GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadCountOnHoLdFailure(payload);

      const result: GepState=GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('Update delete gep FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.DeleteITEMFailure(payload);

      const result: GepState=GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('Image Upload Failaction', () => {
      testState = {
        ...testState,
        isLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.ImageUploadFailure(payload);

      const result: GepState=GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('Update Price Failaction', () => {
      testState = {
        ...testState,
        isLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.UpdatePriceFailure(payload);

      const result: GepState=GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('Init fail Failaction', () => {
      testState = {
        ...testState,
        isLoading: false,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.GepInitFailure(payload);

      const result: GepState=GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it(' Resetaction', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.ResetGep(

      );

      const result: GepState = GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
    });

    it(' update summary  action', () => {
      testState = {
        ...testState,
        isLoading: false,
        summary:null
      };

      const action = new actions.UpdateSummaryBar(
  null
      );

      const result: GepState = GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
    });

    it(' update RSO   action', () => {
      testState = {
        ...testState,
        isLoading: false,
        updateRso:null
      };

      const action = new actions.PostRSOSuccess(
  null
      );

      const result: GepState = GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
    });

    it(' update total value  action', () => {
      testState = {
        ...testState,
        isLoading: false,
        totalBreakUp:null
      };

      const action = new actions.TotalValueBreakUpSuccess(
  null
      );

      const result: GepState = GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
    });

    it(' saveCancelled gep action', () => {
      testState = {
        ...testState,
        isLoading: true
      };

      const action = new actions.SaveCanceleGep(
  null
      );

      const result: GepState = GepReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('gep hold confirm action', () => {
      testState = {
        ...testState,
        isLoading: false,
      holdConfirmResponse:null
      };

      const action = new actions.HoldConfirmSuccess(
  null
      );

      const result: GepState = GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
    });

    it(' UImage Upload Sucees action', () => {
      testState = {
        ...testState,
        isLoading: false,
  preMeltingUploadResponse:true
      };

      const action = new actions.ImageUploadSuccess(true

      );

      const result: GepState = GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
    });

    it(' Delte gep Sucees action', () => {
      testState = {
        ...testState,
        isLoading: false,
  deleteGep:true
      };

      const action = new actions.ImageUploadSuccess(true

      );

      const result: GepState = GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.deleteGep).toBeTruthy();
    });

    it(' Delte gep Sucees action', () => {
      testState = {
        ...testState,
        isLoading: false,
  deleteGep:true
      };

      const action = new actions.DeleteITEMSuccess(true

      );

      const result: GepState = GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.deleteGep).toBeTruthy();
    });

    it(' Delte gep Sucees action', () => {
      testState = {
        ...testState,
        isLoading: false,
  deleteGep:true
      };

      const action = new actions.ImageUploadSuccess(true

      );

      const result: GepState = GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.deleteGep).toBeTruthy();
    });

    it(' Delte gep Sucees action', () => {
      testState = {
        ...testState,
        isLoading: false,
  countOnhold:9
      };

      const action = new actions.LoadCountOnHoLdSuccess(9

      );

      const result: GepState = GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.countOnhold).toBe(9);
    });

    it(' on hold Sucees action', () => {
      testState = {
        ...testState,
        isLoading: false,
  loadOnHold:null
      };

      const action = new actions.LoadOnHoldSuccess(null

      );

      const result: GepState = GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();

    });

    it('itemtype Sucees action', () => {
      testState = {
        ...testState,
        isLoading: false,
  itemType:null
      };

      const action = new actions.LoadITEMSuccess(

  null

      );

      const result: GepState = GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.itemType).toBe(null);
    });

    it('metaltype Sucees action', () => {
      testState = {
        ...testState,
        isLoading: false,
  metalType:null
      };

      const action = new actions.LoadMetalSuccess(

      null

      );

      const result: GepState = GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.metalType).toBe(null);
    });

    it('metalPrice Sucees action', () => {
      testState = {
        ...testState,
        isLoading: false,
  metalPrice:null
      };

      const action = new actions.GepMetalRateSuccess(

      null

      );

      const result: GepState = GepReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.metalPrice).toBe(null);
    });

    it('ClearSearchList should be called', () => {
      const action = new ClearSearchList();
      const result: GepState = GepReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    });

    it('SetHistoryGEPSearchParamDetails should be called', () => {
      const action = new actions.SetHistoryGEPSearchParamDetails(aBRequestStatusDownValues);
      const result: GepState = GepReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    });

  });

  describe('Testing LoadGEPHistory Functionality', () => {
    it('LoadGEPHistory should be called', () => {
      const action = new actions.LoadGEPHistory(advanceHistoryItemsRequestPayload,'','','',0,0,'','');
      const result: GepState = GepReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('LoadGEPHistorySuccess should be called', () => {
      const action = new actions.LoadGEPHistorySuccess({ GEPList:[], totalElements:8 });
      const result: GepState = GepReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.historyItems).toBeTruthy();
    });

    it('LoadGEPHistoryfailure should be called', () => {
      const action = new actions.LoadGEPHistoryFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: GepState = GepReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing ViewGEP Functionality', () => {
    it('ViewGEP should be called', () => {
      const payload = "C5611428-A559-488B-957B-94732086A54B";
      const action = new actions.ViewGEP(payload, "NEW_GEP");
      const result: GepState = GepReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('ViewGEPSuccess should be called', () => {
      const action = new actions.ViewGEPSuccess(gepSearchResponse);
      const result: GepState = GepReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    });

    it('ViewGEPFailure should be called', () => {
      const action = new actions.ViewGEPFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: GepState = GepReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });
});

