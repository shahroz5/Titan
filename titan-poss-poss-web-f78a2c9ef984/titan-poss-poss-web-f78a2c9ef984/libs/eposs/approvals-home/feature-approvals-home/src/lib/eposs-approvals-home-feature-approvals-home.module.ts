import { SharedComponentsUiCardMenuModule } from '@poss-web/shared/components/ui-card-menu';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ApprovalsHomeComponent } from './approvals-home/approvals-home.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

const route: Routes = [{ path: '', component: ApprovalsHomeComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    CommonCustomMaterialModule,
    SharedComponentsUiCardMenuModule
  ],
  declarations: [ApprovalsHomeComponent]
})
export class EpossApprovalsHomeFeatureApprovalsHomeModule {}
