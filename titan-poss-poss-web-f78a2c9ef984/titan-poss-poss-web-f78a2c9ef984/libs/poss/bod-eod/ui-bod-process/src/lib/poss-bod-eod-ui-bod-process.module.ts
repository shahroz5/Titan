import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { BodProcessComponent } from './bod-process/bod-process.component';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [BodProcessComponent],
  exports: [BodProcessComponent]
})
export class PossBodEodUiBodProcessModule {}
