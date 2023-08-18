import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovalsTemplateComponent } from './approvals-template/approvals-template.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [ApprovalsTemplateComponent],
  exports: [ApprovalsTemplateComponent]
})
export class SharedComponentsUiApprovalsTemplateModule {}
