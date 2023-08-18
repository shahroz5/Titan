import * as actions from './catchment.actions';
import { CatchmentState } from './catchment.state';
import { initialState as istate, CatchmentReducer } from './catchment.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CatchmentDetails,
  LoadCatchmentListingPayload,
  LoadCatchmentListingSuccessPayload
} from '@poss-web/shared/models';

describe('Catchment Reducer Testing Suite', () => {
  const initialState: CatchmentState = { ...istate };

  describe('Testing LoadCatchmentListing Functionality', () => {
    it('LoadCatchmentListing should be called', () => {
      const payload: LoadCatchmentListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const action = new actions.LoadCatchmentListing(payload);

      const result: CatchmentState = CatchmentReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
    });
    it('LoadCatchmentListingSuccess should return details', () => {
      const payload: LoadCatchmentListingSuccessPayload = {
        catchmentListing: [
          {
            catchmentCode: 'Code',
            description: 'Desc',
            isActive: true
          }
        ],
        totalElements: 1
      };

      const action = new actions.LoadCatchmentListingSuccess(payload);
      const result: CatchmentState = CatchmentReducer(initialState, action);

      expect(result.catchmentListing).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadCatchmentListingFailure should return error', () => {
      const action = new actions.LoadCatchmentListingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CatchmentState = CatchmentReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadCatchmentDetails Functionality', () => {
    it('LoadCatchmentDetails should be called', () => {
      const payload = '';
      const action = new actions.LoadCatchmentDetails(payload);

      const result: CatchmentState = CatchmentReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
    });
    it('LoadCatchmentDetailsSuccess should return details', () => {
      const payload: CatchmentDetails = {
        catchmentCode: 'Code',
        description: 'Desc',
        isActive: true
      };

      const action = new actions.LoadCatchmentDetailsSuccess(payload);
      const result: CatchmentState = CatchmentReducer(initialState, action);

      expect(result.catchmentDetails).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadCatchmentDetailsFailure should return error', () => {
      const action = new actions.LoadCatchmentDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CatchmentState = CatchmentReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveCatchmentFormDetails Functionality', () => {
    it('SaveCatchmentFormDetails should be called', () => {
      const payload: CatchmentDetails = {
        catchmentCode: 'Code',
        description: 'Desc',
        isActive: true
      };
      const action = new actions.SaveCatchmentFormDetails(payload);

      const result: CatchmentState = CatchmentReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
    });
    it('SaveCatchmentFormDetailsSuccess should return details', () => {
      const payload: CatchmentDetails = {
        catchmentCode: 'Code',
        description: 'Desc',
        isActive: true
      };

      const action = new actions.SaveCatchmentFormDetailsSuccess(payload);
      const result: CatchmentState = CatchmentReducer(initialState, action);

      expect(result.saveCatchmentResponses).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('SaveCatchmentFormDetailsFailure should return error', () => {
      const action = new actions.SaveCatchmentFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CatchmentState = CatchmentReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing EditCatchmentFormDetails Functionality', () => {
    it('EditCatchmentFormDetails should be called', () => {
      const payload: CatchmentDetails = {
        catchmentCode: 'Code',
        description: 'Desc',
        isActive: true
      };
      const action = new actions.EditCatchmentFormDetails(payload);

      const result: CatchmentState = CatchmentReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
    });
    it('EditCatchmentFormDetailsSuccess should return details', () => {
      const payload: CatchmentDetails = {
        catchmentCode: 'Code',
        description: 'Desc',
        isActive: true
      };

      const action = new actions.EditCatchmentFormDetailsSuccess(payload);
      const result: CatchmentState = CatchmentReducer(initialState, action);

      expect(result.editCatchmentResponses).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('EditCatchmentFormDetailsFailure should return error', () => {
      const action = new actions.EditCatchmentFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CatchmentState = CatchmentReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchCatchmentCode Functionality', () => {
    it('SearchCatchmentCode should be called', () => {
      const payload = '';
      const action = new actions.SearchCatchmentCode(payload);

      const result: CatchmentState = CatchmentReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
    });
    it('SearchCatchmentCodeSuccess should return details', () => {
      const payload: LoadCatchmentListingSuccessPayload = {
        catchmentListing: [
          {
            catchmentCode: 'Code',
            description: 'Desc',
            isActive: true
          }
        ],
        totalElements: 1
      };

      const action = new actions.SearchCatchmentCodeSuccess(payload);
      const result: CatchmentState = CatchmentReducer(initialState, action);

      expect(result.editCatchmentResponses).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('SearchCatchmentCodeFailure should return error', () => {
      const action = new actions.SearchCatchmentCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CatchmentState = CatchmentReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });
});
