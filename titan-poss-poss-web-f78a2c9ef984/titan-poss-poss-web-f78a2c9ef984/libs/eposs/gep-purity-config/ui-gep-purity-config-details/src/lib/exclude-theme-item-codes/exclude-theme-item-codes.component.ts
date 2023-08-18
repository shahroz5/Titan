import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { DeleteRowComponent } from '@poss-web/shared/components/ui-ag-grid';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ExcludeItemCodes,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
import {
  fieldValidation,
  FieldValidatorsService
} from '@poss-web/shared/util-field-validators';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-exclude-theme-item-codes',
  templateUrl: './exclude-theme-item-codes.component.html',
  styleUrls: ['./exclude-theme-item-codes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExcludeThemeItemCodesComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() excludeItemCodes: ExcludeItemCodes[];
  @Input() excludeThemeCodes: ExcludeItemCodes[];
  @Output() emitThemeCode = new EventEmitter<string>();
  @Output() deleteThemeCode = new EventEmitter<string>();
  @Input() isParentFormValid: boolean;
  @Output() emitLocationMapping = new EventEmitter<boolean>();
  @Input() isLocationMapping: boolean;
  @Input() excludeItemCodesCount: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() formGroup: FormGroup;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() emitSearchValue = new EventEmitter<string>();
  @Output() clearEvent = new EventEmitter();
  @Output() downloadFileEvent = new EventEmitter();
  @Output() uploadFileEvent = new EventEmitter<any>();
  defaultColDef = {
    suppressMovable: true
  };
  @ViewChild('itemCodeSearch', { static: true })
  itemCodeSearch: ElementRef;
  itemSearchForm = new FormGroup({
    itemSearch: new FormControl()
  });
  destroy$: Subject<null> = new Subject<null>();
  api: GridApi;
  itemGroupApi: GridApi;
  excludeThemeFormGroup: FormGroup;
  animateRows = true;
  ItemCodesRowData = [];
  themeCodesRowData = [];
  context = this;
  themeCodesColumnDefs = [];
  itemCodeColumnDefs = [];

  domLayout = 'autoHeight';
  rowHeight = '35';
  autoHeight = true;
  component: any = this;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    private translate: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.translate
      .get([
        'pw.gePurityConfiguration.themeCode',
        'pw.gePurityConfiguration.removeLabel',
        'pw.gePurityConfiguration.itemCodesLabel',
        'pw.gePurityConfiguration.isExcludedLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.themeCodesColumnDefs = [
          {
            headerName:
              translatedMessages['pw.gePurityConfiguration.themeCode'],
            field: 'themeCode',
            width: 170.5,
            resizable: true
          },
          {
            headerName: '',
            field: 'id',
            cellRenderer: 'deleteRowRenderer',
            width: 21,
            minWidth: 21,
            maxWidth: 21,
            cellClass: 'pw-delete-icon-width',
            headerClass: 'pw-delete-icon-width',
            suppressMovable: true
          }
        ];
        this.itemCodeColumnDefs = [
          {
            headerName:
              translatedMessages['pw.gePurityConfiguration.itemCodesLabel'],
            field: 'itemCode',
            width: 644
          },
          {
            headerName:
              translatedMessages['pw.gePurityConfiguration.isExcludedLabel'],
            field: 'isActive',
            editable: false,
            cellRenderer: params => {
              if (params.value) {
                return 'Active';
              } else {
                return 'In-Active';
              }
            }
          }
        ];
      });
  }

  ngOnInit() {
    this.createForm();
  }
  ngAfterViewInit(): void {
    fromEvent(this.itemCodeSearch.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.itemSearchForm.value.itemSearch;
        if (searchValue) {
          if (fieldValidation.itemCodeField.pattern.test(searchValue)) {
            this.emitSearchValue.emit(searchValue);
          } else {
            this.itemGroupApi.setRowData([]);
          }
        } else this.clearExcludeItemCodes();
      });
  }
  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }
  itemGroupGridReady(params: GridReadyEvent) {
    this.itemGroupApi = params.api;
  }
  clearExcludeItemCodes() {
    this.itemSearchForm.reset();
    this.clearEvent.emit();
  }

  getComponents() {
    return {
      deleteRowRenderer: DeleteRowComponent
    };
  }
  getContext() {
    return {
      componentParent: this.component
    };
  }

  openConfirmDialogForDelete(data: any) {
    if (!this.formGroup.get('isActive').value) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.discountProductGroupMapping.deleteConfirmMessage'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res === true) {
            this.deleteThemeCode.emit(data.id);
          }
        });
    }
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

  onGridSizeChanged(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
  }

  createForm() {
    this.excludeThemeFormGroup = new FormGroup({
      themeCode: new FormControl('', [
        this.fieldValidatorsService.numbersField('Theme Code')
      ])
    });
  }
  addThemeCode() {
    this.emitThemeCode.emit(this.excludeThemeFormGroup.get('themeCode').value);
    this.excludeThemeFormGroup.reset();
  }
  locationMapping() {
    this.emitLocationMapping.emit(true);
  }
  downloadFile() {
    this.downloadFileEvent.emit();
  }
  uploadFile($event) {
    this.uploadFileEvent.emit($event);
  }

  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    this.currentRowInfo = this.excludeItemCodes[this.currentRowIndex][this.currentRowField];
  }

  focusOut(event) {
    this.isFocusing = false;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
