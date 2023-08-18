import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedProductCategoryMappingDataAccessPcMappingModule } from '@poss-web/shared/product-category-mapping/data-access-pc-mapping';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { CommonModule } from '@angular/common';
import { ProductCategoryMappingPopUpService } from './pc-mapping-pop-up.service';
import { ProductCategorySearchPipe } from './pc-search.pipe';
import { ProductCategoryMappingPopUpComponent } from './pc-mapping-pop-up/pc-mapping-pop-up.component';
import { ProductCategoryMappingServiceAbstraction } from '@poss-web/shared/models';
import { NgModule } from '@angular/core';
import { PcMappingWithFormPopupComponent } from './pc-mapping-with-form-popup/pc-mapping-with-form-popup.component';
import { CutPieceFormComponent } from './product-category-mapping-form/cut-piece-form/cut-piece-form.component';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedProductCategoryMappingDataAccessPcMappingModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [
    ProductCategorySearchPipe,
    ProductCategoryMappingPopUpComponent,
    PcMappingWithFormPopupComponent,
    CutPieceFormComponent
  ],
  entryComponents: [],
  providers: [
    {
      provide: ProductCategoryMappingServiceAbstraction,
      useClass: ProductCategoryMappingPopUpService
    }
  ]
})
export class SharedProductCategoryMappingFeaturePcMappingModule {}
