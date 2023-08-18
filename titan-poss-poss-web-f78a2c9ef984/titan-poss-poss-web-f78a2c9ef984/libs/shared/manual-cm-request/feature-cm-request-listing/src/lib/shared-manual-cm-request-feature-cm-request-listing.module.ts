import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmRequestListComponent } from './cm-request-list/cm-request-list.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedManualCmRequestUiRequestListModule } from '@poss-web/shared/manual-cm-request/ui-request-list';
import { SharedManualCmRequestUiRequestHistoryModule } from '@poss-web/shared/manual-cm-request/ui-request-history';
import { SharedManualCmRequestUiBillHistoryModule } from '@poss-web/shared/manual-cm-request/ui-bill-history';
import { SharedManualCmRequestDataAccessCmRequestModule } from '@poss-web/shared/manual-cm-request/data-access-cm-request';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedToolbarFeatureToolbarModule } from '@poss-web/shared/toolbar/feature-toolbar';

const routes: Routes = [
  {
    path: '',
    component: CmRequestListComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedManualCmRequestUiRequestListModule,
    SharedManualCmRequestUiRequestHistoryModule,
    SharedManualCmRequestUiBillHistoryModule,
    SharedManualCmRequestDataAccessCmRequestModule,
    SharedComponentsUiLoaderModule,
    CommonCustomMaterialModule,
    SharedToolbarFeatureToolbarModule
  ],
  declarations: [CmRequestListComponent]
})
export class SharedManualCmRequestFeatureCmRequestListingModule {}
