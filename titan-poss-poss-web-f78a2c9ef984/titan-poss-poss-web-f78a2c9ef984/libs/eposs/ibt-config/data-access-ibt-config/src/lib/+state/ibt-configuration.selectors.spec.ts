// you will need to assert that the store is calling the right selector function.

import {
  CustomErrors,
  IbtConfiguration,
  IbtConfigurationResponse
} from '@poss-web/shared/models';

import { initialState } from './ibt-configuration.reducer';
import * as selectors from './ibt-configuration.selectors';

import { IbtConfigurationState } from './ibt-configuration.state';

describe('IBT Config selector Testing Suite', () => {
  const ibtConfiguration: IbtConfiguration = {
    description: 'ibtconfig',
    ruleDetails: {
      data: {
        maxProductsPerStn: '',
        maxReqPerMonth: '',
        maxValPerStn: '',
        validRequestTime: ''
      },
      type: 'IBT_CONIG'
    },
    isActive: true
  };

  const ibtConfigurationResponse: IbtConfigurationResponse = {
    configId: '1',
    description: 'ibtconfig',
    configType: 'IBT_CONFIG',
    maxProductsPerStn: '',
    maxReqPerMonth: '',
    maxValPerStn: '',
    validRequestTime: '',

    isActive: true
  };
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  describe('Testing IBT Config related Selectors', () => {
    it('selectIbtConfigList Should return the list of ibt config list', () => {
      const state: IbtConfigurationState = {
        ...initialState,
        ibtConfigList: [ibtConfiguration]
      };
      expect(
        selectors.ibtConfigurationSelectors.selectIbtConfigList.projector(state)
      ).toEqual([ibtConfiguration]);
    });

    it('selectIsloading Should return the true or false', () => {
      const state: IbtConfigurationState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.ibtConfigurationSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });
    it('selectError Should return the error object', () => {
      const state: IbtConfigurationState = {
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
        selectors.ibtConfigurationSelectors.selectError.projector(state)
      ).toEqual(error);
    });
    it('selectIbtConfig Should return the IBT Config object', () => {
      const state: IbtConfigurationState = {
        ...initialState,
        ibtConfiguration: ibtConfigurationResponse
      };
      expect(
        selectors.ibtConfigurationSelectors.selectIbtConfig.projector(state)
      ).toEqual(ibtConfigurationResponse);
    });

    it('selectHasSaved Should return the true or false', () => {
      const state: IbtConfigurationState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.ibtConfigurationSelectors.selectHassaved.projector(state)
      ).toEqual(true);
    });
    it('selectHasUpdated Should return the true or false', () => {
      const state: IbtConfigurationState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.ibtConfigurationSelectors.selectHasUpdated.projector(state)
      ).toEqual(true);
    });

    it('selectTotalElements  Should return the true or false', () => {
      const state: IbtConfigurationState = {
        ...initialState,
        totalElements: 10
      };
      expect(
        selectors.ibtConfigurationSelectors.selectTotalElement.projector(state)
      ).toEqual(10);
    });
  });
});
