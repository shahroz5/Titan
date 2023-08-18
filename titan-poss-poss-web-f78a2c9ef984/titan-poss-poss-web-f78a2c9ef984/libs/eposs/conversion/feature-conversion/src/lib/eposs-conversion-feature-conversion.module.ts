import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossConversionDataAccessConversionModule } from '@poss-web/eposs/conversion/data-access-conversion';
import { EpossConversionUiConversionItemModule } from '@poss-web/eposs/conversion/ui-conversion-item';
import { EpossConversionUiConversionRequestPopupModule } from '@poss-web/eposs/conversion/ui-conversion-request-popup';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { SharedComponentsUiFocusableListModule } from '@poss-web/shared/components/ui-focusable-list';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedItemUiItemSearchModule } from '@poss-web/shared/item/ui-item-search';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { ConversionComponent } from './conversion/conversion.component';
const routes: Routes = [
  {
    path: '',
    component: ConversionComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    SharedItemUiItemSearchModule,
    SharedComponentsUiCardListModule,
    SharedComponentsUiLoaderModule,
    EpossConversionUiConversionItemModule,
    EpossConversionDataAccessConversionModule,
    EpossConversionUiConversionRequestPopupModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFocusableListModule,
    SharedLocationSettingsDataAccessLocationSettingsModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [ConversionComponent]
})
export class EpossConversionFeatureConversionModule {}
