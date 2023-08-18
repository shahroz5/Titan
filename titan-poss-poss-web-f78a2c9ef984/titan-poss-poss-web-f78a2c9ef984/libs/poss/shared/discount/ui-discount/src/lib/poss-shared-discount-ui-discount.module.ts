import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountBillLevelComponent } from './discount-bill-level/discount-bill-level.component';
import { DiscountEmployeeComponent } from './discount-employee/discount-employee.component';
import { DiscountEmpowermentComponent } from './discount-empowerment/discount-empowerment.component';
import { DiscountTataEmployeeComponent } from './discount-tata-employee/discount-tata-employee.component';
import { DiscountTsssComponent } from './discount-tsss/discount-tsss.component';
import { DiscountReferralCodeComponent } from './discount-referral-code/discount-referral-code.component';
import { ViewTransactionLevelDiscountsComponent } from './view-transaction-level-discounts/view-transaction-level-discounts.component';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { DiscountSystemDvComponent } from './discount-system-dv/discount-system-dv.component';
import { DiscountSystemDvPopupComponent } from './discount-system-dv-popup/discount-system-dv-popup.component';
import { DiscountRivaahComponent } from './discount-rivaah/discount-rivaah.component';
import { DiscountCoBillLevelComponent } from './discount-co-bill-level/discount-co-bill-level.component';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [
    DiscountBillLevelComponent,
    DiscountCoBillLevelComponent,
    DiscountEmployeeComponent,
    DiscountEmpowermentComponent,
    DiscountTataEmployeeComponent,
    DiscountTsssComponent,
    DiscountReferralCodeComponent,
    ViewTransactionLevelDiscountsComponent,
    DiscountSystemDvComponent,
    DiscountSystemDvPopupComponent,
    DiscountRivaahComponent
  ],
  exports: [
    DiscountBillLevelComponent,
    DiscountCoBillLevelComponent,
    DiscountEmployeeComponent,
    DiscountEmpowermentComponent,
    DiscountTataEmployeeComponent,
    DiscountTsssComponent,
    DiscountReferralCodeComponent,
    ViewTransactionLevelDiscountsComponent,
    DiscountSystemDvComponent,
    DiscountSystemDvPopupComponent,
    DiscountRivaahComponent
  ]
})
export class PossSharedDiscountUiDiscountModule {}
