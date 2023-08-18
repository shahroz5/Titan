import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { SharedComponentsUiCardMenuModule } from '@poss-web/shared/components/ui-card-menu';
import { PossBodEodDataAccessBodEodModule } from '@poss-web/poss/bod-eod/data-access-bod-eod';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiCardMenuModule,
    PossBodEodDataAccessBodEodModule
  ],
  declarations: [HomeComponent]
})
export class PossHomeFeatureHomeModule {}
