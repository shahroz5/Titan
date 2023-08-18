import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { F2MarginListItemsComponent } from './f2-margin-list-items/f2-margin-list-items.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiAgGridModule,
    CommonCustomMaterialModule
  ],
  declarations: [F2MarginListItemsComponent],
  exports: [F2MarginListItemsComponent]
})
export class SharedF2MarginUiF2MarginModule {}
