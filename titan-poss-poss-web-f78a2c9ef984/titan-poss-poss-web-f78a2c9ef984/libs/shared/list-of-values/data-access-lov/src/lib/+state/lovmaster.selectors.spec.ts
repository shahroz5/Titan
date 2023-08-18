import * as selectors from './lovmaster.selectors';

import { initialState } from './lovmaster.reducer';
import { LovMasterState } from './lovmaster.state';
import {
  CustomErrors,
  LovMaster,
  LovMasterType
} from '@poss-web/shared/models';

describe('LOV Master Selector Testing Suite', () => {
  describe('Testing selectLovMasterTypes Related Selectors', () => {
    it('should return selectLovMasterTypes Selector', () => {
      const payload: LovMasterType[] = [
        {
          name: 'LOV_Name',
          value: 'LOV_Value'
        }
      ];
      const state: LovMasterState = {
        ...initialState,
        lovMasterTypes: payload
      };
      expect(
        selectors.LovMasterSelectors.selectLovMasterTypes.projector(state)
      ).toEqual(payload);
    });
  });

  describe('Testing selectLovMasterListing Related Selectors', () => {
    it('should return selectLovMasterListing Selector', () => {
      const payload: LovMaster[] = [
        {
          lovName: 'LOV_Name',
          description: 'Desc',
          isActive: true,
          lovType: 'LOV_Type'
        }
      ];
      const state: LovMasterState = {
        ...initialState,
        lovMasterListing: payload
      };
      expect(
        selectors.LovMasterSelectors.selectLovMasterListing.projector(state)
      ).toEqual(payload);
    });
  });
  describe('Testing selectLovMasterDetails Related Selectors', () => {
    it('should return selectLovMasterDetails Selector', () => {
      const payload: LovMaster = {
        lovName: 'LOV_Name',
        description: 'Desc',
        isActive: true,
        lovType: 'LOV_Type'
      };
      const state: LovMasterState = {
        ...initialState,
        lovMasterDetails: payload
      };
      expect(
        selectors.LovMasterSelectors.selectLovMasterDetails.projector(state)
      ).toEqual(payload);
    });
  });
  describe('Testing selectSaveLovMasterFormResponse Related Selectors', () => {
    it('should return selectSaveLovMasterFormResponse Selector', () => {
      const payload: LovMaster = {
        lovName: 'LOV_Name',
        description: 'Desc',
        isActive: true,
        lovType: 'LOV_Type'
      };
      const state: LovMasterState = {
        ...initialState,
        saveLovMasterDetails: payload
      };
      expect(
        selectors.LovMasterSelectors.selectSaveLovMasterFormResponse.projector(
          state
        )
      ).toEqual(payload);
    });
  });
  describe('Testing selectEditLovMasterFormResponse Related Selectors', () => {
    it('should return selectEditLovMasterFormResponse Selector', () => {
      const payload: LovMaster[] = [
        {
          lovName: 'LOV_Name',
          description: 'Desc',
          isActive: true,
          lovType: 'LOV_Type'
        }
      ];
      const state: LovMasterState = {
        ...initialState,
        editLovMasterDetails: payload
      };
      expect(
        selectors.LovMasterSelectors.selectEditLovMasterFormResponse.projector(
          state
        )
      ).toEqual(payload);
    });
  });
  describe('Testing selectLovMasterDetails Related Selectors', () => {
    it('should return selectLovMasterDetails Selector', () => {
      const payload = 1;
      const state: LovMasterState = {
        ...initialState,
        totalMasterDetails: payload
      };
      expect(
        selectors.LovMasterSelectors.selectTotalLovMasterDetails.projector(
          state
        )
      ).toEqual(payload);
    });
  });

  describe('Testing selectIsLoading Related Selectors', () => {
    it('should return selectIsLoading Selector', () => {
      const state: LovMasterState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.LovMasterSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });
  });

  describe('Testing selectError Related Selectors', () => {
    it('should return selectError Selector', () => {
      const error: CustomErrors = {
        code: 'c',
        error: {
          message: 'message',
          name: 'name'
        },
        message: 'Mess',
        timeStamp: '123123123',
        traceId: '1'
      };
      const state: LovMasterState = {
        ...initialState,
        error
      };
      expect(selectors.LovMasterSelectors.selectError.projector(state)).toEqual(
        error
      );
    });
  });
});
