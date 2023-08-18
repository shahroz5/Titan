import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerSummaryComponent } from './customer-summary.component';
import { CustomerSummaryService } from './customer-summary.service';
import { CustomerSummaryAbstraction } from '@poss-web/shared/models';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { RouterModule } from '@angular/router';
import { SharedCustomerDataAccessCustomerModule } from '@poss-web/shared/customer/data-access-customer';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiAddressPanelModule } from '@poss-web/shared/components/ui-address-panel';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule,
    SharedComponentsUiLoaderModule,
    SharedCustomerDataAccessCustomerModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiAddressPanelModule
  ],
  declarations: [CustomerSummaryComponent],
  exports: [CustomerSummaryComponent],
  entryComponents: [CustomerSummaryComponent],
  providers: [
    {
      provide: CustomerSummaryAbstraction,
      useClass: CustomerSummaryService
    }
  ]
})
export class SharedCustomerFeatureCustomerSummaryModule {}
