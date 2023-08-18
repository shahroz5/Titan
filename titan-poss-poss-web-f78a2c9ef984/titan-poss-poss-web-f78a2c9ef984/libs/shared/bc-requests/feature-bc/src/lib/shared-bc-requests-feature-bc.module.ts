import { SharedBcRequestsDataAccessBcModule } from '@poss-web/shared/bc-requests/data-access-bc';
import { SharedBcRequestsUiBcModule } from '@poss-web/shared/bc-requests/ui-bc';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { BillCancellationRequestsComponent } from './bill-cancellation-requests/bill-cancellation-requests.component';

@NgModule({
  imports: [
    CommonModule,
    SharedBcRequestsUiBcModule,
    CommonCustomMaterialModule,
    SharedUtilFieldValidatorsModule,
    SharedCommonDataAccessCommonModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedBcRequestsDataAccessBcModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [BillCancellationRequestsComponent],
  exports: [BillCancellationRequestsComponent]
})
export class SharedBcRequestsFeatureBcModule {}
