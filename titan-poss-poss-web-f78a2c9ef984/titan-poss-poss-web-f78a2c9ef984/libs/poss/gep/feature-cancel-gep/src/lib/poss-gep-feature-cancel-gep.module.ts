import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CancelGepComponent } from './cancel-gep/cancel-gep.component';
import { PossGepDataAccessGepModule } from '@poss-web/poss/gep/data-access-gep';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossGepUiCancelGepModule } from '@poss-web/poss/gep/ui-cancel-gep';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { PossSharedProductDataAccessProductModule } from '@poss-web/poss/shared/product/data-access-product';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedBodEodDataAccessBodEodModule } from '@poss-web/shared/bod-eod/data-access-bod-eod';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    PossGepDataAccessGepModule,
    SharedCommonDataAccessCommonModule,
    PossSharedProductDataAccessProductModule,
    PossGepUiCancelGepModule,
    SharedComponentsUiLoaderModule,
    RouterModule.forChild([{ path: '', component: CancelGepComponent }]),
    SharedLocationSettingsDataAccessLocationSettingsModule,
    SharedBodEodDataAccessBodEodModule
  ],
  declarations: [CancelGepComponent],
  exports: [CancelGepComponent]
})
export class PossGepFeatureCancelGepModule {}
