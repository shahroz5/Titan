import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossConversionDataAccessConversionModule } from '@poss-web/eposs/conversion/data-access-conversion';
import { EpossConversionUiConversionItemModule } from '@poss-web/eposs/conversion/ui-conversion-item';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { ConversionHistoryDetailsComponent } from './conversion-history-details/conversion-history-details.component';

const routes: Routes = [
  {
    path: '',
    component: ConversionHistoryDetailsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    EpossConversionDataAccessConversionModule,
    SharedComponentsUiFormattersModule,
    EpossConversionUiConversionItemModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [ConversionHistoryDetailsComponent]
})
export class EpossConversionFeatureConversionHistoryDetailsModule {}
