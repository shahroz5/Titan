import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';
import { EpossDiscountConfigUiDiscountConfigListModule } from '@poss-web/eposs/discount-config/ui-discount-config-list';
import { EpossDiscountConfigDataAccessDiscountConfigModule } from '@poss-web/eposs/discount-config/data-access-discount-config';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { DiscountConfigListComponent } from './discount-config-list/discount-config-list.component';
import { CommonModule } from '@angular/common';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
const routes: Routes = [
  {
    path: '',
    component: DiscountConfigListComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    EpossDiscountConfigDataAccessDiscountConfigModule,
    EpossDiscountConfigUiDiscountConfigListModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedFileUploadDataAccessFileUploadModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [DiscountConfigListComponent]
})
export class EpossDiscountConfigFeatureDiscountConfigListModule {}
