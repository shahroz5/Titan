import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileuploadConfirmationPopupComponent } from './fileupload-confirmation-popup/fileupload-confirmation-popup.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [FileuploadConfirmationPopupComponent],
  exports: [FileuploadConfirmationPopupComponent],
  entryComponents: [FileuploadConfirmationPopupComponent]
})
export class SharedComponentsUiFileuploadConfirmationPopupModule {}
