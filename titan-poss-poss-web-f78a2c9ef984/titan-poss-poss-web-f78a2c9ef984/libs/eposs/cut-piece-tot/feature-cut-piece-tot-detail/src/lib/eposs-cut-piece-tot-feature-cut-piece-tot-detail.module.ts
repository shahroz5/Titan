import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { Routes, RouterModule } from '@angular/router';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

import { EpossCutPieceTotDataAccessCutPieceTotModule } from '@poss-web/eposs/cut-piece-tot/data-access-cut-piece-tot';
import { EpossCutPieceTotUiCutPieceTotDetailModule } from '@poss-web/eposs/cut-piece-tot/ui-cut-piece-tot-detail';

import { CutPieceTotDetailComponent } from './cut-piece-tot-detail.component';

const routes: Routes = [
  {
    path: '',
    component: CutPieceTotDetailComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    EpossCutPieceTotDataAccessCutPieceTotModule,
    EpossCutPieceTotUiCutPieceTotDetailModule
  ],
  declarations: [CutPieceTotDetailComponent]
})
export class EpossCutPieceTotFeatureCutPieceTotDetailModule {}
