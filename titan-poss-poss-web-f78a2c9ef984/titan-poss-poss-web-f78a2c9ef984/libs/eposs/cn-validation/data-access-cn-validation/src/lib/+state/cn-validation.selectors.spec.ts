import {
  CustomErrors,
  CnValidation,
  CnValidationResponse
} from '@poss-web/shared/models';

import { initialState } from './cn-validation.reducer';
import * as selectors from './cn-validation.selectors';

import { CnValidationState } from './cn-validation.state';

describe('CN Validation selector Testing Suite', () => {
  const cnValidation: CnValidation = {
    ruleId: '1',
    ruleType: 'GEP',
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

  const cnTypeList = [
    {
      id: 'GEP',
      description: 'GEP'
    }
  ];

  const cnValidationResponse: CnValidationResponse = {
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
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  describe('Testing CN Validation related Selectors', () => {
    it('selectCnValidationList Should return the list of ibt Cn Validation list', () => {
      const state: CnValidationState = {
        ...initialState,
        cnValidationList: [cnValidationResponse]
      };
      expect(
        selectors.cnValidationSelectors.selectCnValidationList.projector(state)
      ).toEqual([cnValidationResponse]);
    });

    it('selectIsloading Should return the true or false', () => {
      const state: CnValidationState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.cnValidationSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });
    it('selectError Should return the error object', () => {
      const state: CnValidationState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(
        selectors.cnValidationSelectors.selectError.projector(state)
      ).toEqual(error);
    });
    it('selectCnValidation Should return the Cn Validation object', () => {
      const state: CnValidationState = {
        ...initialState,
        cnValidation: cnValidationResponse
      };
      expect(
        selectors.cnValidationSelectors.selectCnValidation.projector(state)
      ).toEqual(cnValidationResponse);
    });

    it('selectHasSaved Should return the true or false', () => {
      const state: CnValidationState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.cnValidationSelectors.selectHassaved.projector(state)
      ).toEqual(true);
    });
    it('selectHasUpdated Should return the true or false', () => {
      const state: CnValidationState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.cnValidationSelectors.selectHasUpdated.projector(state)
      ).toEqual(true);
    });

    it('selectTotalElements  Should return the true or false', () => {
      const state: CnValidationState = {
        ...initialState,
        totalElements: 10
      };
      expect(
        selectors.cnValidationSelectors.selectTotalElement.projector(state)
      ).toEqual(10);
    });

    it('selectCnTypeList  Should return the CN Type', () => {
      const state: CnValidationState = {
        ...initialState,
        cnTypeList: cnTypeList
      };
      expect(
        selectors.cnValidationSelectors.selectCnTypeList.projector(state)
      ).toEqual(cnTypeList);
    });
  });
});
