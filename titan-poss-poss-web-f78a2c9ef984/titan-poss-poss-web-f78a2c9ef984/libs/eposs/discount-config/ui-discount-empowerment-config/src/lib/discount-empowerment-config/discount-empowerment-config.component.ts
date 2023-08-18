import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  DiscountTypeEnum,
  EmpowerConfigItem,
  EmpowerDetailsPopup,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
} from '@poss-web/shared/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import {
  DeleteRowComponent,
  CheckboxCellComponent,
  ToggleButtonCellComponent
} from '@poss-web/shared/components/ui-ag-grid';
import { DiscountEmpowermentPopupComponent } from '../discount-empowerment-popup/discount-empowerment-popup.component';

@Component({
  selector: 'poss-web-discount-empowerment-config',
  templateUrl: './discount-empowerment-config.component.html',
  styleUrls: ['./discount-empowerment-config.component.scss'],
})
export class DiscountEmpowermentConfigComponent implements OnDestroy {
  @Input() empowerConfigDetailsList: EmpowerConfigItem[];
  @Input() discountDetails;


  @Output() delete = new EventEmitter<{
    updateData: EmpowerConfigItem[];
    deleteData: string[];
  }>();
  @Output() add = new EventEmitter<{
    addData: EmpowerConfigItem;
    updateData: EmpowerConfigItem[];
  }>();

  @Output() valueUpdate = new EventEmitter<{
    configDetails: any[];
    id: string;
    isActive?: boolean;
  }>();

  destroy$ = new Subject<null>();

  columnDefs = [];
  rowSelection = 'single';
  domLayout = 'autoHeight';
  rowHeight = 35;
  animateRows = true;
  api: GridApi;
  hasSelectedRow = false;

  selectedConfig: EmpowerConfigItem;

  component: any = this;
  defaultColDef = {
    suppressMovable: true
  };
  maxDiscountHeader: string;
  minProductValueHeader: string;
  maxProductValueHeader: string;
  metalCahrgesHeader: string;
  stoneHeader: string;
  wastageHeader: string;
  makingChargesHeader: string;
  ucpChargesHeader: string;
  conflictEmpowerMsg1: string;
  conflictEmpowerMsg2: string;
  conflictEmpowerMsg3: string;

  constructor(
    private translate: TranslateService,
    private dialog: MatDialog,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translate
      .get([
        'pw.discEmpowermentConfig.maxDiscLabel',
        'pw.discEmpowermentConfig.minProductValueLabel',
        'pw.discEmpowermentConfig.maxProductValueLabel',
        'pw.discEmpowermentConfig.metalChargesLabel',
        'pw.discEmpowermentConfig.stoneLabel',
        'pw.discEmpowermentConfig.WastageLabel',
        'pw.discEmpowermentConfig.makingChargesLabel',
        'pw.discEmpowermentConfig.ucpLabel',
        'pw.discEmpowermentConfig.conflictEmpowerMsg1',
        'pw.discEmpowermentConfig.conflictEmpowerMsg2',
        'pw.discEmpowermentConfig.conflictEmpowerMsg3'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.maxDiscountHeader =
          translatedMessages['pw.discEmpowermentConfig.maxDiscLabel'];
        this.minProductValueHeader =
          translatedMessages['pw.discEmpowermentConfig.minProductValueLabel'];
        this.maxProductValueHeader =
          translatedMessages['pw.discEmpowermentConfig.maxProductValueLabel'];
        this.metalCahrgesHeader =
          translatedMessages['pw.discEmpowermentConfig.metalChargesLabel'];
        this.stoneHeader =
          translatedMessages['pw.discEmpowermentConfig.stoneLabel'];
        this.wastageHeader =
          translatedMessages['pw.discEmpowermentConfig.WastageLabel'];
        this.makingChargesHeader =
          translatedMessages['pw.discEmpowermentConfig.makingChargesLabel'];
        this.ucpChargesHeader =
          translatedMessages['pw.discEmpowermentConfig.ucpLabel'];
        this.conflictEmpowerMsg1 =
          translatedMessages['pw.discEmpowermentConfig.conflictEmpowerMsg1'];
        this.conflictEmpowerMsg2 =
          translatedMessages['pw.discEmpowermentConfig.conflictEmpowerMsg2'];
        this.conflictEmpowerMsg3 =
          translatedMessages['pw.discEmpowermentConfig.conflictEmpowerMsg3'];

        this.columnDefs = [
          {
            checkboxSelection: params => params.data.isActive,
            minWidth: 35,
            width: 40,
            pinned: 'left',
            lockPinned: true
          },
          {
            headerName: this.maxDiscountHeader,
            field: 'discountPercent',
            width: 120,
            pinned: 'left',
            lockPinned: true
          },
          {
            headerName: this.minProductValueHeader,
            field: 'minValue',
            width: 160,
            type: 'numericColumn',
            cellClass: 'pw-justify-content-end'
          },
          {
            headerName: this.maxProductValueHeader,
            field: 'maxValue',
            width: 160,
            type: 'numericColumn',
            cellClass: 'pw-justify-content-end'
          },
          {
            headerName: this.metalCahrgesHeader,
            field: 'is_metal_charges',
            width: 120,
            cellRendererFramework: CheckboxCellComponent
          },
          {
            headerName: this.stoneHeader,
            field: 'is_stone_charges',
            width: 100,
            cellRendererFramework: CheckboxCellComponent
          },

          {
            headerName: this.makingChargesHeader,
            field: 'is_making_charges',
            width: 130,
            cellRendererFramework: CheckboxCellComponent
          },
          {
            headerName: this.ucpChargesHeader,
            field: 'is_ucp_charges',
            width: 120,
            cellRendererFramework: CheckboxCellComponent
          },
          {
            headerName: 'Status',
            field: 'isActive',
            cellRendererFramework: ToggleButtonCellComponent,
            width: 110
          },
          {
            headerName: '',
            cellRenderer: 'deleteRowRenderer',
            width: 21,
            minWidth: 21,
            maxWidth: 21,
            cellClass: 'pw-delete-icon-width',
            headerClass: 'pw-delete-icon-width'
          }
        ];
      });
  }


