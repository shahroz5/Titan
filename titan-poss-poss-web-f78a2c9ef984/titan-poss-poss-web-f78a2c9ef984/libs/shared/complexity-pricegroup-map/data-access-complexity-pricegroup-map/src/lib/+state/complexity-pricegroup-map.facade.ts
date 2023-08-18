import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import {
  LoadComplexityPriceGroupListingPayload,
  SaveComplexityPriceGroupFormPayload,
  EditComplexityPriceGroupFormPayload,
  ComplexityPricegroupFilter
} from '@poss-web/shared/models';

import * as complexityPriceGroupActions from './complexity-pricegroup-map.actions';
import { ComplexityPricegroupState } from './complexity-pricegroup-map.state';
import { ComplexityPricegroupSelectors } from './complexity-pricegroup-map.selectors';
@Injectable()
export class ComplexityPricegroupFacade {
  constructor(private store: Store<ComplexityPricegroupState>) {}

  private complexityPricegroupListing$ = this.store.select(
    ComplexityPricegroupSelectors.selectComplexityPriceGroupDetailsListing
  );

  private ComplexityPricegroupDetailsById$ = this.store.select(
    ComplexityPricegroupSelectors.selectComplexityPriceGroupDetailsById
  );

  private isLoading$ = this.store.select(
    ComplexityPricegroupSelectors.selectIsLoading
  );

  private isComplexityPricegroupSaved$ = this.store.select(
    ComplexityPricegroupSelectors.selectSaveComplexityPriceGroupFormResponse
  );

  private isComplexityPricegroupEdited$ = this.store.select(
    ComplexityPricegroupSelectors.selectEditComplexityPriceGroupFormResponse
  );

  private totalcomplexityPricegroupDetails$ = this.store.select(
    ComplexityPricegroupSelectors.selectTotalComplexityPriceGroupDetailsCount
  );

  private hasError$ = this.store.select(
    ComplexityPricegroupSelectors.selectError
  );

  private complexityCodeDetails$ = this.store.select(
    ComplexityPricegroupSelectors.selectComplexityCode
  );
  private priceGroupDetails$ = this.store.select(
    ComplexityPricegroupSelectors.selectPriceGroup
  );
  private fileUploadSuccess$ = this.store.select(
    ComplexityPricegroupSelectors.selectFileUploadSuccess
  );

  getisLoading() {
    return this.isLoading$;
  }
  getTotalcomplexityPricegroupDetails() {
    return this.totalcomplexityPricegroupDetails$;
  }

  getcomplexityPricegroupDetailsListing() {
    return this.complexityPricegroupListing$;
  }

  getcomplexityPricegroupDetailsById() {
    return this.ComplexityPricegroupDetailsById$;
  }

  getcomplexityPricegroupSaveResponse() {
    return this.isComplexityPricegroupSaved$;
  }

  getcomplexityPricegroupEditResponse() {
    return this.isComplexityPricegroupEdited$;
  }

  getComplexityCode() {
    return this.complexityCodeDetails$;
  }
  getPriceGroup() {
    return this.priceGroupDetails$;
  }
getFileUploadSuccess(){
  return this.fileUploadSuccess$;
}
  getError() {
    return this.hasError$;
  }
  loadComplexityPricegroupDetailsById(id: string) {
    this.store.dispatch(
      new complexityPriceGroupActions.LoadComplexityPricegroupMappingDetailsById(
        id
      )
    );
  }
  loadcomplexityPricegroupDetailsListing(
    loadComplexityPriceGroupListingPayload: LoadComplexityPriceGroupListingPayload,
    complexCode?: string,
    priceCode?: string
  ) {
    this.store.dispatch(
      new complexityPriceGroupActions.LoadComplexityPricegroupMappingDetails(
        loadComplexityPriceGroupListingPayload,
        complexCode,
        priceCode
      )
    );
  }

  loadComplexityCodes() {
    this.store.dispatch(new complexityPriceGroupActions.LoadComplexityCode());
  }

  loadPricegroups() {
    this.store.dispatch(new complexityPriceGroupActions.LoadPricegroup());
  }

  loadFileUploadItems(payload: FormData) {
    this.store.dispatch(
      new complexityPriceGroupActions.LoadFileUploadItems(payload)
    );
  }

  resetComplexityPricegroupDialogData() {
    this.store.dispatch(
      new complexityPriceGroupActions.ResetComplexityPricegroupDialog()
    );
  }

  editComplexityPricegroupFormDetails(
    editFormDetails: EditComplexityPriceGroupFormPayload
  ) {
    this.store.dispatch(
      new complexityPriceGroupActions.EditComplexityPricegroupFormDetails(
        editFormDetails
      )
    );
  }

  saveComplexityPricegroupFormDetails(
    saveFormDetails: SaveComplexityPriceGroupFormPayload
  ) {
    this.store.dispatch(
      new complexityPriceGroupActions.SaveComplexityPricegroupFormDetails(
        saveFormDetails
      )
    );
  }

}
