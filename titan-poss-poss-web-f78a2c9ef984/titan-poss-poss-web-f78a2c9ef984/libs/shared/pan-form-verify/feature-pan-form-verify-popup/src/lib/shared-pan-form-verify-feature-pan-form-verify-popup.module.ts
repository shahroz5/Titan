import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PanFormVerifyComponent } from './pan-form-verify/pan-form-verify.component';
import { PanFormVerifyPopupService } from './pan-form-verify-popup.service';
import { PanFormVerifyPopupServiceAbstraction } from '@poss-web/shared/models';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule, SharedComponentsUiFormFieldControlsModule, SharedUtilFieldValidatorsModule
    , SharedComponentsUiLoaderModule],
  declarations: [PanFormVerifyComponent],
  entryComponents: [PanFormVerifyComponent],
  providers: [
    {
      provide: PanFormVerifyPopupServiceAbstraction,
      useClass: PanFormVerifyPopupService
    }
  ]
})
export class SharedPanFormVerifyFeaturePanFormVerifyPopupModule {}
