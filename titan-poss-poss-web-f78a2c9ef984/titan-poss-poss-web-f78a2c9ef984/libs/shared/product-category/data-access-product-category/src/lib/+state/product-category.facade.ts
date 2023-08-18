import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';


import * as productCategoryActions from './product-category.actions';
import { ProductCategorySelectors } from './product-category.selectors';
import { ProductCategoryState } from './product-category.state';
import { LoadProductCategoryListingPayload, SaveProductCategoryFormDetailsPayload } from '@poss-web/shared/models';

@Injectable()
export class ProductCategoryFacade {
    constructor(private store: Store<ProductCategoryState>) { }


    private productCategoryListing$ = this.store.select(
        ProductCategorySelectors.selectProductCategoryDetailsListing
    );

    private ProductCategoryDetailsByProductCategoryCode$ = this.store.select(
        ProductCategorySelectors.selectProductCategoryDetailsByProductCategoryCode
    );

    private isLoading$ = this.store.select(
        ProductCategorySelectors.selectIsLoading
    );

    private isproductCategorySaved$ = this.store.select(
        ProductCategorySelectors.selectSaveproductCategoryFormResponse
    );

    private isproductCategoryEdited$ = this.store.select(
        ProductCategorySelectors.selectEditproductCategoryFormResponse
    );


    private totalproductCategoryDetails$ = this.store.select(
        ProductCategorySelectors.selectTotalProductCategoryDetailsCount
    );

    private hasError$ = this.store.select(
        ProductCategorySelectors.selectError
    );


    getproductCategorySaveResponse() {
        return this.isproductCategorySaved$;
    }

    getproductCategoryEditResponse() {
        return this.isproductCategoryEdited$;
    }

    getisLoading() {
        return this.isLoading$;
    }

    getTotalproductCategoryDetails() {
        return this.totalproductCategoryDetails$;
    }


    getproductCategoryDetailsListing() {
        return this.productCategoryListing$;
    }


    getproductCategoryDetailsByproductCategoryCode() {
        return this.ProductCategoryDetailsByProductCategoryCode$;
    }

    getError() {
        return this.hasError$;
    }


    loadProductCategoryDetailsByproductCategoryCode(binGroup: string) {
        this.store.dispatch(
            new productCategoryActions.LoadProductCategoryByProductCategoryCode(
                binGroup
            )
        );
    }

    loadProductCategoryDetailsListing(
        loadbinGroupDetailsListingPayload: LoadProductCategoryListingPayload
    ) {
        this.store.dispatch(
            new productCategoryActions.LoadProductCategoryDetails(
                loadbinGroupDetailsListingPayload
            )
        );
    }

    resetproductCategoryDialogData() {
        this.store.dispatch(new productCategoryActions.ResetProductCategoryDialog());
    }

    editproductCategoryFormDetails(editFormDetails: SaveProductCategoryFormDetailsPayload) {
        this.store.dispatch(
            new productCategoryActions.EditProductCategoryFormDetails(editFormDetails)
        );
    }

    saveproductCategoryFormDetails(saveFormDetails:SaveProductCategoryFormDetailsPayload) {
        this.store.dispatch(
            new productCategoryActions.SaveProductCategoryFormDetails(saveFormDetails)
        );
    }


    searchProductCategor(productCategoryCode: string) {
        this.store.dispatch(
            new productCategoryActions.SearchProductCategoryCode(productCategoryCode)
        );
    }

}
