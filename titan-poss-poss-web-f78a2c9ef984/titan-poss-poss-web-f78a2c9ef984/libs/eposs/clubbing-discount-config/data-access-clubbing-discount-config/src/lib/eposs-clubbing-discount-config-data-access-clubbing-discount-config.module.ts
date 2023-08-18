import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ClubbingDiscountsService } from './clubbing-discounts.service';
import { ClubDiscountsEffect } from './+state/clubbing-discount.effects';
import { ClubDiscountsFacade } from './+state/clubbing-discount.facade';
import {
  CLUB_DISCOUNTS_FEATURE_KEY,
  ClubDiscountsReducer
} from './+state/clubbing-discount.reducer';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(CLUB_DISCOUNTS_FEATURE_KEY, ClubDiscountsReducer),
    EffectsModule.forFeature([ClubDiscountsEffect])
  ],
  providers: [ClubDiscountsFacade, ClubbingDiscountsService]
})
export class EpossClubbingDiscountConfigDataAccessClubbingDiscountConfigModule {}
