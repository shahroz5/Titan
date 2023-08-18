import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PossBcUiBcHistoryModule} from '@poss-web/poss/bc/ui-bc-history'
import { BcHistoryComponent } from './bc-history/bc-history.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedBcRequestsFeatureBcStatusModule } from '@poss-web/shared/bc-requests/feature-bc-status';
import { SharedToolbarFeatureToolbarModule } from '@poss-web/shared/toolbar/feature-toolbar';
import { RouterModule, Routes } from '@angular/router';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { PossBcDataAccessBcModule } from '@poss-web/poss/bc/data-access-bc';
import { PossCashMemoDataAccessCashMemoModule } from '@poss-web/poss/cash-memo/data-access-cash-memo';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
const routes: Routes = [
  {
    path: '',
    component: BcHistoryComponent,
  }
];
@NgModule({
  imports: [CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    SharedBcRequestsFeatureBcStatusModule,
    SharedToolbarFeatureToolbarModule,
    PossBcDataAccessBcModule,
    SharedComponentsUiLoaderModule,
    CommonCustomMaterialModule,
    PossCashMemoDataAccessCashMemoModule,
    SharedCommonDataAccessCommonModule,
    SharedComponentsUiFormFieldControlsModule,
    PossBcUiBcHistoryModule
  ],
  declarations: [BcHistoryComponent],
  exports: [BcHistoryComponent]
})
export class PossBcFeatureBcHistoryModule {}
