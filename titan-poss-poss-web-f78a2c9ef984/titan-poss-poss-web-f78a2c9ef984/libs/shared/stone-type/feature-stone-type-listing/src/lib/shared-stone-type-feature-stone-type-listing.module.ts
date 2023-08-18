import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoneTypeListingComponent } from './stone-type-listing/stone-type-listing.component';
import { RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedStoneTypeUiStoneTypeListModule} from '@poss-web/shared/stone-type/ui-stone-type-list'
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedStoneTypeDataAccessStoneTypeModule } from '@poss-web/shared/stone-type/data-access-stone-type'
import { StoneTypeDetailsComponent, SharedStoneTypeUiStoneTypeDetailModule } from '@poss-web/shared/stone-type/ui-stone-type-detail';
const route = [{ path: '', component:StoneTypeListingComponent, pathMatch: 'full' }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedStoneTypeUiStoneTypeListModule,
    SharedStoneTypeDataAccessStoneTypeModule,
    SharedStoneTypeUiStoneTypeDetailModule

  ],
  declarations: [StoneTypeListingComponent],
  entryComponents: [StoneTypeDetailsComponent]
})
export class SharedStoneTypeFeatureStoneTypeListingModule {}
