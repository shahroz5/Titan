import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { UserFormComponent } from './user-form.component';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFormattersModule,
    SharedPermissionUiPermissionModule
  ],
  declarations: [UserFormComponent],
  exports: [UserFormComponent],
  providers: []
})
export class SharedUserMgmtUiUserDetailModule {}
