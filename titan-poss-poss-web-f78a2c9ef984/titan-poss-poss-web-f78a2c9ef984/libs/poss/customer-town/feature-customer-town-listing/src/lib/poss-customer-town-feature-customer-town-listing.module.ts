import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { RouterModule } from '@angular/router';
import { CustomerTownListingComponent } from './customer-town-listing/customer-town-listing.component';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { PossCustomerTownDataAccessCustomerTownModule } from '@poss-web/poss/customer-town/data-access-customer-town';
import { PossCustomerTownUiCustomerTownDetailModule } from '@poss-web/poss/customer-town/ui-customer-town-detail';
import { PossCustomerTownUiCustomerTownListModule } from '@poss-web/poss/customer-town/ui-customer-town-list';

const route = [
  { path: '', component: CustomerTownListingComponent, pathMatch: 'full' }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(route),
    SharedComponentsUiLoaderModule,
    PossCustomerTownDataAccessCustomerTownModule,
    PossCustomerTownUiCustomerTownDetailModule,
    PossCustomerTownUiCustomerTownListModule
  ],

  declarations: [CustomerTownListingComponent]
})
export class PossCustomerTownFeatureCustomerTownListingModule {}
