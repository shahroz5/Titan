import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ClubDiscountsListPayload,
  SaveRulesPayload
} from '@poss-web/shared/models';

import * as ClubDiscountsActions from './clubbing-discount.actions';
import { ClubDiscountsSelectors } from './clubbing-discount.selectors';
import { ClubDiscountsState } from './clubbing-discount.state';

@Injectable()
export class ClubDiscountsFacade {
  constructor(private store: Store<ClubDiscountsState>) {}

  private isLoading$ = this.store.select(
    ClubDiscountsSelectors.selectIsLoading
  );
  private hasError$ = this.store.select(ClubDiscountsSelectors.selectError);
  private isSaved$ = this.store.select(ClubDiscountsSelectors.selectIsSaved);
  private glClubbedDiscountList$ = this.store.select(
    ClubDiscountsSelectors.selectClubbedDiscountsList
  );
  private totalElements$ = this.store.select(
    ClubDiscountsSelectors.selectTotalElements
  );
  private discountCodesType1$ = this.store.select(
    ClubDiscountsSelectors.selectType1DiscountCodes
  );
  private discountCodesType2$ = this.store.select(
    ClubDiscountsSelectors.selectType2DiscountCodes
  );
  private discountCodesType3$ = this.store.select(
    ClubDiscountsSelectors.selectType3DiscountCodes
  );

  getClubbedDiscountList() {
    return this.glClubbedDiscountList$;
  }
  getIsLoading() {
    return this.isLoading$;
  }
  getIsSaved() {
    return this.isSaved$;
  }
  getError() {
    return this.hasError$;
  }
  getTotalElements() {
    return this.totalElements$;
  }
  getType1DiscountCodes() {
    return this.discountCodesType1$;
  }
  getType2DiscountCodes() {
    return this.discountCodesType2$;
  }
  getType3DiscountCodes() {
    return this.discountCodesType3$;
  }
  loadClubbedDiscountsList(
    payload: ClubDiscountsListPayload,
    discountCode?: string
  ) {
    this.store.dispatch(
      new ClubDiscountsActions.LoadClubbingDiscountConfigList(
        payload,
        discountCode
      )
    );
  }

  saveClubbedDiscountList(payload: SaveRulesPayload) {
    this.store.dispatch(
      new ClubDiscountsActions.SaveClubbingDiscountConfigList(payload)
    );
  }

  deleteRowData(id: string) {
    this.store.dispatch(
      new ClubDiscountsActions.DeleteClubbingDiscountConfigList(id)
    );
  }
  loadType1DiscountCodes(type: string) {
    this.store.dispatch(new ClubDiscountsActions.LoadType1Discounts(type));
  }
  loadType2DiscountCodes(type: string) {
    this.store.dispatch(new ClubDiscountsActions.LoadType2Discounts(type));
  }
  loadType3DiscountCodes(type: string) {
    this.store.dispatch(new ClubDiscountsActions.LoadType3Discounts(type));
  }

  resetData() {
    this.store.dispatch(
      new ClubDiscountsActions.ResetClubbingDiscountConfigList()
    );
  }
}
