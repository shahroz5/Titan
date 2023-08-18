import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossTepDataAccessTepModule } from '@poss-web/poss/tep/data-access-tep';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { TepRefundStatusComponent } from './tep-refund-status/tep-refund-status.component';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule,
    PossTepDataAccessTepModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    SharedComponentsUiFormattersModule,
    SharedCommonDataAccessCommonModule,
    SharedUtilFieldValidatorsModule,

    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [TepRefundStatusComponent],
  exports: [TepRefundStatusComponent]
})
export class PossTepFeatureTepRefundRequestModule {}
