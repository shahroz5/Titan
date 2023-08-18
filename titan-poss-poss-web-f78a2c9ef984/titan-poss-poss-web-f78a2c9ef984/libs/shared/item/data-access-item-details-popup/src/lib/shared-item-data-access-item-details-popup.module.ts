import {
  ITEM_DETAILS_POPUP_FEATURE_KEY,
  ItemDetailsPopupReducer
} from './+state/item-details-popup.reducer';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemDetailsPopupEffect } from './+state/item-details-popup.effect';
import { StoreModule } from '@ngrx/store';
import { ItemDetailsPopupFacade } from './+state/item-details-popup.facade';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      ITEM_DETAILS_POPUP_FEATURE_KEY,
      ItemDetailsPopupReducer
    ),
    EffectsModule.forFeature([ItemDetailsPopupEffect])
  ],
  providers: [ItemDetailsPopupFacade]
})
export class SharedItemDataAccessItemDetailsPopupModule {}
