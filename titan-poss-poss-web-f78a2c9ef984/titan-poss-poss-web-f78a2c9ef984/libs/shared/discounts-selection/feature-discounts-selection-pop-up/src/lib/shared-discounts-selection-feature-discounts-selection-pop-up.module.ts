import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountsSelectionPopUpComponent } from './discounts-selection-pop-up/discounts-selection-pop-up.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { DiscountsSelectionServiceAbstraction } from '@poss-web/shared/models';
import { SharedTepDataAccessDirectTepModule } from '@poss-web/shared/tep/data-access-direct-tep';
import { SharedDiscountsSelectionUiDiscountsSelectionGridModule } from '@poss-web/shared/discounts-selection/ui-discounts-selection-grid';
import { DiscountsSelectionPopUpService } from './discounts-selection-pop-up.service';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedTepDataAccessDirectTepModule,
    SharedDiscountsSelectionUiDiscountsSelectionGridModule
  ],
  declarations: [DiscountsSelectionPopUpComponent],
  entryComponents: [DiscountsSelectionPopUpComponent],
  providers: [
    {
      provide: DiscountsSelectionServiceAbstraction,
      useClass: DiscountsSelectionPopUpService
    }
  ]
})
export class SharedDiscountsSelectionFeatureDiscountsSelectionPopUpModule {}
