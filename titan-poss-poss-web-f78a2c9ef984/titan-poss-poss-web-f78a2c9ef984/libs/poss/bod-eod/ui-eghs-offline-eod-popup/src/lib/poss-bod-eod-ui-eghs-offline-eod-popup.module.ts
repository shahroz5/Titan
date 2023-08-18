import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { EghsOfflineEodPopupComponent } from './eghs-offline-eod-popup/eghs-offline-eod-popup.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule
  ],
  declarations: [EghsOfflineEodPopupComponent],
  entryComponents: [EghsOfflineEodPopupComponent]
})
export class PossBodEodUiEghsOfflineEodPopupModule {}
