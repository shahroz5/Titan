import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { GlBoutiqueDetailsMainComponent } from './gl-boutique-details-main/gl-boutique-details-main.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { EpossGlBoutiqueLocationUiGlBoutiqueLocationDetailModule } from '@poss-web/eposs/gl-boutique-location/ui-gl-boutique-location-detail';
import { EpossGlBoutiqueLocationDataAccessGlBoutiqueLocationModule } from '@poss-web/eposs/gl-boutique-location/data-access-gl-boutique-location';
import { EpossRequestApprovalsDataAccessRequestApprovalsModule } from '@poss-web/eposs/request-approvals/data-access-request-approvals';
import { SharedComponentsUiSelectionDialogModule } from '@poss-web/shared/components/ui-selection-dialog';
import { EpossGlBoutiqueLocationUiGlBoutiqueLocationViewModule } from '@poss-web/eposs/gl-boutique-location/ui-gl-boutique-location-view';
const routes: Routes = [
  {
    path: '',
    component: GlBoutiqueDetailsMainComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    EpossGlBoutiqueLocationUiGlBoutiqueLocationDetailModule,
    EpossGlBoutiqueLocationDataAccessGlBoutiqueLocationModule,
    EpossRequestApprovalsDataAccessRequestApprovalsModule,
    SharedComponentsUiSelectionDialogModule,
    EpossGlBoutiqueLocationUiGlBoutiqueLocationViewModule
  ],
  declarations: [GlBoutiqueDetailsMainComponent]
})
export class EpossGlBoutiqueLocationFeatureGlBoutiqueLocationDetailModule {}
