import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CashbackOfferConfigurtaionDetailsComponent } from './cashback-offer-configurtaion-details/cashback-offer-configurtaion-details.component';
import { EpossCashbackOfferConfigDataAccessCashbackOfferConfigModule } from '@poss-web/eposs/cashback-offer-config/data-access-cashback-offer-config';
import { EpossCashbackOfferConfigUiCashbackOfferConfigDetailModule } from '@poss-web/eposs/cashback-offer-config/ui-cashback-offer-config-detail';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFileuploadConfirmationPopupModule } from '@poss-web/shared/components/ui-fileupload-confirmation-popup';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';
import { EpossCashbackOfferConfigUiCashbackOfferConfigViewModule } from '@poss-web/eposs/cashback-offer-config/ui-cashback-offer-config-view';

const routes: Routes = [
  {
    path: '',
    component: CashbackOfferConfigurtaionDetailsComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    RouterModule.forChild(routes),
    EpossCashbackOfferConfigUiCashbackOfferConfigDetailModule,
    EpossCashbackOfferConfigDataAccessCashbackOfferConfigModule,
    SharedComponentsUiFileuploadConfirmationPopupModule,
    SharedFileUploadDataAccessFileUploadModule,
    EpossCashbackOfferConfigUiCashbackOfferConfigViewModule
  ],
  declarations: [CashbackOfferConfigurtaionDetailsComponent]
})
export class EpossCashbackOfferConfigFeatureCashbackOfferConfigDetailModule {}
