import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryViewComponent } from './view/country-view/country-view.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [CountryViewComponent],
  exports: [CountryViewComponent]
})
export class SharedCountryMasterUiCountryViewModule {}
