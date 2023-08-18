import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RemoveGoldRateEditComponent } from './remove-gold-rate-edit/remove-gold-rate-edit.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { RemoveGoldRateViewComponent } from './remove-gold-rate-view/remove-gold-rate-view.component';
import { ActivateCnEditComponent } from './activate-cn-edit/activate-cn-edit.component';
import { ActivateCnViewComponent } from './activate-cn-view/activate-cn-view.component';
import { TrasnfetToEghsEditComponent } from './trasnfet-to-eghs-edit/trasnfet-to-eghs-edit.component';
import { TransferToEghsViewComponent } from './transfer-to-eghs-view/transfer-to-eghs-view.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { CancelCnEditComponent } from './cancel-cn-edit/cancel-cn-edit.component';
import { ViewCnDetailsComponent } from './view-cn-details/view-cn-details.component';
import { CancelCnViewComponent } from './cancel-cn-view/cancel-cn-view.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule
  ],
  declarations: [
    RemoveGoldRateEditComponent,
    RemoveGoldRateViewComponent,
    ActivateCnEditComponent,
    ActivateCnViewComponent,
    TrasnfetToEghsEditComponent,
    TransferToEghsViewComponent,
    CancelCnEditComponent,
    ViewCnDetailsComponent,
    CancelCnViewComponent
  ],
  exports: [
    RemoveGoldRateEditComponent,
    RemoveGoldRateViewComponent,
    ActivateCnEditComponent,
    ActivateCnViewComponent,
    TrasnfetToEghsEditComponent,
    TransferToEghsViewComponent,
    CancelCnEditComponent,
    CancelCnViewComponent,
    ViewCnDetailsComponent
  ]
})
export class PossCreditNoteUiCnDetailsViewsModule {}
