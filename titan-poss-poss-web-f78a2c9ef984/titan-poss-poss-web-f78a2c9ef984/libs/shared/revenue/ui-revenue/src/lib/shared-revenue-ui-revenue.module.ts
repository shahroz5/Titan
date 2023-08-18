import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevenueFilterComponent } from './revenue-filter/revenue-filter.component';
import { RevenueListComponent } from './revenue-list/revenue-list.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { AgGridModule } from 'ag-grid-angular';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { TodayRevenueListComponent } from './today-revenue-list/today-revenue-list.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    AgGridModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [
    RevenueFilterComponent,
    RevenueListComponent,
    TodayRevenueListComponent
  ],
  exports: [
    RevenueFilterComponent,
    RevenueListComponent,
    TodayRevenueListComponent
  ]
})
export class SharedRevenueUiRevenueModule {}
