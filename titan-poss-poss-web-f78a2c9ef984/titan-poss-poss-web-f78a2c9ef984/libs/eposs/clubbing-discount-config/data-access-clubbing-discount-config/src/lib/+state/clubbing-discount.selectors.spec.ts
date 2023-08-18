import {
  CustomErrors,
  ClubDiscountsList,
  DiscountTypeBasedCodes,
  SaveRulesPayload
} from '@poss-web/shared/models';
import { ClubDiscountsState } from './clubbing-discount.state';
import { initialState } from './clubbing-discount.reducer';
import * as selectors from './clubbing-discount.selectors';
import {
  ClubDiscountsEntity,
  clubDiscountsAdapter
} from './clubbing-discount.entity';

describe('Bin selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  const clubbedDiscountsList: ClubDiscountsList = {
    id: '4567890',
    type1DiscountCode: 'AAA',
    type2DiscountCode: 'BBB',
    type3DiscountCode: 'CCC'
  };
  const addElementToEntities = <T extends ClubDiscountsList>(
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
  const clubDiscountsState: ClubDiscountsEntity = {
    ids: [clubbedDiscountsList.id],
    entities: addElementToEntities([clubbedDiscountsList])
  };

  describe('Testing Clubbng Of Discounts related Selectors', () => {
    it('Should return gl location list ', () => {
      const selectClubDiscountList = clubDiscountsAdapter.setAll(
        [clubbedDiscountsList],
        {
          ...clubDiscountsAdapter.getInitialState()
        }
      );

      const state: ClubDiscountsState = {
        ...initialState,
        clubbedDiscountList: clubDiscountsState
      };
      expect(selectors.selectClubbedDiscountsListing.projector(state)).toEqual(
        selectClubDiscountList
      );
    });

    it('Should return the true or false', () => {
      const state: ClubDiscountsState = {
        ...initialState,
        isLoading: true
      };
      expect(selectors.selectIsLoading.projector(state)).toEqual(true);
    });
    it('Should return the count', () => {
      const state: ClubDiscountsState = {
        ...initialState,
        totalCount: 0
      };
      expect(selectors.selectTotalElements.projector(state)).toEqual(0);
    });
    it('Should return the error object', () => {
      const state: ClubDiscountsState = {
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

    it('Should return the type 1 DiscountCode data list', () => {
      const discountCodes: DiscountTypeBasedCodes[] = [
        {
          id: '12',
          discountCode: 'AAA'
        }
      ];

      const state: ClubDiscountsState = {
        ...initialState,
        discountCodesType1: discountCodes
      };

      expect(selectors.selectType1DiscountCodes.projector(state)).toEqual(
        discountCodes
      );
    });

    it('Should return the type 2 DiscountCode data list', () => {
      const discountCodes: DiscountTypeBasedCodes[] = [
        {
          id: '12',
          discountCode: 'AAA'
        }
      ];

      const state: ClubDiscountsState = {
        ...initialState,
        discountCodesType2: discountCodes
      };

      expect(selectors.selectType2DiscountCodes.projector(state)).toEqual(
        discountCodes
      );
    });

    it('Should return the type 3 DiscountCode data list', () => {
      const discountCodes: DiscountTypeBasedCodes[] = [
        {
          id: '12',
          discountCode: 'AAA'
        }
      ];

      const state: ClubDiscountsState = {
        ...initialState,
        discountCodesType3: discountCodes
      };

      expect(selectors.selectType3DiscountCodes.projector(state)).toEqual(
        discountCodes
      );
    });

    it('Should save the gl location payment', () => {
      const payload: ClubDiscountsList = {
        id: '4567890',
        type1DiscountCode: 'AAA',
        type2DiscountCode: 'BBB',
        type3DiscountCode: 'CCC'
      };
      const state: ClubDiscountsState = {
        ...initialState,
        saveclubbedDiscounts: payload
      };
      expect(selectors.selectSaveClubbedDiscounts.projector(state)).toEqual(
        payload
      );
    });
    it('Should return the true or false', () => {
      const state: ClubDiscountsState = {
        ...initialState,
        hasSaved: true
      };
      expect(selectors.selectIsSaved.projector(state)).toBe(true);
    });
  });
});
