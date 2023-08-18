import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedBodEodDataAccessBodEodModule } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { CnTransferListingComponent } from './cn-transfer-listing/cn-transfer-listing.component';
import { PossCnTransferDataAccessCnTransferModule } from '@poss-web/poss/cn-transfer/data-access-cn-transfer';

const routes: Routes = [
  {
    path: '',
    component: CnTransferListingComponent
  }
]
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiCardListModule,
    RouterModule.forChild(routes),
    PossCnTransferDataAccessCnTransferModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiLoaderModule,
    SharedLocationSettingsDataAccessLocationSettingsModule,
    SharedBodEodDataAccessBodEodModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [CnTransferListingComponent],
  exports: [CnTransferListingComponent]
})
export class PossCnTransferFeatureCnTransferRequestListingModule {}
