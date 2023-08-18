import * as actions from './cn-validation.actions';

import {
  CnValidationListPayload,
  CnValidationList,
  CnValidation,
  CnValidationResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { cnValidationReducer, initialState } from './cn-validation.reducer';

describe('Cn Validation reducer Testing Suite', () => {
  const cnValidationListPayload: CnValidationListPayload = {
    pageIndex: 0,
    pageSize: 100,
    length: 0
  };

  it('should return the initial state', () => {
    const action: any = {};
    const state = cnValidationReducer(null, action);

    expect(initialState).toBe(initialState);
  });

  describe('Testing LoadCnValidationList ', () => {
    it('Load LoadCnValidationList should set the isLoading to true', () => {
      const action = new actions.LoadCnValidationList(cnValidationListPayload);

      const result = cnValidationReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadCnValidationListSuccess should return list of cn validations', () => {
      const payload: CnValidationList = {
        cnValidationList: [
          {
            ruleId: '1',

            description: 'GEP',
            ruleDetails: {
              data: {},
              type: 'GEP'
            },
            isActive: true
          }
        ],
        totalElements: 1
      };
      const action = new actions.LoadCnValidationListSuccess(payload);

      const result = cnValidationReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.cnValidationList.length).toBe(1);
    });
    it('LoadCnValidationListFailure should return error', () => {
      const action = new actions.LoadCnValidationListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = cnValidationReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchCnValidationByCnType ', () => {
    beforeEach(() => {});
    it('Load SearchCnValidationByCnType should set the isLoading to true', () => {
      const action = new actions.SearchCnValidationByCnType('GEP');

      const result = cnValidationReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadCnValidationListSuccess should return list of CN Validations', () => {
      const payload: CnValidationList = {
        cnValidationList: [
          {
            ruleId: '1',

            description: 'ibtconfig',
            ruleDetails: {
              data: {},
              type: 'IBT_CONIG'
            },
            isActive: true
          }
        ],
        totalElements: 1
      };
      const action = new actions.SearchCnValidationByCnTypeSuccess(payload);

      const result = cnValidationReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.cnValidationList.length).toBe(1);
    });
    it('LoadCnValidationListFailure should return error', () => {
      const action = new actions.SearchCnValidationByCnTypeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = cnValidationReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveCnValidation Functionality ', () => {
    beforeEach(() => {});
    it('SaveCnValidation ', () => {
      const payload: CnValidation = {
        description: 'ibtconfig',
        ruleDetails: {
          data: {},
          type: 'IBT_CONIG'
        },
        isActive: true
      };
      const action = new actions.SaveCnValidation(payload);

      const result = cnValidationReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.hasSaved).toBe(null);
    });
    it('SaveCnValidationSuccess should update the hasSaved property to true', () => {
      const payload: CnValidationResponse = {
        ruleId: '1',
        description: 'ibtconfig',
        ruleType: 'IBT_CONFIG',
        isCancellationAllowed: true,
        deductionRate: '30',
        criteriaRateForDeduction: '30',
        residentialValueAmount: '5000',
        isBrandWiseTransferAllowed: true,
        isBoutiqueWiseTransferAllowed: true,
        GHSUtilizationTransferPercent: '30',
        GHSMaxAmountTransfer: '2000',
        isActive: true
      };
      const action = new actions.SaveCnValidationSuccess(payload);

      const result = cnValidationReducer(initialState, action);

      expect(result.hasSaved).toBe(true);

      expect(result.isLoading).toBe(false);
    });
    it('SaveCnValidationFailure should return error', () => {
      const action = new actions.SaveCnValidationFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = cnValidationReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateCnValidation ', () => {
    beforeEach(() => {});
    it('UpdateCnValidation ', () => {
      const payload: CnValidation = {
        ruleId: '1',
        description: 'ibtconfig',
        ruleDetails: {
          data: {},
          type: 'IBT_CONIG'
        },
        isActive: true
      };
      const action = new actions.UpdateCnValidation(payload);

      const result = cnValidationReducer(initialState, action);

      expect(result.hasUpdated).toBe(false);
    });
    it('UpdateCnValidationSuccess should update the hasUpdated property to true', () => {
      const payload: CnValidationResponse = {
        ruleId: '1',
        description: 'ibtconfig',
        ruleType: 'IBT_CONFIG',
        isCancellationAllowed: true,
        deductionRate: '30',
        criteriaRateForDeduction: '30',
        residentialValueAmount: '5000',
        isBrandWiseTransferAllowed: true,
        isBoutiqueWiseTransferAllowed: true,
        GHSUtilizationTransferPercent: '30',
        GHSMaxAmountTransfer: '2000',

        isActive: true
      };

      const action = new actions.UpdateCnValidationSuccess(payload);

      const result = cnValidationReducer(initialState, action);

      expect(result.hasUpdated).toBe(true);
    });
    it('UpdateCnValidationFailure should return error', () => {
      const action = new actions.UpdateCnValidationFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = cnValidationReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadCnValidationByRuleId ', () => {
    beforeEach(() => {});
    it('LoadCnValidationByRuleId should return the Cn Validation ', () => {
      const payload = '1';
      const action = new actions.LoadCnValidationByRuleId(payload, 'GEP');

      const result = cnValidationReducer(
        initialState,

        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadCnValidationByRuleIdSuccess should return the ibt config', () => {
      const payload: CnValidationResponse = {
        ruleId: '1',
        description: 'ibtconfig',
        ruleType: 'IBT_CONFIG',
        isCancellationAllowed: true,
        deductionRate: '30',
        criteriaRateForDeduction: '30',
        residentialValueAmount: '5000',
        isBrandWiseTransferAllowed: true,
        isBoutiqueWiseTransferAllowed: true,
        GHSUtilizationTransferPercent: '30',
        GHSMaxAmountTransfer: '2000',

        isActive: true
      };

      const action = new actions.LoadCnValidationByRuleIdSuccess(payload);

      const result = cnValidationReducer(
        initialState,

        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.cnValidation).toEqual(payload);
    });
    it('LoadCnValidationByConfigIdFailure should return error', () => {
      const action = new actions.LoadCnValidationByRuleIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = cnValidationReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadCnTypeList ', () => {
    it('Load LoadCnTypeList should set the isLoading to true', () => {
      const action = new actions.LoadCnTypeList();

      const result = cnValidationReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadCnTypeListSuccess should return list of cn type', () => {
      const payload = [
        {
          id: 'GEP',
          description: 'GEP'
        }
      ];
      const action = new actions.LoadCnTypeListSuccess(payload);

      const result = cnValidationReducer(initialState, action);

      expect(result.cnTypeList.length).toBe(1);
    });
    it('LoadCnTypeListFailure should return error', () => {
      const action = new actions.LoadCnTypeListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = cnValidationReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadReset ', () => {
    beforeEach(() => {});
    it('LoadReset should reset the store', () => {
      const action = new actions.LoadReset();

      const result = cnValidationReducer(
        initialState,

        action
      );

      expect(result).toEqual(initialState);
    });
  });
});
