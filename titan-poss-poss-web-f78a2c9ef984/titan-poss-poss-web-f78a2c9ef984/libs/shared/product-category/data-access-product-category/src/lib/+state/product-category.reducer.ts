import { ProductCategoryState } from './product-category.state';
import { ProductCategoryActions, ProductCategoryActionTypes } from './product-category.actions';
import { createFeatureSelector } from '@ngrx/store';

export const initialState: ProductCategoryState = {
    productCategoryListing: null,
    productCategoryDetails: null,
    totalProductCategoryDetails: 0,
    isLoading: false,
    error: null,
    saveProductCategoryResponses: null,
    editProductCategoryResponses: null
};

export const PRODUCT_CATEGORY_FEATURE_KEY = 'productCategory';
export const selectProductCategoryState = createFeatureSelector<ProductCategoryState>(
    PRODUCT_CATEGORY_FEATURE_KEY
);


export function ProductCategoryReducer(state: ProductCategoryState = initialState, action: ProductCategoryActions): ProductCategoryState {
    switch (action.type) {
        case ProductCategoryActionTypes.LOAD_PRODUCT_CATEGORY_DETAILS:
        case ProductCategoryActionTypes.LOAD_PRODUCT_CATEGORY_DETAILS_BY_PRODUCT_CATEGORYCODE:
        case ProductCategoryActionTypes.SAVE_PRODUCT_CATEGORY_FORM_DETAILS:
        case ProductCategoryActionTypes.EDIT_PRODUCT_CATEGORY_FORM_DETAILS:
        case ProductCategoryActionTypes.SEARCH_PRODUCT_CATEGORY_DETAILS:
            return {
                ...state,
                isLoading: true
            };

        case ProductCategoryActionTypes.LOAD_PRODUCT_CATEGORY_DETAILS_SUCCESS:
            return {
                ...state,
                productCategoryListing: action.payload.productCategoryListing,
                totalProductCategoryDetails: action.payload.totalElements,
                isLoading: false
            };

        case ProductCategoryActionTypes.LOAD_PRODUCT_CATEGORY_DETAILS_FAILURE:
        case ProductCategoryActionTypes.LOAD_PRODUCT_CATEGORY_DETAILS_BY_PRODUCT_CATEGORYCODE_FAILURE:
        case ProductCategoryActionTypes.EDIT_PRODUCT_CATEGORY_FORM_DETAILS_FAILURE:
        case ProductCategoryActionTypes.SAVE_PRODUCT_CATEGORY_FORM_DETAILS_FAILURE:
            return {
                ...state,
                error: action.payload,
                isLoading: false
            };

        // case ProductCategoryActionTypes.LOAD_PRODUCT_CATEGORY_DETAILS_BY_PRODUCT_CATEGORYCODE:
        //     return {
        //         ...state,
        //         isLoading: true
        //     }; // Duplicate return

        case ProductCategoryActionTypes.LOAD_PRODUCT_CATEGORY_DETAILS_BY_PRODUCT_CATEGORYCODE_SUCCESS:
            return {
                ...state,
                productCategoryDetails: action.payload,
                isLoading: false
            };

        // case ProductCategoryActionTypes.LOAD_PRODUCT_CATEGORY_DETAILS_BY_PRODUCT_CATEGORYCODE_FAILURE:
        //     return {
        //         ...state,
        //         error: action.payload,
        //         isLoading: false
        //     };  // Duplicate return

        case ProductCategoryActionTypes.RESET_PRODUCT_CATEGORY_DIALOG_DATA:
            return {
                ...state,
                productCategoryListing: null,
                productCategoryDetails: null,
                error: null,
                isLoading: false,
                saveProductCategoryResponses: null,
                editProductCategoryResponses: null

            };

        // case ProductCategoryActionTypes.SAVE_PRODUCT_CATEGORY_FORM_DETAILS:
        //     return {
        //         ...state,
        //         isLoading: true
        //     }; // Duplicate return

        case ProductCategoryActionTypes.SAVE_PRODUCT_CATEGORY_FORM_DETAILS_SUCCESS:

            return {
                ...state,
                isLoading: false,
                saveProductCategoryResponses: action.payload,
                productCategoryListing: [...state.productCategoryListing, action.payload]
            };

        // case ProductCategoryActionTypes.SAVE_PRODUCT_CATEGORY_FORM_DETAILS_FAILURE:
        //     return {
        //         ...state,
        //         error: action.payload,
        //         isLoading: false
        //     }; // Duplicate return

        // case ProductCategoryActionTypes.EDIT_PRODUCT_CATEGORY_FORM_DETAILS:
        //     return {
        //         ...state,
        //         isLoading: true
        //     };

        case ProductCategoryActionTypes.EDIT_PRODUCT_CATEGORY_FORM_DETAILS_SUCCESS:
            // const oneProductCategory = state.productCategoryListing.filter(data => data.productCategoryCode === action.payload.productCategoryCode);
            // const affectedProductCategoryIndex = state.productCategoryListing.findIndex(data => data.productCategoryCode === action.payload.productCategoryCode);

            // const allProducts = state.productCategoryListing;
            // allProducts[affectedProductCategoryIndex] = action.payload;
            return {
                ...state,
                isLoading: false,
                editProductCategoryResponses: action.payload
            };
        // case ProductCategoryActionTypes.EDIT_PRODUCT_CATEGORY_FORM_DETAILS_FAILURE:
        //     return {
        //         ...state,
        //         error: action.payload,
        //         isLoading: false
        //     }; // Duplicate return


        // case ProductCategoryActionTypes.SEARCH_PRODUCT_CATEGORY_DETAILS:
        //     return {
        //         ...state,
        //         isLoading: true
        //     }; // Duplicate return

        case ProductCategoryActionTypes.SEARCH_PRODUCT_CATEGORY_DETAILS_SUCCESS:
            return {
                ...state,
                productCategoryListing: action.payload,
                isLoading: false,
                totalProductCategoryDetails: 0
            };

        case ProductCategoryActionTypes.SEARCH_PRODUCT_CATEGORY_DETAILS_FAILURE:
            return {
                ...state,
                error: action.payload,
                productCategoryListing: null,
                isLoading: false,
                totalProductCategoryDetails: 0
            };

        default:
            return state;
    }
}
