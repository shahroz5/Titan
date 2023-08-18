import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { NewRoleFormComponent } from './new-role-form.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [NewRoleFormComponent],
  entryComponents: [NewRoleFormComponent]
})
export class SharedRoleMgmtUiRoleCreateFormModule {}
