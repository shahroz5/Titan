import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CnTypeList,
  CnValidation,
  CnValidationList,
  CnValidationListPayload,
  CnValidationResponse,
  CustomErrors
} from '@poss-web/shared/models';
import {
  CnValidationActionTypes,
  LoadCnTypeList,
  LoadCnTypeListFailure,
  LoadCnTypeListSuccess,
  LoadCnValidationByRuleId,
  LoadCnValidationByRuleIdFailure,
  LoadCnValidationByRuleIdSuccess,
  LoadCnValidationList,
  LoadCnValidationListFailure,
  LoadCnValidationListSuccess,
  LoadNewCnValidationByRuleId,
  LoadReset,
  SaveCnValidation,
  SaveCnValidationFailure,
  SaveCnValidationSuccess,
  SearchCnValidationByCnType,
  SearchCnValidationByCnTypeFailure,
  SearchCnValidationByCnTypeSuccess,
  UpdateCnValidation,
  UpdateCnValidationFailure,
  UpdateCnValidationSuccess
} from './cn-validation.actions';

describe('Cn Validation action Action Testing Suite', () => {
  describe('LoadCnValidationList Action Test Cases', () => {
    it('should check correct type is used for  LoadCnValidationList action ', () => {
      const payload: CnValidationListPayload = {
        pageIndex: 0,
        pageSize: 100,
        length: 0
      };
      const action = new LoadCnValidationList(payload);
      expect({ ...action }).toEqual({
        type: CnValidationActionTypes.LOAD_CN_VALIDATION_LIST,
        payload
      });
    });
    it('should check correct type is used for LoadCnValidationListSuccess action ', () => {
      const payload: CnValidationList = {
        cnValidationList: [
          {
            ruleId: '1',

            description: 'GEP',
            ruleDetails: {
              data: {
                isCancellationAllowed: true,
                deductionRate: '30',
                criteriaRateForDeduction: '30',
                residentialValueAmount: '5000',
                isBrandWiseTransferAllowed: true,
                isBoutiqueWiseTransferAllowed: true,
                GHSUtilizationTransferPercent: '30',
                GHSMaxAmountTransfer: '2000'
              },
              type: 'GEP'
            },
            isActive: true
          }
        ],
        totalElements: 1
      };
      const action = new LoadCnValidationListSuccess(payload);

      expect({ ...action }).toEqual({
        type: CnValidationActionTypes.LOAD_CN_VALIDATION_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadCnValidationListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCnValidationListFailure(payload);

      expect({ ...action }).toEqual({
        type: CnValidationActionTypes.LOAD_CN_VALIDATION_LIST_FAILURE,
        payload
      });
    });
  });

  describe('SearchCnValidationByCnType Action Test Cases', () => {
    it('should check correct type is used for  SearchCnValidationByCnType action ', () => {
      const payload = 'GEP';
      const action = new SearchCnValidationByCnType(payload);
      expect({ ...action }).toEqual({
        type: CnValidationActionTypes.SEARCH_CN_VALIDATION_BY_CN_TYPE,
        payload
      });
    });
    it('should check correct type is used for SearchCnValidationByCnTypeSuccess action ', () => {
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
      const action = new SearchCnValidationByCnTypeSuccess(payload);

      expect({ ...action }).toEqual({
        type: CnValidationActionTypes.SEARCH_CN_VALIDATION_BY_CN_TYPE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SearchCnValidationByCnTypeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchCnValidationByCnTypeFailure(payload);

      expect({ ...action }).toEqual({
        type: CnValidationActionTypes.SEARCH_CN_VALIDATION_BY_CN_TYPE_FAILURE,
        payload
      });
    });
  });

  describe('SaveCnValidation Action Test Cases', () => {
    it('should check correct type is used for  SaveCnValidation action ', () => {
      const payload: CnValidation = {
        description: 'GEP',
        ruleDetails: {
          data: {},
          type: 'GEP'
        },
        isActive: true
      };

      const action = new SaveCnValidation(payload);
      expect({ ...action }).toEqual({
        type: CnValidationActionTypes.SAVE_CN_VALIDATION,
        payload
      });
    });
    it('should check correct type is used for SaveCnValidationSuccess action ', () => {
      const payload: CnValidationResponse = {
        ruleId: '1',
        description: 'GEP',
        ruleType: 'GEP',
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
      const action = new SaveCnValidationSuccess(payload);

      expect({ ...action }).toEqual({
        type: CnValidationActionTypes.SAVE_CN_VALIDATION_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveCnValidationFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveCnValidationFailure(payload);

      expect({ ...action }).toEqual({
        type: CnValidationActionTypes.SAVE_CN_VALIDATION_FAILURE,
        payload
      });
    });
  });

  describe('UpdateCnValidation Action Test Cases', () => {
    it('should check correct type is used for  UpdateCnValidation action ', () => {
      const payload: CnValidation = {
        ruleId: '1',
        description: 'GEP',
        ruleDetails: {
          data: {
            isCancellationAllowed: true,
            deductionRate: '30',
            criteriaRateForDeduction: '30',
            residentialValueAmount: '5000',
            isBrandWiseTransferAllowed: true,
            isBoutiqueWiseTransferAllowed: true,
            GHSUtilizationTransferPercent: '30',
            GHSMaxAmountTransfer: '2000'
          },
          type: 'GEP'
        },
        isActive: true
      };
      const action = new UpdateCnValidation(payload);
      expect({ ...action }).toEqual({
        type: CnValidationActionTypes.UPDATE_CN_VALIDATION,
        payload
      });
    });
    it('should check correct type is used for UpdateCnValidationSuccess action ', () => {
      const payload: CnValidationResponse = {
        ruleId: '1',
        description: 'GEP',
        ruleType: 'GEP',
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
      const action = new UpdateCnValidationSuccess(payload);

      expect({ ...action }).toEqual({
        type: CnValidationActionTypes.UPDATE_CN_VALIDATION_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  UpdateCnValidationFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateCnValidationFailure(payload);

      expect({ ...action }).toEqual({
        type: CnValidationActionTypes.UPDATE_CN_VALIDATION_FAILURE,
        payload
      });
    });
  });

  describe('LoadCnValidationByRuleId Action Test Cases', () => {
    it('should check correct type is used for  LoadCnValidationByRuleId action ', () => {
      const payload = '1';
      const action = new LoadCnValidationByRuleId(payload, 'GEP');
      expect({ ...action }).toEqual({
        type: CnValidationActionTypes.LOAD_CN_VALIDATION_BY_RULE_ID,
        ruleId: payload,
        ruleType: 'GEP'
      });
    });
    it('should check correct type is used for LoadCnValidationByRuleIdSuccess action ', () => {
      const payload: CnValidationResponse = {
        ruleId: '1',
        description: 'GEP',
        ruleType: 'GEP',
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
      const action = new LoadCnValidationByRuleIdSuccess(payload);

      expect({ ...action }).toEqual({
        type: CnValidationActionTypes.LOAD_CN_VALIDATION_BY_RULE_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadCnValidationByRuleIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCnValidationByRuleIdFailure(payload);

      expect({ ...action }).toEqual({
        type: CnValidationActionTypes.LOAD_CN_VALIDATION_BY_RULE_ID_FAILURE,
        payload
      });
    });
  });

  describe('LoadCnTypeList Action Test Cases', () => {
    it('should check correct type is used for  LoadCnTypeList action ', () => {
      const action = new LoadCnTypeList();
      expect({ ...action }).toEqual({
        type: CnValidationActionTypes.LOAD_CN_TYPE_LIST
      });
    });
    it('should check correct type is used for LoadCnTypeListSuccess action ', () => {
      const payload: CnTypeList[] = [
        {
          id: 'GEP',
          description: 'GEP'
        }
      ];
      const action = new LoadCnTypeListSuccess(payload);

      expect({ ...action }).toEqual({
        type: CnValidationActionTypes.LOAD_CN_TYPE_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadCnTypeListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCnTypeListFailure(payload);

      expect({ ...action }).toEqual({
        type: CnValidationActionTypes.LOAD_CN_TYPE_LIST_FAILURE,
        payload
      });
    });
  });

  describe('LoadNewCnValidationByRuleId Action Test Cases', () => {
    it('should check correct type is used for  LoadNewCnValidationByRuleId action ', () => {
      const action = new LoadNewCnValidationByRuleId();
      expect({ ...action }).toEqual({
        type: CnValidationActionTypes.LOAD_NEW_CN_VALIDATION_BY_RULE_ID
      });
    });
  });

  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: CnValidationActionTypes.LOAD_RESET
      });
    });
  });
});
