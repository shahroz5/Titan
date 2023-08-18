import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { InputCellComponent } from '@poss-web/shared/components/ui-ag-grid';
import {
  EghsBodGeneratedPassword,
  OfflineEghsBodGridEnum
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-ag-eghs-offline-bod-password-grid',
  templateUrl: './ag-eghs-offline-bod-password-grid.component.html',
  styleUrls: ['./ag-eghs-offline-bod-password-grid.component.scss']
})
export class AgEghsOfflineBodPasswordGridComponent
  implements OnInit, OnChanges, OnDestroy {
  api: GridApi;
  columnApi: ColumnApi;
  domLayout = OfflineEghsBodGridEnum.AUTO_HEIGHT;
  animateRows = true;
  rowHeight = 35;
  rowSelection = OfflineEghsBodGridEnum.SINGLE;
  defaultColDef = {
    enableCellTextSelection: true,
    suppressMovable: true,
    flex: 1
  };
  columnDefs = [];
  rowData = [];
  context = this;

  @Input() offlineEghsBodData: EghsBodGeneratedPassword[];
  @Input() count = 0;

  @Output() paginator = new EventEmitter<PageEvent>();
  component: AgEghsOfflineBodPasswordGridComponent = this;

  destroy$: Subject<null> = new Subject<null>();

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['offlineEghsBodData']) {
      this.rowData = [];
      if (!!this.offlineEghsBodData && this.offlineEghsBodData.length > 0) {
        this.offlineEghsBodData.forEach(data => {
          this.rowData.push({
            passwordDate: data.passwordDate,
            locationCode: data.locationCode,
            goldRate: data.goldRate,
            formGroup: new FormGroup({
              password: new FormControl(data.password)
            })
          });
        });
      }
    }
  }

  ngOnInit(): void {
    const businessDate = 'pw.bodEod.businessDate';
    const locationCode = 'pw.bodEod.locationCode';
    const goldPrice = 'pw.bodEod.goldRate';
    const passwordLabel = 'pw.bodEod.passwordLabel';

    this.translate
      .get([locationCode, businessDate, goldPrice, passwordLabel])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMessages => {
        this.columnDefs = [
          {
            minWidth: 5,
            width: 5,
            pinned: 'left',
            lockPinned: true,
            cellStyle: params => {
              if (params.data.newlyAdded) {
                return { backgroundColor: '#1eb496', padding: '0px' };
              }
            }
          },
          {
            headerName: translatedMessages[businessDate],
            field: 'passwordDate'
          },
          {
            headerName: translatedMessages[goldPrice],
            field: 'goldRate'
          },
          {
            headerName: translatedMessages[passwordLabel],
            field: 'password',
            cellRendererFramework: InputCellComponent
          }
        ];
      });
  }

  getContext() {
    return {
      componentParent: this.component,
      disableInput: true
    };
  }

  onGridSizeChanged() {
    this.api.sizeColumnsToFit();
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.columnApi = params.columnApi;
  }
  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    var node = this.api.getDisplayedRowAtIndex(this.currentRowIndex);
    this.currentRowInfo = this.api.getValue(this.currentRowField, node);
    if (this.currentRowField === 'password')
      this.currentRowInfo = this.rowData[
        this.currentRowIndex
      ].formGroup.controls[this.currentRowField].value.replace(/./g, '*');
  }

  focusOut(event) {
    this.isFocusing = false;
  }

  visibility() {
    console.log(this.isFocusing);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
