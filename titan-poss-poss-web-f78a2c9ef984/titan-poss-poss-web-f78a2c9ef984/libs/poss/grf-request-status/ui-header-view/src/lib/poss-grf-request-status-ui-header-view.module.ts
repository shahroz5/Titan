import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderViewComponent } from './header-view/header-view.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiFileUploadModule } from '@poss-web/shared/components/ui-file-upload';
@NgModule({
  imports: [CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFileUploadModule
  ],
  declarations: [HeaderViewComponent],
  exports: [HeaderViewComponent]
})
export class PossGrfRequestStatusUiHeaderViewModule {}
