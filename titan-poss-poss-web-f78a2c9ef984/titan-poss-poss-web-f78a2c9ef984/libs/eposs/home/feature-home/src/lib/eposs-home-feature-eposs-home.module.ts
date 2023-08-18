import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { EpossHomeComponent } from './eposs-home/eposs-home.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiCardMenuModule } from '@poss-web/shared/components/ui-card-menu';

const route: Routes = [{ path: '', component: EpossHomeComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    CommonCustomMaterialModule,
    SharedComponentsUiCardMenuModule
  ],
  declarations: [EpossHomeComponent]
})
export class EpossHomeFeatureEpossHomeModule {}
