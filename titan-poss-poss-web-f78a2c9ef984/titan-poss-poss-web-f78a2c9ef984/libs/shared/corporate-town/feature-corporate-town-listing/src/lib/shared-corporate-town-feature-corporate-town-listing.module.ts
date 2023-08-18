import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { RouterModule } from '@angular/router';
import { CorporateTownListingComponent } from './corporate-town-listing.component';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

import { SharedCorporateTownDataAccessCorporateTownModule } from '@poss-web/shared/corporate-town/data-access-corporate-town';
import { SharedCorporateTownUiCorporateTownListModule } from '@poss-web/shared/corporate-town/ui-corporate-town-list';
import { SharedCorporateTownUiCorporateTownDetailModule } from '@poss-web/shared/corporate-town/ui-corporate-town-detail';
import { SharedCorporateTownUiCorporateTownViewModule } from '@poss-web/shared/corporate-town/ui-corporate-town-view';

const route = [
  { path: '', component: CorporateTownListingComponent, pathMatch: 'full' }
];
@NgModule({
  declarations: [CorporateTownListingComponent],
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(route),
    SharedComponentsUiLoaderModule,
    SharedCorporateTownDataAccessCorporateTownModule,
    SharedCorporateTownUiCorporateTownListModule,
    SharedCorporateTownUiCorporateTownDetailModule,
    SharedCorporateTownUiCorporateTownViewModule
  ]
})
export class SharedCorporateTownFeatureCorporateTownListingModule {}
