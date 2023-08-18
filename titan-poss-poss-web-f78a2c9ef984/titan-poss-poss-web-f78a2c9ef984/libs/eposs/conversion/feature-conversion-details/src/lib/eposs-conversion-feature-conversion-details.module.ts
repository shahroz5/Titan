import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossConversionDataAccessConversionModule } from '@poss-web/eposs/conversion/data-access-conversion';
import { EpossConversionUiConversionItemModule } from '@poss-web/eposs/conversion/ui-conversion-item';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { SharedComponentsUiFocusableListModule } from '@poss-web/shared/components/ui-focusable-list';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedItemUiItemSearchModule } from '@poss-web/shared/item/ui-item-search';
import { ConversionDetailsComponent } from './conversion-details/conversion-details.component';

const routes: Routes = [
  {
    path: '',
    component: ConversionDetailsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedItemUiItemSearchModule,
    EpossConversionUiConversionItemModule,
    SharedComponentsUiCardListModule,
    SharedComponentsUiLoaderModule,
    EpossConversionDataAccessConversionModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFocusableListModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [ConversionDetailsComponent]
})
export class EpossConversionFeatureConversionDetailsModule {}
