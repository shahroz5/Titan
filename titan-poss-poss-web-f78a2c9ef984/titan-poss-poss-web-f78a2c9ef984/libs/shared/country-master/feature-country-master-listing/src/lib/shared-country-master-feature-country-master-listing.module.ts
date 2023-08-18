import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryListingComponent } from './country-listing/country-listing.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedCountryMasterUiCountryMasterListModule } from '@poss-web/shared/country-master/ui-country-master-list';
import { RouterModule } from '@angular/router';
import { SharedCountryMasterDataAccessCountryMasterModule } from '@poss-web/shared/country-master/data-access-country-master';
import {
  CountryDetailComponent,
  SharedCountryMasterUiCountryMasterDetailModule
} from '@poss-web/shared/country-master/ui-country-master-detail';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { SharedCountryMasterUiCountryViewModule } from '@poss-web/shared/country-master/ui-country-view';
const route = [
  { path: '', component: CountryListingComponent, pathMatch: 'full' }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedCountryMasterUiCountryMasterListModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiDynamicFormModule,
    RouterModule.forChild(route),
    SharedCountryMasterDataAccessCountryMasterModule,
    SharedCountryMasterUiCountryMasterDetailModule,
    SharedCountryMasterUiCountryViewModule
  ],
  declarations: [CountryListingComponent],
  entryComponents: [CountryDetailComponent]
})
export class SharedCountryMasterFeatureCountryMasterListingModule {}
