import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CashbackOfferConfigListComponent } from './cashback-offer-config-list/cashback-offer-config-list.component';
import { EpossCashbackOfferConfigDataAccessCashbackOfferConfigModule } from '@poss-web/eposs/cashback-offer-config/data-access-cashback-offer-config';
import { EpossCashbackOfferConfigUiCashbackOfferConfigListModule } from '@poss-web/eposs/cashback-offer-config/ui-cashback-offer-config-list';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: CashbackOfferConfigListComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    EpossCashbackOfferConfigDataAccessCashbackOfferConfigModule,
    EpossCashbackOfferConfigUiCashbackOfferConfigListModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [CashbackOfferConfigListComponent]
})
export class EpossCashbackOfferConfigFeatureCashbackOfferConfigListModule {}
