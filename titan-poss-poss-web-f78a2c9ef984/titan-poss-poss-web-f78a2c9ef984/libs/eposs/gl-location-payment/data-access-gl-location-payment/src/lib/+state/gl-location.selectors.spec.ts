import { CustomErrors, GLLocationPaymentList } from '@poss-web/shared/models';
import { GlLocationPaymentState } from './gl-location.state';
import { initialState } from './gl-location.reducer';
import * as selectors from './gl-location.selectors';
import {
  GlLocationPaymentDetailsEntity,
  glLocPaymentAdapter
} from './gl-location.entity';

describe('Bin selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  const glLocationPaymentList: GLLocationPaymentList = {
    id: '4567890',
    glCode: 23456,
    locationCode: 'URB',
    paymentCode: 'CASH',
    lastModified: true
  };
  const addElementToEntities = <T extends GLLocationPaymentList>(
    payload: T[]
  ): { [id: string]: T } => {
    const reducedEntities = payload.reduce(
      (entities: { [id: string]: T }, element: T) => {
        return {
          ...entities,
          [element.id]: element
        };
      },
      {}
    );

    return reducedEntities;
  };
  const glLocationState: GlLocationPaymentDetailsEntity = {
    ids: [glLocationPaymentList.id],
    entities: addElementToEntities([glLocationPaymentList])
  };

  describe('Testing Gl Location Payment related Selectors', () => {
    it('Should return gl location list ', () => {
      const selectGlLocationList = glLocPaymentAdapter.setAll(
        [glLocationPaymentList],
        {
          ...glLocPaymentAdapter.getInitialState()
        }
      );

      const state: GlLocationPaymentState = {
        ...initialState,
        glLocationList: glLocationState
      };
      expect(selectors.selectGlLocationPaymentListing.projector(state)).toEqual(
        selectGlLocationList
      );
    });

    it('Should return the true or false', () => {
      const state: GlLocationPaymentState = {
        ...initialState,
        isLoading: true
      };
      expect(selectors.selectIsLoading.projector(state)).toEqual(true);
    });
    it('Should return the count', () => {
      const state: GlLocationPaymentState = {
        ...initialState,
        totalCount: 0
      };
      expect(selectors.selectTotalElements.projector(state)).toEqual(0);
    });
    it('Should return the error object', () => {
      const state: GlLocationPaymentState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(selectors.selectError.projector(state)).toEqual(error);
    });

    it('Should return the payment data list', () => {
      const paymentData = [
        {
          value: 'CASH',
          description: 'CASH'
        }
      ];

      const state: GlLocationPaymentState = {
        ...initialState,
        paymentCodes: paymentData
      };

      expect(selectors.selectPaymentCodes.projector(state)).toEqual(
        paymentData
      );
    });
    it('Should return the location Data list', () => {
      const locationData = [
        {
          locationCode: 'URB',
          description: 'aaaa'
        }
      ];

      const state: GlLocationPaymentState = {
        ...initialState,
        locationData: locationData
      };

      expect(selectors.selectLocationCodes.projector(state)).toEqual(
        locationData
      );
    });
    it('Should save the gl location payment', () => {
      const payload: GLLocationPaymentList = {
        id: '4567890',
        glCode: 23456,
        locationCode: 'URB',
        paymentCode: 'CASH',
        lastModified: true
      };
      const state: GlLocationPaymentState = {
        ...initialState,
        saveGlLocationPayment: payload
      };
      expect(selectors.selectSaveGlLocationPayment.projector(state)).toEqual(
        payload
      );
    });
    it('Should return the true or false', () => {
      const state: GlLocationPaymentState = {
        ...initialState,
        hasSaved: true
      };
      expect(selectors.selectIsSaved.projector(state)).toBe(true);
    });
  });
});
