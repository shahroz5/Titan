import { NgModule } from '@angular/core';

import { BinDetailsComponent } from './bin-details.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';

import { EpossNewBinRequestDataAccessBinRequestModule } from '@poss-web/eposs/new-bin-request/data-access-bin-request';

import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { EpossNewBinRequestUiBinDetailsPopupModule } from '@poss-web/eposs/new-bin-request/ui-bin-details-popup';

const routes: Routes = [
  {
    path: '',
    component: BinDetailsComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    EpossNewBinRequestDataAccessBinRequestModule,
    SharedComponentsUiFormattersModule,
    EpossNewBinRequestUiBinDetailsPopupModule,
    SharedLocationSettingsDataAccessLocationSettingsModule
  ],
  declarations: [BinDetailsComponent]
})
export class EpossNewBinRequestFeatureBinDetailsModule {}
