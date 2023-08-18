import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossGepPurityConfigDataAccessGepPurityConfigModule } from '@poss-web/eposs/gep-purity-config/data-access-gep-purity-config';
import { EpossGepPurityConfigUiGepPurityConfigDetailsModule } from '@poss-web/eposs/gep-purity-config/ui-gep-purity-config-details';
import { EpossGepPurityConfigUiGepPurityConfigViewModule } from '@poss-web/eposs/gep-purity-config/ui-gep-purity-config-view';
import { SharedComponentsUiFileuploadConfirmationPopupModule } from '@poss-web/shared/components/ui-fileupload-confirmation-popup';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';
import { GepPurityConfigDetailsComponent } from './gep-purity-config-details/gep-purity-config-details.component';

const routes: Routes = [
  {
    path: '',
    component: GepPurityConfigDetailsComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    EpossGepPurityConfigUiGepPurityConfigDetailsModule,
    EpossGepPurityConfigDataAccessGepPurityConfigModule,
    SharedComponentsUiFileuploadConfirmationPopupModule,
    SharedComponentsUiFormFieldControlsModule,
    EpossGepPurityConfigUiGepPurityConfigViewModule
  ],
  declarations: [GepPurityConfigDetailsComponent],
  exports: [GepPurityConfigDetailsComponent],
  providers: [SelectionDialogService]
})
export class EpossGepPurityConfigFeatureGepPurityConfigDetailsModule {}
