import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiAbRequestComponent } from './ui-ab-requests/ui-ab-request.component';
import { UiAbPopupComponent } from './ui-ab-requests-popup/ui-ab-popup.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

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
  declarations: [UiAbRequestComponent, UiAbPopupComponent],
  exports: [UiAbRequestComponent, UiAbPopupComponent],
  entryComponents: [UiAbPopupComponent]
})
export class EpossSharedAbRequestsUiAbRequestsModule {}
