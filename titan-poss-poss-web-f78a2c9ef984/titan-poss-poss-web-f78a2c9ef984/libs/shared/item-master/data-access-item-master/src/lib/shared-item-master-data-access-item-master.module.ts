import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ItemReducer, ITEM_FEATURE_KEY } from './+state/item.reducer';
import { ItemEffect } from './+state/item.effects';
import { ItemFacade } from './+state/item.facade';
import { ItemListingService } from './item.service';

@NgModule({
  imports: [
    CommonModule, SharedUtilApiServiceModule,
    StoreModule.forFeature(ITEM_FEATURE_KEY, ItemReducer),
    EffectsModule.forFeature([ItemEffect])
  ],
  providers: [ItemFacade, ItemListingService]
})
export class SharedItemMasterDataAccessItemMasterModule {}
