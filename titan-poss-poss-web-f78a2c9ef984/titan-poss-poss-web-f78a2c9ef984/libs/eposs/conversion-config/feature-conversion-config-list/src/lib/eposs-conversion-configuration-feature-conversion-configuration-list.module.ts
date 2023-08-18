import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversionConfigListComponent } from './conversion-config-list/conversion-config-list.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { Routes, RouterModule } from '@angular/router';
import { EpossConversionConfigDataAccessConversionConfigModule } from '@poss-web/eposs/conversion-config/data-access-conversion-config';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossConversionConfigUiConversionConfigItemListModule } from '@poss-web/eposs/conversion-config/ui-conversion-config-item-list';

const routes: Routes = [
  {
    path: '',
    component: ConversionConfigListComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    EpossConversionConfigDataAccessConversionConfigModule,
    SharedComponentsUiLoaderModule,
    EpossConversionConfigUiConversionConfigItemListModule
  ],
  declarations: [ConversionConfigListComponent],
  entryComponents: []
})
export class EpossConversionConfigFeatureConversionConfigListModule {}
