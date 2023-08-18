import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossGepPurityConfigDataAccessGepPurityConfigModule } from '@poss-web/eposs/gep-purity-config/data-access-gep-purity-config';
import { EpossGepPurityConfigUiGepPurityConfigItemListModule } from '@poss-web/eposs/gep-purity-config/ui-gep-purity-config-item-list';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { GepPurityConfigListComponent } from './gep-purity-config-list/gep-purity-config-list.component';
const routes: Routes = [
  {
    path: '',
    component: GepPurityConfigListComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    SharedComponentsUiLoaderModule,
    EpossGepPurityConfigDataAccessGepPurityConfigModule,
    EpossGepPurityConfigUiGepPurityConfigItemListModule
  ],
  declarations: [GepPurityConfigListComponent]
})
export class EpossGepPurityConfigFeatureGepPurityConfigListModule {}
