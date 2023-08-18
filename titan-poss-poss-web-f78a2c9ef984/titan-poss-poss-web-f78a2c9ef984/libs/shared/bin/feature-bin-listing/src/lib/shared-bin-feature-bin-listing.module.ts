import { NgModule } from '@angular/core';
import { BinCodeListingComponent } from './bin-code-listing.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { RouterModule } from '@angular/router';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedBinDataAccessBinModule } from '@poss-web/shared/bin/data-access-bin';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { SharedBinGroupDataAccessBinGroupModule } from '@poss-web/shared/bin-group/data-access-bin-group';
import { SharedBinUiBinViewModule } from '@poss-web/shared/bin/ui-bin-view';
import {
  BinCodeDialogComponent,
  SharedBinUiBinPopupModule
} from '@poss-web/shared/bin/ui-bin-popup';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
const route = [
  {
    path: '',
    component: BinCodeListingComponent,
    pathMatch: 'full'
  }
];
@NgModule({
  declarations: [BinCodeListingComponent],
  imports: [
    CommonCustomMaterialModule,
    RouterModule.forChild(route),
    SharedComponentsUiLoaderModule,
    SharedBinGroupDataAccessBinGroupModule,
    SharedComponentsUiCardListModule,
    SharedBinDataAccessBinModule,
    SharedBinUiBinPopupModule,
    SharedComponentsUiDynamicFormModule,
    SharedComponentsUiToggleButtonModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedBinUiBinViewModule
  ],
  entryComponents: [BinCodeDialogComponent]
})
export class SharedBinFeatureBinListingModule {}
