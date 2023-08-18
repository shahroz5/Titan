import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { GrfHistoryDetailComponent } from './grf-history-detail/grf-history-detail.component';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { PossGrfDataAccessGrfModule } from '@poss-web/poss/grf/data-access-grf';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedPaymentUiPaymentModule } from '@poss-web/shared/payment/ui-payment';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';
import { PossGrfUiGrfHistoryDetailsModule } from '@poss-web/poss/grf/ui-grf-history-details';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    PossGrfDataAccessGrfModule,
    SharedComponentsUiFormattersModule,
    SharedPaymentUiPaymentModule,
    SharedFileUploadDataAccessFileUploadModule,
    PossGrfUiGrfHistoryDetailsModule
  ],
  declarations: [GrfHistoryDetailComponent],
  exports: [GrfHistoryDetailComponent]
})
export class PossGrfFeatureGrfHistoryDetailModule {}
