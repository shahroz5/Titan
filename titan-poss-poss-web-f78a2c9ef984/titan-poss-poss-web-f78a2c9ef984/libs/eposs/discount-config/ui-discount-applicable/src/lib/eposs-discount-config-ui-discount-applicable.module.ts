import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountApplicableComponent } from './discount-applicable/discount-applicable.component';
import { BasicDiscountCategoryComponent } from './basic-discount-category/basic-discount-category.component';
import { ClubbingDiscountsComponent } from './clubbing-discounts/clubbing-discounts.component';
import { ClubbingOffersComponent } from './clubbing-offers/clubbing-offers.component';
import { GRNConfigComponent } from './grn-config/grn-config.component';
import { AbCoConfigComponent } from './ab-co-config/ab-co-config.component';
import { TepRecoveryConfigComponent } from './tep-recovery-config/tep-recovery-config.component';
import { CumulativeDiscountsComponent } from './cumulative-discounts/cumulative-discounts.component';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [
    DiscountApplicableComponent,
    BasicDiscountCategoryComponent,
    ClubbingDiscountsComponent,
    ClubbingOffersComponent,
    GRNConfigComponent,
    AbCoConfigComponent,
    TepRecoveryConfigComponent,
    CumulativeDiscountsComponent
  ],
  exports: [DiscountApplicableComponent]
})
export class EpossDiscountConfigUiDiscountApplicableModule {}
