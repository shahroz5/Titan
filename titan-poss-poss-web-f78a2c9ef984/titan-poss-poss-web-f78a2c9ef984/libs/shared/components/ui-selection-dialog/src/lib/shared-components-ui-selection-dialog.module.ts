import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SelectionDialogComponent } from './selection-dialog/selection-dialog.component';
import { SelectionDialogService } from './selection-dialog.service';
import { SharedComponentsUiFocusableListModule } from '@poss-web/shared/components/ui-focusable-list';
import { SelectionDialogWithApplyBtnComponent } from './selection-dialog-with-apply-btn/selection-dialog-with-apply-btn.component';

@NgModule({
  declarations: [
    SelectionDialogComponent,
    SelectionDialogWithApplyBtnComponent
  ],
  imports: [CommonCustomMaterialModule, SharedComponentsUiFocusableListModule],
  providers: [SelectionDialogService],
  entryComponents: [
    SelectionDialogComponent,
    SelectionDialogWithApplyBtnComponent
  ]
})
export class SharedComponentsUiSelectionDialogModule {}
