import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossConversionApprovalsDataAccessConversionApprovalsModule } from '@poss-web/eposs/conversion-approvals/data-access-conversion-approvals';
import { EpossConversionUiConversionItemModule } from '@poss-web/eposs/conversion/ui-conversion-item';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { ConversionApprovalDetailsComponent } from './conversion-approval-details/conversion-approval-details.component';

const routes: Routes = [
  {
    path: '',
    component: ConversionApprovalDetailsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    SharedComponentsUiFormattersModule,
    EpossConversionApprovalsDataAccessConversionApprovalsModule,
    EpossConversionUiConversionItemModule
  ],
  declarations: [ConversionApprovalDetailsComponent]
})
export class EpossConversionApprovalsFeatureConversionApprovalDetailsModule {}
