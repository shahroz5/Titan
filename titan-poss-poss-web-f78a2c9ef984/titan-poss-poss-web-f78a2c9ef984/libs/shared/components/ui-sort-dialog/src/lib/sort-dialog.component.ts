import { Component, Inject } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { Column } from './models/sort-dialog.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: './sort-dialog.component.html',
  styleUrls: ['./sort-dialog.component.scss']
})
export class SortDialogComponent {
  selectedSortList: Column[];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      data: Column[];
      selected: Column[];
      description: string[];
      limit: number;
    },
    private productFilterDialog: MatDialogRef<SortDialogComponent>,
    public translateService: TranslateService
  ) {
    this.selectedSortList = data.selected;
  }

  updateSortList(item: Column, event: MatCheckboxChange) {
    if (this.data.limit === 1) {
      this.selectedSortList = [];
    }
    event.checked
      ? this.selectedSortList.push({
          ...item,
          sortAscOrder: true
        })
      : this.selectedSortList.splice(
          this.selectedSortList.findIndex(itemVal => itemVal.id === item.id),
          1
        );
  }

  updateOrderOptions(item: Column, event: MatRadioChange) {
    const index = this.selectedSortList.findIndex(
      itemVal => itemVal.id === item.id
    );
    this.selectedSortList[index] = {
      ...item,
      sortAscOrder: event.value
    };
  }

  checkedSortType(id: number) {
    return this.selectedSortList.findIndex(item => item.id === id) !== -1;
  }

  selectedOrder(id: number): string {
    const selectedSortType = this.selectedSortList.find(item => item.id === id);
    if (selectedSortType) {
      return selectedSortType.sortAscOrder
        ? this.data.description[0]
        : this.data.description[1];
    }
  }

  closePopUp() {
    this.productFilterDialog.close(this.selectedSortList);
  }
}
