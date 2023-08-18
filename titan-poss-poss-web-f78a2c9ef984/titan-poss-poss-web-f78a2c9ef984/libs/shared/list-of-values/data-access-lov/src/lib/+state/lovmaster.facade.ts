import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';


import * as lovMasterActions from './lovmaster.actons';
import { LovMasterSelectors } from './lovmaster.selectors';
import { LovMasterState } from './lovmaster.state';
import { LovMaster } from '@poss-web/shared/models';

@Injectable()
export class LovMasterFacade {
  constructor(private store: Store<LovMasterState>) { }


  private lovMasterTypes$ = this.store.select(
    LovMasterSelectors.selectLovMasterTypes
  );

  private lovMasterTypesMain$ = this.store.select(
    LovMasterSelectors.selectLovMasterTypesMain
  );

  private lovMasterListing$ = this.store.select(
    LovMasterSelectors.selectLovMasterListing
  );

  private lovMasterDetails$ = this.store.select(
    LovMasterSelectors.selectLovMasterDetails
  );

  private isLoading$ = this.store.select(
    LovMasterSelectors.selectIsLoading
  );


  private totalLovMasterDetails$ = this.store.select(
    LovMasterSelectors.selectTotalLovMasterDetails
  );

  private error$ = this.store.select(
    LovMasterSelectors.selectError
  );


  private isLovDetailsSaved$ = this.store.select(
    LovMasterSelectors.selectSaveLovMasterFormResponse
  );

  private isLovDetailsEdited$ = this.store.select(
    LovMasterSelectors.selectEditLovMasterFormResponse
  );

  getIsLoading() {
    return this.isLoading$;
  }

  getTotalLovMasterDetails() {
    return this.totalLovMasterDetails$;
  }


  getLovMasterTypes() {
    return this.lovMasterTypes$;
  }
  getLovMasterTypesMain() {
    return this.lovMasterTypesMain$;
  }

  getLovMasterListing() {
    return this.lovMasterListing$;
  }


  getLovMasterDetails() {
    return this.lovMasterDetails$;
  }

  getError() {
    return this.error$;
  }

  getLovDetailsSaveResponse() {
    return this.isLovDetailsSaved$;
  }

  getLovDetailsEditResponse() {
    return this.isLovDetailsEdited$;
  }


  loadLovMasterTypes() {
    this.store.dispatch(
      new lovMasterActions.LoadLovTypes()
    );
  }

  loadLovMasterTypesMain() {
    this.store.dispatch(
      new lovMasterActions.LoadLovTypesMain()
    );
  }

  loadLovMasterListing(
    lovType?: string
  ) {
    if(lovType){
      this.store.dispatch(
        new lovMasterActions.LoadLovListing(
          lovType
        )
      );
    } else{
      this.store.dispatch(new lovMasterActions.NoLovtypeListing());
    }
  }

  saveLovFormDetails(saveFormDetails: LovMaster) {
    this.store.dispatch(
      new lovMasterActions.SaveLovFormDetails(saveFormDetails)
    );
  }

  editLovFormDetails(editFormDetails: LovMaster) {
    this.store.dispatch(
      new lovMasterActions.EditLovFormDetails(editFormDetails)
    );
  }

  resetLovMasterData() {
    this.store.dispatch(new lovMasterActions.ResetLovMasterData());
  }

}
