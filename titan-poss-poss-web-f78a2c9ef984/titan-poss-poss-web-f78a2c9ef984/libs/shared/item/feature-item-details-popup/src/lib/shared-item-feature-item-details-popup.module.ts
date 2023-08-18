import { SharedItemUiPriceDetailsModule } from '@poss-web/shared/item/ui-price-details';
import { SharedItemUiItemDetailsHeaderModule } from '@poss-web/shared/item/ui-item-details-header';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemDetailsPopupComponent } from './item-details-popup.component';
import { ItemDetailPopupservice } from './item-details-popup.service';
import { SharedItemDataAccessItemDetailsPopupModule } from '@poss-web/shared/item/data-access-item-details-popup';
import { SharedItemUiStoneDetailsModule } from '@poss-web/shared/item/ui-stone-details';
import { ItemDetailPopupserviceAbstraction } from '@poss-web/shared/models';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedItemDataAccessItemDetailsPopupModule,
    SharedItemUiStoneDetailsModule,
    SharedItemUiItemDetailsHeaderModule,
    SharedItemUiPriceDetailsModule
  ],
  declarations: [ItemDetailsPopupComponent],
  entryComponents: [ItemDetailsPopupComponent],
  providers: [
    {
      provide: ItemDetailPopupserviceAbstraction,
      useClass: ItemDetailPopupservice
    }
  ]
})
export class SharedItemFeatureItemDetailsPopupModule {}
