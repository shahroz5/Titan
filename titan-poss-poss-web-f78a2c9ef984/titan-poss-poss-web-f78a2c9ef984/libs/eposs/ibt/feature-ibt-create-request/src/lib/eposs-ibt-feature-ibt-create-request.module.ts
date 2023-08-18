import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedItemUiItemSearchModule } from '@poss-web/shared/item/ui-item-search';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { EpossIbtDataAccessIbtModule } from '@poss-web/eposs/ibt/data-access-ibt';
import { InterBoutiqueTransferCreateRequestComponent } from './inter-boutique-transfer-create-request.component';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

const routes: Routes = [
  {
    path: '',
    component: InterBoutiqueTransferCreateRequestComponent
  }
];

@NgModule({
  declarations: [InterBoutiqueTransferCreateRequestComponent],
  imports: [
    //loading Angular Material and ngx-translate modules
    CommonModule,
    CommonCustomMaterialModule,
    //loading standard route module from angular
    RouterModule.forChild(routes),
    //loading the Shared Components
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    SharedItemUiItemSearchModule,
    SharedUtilFieldValidatorsModule,

    //loading the app specific shared components
    EpossIbtDataAccessIbtModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  entryComponents: []
})
export class EpossIbtFeatureIbtCreateRequestModule {}
