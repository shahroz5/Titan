import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FocItemCodeMappingComponent } from './foc-item-code-mapping/foc-item-code-mapping.component';
import { LocationMappingComponent } from './location-mapping/location-mapping.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { FocValueBasedGoldComponent } from './foc-value-based-gold/foc-value-based-gold.component';
import { FocValueBasedOthersComponent } from './foc-value-based-others/foc-value-based-others.component';
import { FocWeightBasedOthersComponent } from './foc-weight-based-others/foc-weight-based-others.component';
import { FocWeightBasedGoldComponent } from './foc-weight-based-gold/foc-weight-based-gold.component';
import { DateRangeFormComponent } from './location-mapping/date-range-form/date-range-form.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiToggleButtonModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [
    FocItemCodeMappingComponent,
    LocationMappingComponent,
    FocValueBasedGoldComponent,
    FocValueBasedOthersComponent,
    FocWeightBasedOthersComponent,
    FocWeightBasedGoldComponent,
    DateRangeFormComponent
  ],
  exports: [
    FocItemCodeMappingComponent,
    LocationMappingComponent,
    FocValueBasedGoldComponent,
    FocValueBasedOthersComponent,
    FocWeightBasedOthersComponent,
    FocWeightBasedGoldComponent
  ]
})
export class EpossFocConfigUiFocVariantDetailsModule {}
