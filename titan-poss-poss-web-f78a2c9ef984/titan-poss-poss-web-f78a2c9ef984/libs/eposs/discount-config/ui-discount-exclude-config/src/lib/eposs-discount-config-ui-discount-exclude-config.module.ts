import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountExcludeConfigComponent } from './discount-exclude-config/discount-exclude-config.component';
import { ExcludeThemeItemCodesComponent } from './exclude-theme-item-codes/exclude-theme-item-codes.component';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { ExcludeComplexityComponent } from './exclude-complexity/exclude-complexity.component';
import { ExcludePerGramMcConfigComponent } from './exclude-per-gram-mc/exclude-per-gram-mc.component';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiToggleButtonModule,
  ],
  declarations: [
    DiscountExcludeConfigComponent,
    ExcludeThemeItemCodesComponent,
    ExcludeComplexityComponent,
    ExcludePerGramMcConfigComponent
  ],
  exports: [DiscountExcludeConfigComponent]
})
export class EpossDiscountConfigUiDiscountExcludeConfigModule {}
