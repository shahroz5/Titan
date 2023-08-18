import { createSelector } from '@ngrx/store';
import { selectProductCategoryState } from './product-category.reducer';


const selectProductCategoryDetailsListing = createSelector(
    selectProductCategoryState,
    state => state.productCategoryListing
);

const selectTotalProductCategoryDetailsCount = createSelector(
    selectProductCategoryState,
    state => state.totalProductCategoryDetails
);


const selectProductCategoryDetailsByProductCategoryCode = createSelector(
    selectProductCategoryState,
    state => state.productCategoryDetails
);

const selectIsLoading = createSelector(
    selectProductCategoryState,
    state => state.isLoading
);


const selectError = createSelector(
    selectProductCategoryState,
    state => state.error
);


const selectSaveproductCategoryFormResponse = createSelector(
    selectProductCategoryState,
    state => state.saveProductCategoryResponses
);

const selectEditproductCategoryFormResponse = createSelector(
    selectProductCategoryState,
    state => state.editProductCategoryResponses
);



export const ProductCategorySelectors = {
    selectProductCategoryDetailsListing,
    selectProductCategoryDetailsByProductCategoryCode,
    selectIsLoading,
    selectError,
    selectTotalProductCategoryDetailsCount,
    selectSaveproductCategoryFormResponse,
    selectEditproductCategoryFormResponse
};
