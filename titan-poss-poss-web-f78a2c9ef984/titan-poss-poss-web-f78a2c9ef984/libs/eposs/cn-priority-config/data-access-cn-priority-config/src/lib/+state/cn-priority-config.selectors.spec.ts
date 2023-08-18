import {
  CustomErrors,
  CnPriorityConfig,
  CnPriorityConfigResponse
} from '@poss-web/shared/models';

import { initialState } from './cn-priority-config.reducer';
import * as selectors from './cn-priority-config.selectors';

import { CnPriorityConfigState } from './cn-priority-config.state';

describe('CN Priority Config selector Testing Suite', () => {
  const cnPriorityConfig: CnPriorityConfig = {
    description: 'gep',
    ruleDetails: {
      data: {},
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

  const cnPriorityConfigResponse: CnPriorityConfigResponse = {
    configId: '1',
    description: 'gep',
    configType: 'GEP',
    priorityDetails: [],

    isActive: true
  };
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  describe('Testing CN priority Config related Selectors', () => {
    it('selectCnPriorityConfigList Should return the list of ibt config list', () => {
      const state: CnPriorityConfigState = {
        ...initialState,
        cnPriorityConfigList: [cnPriorityConfig]
      };
      expect(
        selectors.cnPriorityConfigSelectors.selectCnPriorityConfigList.projector(
          state
        )
      ).toEqual([cnPriorityConfig]);
    });

    it('selectIsloading Should return the true or false', () => {
      const state: CnPriorityConfigState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.cnPriorityConfigSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });
    it('selectError Should return the error object', () => {
      const state: CnPriorityConfigState = {
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
        selectors.cnPriorityConfigSelectors.selectError.projector(state)
      ).toEqual(error);
    });
    it('selectCnPriorityConfig Should return the CN Priority Config object', () => {
      const state: CnPriorityConfigState = {
        ...initialState,
        cnPriorityConfig: cnPriorityConfigResponse
      };
      expect(
        selectors.cnPriorityConfigSelectors.selectCnPriorityConfig.projector(
          state
        )
      ).toEqual(cnPriorityConfigResponse);
    });

    it('selectHasSaved Should return the true or false', () => {
      const state: CnPriorityConfigState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.cnPriorityConfigSelectors.selectHassaved.projector(state)
      ).toEqual(true);
    });
    it('selectHasUpdated Should return the true or false', () => {
      const state: CnPriorityConfigState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.cnPriorityConfigSelectors.selectHasUpdated.projector(state)
      ).toEqual(true);
    });

    it('selectTotalElements  Should return the true or false', () => {
      const state: CnPriorityConfigState = {
        ...initialState,
        totalElements: 10
      };
      expect(
        selectors.cnPriorityConfigSelectors.selectTotalElement.projector(state)
      ).toEqual(10);
    });

    it('selectCnTypeList  Should return the CN Type', () => {
      const state: CnPriorityConfigState = {
        ...initialState,
        cnTypeList: cnTypeList
      };
      expect(
        selectors.cnPriorityConfigSelectors.selectCnTypeList.projector(state)
      ).toEqual(cnTypeList);
    });
  });
});
