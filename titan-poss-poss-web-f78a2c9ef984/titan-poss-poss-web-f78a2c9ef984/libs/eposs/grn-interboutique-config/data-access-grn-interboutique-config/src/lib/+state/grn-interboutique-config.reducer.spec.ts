import { GrnInterboutiqueConfig } from '@poss-web/shared/models';
import * as actions from './grn-interboutique-config.actions';
import { GrnInterboutiqueConfigState } from './grn-interboutique-config.state';
import {
  initialState as istate,
  GrnInterboutiqueConfigReducer
} from './grn-interboutique-config.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('GRN Interboutique config Reducer Testing Suite', () => {
  const initialState: GrnInterboutiqueConfigState = { ...istate };

  describe('Testing LoadGrnInterboutiqueConfig Functionality', () => {
    it('LoadGrnInterboutiqueConfig should be called', () => {
      const payload = 1;
      const action = new actions.LoadGrnInterboutiqueConfig(payload);

      const result: GrnInterboutiqueConfigState = GrnInterboutiqueConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadGrnInterboutiqueConfigSuccess should return details', () => {
      const payload: GrnInterboutiqueConfig = {
        description: 'Desc',
        isActive: true,
        ruleDetails: {
          type: 'Type',
          data: {
            config: {
              L1: ['1'],
              L2: ['1'],
              L3: ['1']
            },
            type: 'Type'
          }
        },
        ruleId: 1,
        ruleType: 'Type'
      };

      const action = new actions.LoadGrnInterboutiqueConfigSuccess(payload);
      const result: GrnInterboutiqueConfigState = GrnInterboutiqueConfigReducer(
        initialState,
        action
      );

      expect(result.grnInterboutiqueConfigDetails).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadGrnInterboutiqueConfigFailure should return error', () => {
      const action = new actions.LoadGrnInterboutiqueConfigFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: GrnInterboutiqueConfigState = GrnInterboutiqueConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadGrnInterboutiqueConfig Functionality', () => {
    const payload: GrnInterboutiqueConfig = {
      description: 'Desc',
      isActive: true,
      ruleDetails: {
        type: 'Type',
        data: {
          config: {
            L1: ['1'],
            L2: ['1'],
            L3: ['1']
          },
          type: 'Type'
        }
      },
      ruleId: 1,
      ruleType: 'Type'
    };
    it('LoadGrnInterboutiqueConfig should be called', () => {
      const action = new actions.AddNewGrnInterboutiqueConfig(payload);

      const result: GrnInterboutiqueConfigState = GrnInterboutiqueConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('AddNewGrnInterboutiqueConfigSuccess should return details', () => {
      const action = new actions.AddNewGrnInterboutiqueConfigSuccess(payload);
      const result: GrnInterboutiqueConfigState = GrnInterboutiqueConfigReducer(
        initialState,
        action
      );

      expect(result.editGrnInterboutiqueConfigResponses).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('AddNewGrnInterboutiqueConfigFailure should return error', () => {
      const action = new actions.AddNewGrnInterboutiqueConfigFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: GrnInterboutiqueConfigState = GrnInterboutiqueConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing EditGrnInterboutiqueConfig Functionality', () => {
    const payload: GrnInterboutiqueConfig = {
      description: 'Desc',
      isActive: true,
      ruleDetails: {
        type: 'Type',
        data: {
          config: {
            L1: ['1'],
            L2: ['1'],
            L3: ['1']
          },
          type: 'Type'
        }
      },
      ruleId: 1,
      ruleType: 'Type'
    };
    it('EditGrnInterboutiqueConfig should be called', () => {
      const action = new actions.EditGrnInterboutiqueConfig({
        ruleId: 1,
        grnInterboutiqueConfig: payload
      });

      const result: GrnInterboutiqueConfigState = GrnInterboutiqueConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('EditGrnInterboutiqueConfigSuccess should return details', () => {
      const action = new actions.EditGrnInterboutiqueConfigSuccess(payload);
      const result: GrnInterboutiqueConfigState = GrnInterboutiqueConfigReducer(
        initialState,
        action
      );

      expect(result.editGrnInterboutiqueConfigResponses).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('EditGrnInterboutiqueConfigFailure should return error', () => {
      const action = new actions.EditGrnInterboutiqueConfigFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: GrnInterboutiqueConfigState = GrnInterboutiqueConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });
});
