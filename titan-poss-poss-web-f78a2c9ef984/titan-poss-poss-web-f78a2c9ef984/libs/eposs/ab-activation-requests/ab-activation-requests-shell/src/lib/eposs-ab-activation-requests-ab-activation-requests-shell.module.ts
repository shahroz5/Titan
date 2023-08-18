import { EpossSharedAbRequestsFeatureAbRequestsModule } from '@poss-web/eposs/shared/ab-requests/feature-ab-requests';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbActivationRequestShellComponent } from './ab-activation-request-shell/ab-activation-request-shell.component';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

const routes: Routes = [
  {
    path: '',
    component: AbActivationRequestShellComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    EpossSharedAbRequestsFeatureAbRequestsModule
  ],
  declarations: [AbActivationRequestShellComponent]
})
export class EpossAbActivationRequestsAbActivationRequestsShellModule {}
