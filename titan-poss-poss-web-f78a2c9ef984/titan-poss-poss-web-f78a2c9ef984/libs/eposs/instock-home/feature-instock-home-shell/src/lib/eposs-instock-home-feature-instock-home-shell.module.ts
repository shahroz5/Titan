import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { FeatureInstockHomeShellComponent } from './feature-instock-home-shell.component';
import { EpossNewBinRequestFeatureBinRequestModule } from '@poss-web/eposs/new-bin-request/feature-bin-request';
import { EpossInstockHomeFeatureInstockHomeModule } from '@poss-web/eposs/instock-home/feature-instock-home';

const routes: Routes = [
  {
    path: '',
    component: FeatureInstockHomeShellComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    EpossNewBinRequestFeatureBinRequestModule,
    EpossInstockHomeFeatureInstockHomeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FeatureInstockHomeShellComponent]
})
export class EpossInstockHomeFeatureInstockHomeShellModule {}
