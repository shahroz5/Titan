import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AirpayHostListComponent } from './airpay-host-list/airpay-host-list.component';
import { Route, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossAirpayHostConfigDataAccessAirpayHostConfigModule } from '@poss-web/eposs/airpay-host-config/data-access-airpay-host-config';
import { EpossAirpayHostConfigUiAirpayHostConfigModule } from '@poss-web/eposs/airpay-host-config/ui-airpay-host-config';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';
const route: Route[] = [{ path: '', component: AirpayHostListComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    EpossAirpayHostConfigUiAirpayHostConfigModule,
    EpossAirpayHostConfigDataAccessAirpayHostConfigModule,
    SharedFileUploadDataAccessFileUploadModule
  ],
  declarations: [AirpayHostListComponent]
})
export class EpossAirpayHostConfigFeatureAirpayHostConfigModule {}