  getComponents() {
    return {
      deleteRowRenderer: DeleteRowComponent
    };
  }

  onCellKeyPress(event) {
    const keyPressed = event.event.key;
    if (
      keyPressed === 'Enter' &&
      event.colDef.cellRenderer === 'deleteRowRenderer'
    ) {
      this.openConfirmDialogForDelete(event.data);
    }
  }



  openConfirmDialogForDelete(data: any) {
    if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.discountProductCategoryMapping.deleteConfirmMessage'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res === true) {

            const updateData = this.getAllRows(data.id);

            this.delete.emit({ updateData: updateData, deleteData: [data.id] });
            this.empowerConfigDetailsList = [...this.empowerConfigDetailsList];
            this.hasSelectedRow = false;
            this.selectedConfig = null;
          }
        });
    }
  }

  getAllRows(rowId, data?: string) {
    const rowData = [];
    let index = 1;
    console.log('rowId', rowId);
    if (data) {
      this.api.forEachNode(node => {
        if (node && node.data.id !== data) {
          node.data = {
            ...node.data,
            rowId: index++
          };

          rowData.push(node.data);
        }
      });
    } else {
      if (rowId) {
        this.api.forEachNode(node => {
          if (node && index !== rowId) {
            node.data = {
              ...node.data,
              rowId: index++
            };

            rowData.push(node.data);
          } else {
            node.data = {
              ...node.data,
              rowId: ++index
            };
            rowData.push(node.data);
            index++;
          }
        });
      } else {
        this.api.forEachNode(node => {
          if (node) {
            node.data = {
              ...node.data,
              rowId: index++
            };

            rowData.push(node.data);
          }
        });
      }
    }

    return rowData;
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }

  getContext() {
    return {
      componentParent: this.component,
      disableCheckBox: true
    };
  }

  selectionChanged(grid) {
    if (grid.api.getSelectedRows().length) {
      this.hasSelectedRow = true;
      this.selectedConfig = grid.api.getSelectedRows()[0];
    } else {
      this.hasSelectedRow = false;
      this.selectedConfig = null;
    }
  }

  empowermentDetailPopup(mode: boolean, toUpBelow?: any) {
    if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      // True - Edit, false - Add new
      const minValue = this.selectedConfig?.minValue;
      const maxValue = this.selectedConfig?.maxValue;
      const rowId = this.selectedConfig?.rowId;
      const totalNoOfRows = this.getAllRows(null).length;

      let tempParticularRowId = 0;
      if (toUpBelow === 'below') {
        if (totalNoOfRows === 1) {
          tempParticularRowId = 0;
        } else if (totalNoOfRows !== 1 && totalNoOfRows === toUpBelow.rowId) {
          tempParticularRowId = 0;
        } else {
          tempParticularRowId = rowId + 1;
        }
      } else if (toUpBelow === 'above') {
        if (totalNoOfRows === 1) {
          tempParticularRowId = 0;
        } else if (totalNoOfRows !== 1 && totalNoOfRows === toUpBelow.rowId) {
          tempParticularRowId = rowId - 1;
        } else {
          tempParticularRowId = rowId - 1;
        }
      }


      const compareRow =
        tempParticularRowId !== 0
          ? this.getParticularRow(tempParticularRowId, totalNoOfRows, toUpBelow)
          : null;

      const data: EmpowerDetailsPopup = {
        empowermentDetailsList: this.selectedConfig,
        mode,
        minValue,
        maxValue,
        compareRow,
        totalNoOfRows,
        rowId,
        toUpBelow
      };
      const dialogRef = this.dialog.open(DiscountEmpowermentPopupComponent, {
        width: '600px',
        height: 'auto',
        data: data,
        disableClose: true
      });

      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            if (mode) {
              const discountComponents = {
                configDetails: [
                  {
                    type: DiscountTypeEnum.EMPOWERMENT_DISCOUNT,
                    data: {
                      is_metal_charges: res.is_metal_charges,
                      is_stone_charges: res.is_stone_charges,
                      is_making_charges: res.is_making_charges,
                      is_ucp_charges: res.is_ucp_charges
                    }
                  }
                ],
                id: res.id,
                isActive: res.isActive,
                discountPercent: res.discountPercent,
              };

              this.valueUpdate.emit(discountComponents);
              this.empowerConfigDetailsList = [...this.empowerConfigDetailsList];
              this.hasSelectedRow = false;
              this.selectedConfig = null;
            } else {
              if (
                this.checkForConflicts(
                  // tslint:disable-next-line:radix
                  Number.parseInt(res.minValue),
                  // tslint:disable-next-line:radix
                  Number.parseInt(res.maxValue)
                )
              ) {
                let tempRowId = 1;
                if (toUpBelow === 'below') tempRowId = rowId + 1;
                else if (toUpBelow === 'above') tempRowId = rowId;


                const updateData = this.getAllRows(tempRowId);


                const newEmpowerConfig = {
                  id: null,
                  rowId: tempRowId,
                  minValue: res.minValue,
                  maxValue: res.maxValue,
                  discountPercent: res.discountPercent,
                  is_metal_charges: res.is_metal_charges,
                  is_stone_charges: res.is_stone_charges,
                  is_making_charges: res.is_making_charges,
                  is_ucp_charges: res.is_ucp_charges,
                  isActive: true,
                  configDetails:
                    {
                      type: DiscountTypeEnum.EMPOWERMENT_DISCOUNT,
                      data: {
                        is_metal_charges: res.is_metal_charges,
                        is_stone_charges: res.is_stone_charges,
                        is_making_charges: res.is_making_charges,
                        is_ucp_charges: res.is_ucp_charges
                      }
                    }
                  ,
                };


                this.add.emit({
                  addData: newEmpowerConfig,
                  updateData: updateData
                });
                this.empowerConfigDetailsList = [...this.empowerConfigDetailsList];
                this.hasSelectedRow = false;
                this.selectedConfig = null;
              }
            }
          }
        });
    }
  }

  selectionChange(id, status) {
    this.valueUpdate.emit({ configDetails: [], id: id, isActive: status });
    this.empowerConfigDetailsList = [...this.empowerConfigDetailsList];
    this.hasSelectedRow = false;
    this.selectedConfig = null;
  }
  showMessage(key: string) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasBackdrop: true,
            hasClose: true
          })
          .events.subscribe();
      });
  }

  getParticularRow(rowId, totalNoOfRows, mode) {
    const rowData = [];
    console.log('rowId', rowId);
    this.api.forEachNode(node => {
      if (node && node.data.rowId === rowId && node.data.isActive) {
        rowData.push(node.data);
      }
    });
    if (rowData.length) {
      return rowData;
    } else {
        if (rowId >= 1 && rowId <= totalNoOfRows) {
          if (mode === 'below') {
            return this.getParticularRow(rowId + 1,totalNoOfRows, mode);
          } else if (mode === 'above') {
            return this.getParticularRow(rowId - 1,totalNoOfRows, mode);
          }
        }
    }
  }

  checkForConflicts(minValue: number, maxValue: number) {
    const rows = [];
    this.api.forEachNode(node => rows.push(node.data));
    for (const row of rows) {
      // tslint:disable-next-line:radix
      const rowMin = Number.parseInt(row.minValue);
      // tslint:disable-next-line:radix
      const rowMax = Number.parseInt(row.maxValue);

      if (
        ((rowMin <= minValue && minValue <= rowMax) ||
        (rowMin <= maxValue && maxValue <= rowMax)) &&
        row.isActive
      ) {
        this.showConflictError(rowMin, rowMax);

        return false;
      }
    }

    return true;
  }

  showConflictError(min: number, max: number) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.ERROR,
        message:
          this.conflictEmpowerMsg1 +
          this.conflictEmpowerMsg2 +
          min +
          this.conflictEmpowerMsg3 +
          max
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) this.empowermentDetailPopup(false);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
