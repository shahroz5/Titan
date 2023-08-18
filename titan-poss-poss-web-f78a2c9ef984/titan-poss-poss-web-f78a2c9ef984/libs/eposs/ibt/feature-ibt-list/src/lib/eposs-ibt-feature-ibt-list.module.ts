import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { InterBoutiqueTransferComponent } from './inter-boutique-transfer.component';
import { EpossIbtDataAccessIbtModule } from '@poss-web/eposs/ibt/data-access-ibt';
import { EpossIbtUiIbtItemListModule } from '@poss-web/eposs/ibt/ui-ibt-item-list';
import { EpossIbtUiIbtPopupModule } from '@poss-web/eposs/ibt/ui-ibt-popup';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
const routes: Routes = [
  {
    path: '',
    component: InterBoutiqueTransferComponent
  }
];

@NgModule({
  declarations: [InterBoutiqueTransferComponent],
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    EpossIbtDataAccessIbtModule,
    EpossIbtUiIbtItemListModule,
    SharedComponentsUiFormattersModule,
    EpossIbtUiIbtPopupModule,
    SharedPermissionUiPermissionModule,
    SharedUtilFieldValidatorsModule,
    SharedLocationSettingsDataAccessLocationSettingsModule
  ]
})
export class EpossIbtFeatureIbtListModule {}
