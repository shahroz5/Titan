import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductViewComponent } from './product-view/product-view.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedUtilCommonModule } from '@poss-web/shared/util-common';
import { PossFocUiFocPopupsModule } from '@poss-web/poss/foc/ui-foc-popups';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormattersModule,
    SharedUtilCommonModule,
    PossFocUiFocPopupsModule
  ],
  declarations: [ProductViewComponent],
  exports: [ProductViewComponent]
})
export class SharedComponentsUiProductViewModule {}
