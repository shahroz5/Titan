import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossDiscountConfigDataAccessDiscountConfigModule } from '@poss-web/eposs/discount-config/data-access-discount-config';
import { EpossDiscountConfigUiDiscountConfigRequestListModule } from '@poss-web/eposs/discount-config/ui-discount-config-request-list';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { DiscountConfigRequestComponent } from './discount-config-request/discount-config-request.component';

const routes: Routes = [
  {
    path: '',
    component: DiscountConfigRequestComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    EpossDiscountConfigDataAccessDiscountConfigModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    EpossDiscountConfigUiDiscountConfigRequestListModule,
    SharedPermissionUiPermissionModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedLocationSettingsDataAccessLocationSettingsModule
  ],
  declarations: [DiscountConfigRequestComponent]
})
export class EpossDiscountConfigFeatureDiscountConfigRequestModule {}
