import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryDetailComponent } from './country-detail/country-detail.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule
  ],
  declarations: [CountryDetailComponent]
})
export class SharedCountryMasterUiCountryMasterDetailModule {}
