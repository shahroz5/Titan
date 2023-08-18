import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossBodEodDataAccessBodEodModule } from '@poss-web/poss/bod-eod/data-access-bod-eod';
import { PossBodEodUiEghsOfflineBodPasswordGridModule } from '@poss-web/poss/bod-eod/ui-eghs-offline-bod-password-grid';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { ViewEghsOfflineBodComponent } from './view-eghs-offline-bod/view-eghs-offline-bod.component';

const routes: Routes = [
  {
    path: '',
    component: ViewEghsOfflineBodComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    PossBodEodUiEghsOfflineBodPasswordGridModule,
    SharedComponentsUiLoaderModule,
    PossBodEodDataAccessBodEodModule
  ],
  declarations: [ViewEghsOfflineBodComponent]
})
export class PossBodEodFeatureViewEghsOfflineBodModule {}
