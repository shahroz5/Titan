import * as selectors from './tep-validation-config.selectors';

import { initialState } from './tep-validation-config.reducer';
import { TepValidationConfigState } from './tep-validation-config.state';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('TEP Validation Selector Testing Suite', () => {
  describe('Testing selectTepValidationConfigDetails Related Selectors', () => {
    it('should return selectTepValidationConfigDetails Selector', () => {
      const state: TepValidationConfigState = {
        ...initialState,
        tepValidationConfigDetails: {
          configDetails: {
            data: {
              fvtCNCancellationDeductionPercent: 10,
              isAnnexurePrintingAllowed: true,
              isFVTCNCancellationAllowed: true,
              isInterBrandCashRefundAllowed: true,
              tepCancellationDays: 1
            },
            type: 'TYPE'
          },
          configId: '1',
          configType: 'Type',
          description: 'Desc',
          isActive: true,
          offerDetails: null
        }
      };
      expect(
        selectors.tepValidationConfigSelectors.selectTepValidationConfigDetails.projector(
          state
        )
      ).toBeDefined();
    });
  });
  describe('Testing selectLovMasterTypes Related Selectors', () => {
    it('should return selectLovMasterTypes Selector', () => {
      const state: TepValidationConfigState = {
        ...initialState,
        totalElements: 1
      };
      expect(
        selectors.tepValidationConfigSelectors.selectTotalElements.projector(
          state
        )
      ).toEqual(1);
    });
  });

  describe('Testing selectIsLoading Related Selectors', () => {
    it('should return selectIsLoading Selector', () => {
      const state: TepValidationConfigState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.tepValidationConfigSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });
  });

  describe('Testing selectHasUpdated Related Selectors', () => {
    it('should return selectHasUpdated Selector', () => {
      const state: TepValidationConfigState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.tepValidationConfigSelectors.selectHasUpdated.projector(state)
      ).toEqual(true);
    });
  });
  describe('Testing selectHasSaved Related Selectors', () => {
    it('should return selectHasSaved Selector', () => {
      const state: TepValidationConfigState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.tepValidationConfigSelectors.selectHasSaved.projector(state)
      ).toEqual(true);
    });
  });
  describe('Testing selectError Related Selectors', () => {
    it('should return selectError Selector', () => {
      const state: TepValidationConfigState = {
        ...initialState,
        error: CustomErrorAdaptor.fromJson(Error('some error'))
      };
      expect(
        selectors.tepValidationConfigSelectors.selectError.projector(state)
      ).toEqual(CustomErrorAdaptor.fromJson(Error('some error')));
    });
  });
});
