import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossGepPurityConfigDataAccessGepPurityConfigModule } from '@poss-web/eposs/gep-purity-config/data-access-gep-purity-config';
import { EpossGepPurityConfigUiGepPurityConfigViewModule } from '@poss-web/eposs/gep-purity-config/ui-gep-purity-config-view';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedLocationMappingDataAccessLocationMappingModule } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import { GepPurityConfigViewComponent } from './gep-purity-config-view/gep-purity-config-view.component';
const routes: Route[] = [
  {
    path: '',
    component: GepPurityConfigViewComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    SharedComponentsUiLoaderModule,
    EpossGepPurityConfigDataAccessGepPurityConfigModule,
    SharedComponentsUiToggleButtonModule,
    EpossGepPurityConfigUiGepPurityConfigViewModule,
    SharedLocationMappingDataAccessLocationMappingModule
  ],
  declarations: [GepPurityConfigViewComponent],
  exports: [GepPurityConfigViewComponent],
  providers: [SelectionDialogService]
})
export class EpossGepPurityConfigFeatureGepPurityConfigViewModule {}
