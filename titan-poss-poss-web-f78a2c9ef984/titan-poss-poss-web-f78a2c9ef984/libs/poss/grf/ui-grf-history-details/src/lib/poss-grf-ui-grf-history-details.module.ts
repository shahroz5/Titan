import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadDetailsComponent } from './upload-details/upload-details.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [UploadDetailsComponent],
  exports: [UploadDetailsComponent]
})
export class PossGrfUiGrfHistoryDetailsModule {}
