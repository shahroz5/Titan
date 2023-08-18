import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { LoaderComponent } from './loader.component';
import { LoaderContentComponent } from './loader-content/loader-content.component';

@NgModule({
  declarations: [LoaderComponent, LoaderContentComponent],
  imports: [CommonCustomMaterialModule],
  exports: [LoaderComponent],
  entryComponents: [LoaderContentComponent]
})
export class SharedComponentsUiLoaderModule {}
