import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CashbackOfferConfigListItemComponent } from './cashback-offer-config-list-item/cashback-offer-config-list-item.component';
import { CashbackOfferConfigListItemsComponent } from './cashback-offer-config-list-items/cashback-offer-config-list-items.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [
    CashbackOfferConfigListItemComponent,
    CashbackOfferConfigListItemsComponent
  ],
  exports: [
    CashbackOfferConfigListItemComponent,
    CashbackOfferConfigListItemsComponent
  ]
})
export class EpossCashbackOfferConfigUiCashbackOfferConfigListModule {}
