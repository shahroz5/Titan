import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { LovmasterViewComponent } from './lovmaster-view.component';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [LovmasterViewComponent],
  exports: [LovmasterViewComponent]
})
export class SharedListOfValuesUiLovmasterViewModule {}
