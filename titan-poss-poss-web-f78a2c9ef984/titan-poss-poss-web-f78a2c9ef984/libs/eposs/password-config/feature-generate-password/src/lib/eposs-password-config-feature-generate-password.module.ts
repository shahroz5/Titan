import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneratePasswordComponent } from './generate-password/generate-password.component';
import { RouterModule, Routes } from '@angular/router';
import { EpossPasswordConfigUiGeneratePasswordModule } from '@poss-web/eposs/password-config/ui-generate-password';
import { EpossPasswordConfigDataAccessPasswordConfigModule } from '@poss-web/eposs/password-config/data-access-password-config';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

const route: Routes = [{ path: '', component: GeneratePasswordComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    EpossPasswordConfigUiGeneratePasswordModule,
    EpossPasswordConfigDataAccessPasswordConfigModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [GeneratePasswordComponent]
})
export class EpossPasswordConfigFeatureGeneratePasswordModule {}
