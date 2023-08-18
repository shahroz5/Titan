import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedAccessControlMgmtUiAccessControlListModule } from '@poss-web/shared/access-control-mgmt/ui-access-control-list';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessControlMgmtComponent } from './access-control-mgmt.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { Routes, RouterModule } from '@angular/router';
import { SharedAccessControlMgmtDataAccessAccessControlMgmtModule } from '@poss-web/shared/access-control-mgmt/data-access-access-control-mgmt';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

const routes: Routes = [
  {
    path: '',
    component: AccessControlMgmtComponent
  }
];
@NgModule({
  declarations: [AccessControlMgmtComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedAccessControlMgmtUiAccessControlListModule,
    SharedAccessControlMgmtDataAccessAccessControlMgmtModule,
    SharedComponentsUiFormFieldControlsModule
  ]
})
export class SharedAccessControlMgmtFeatureAccessControlModule {}
