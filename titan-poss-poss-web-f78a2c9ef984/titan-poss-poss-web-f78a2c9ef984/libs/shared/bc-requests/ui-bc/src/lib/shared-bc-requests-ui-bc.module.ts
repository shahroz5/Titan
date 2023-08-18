import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiBillCancellationRequestsComponent } from './ui-bill-cancellation-requests/ui-bill-cancellation-requests.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { UiBillCancellationRequestsDetailComponent } from './ui-bill-cancellation-requests-detail/ui-bill-cancellation-requests-detail.component';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { UiBillCancelRequestStatusComponent } from './ui-bill-cancel-request-status/ui-bill-cancel-request-status.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [
    UiBillCancellationRequestsComponent,
    UiBillCancellationRequestsDetailComponent,
    UiBillCancelRequestStatusComponent
  ],
  exports: [
    UiBillCancellationRequestsComponent,
    UiBillCancellationRequestsDetailComponent,
    UiBillCancelRequestStatusComponent
  ]
})
export class SharedBcRequestsUiBcModule {}
