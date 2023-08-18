import { SharedComponentsUiCardMenuModule } from '@poss-web/shared/components/ui-card-menu';
import { ReportsHomeComponent } from './reports-home/reports-home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ReportsHomeComponent,
  },
];
@NgModule({
  declarations: [ReportsHomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiCardMenuModule
  ],
})
export class SharedReportsFeatureReportsHomeModule {}
