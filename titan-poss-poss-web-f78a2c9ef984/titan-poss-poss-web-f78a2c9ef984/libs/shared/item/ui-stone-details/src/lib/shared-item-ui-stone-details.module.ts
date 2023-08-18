import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoneDetailsComponent } from './stone-details.component';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,

    SharedComponentsUiFormattersModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [StoneDetailsComponent],
  exports: [StoneDetailsComponent]
})
export class SharedItemUiStoneDetailsModule {}
