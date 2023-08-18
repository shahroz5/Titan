import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EditRoleFormComponent } from './edit-role-form.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [EditRoleFormComponent],
  entryComponents: [EditRoleFormComponent]
})
export class SharedRoleMgmtUiRoleEditFormModule {}
