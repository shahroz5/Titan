import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbCancellationRequestsShellComponent } from './ab-cancellation-requests-shell/ab-cancellation-requests-shell.component';
import { EpossSharedAbRequestsFeatureAbRequestsModule } from '@poss-web/eposs/shared/ab-requests/feature-ab-requests';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

const routes: Routes = [
  {
    path: '',
    component: AbCancellationRequestsShellComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    EpossSharedAbRequestsFeatureAbRequestsModule
  ],
  declarations: [AbCancellationRequestsShellComponent],
  exports: [AbCancellationRequestsShellComponent]
})
export class EpossAbCancellationRequestsAbCancellationRequestsShellModule {}
