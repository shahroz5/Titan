import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CorporateTownDetailsComponent } from './corporate-town-details.component';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

@NgModule({
  declarations: [CorporateTownDetailsComponent],
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule,
    SharedComponentsUiLoaderModule
  ],
  exports: [CorporateTownDetailsComponent],
  entryComponents: [CorporateTownDetailsComponent]
})
export class SharedCorporateTownUiCorporateTownDetailModule {}
