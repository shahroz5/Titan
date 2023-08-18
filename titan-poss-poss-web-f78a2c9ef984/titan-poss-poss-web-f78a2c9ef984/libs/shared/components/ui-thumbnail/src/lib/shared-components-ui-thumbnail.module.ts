import { NgModule } from '@angular/core';
import { ThumbnailComponent } from './thumbnail.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

@NgModule({
  declarations: [ThumbnailComponent],
  imports: [CommonCustomMaterialModule],
  exports: [ThumbnailComponent]
})
export class SharedComponentsUiThumbnailModule {}
