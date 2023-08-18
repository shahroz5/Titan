import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessControlMgmtListComponent } from './access-control-mgmt-list.component';

@NgModule({
  declarations: [AccessControlMgmtListComponent],
  imports: [
    CommonModule,
    //loading Angular Material and ngx-translate modules
    CommonCustomMaterialModule
  ],
  exports: [AccessControlMgmtListComponent]
})
export class SharedAccessControlMgmtUiAccessControlListModule {}
