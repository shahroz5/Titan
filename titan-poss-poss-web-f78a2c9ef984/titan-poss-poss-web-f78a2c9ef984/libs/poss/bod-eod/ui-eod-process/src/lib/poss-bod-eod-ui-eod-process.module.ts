import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EodProcessComponent } from './eod-process/eod-process.component';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [EodProcessComponent],
  exports: [EodProcessComponent]
})
export class PossBodEodUiEodProcessModule {}
