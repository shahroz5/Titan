import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ActivateUserFormComponent } from './activate-user-form.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  exports: [ActivateUserFormComponent],
  declarations: [ActivateUserFormComponent]
})
export class SharedActivateUserUiActivateUserFormModule {}
