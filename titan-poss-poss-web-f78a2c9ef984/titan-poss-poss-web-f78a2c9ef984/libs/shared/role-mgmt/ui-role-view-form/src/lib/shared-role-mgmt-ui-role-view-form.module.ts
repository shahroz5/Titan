import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewRoleFormComponent } from './view-role-form/view-role-form.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [ViewRoleFormComponent],
  entryComponents: [ViewRoleFormComponent]
})
export class SharedRoleMgmtUiRoleViewFormModule {}
