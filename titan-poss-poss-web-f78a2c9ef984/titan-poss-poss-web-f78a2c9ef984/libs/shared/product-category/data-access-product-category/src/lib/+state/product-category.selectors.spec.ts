import * as selectors from './product-category.selectors';
import { initialState } from './product-category.reducer';
import { ProductCategoryState } from './product-category.state';

describe('Product Category Selector Testing Suite', () => {
  describe('Testing ResetStockIssueList Related Selectors', () => {
    it('should return stockIssueListReset Selector', () => {
      const state: ProductCategoryState = {
        ...initialState,
        productCategoryListing: []
      };
      expect(
        selectors.ProductCategorySelectors.selectProductCategoryDetailsListing.projector(
          state
        )
      ).toEqual([]);
    });
  });

  describe('Testing ResetStockIssueList Related Selectors', () => {
    it('should return stockIssueListReset Selector', () => {
      const state: ProductCategoryState = {
        ...initialState,
        totalProductCategoryDetails: 3
      };
      expect(
        selectors.ProductCategorySelectors.selectTotalProductCategoryDetailsCount.projector(
          state
        )
      ).toEqual(3);
    });
  });

  describe('Testing ResetStockIssueList Related Selectors', () => {
    it('should return stockIssueListReset Selector', () => {
      const data = {
        configDetails: {
          isActive: true,
          isAlddFrDmyStdASSM: true
        },
        description: 'desc',
        orgCode: 'orgCode',
        productCategoryCode: 'A',
        isActive: true,
        isConversionEnabled: true,
        hallmarkDetails: {
          data: {
            hallmarkingCharges: '10',
            isAllowedForHallmarking: false,
            isFOCForHallmarkingCharges: false
          },
          type: 'HALLMARK_DETAILS'
        }
      };
      const state: ProductCategoryState = {
        ...initialState,
        productCategoryDetails: data
      };
      expect(
        selectors.ProductCategorySelectors.selectProductCategoryDetailsByProductCategoryCode.projector(
          state
        )
      ).toEqual(data);
    });
  });

  describe('Testing ResetStockIssueList Related Selectors', () => {
    it('should return stockIssueListReset Selector', () => {
      const state: ProductCategoryState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.ProductCategorySelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });
  });
});
