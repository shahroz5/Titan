import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { Subject } from 'rxjs';
import {
  FOCItemCodes,
  FocItemMappingApplyResponse
} from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-foc-item-mapping-popup',
  templateUrl: './foc-item-mapping-popup.component.html',
  styleUrls: ['./foc-item-mapping-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FocItemMappingPopupComponent implements OnInit, OnDestroy {
  @ViewChild(MatTabGroup, { static: false }) tabGroup: MatTabGroup;
  prevMappedItemCodes = [];
  allFocItemCodes: FOCItemCodes[] = [];
  selectedFocItemCodes: FOCItemCodes[] = [];
  isViewMode: boolean;
  viewModeLabel: string;
  selectAllOfAddNewTab = false;
  selectAllOfSelectedTab = false;
  destroy$ = new Subject();
  hasChange = false;
  disableRemoveButton = true;
  isChecked = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FocItemMappingPopupComponent>,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.prevMappedItemCodes = this.data.selectedItemCodes;

    this.selectedFocItemCodes = this.data.selectedItemCodes;
    this.allFocItemCodes = this.getFilteredArray(
      this.data.focItemCodes,
      this.selectedFocItemCodes
    );
    this.allFocItemCodes = this.allFocItemCodes.map(itemCode => ({
      ...itemCode,
      isSelected: false
    }));
    this.selectedFocItemCodes = this.selectedFocItemCodes.map(itemCode => ({
      ...itemCode,
      isSelected: false
    }));
    this.isViewMode = this.data.isViewMode ? this.data.isViewMode : false;
    this.viewModeLabel = this.data.viewModeLabel;
  }

  selectAll(type: string, isSelected: boolean) {
    this.isChecked = isSelected;
    if (type === 'new') {
      this.allFocItemCodes = this.allFocItemCodes.map(itemCode => ({
        ...itemCode,
        isSelected: isSelected
      }));
    } else if (type === 'selected') {
      this.selectedFocItemCodes = this.selectedFocItemCodes.map(itemCode => ({
        ...itemCode,
        isSelected: isSelected
      }));
      if (
        this.selectedFocItemCodes.filter(
          focItemCodesData => focItemCodesData.isSelected
        ).length > 0
      ) {
        this.disableRemoveButton = false;
      } else {
        this.disableRemoveButton = true;
      }
    }
  }

  selectionChange(itemCode: FOCItemCodes, isSelected: boolean, type: string) {
    this.isChecked = isSelected;
    if (itemCode?.isSelected !== isSelected) {
      itemCode.isSelected = isSelected;
    }
    if (type === 'new') {
      this.selectAllOfAddNewTab =
        this.allFocItemCodes.length ===
        this.allFocItemCodes.filter(
          focItemCodesData => focItemCodesData.isSelected
        ).length;
    } else if (type === 'selected') {
      this.selectAllOfSelectedTab =
        this.selectedFocItemCodes.length ===
        this.selectedFocItemCodes.filter(
          focItemCodesData => focItemCodesData.isSelected
        ).length;
      if (
        this.selectedFocItemCodes.filter(
          focItemCodesData => focItemCodesData.isSelected
        ).length > 0
      ) {
        this.disableRemoveButton = false;
      } else {
        this.disableRemoveButton = true;
      }
    }
    console.log('111', this.selectedFocItemCodes);
  }

  updateFocItemCodes(type: string) {
    this.isChecked = false;
    this.hasChange = true;
    if (type === 'new') {
      if (this.allFocItemCodes.filter(data => data.isSelected).length) {
        const selectItemCode = this.selectedFocItemCodes.map(
          focItemCodes => focItemCodes.itemCode
        );
        this.selectedFocItemCodes = this.selectedFocItemCodes
          .concat(
            this.allFocItemCodes.filter(
              data => data.isSelected && !selectItemCode.includes(data.itemCode)
            )
          )
          .map(productGroup => ({
            ...productGroup,
            isSelected: false
          }));
        this.allFocItemCodes = this.allFocItemCodes
          .filter(productGroup => !productGroup.isSelected)
          .map(data => ({
            ...data,
            isSelected: false
          }));

        this.tabGroup.selectedIndex = 1;
        this.selectAllOfSelectedTab = false;
        this.selectAllOfAddNewTab = false;
      }
    } else if (type === 'selected') {
      this.selectAllOfSelectedTab = false;

      this.allFocItemCodes = this.allFocItemCodes
        .concat(this.selectedFocItemCodes.filter(data => data.isSelected))
        .map(data => ({
          ...data,
          isSelected: false
        }));
      this.selectedFocItemCodes = this.selectedFocItemCodes.filter(
        data => !data.isSelected
      );
    }
  }

  createResponse(): FocItemMappingApplyResponse {
    const updatedSelectedProductGroups = this.mapToProductGroupOptions(
      this.selectedFocItemCodes
    );

    return {
      selectedItemCodes: updatedSelectedProductGroups,
      addItemCodes: this.getFilteredArray(
        updatedSelectedProductGroups,
        this.prevMappedItemCodes
      ),
      removeItemCodes: this.getFilteredArray(
        this.prevMappedItemCodes,
        updatedSelectedProductGroups
      )
    };
  }

  applyProductGroups() {
    this.dialogRef.close({
      type: 'apply',
      data: this.createResponse()
    });
  }

  mapToProductGroupOptions(array: FOCItemCodes[]): FOCItemCodes[] {
    return array.map(ele => ({
      itemCode: ele.itemCode,
      stdWeight: ele.stdWeight,
      karat: ele.karat
    }));
  }

  // getSelectedProductGroupWithDescription(array1, array2) {
  //   const array2Ids: string[] = array2.map(data => data.id);
  //   this.selectedMappedProuctGroup = array1
  //     .filter(ele => array2Ids.includes(ele.id))
  //     .map(data => ({
  //       ...data,
  //       isSelected: false
  //     }))
  //     .sort((productGroup1, productGroup2) =>
  //       productGroup1.description.toLocaleLowerCase() >
  //       productGroup2.description.toLocaleLowerCase()
  //         ? 1
  //         : -1
  //     );
  // }
  getFilteredArray(
    array1: FOCItemCodes[],
    array2: FOCItemCodes[]
  ): FOCItemCodes[] {
    const array2Ids: string[] = array2.map(data => data.itemCode);
    return array1.filter(ele => !array2Ids.includes(ele.itemCode));
  }

  close() {
    this.dialogRef.close({ type: 'close' });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
