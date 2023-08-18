import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TepRequestShellComponent } from './tep-request-shell/tep-request-shell.component';
import { PossTepFeatureTepRefundRequestModule } from '@poss-web/poss/tep/feature-tep-refund-request';
import { PossTepFeatureTepRequestModule } from '@poss-web/poss/tep/feature-tep-request';

import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedToolbarFeatureToolbarModule } from '@poss-web/shared/toolbar/feature-toolbar';
import { PossSharedFeatureCommonModule } from '@poss-web/poss/shared/feature-common';

const routes: Routes = [
  {
    path: '',
    component: TepRequestShellComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    PossTepFeatureTepRequestModule,
    PossSharedFeatureCommonModule,
    PossTepFeatureTepRefundRequestModule,
    SharedToolbarFeatureToolbarModule
  ],
  declarations: [TepRequestShellComponent]
})
export class PossTepFeatureTepRequestShellModule {}
