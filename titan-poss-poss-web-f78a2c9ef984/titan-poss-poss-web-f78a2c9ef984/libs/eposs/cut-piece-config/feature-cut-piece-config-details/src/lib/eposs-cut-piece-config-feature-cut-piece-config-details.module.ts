import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CutPieceConfigDetailsComponent } from './cut-piece-config-details/cut-piece-config-details.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { Routes, RouterModule } from '@angular/router';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossCutPieceConfigUiCutPieceConfigDetailsModule } from '@poss-web/eposs/cut-piece-config/ui-cut-piece-config-details';

import { EpossCutPieceConfigDataAccessCutPieceConfigModule } from '@poss-web/eposs/cut-piece-config/data-access-cut-piece-config';
const routes: Routes = [
  {
    path: '',
    component: CutPieceConfigDetailsComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    EpossCutPieceConfigUiCutPieceConfigDetailsModule,
    EpossCutPieceConfigDataAccessCutPieceConfigModule
  ],
  declarations: [CutPieceConfigDetailsComponent]
})
export class EpossCutPieceConfigFeatureCutPieceConfigDetailsModule {}
