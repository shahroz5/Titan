import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AirpayVendorListComponent } from './airpay-vendor-list/airpay-vendor-list.component';
import { Route, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossAirpayConfigDataAccessAirpayConfigModule } from '@poss-web/eposs/airpay-config/data-access-airpay-config';
import { EpossAirpayConfigUiAirpayConfigModule } from '@poss-web/eposs/airpay-config/ui-airpay-config';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';

const route: Route[] = [{ path: '', component: AirpayVendorListComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    EpossAirpayConfigDataAccessAirpayConfigModule,
    EpossAirpayConfigUiAirpayConfigModule,
    SharedFileUploadDataAccessFileUploadModule
  ],
  declarations: [AirpayVendorListComponent]
})
export class EpossAirpayConfigFeatureAirpayConfigModule {}
