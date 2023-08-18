import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossRazorpayVendorConfigDataAccessRazorpayVendorConfigModule } from '@poss-web/eposs/razorpay-vendor-config/data-access-razorpay-vendor-config';
import { EpossRazorpayVendorConfigUiRazorpayVendorConfigListModule } from '@poss-web/eposs/razorpay-vendor-config/ui-razorpay-vendor-config-list';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';

import { RazorpayVendorListComponent } from './razorpay-vendor-list.component';

const route: Route[] = [{ path: '', component: RazorpayVendorListComponent }];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedFileUploadDataAccessFileUploadModule,
    EpossRazorpayVendorConfigDataAccessRazorpayVendorConfigModule,
    EpossRazorpayVendorConfigUiRazorpayVendorConfigListModule
  ],
  declarations: [RazorpayVendorListComponent]
})
export class EpossRazorpayVendorConfigFeatureRazorpayVendorConfigMappingModule {}
