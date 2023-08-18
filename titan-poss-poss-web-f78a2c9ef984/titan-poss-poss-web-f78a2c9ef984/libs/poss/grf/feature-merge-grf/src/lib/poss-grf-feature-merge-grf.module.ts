import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MergeGrfComponent } from './merge-grf/merge-grf.component';
import { PossGrfUiMergeGrfListModule } from '@poss-web/poss/grf/ui-merge-grf-list';
import { PossGrfDataAccessGrfModule } from '@poss-web/poss/grf/data-access-grf';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedProfileDataAccessProfileModule } from '@poss-web/shared/profile/data-access-profile';
import { SharedCustomerDataAccessCustomerModule } from '@poss-web/shared/customer/data-access-customer';
import { RouterModule } from '@angular/router';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';
import { SharedBodEodDataAccessBodEodModule } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedCustomerFeatureCustomerCreateModule } from '@poss-web/shared/customer/feature-customer-create';
@NgModule({
  imports: [
    CommonModule,
    PossGrfUiMergeGrfListModule,
    PossGrfDataAccessGrfModule,
    CommonCustomMaterialModule,
    SharedCommonDataAccessCommonModule,
    SharedComponentsUiLoaderModule,
    SharedLocationSettingsDataAccessLocationSettingsModule,
    SharedProfileDataAccessProfileModule,
    SharedCustomerDataAccessCustomerModule,
    RouterModule.forChild([{ path: '', component: MergeGrfComponent }]),
    SharedFileUploadDataAccessFileUploadModule,
    SharedBodEodDataAccessBodEodModule,
    SharedComponentsUiFormattersModule,
    SharedCustomerFeatureCustomerCreateModule
  ],
  declarations: [MergeGrfComponent],
  exports: [MergeGrfComponent]
})
export class PossGrfFeatureMergeGrfModule {}
