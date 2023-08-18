import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  DeleteRowComponent,
  ToggleButtonCellComponent
} from '@poss-web/shared/components/ui-ag-grid';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  DiscountExcludeItemCodes,
  DiscountExcludeThemeCode,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  DiscountExcludeConfigTabEnum
} from '@poss-web/shared/models';
import { FormGroup, FormControl } from '@angular/forms';
import { GridReadyEvent, GridApi } from 'ag-grid-community';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { fromEvent, Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-exclude-theme-item-codes',
  templateUrl: './exclude-theme-item-codes.component.html',
  styleUrls: ['./exclude-theme-item-codes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExcludeThemeItemCodesComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @Input() selectedTab;
  @Input() excludeItemCodes: DiscountExcludeItemCodes[] = [];
  @Input() excludeThemeCodes: DiscountExcludeThemeCode[] = [];

  @Input() excludeItemCodesCount: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[] = [];
  @Input() minPageSize = 0;
  @Input() discountDetails;
  @Output() addThemeCode = new EventEmitter<any>();
  @Output() deleteThemeCode = new EventEmitter<{
    id: string;
    excludeType: any;
  }>();
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() loadItemCodes = new EventEmitter<{
    searchItemCode: string;
    pageEvent: PageEvent;
  }>();
  @Output() downLoadFormat = new EventEmitter<null>();
  @Output() activateThemeCode = new EventEmitter<{
    id: string;
    status: string;
  }>();
  @Output() uploadItemCodes = new EventEmitter<{
    event: any;
    fileInput: any;
  }>();

  @ViewChild('fileInput') fileInput;

  searchItemCode: string;

  destroy$: Subject<null> = new Subject<null>();
  api: GridApi;
  animateRows = true;
  autoHeight = true;
  context = this;
  themeCodesColumnDefs = [];
  itemCodeColumnDefs = [];

  domLayout = 'autoHeight';
  rowHeight = '35';

  form = new FormGroup({
    itemCode: new FormControl(),
    themeCode: new FormControl()
  });
  component: ExcludeThemeItemCodesComponent = this;
  @ViewChild('itemCodeSearch', { static: true })
  itemCodeSearch: ElementRef;

  itemCodeLabel: string;
  themeCodeLabel: string;

  defaultColDef = {
    suppressMovable: true
  };
  invalid = false;
  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    private translate: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private fieldValidatorsService: FieldValidatorsService,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translate
      .get([
        'pw.discountExculdeConfig.themeCode',
        'pw.discountExculdeConfig.removeLabel',
        'pw.discountExculdeConfig.itemCodesLabel',
        'pw.discountExculdeConfig.isExcludedLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.itemCodeLabel =
          translatedMessages['pw.discountExculdeConfig.itemCodesLabel'];
        this.themeCodeLabel =
          translatedMessages['pw.discountExculdeConfig.themeCode'];

        this.themeCodesColumnDefs = [
          {
            headerName: this.themeCodeLabel,
            field: 'themeCode',
            flex: 1,
            suppressMovable: true
          },
          {
            headerName: 'Is Active',
            field: 'isActive',
            cellRendererFramework: ToggleButtonCellComponent,
            width: 120
          },
          {
            headerName: '',
            cellRenderer: 'deleteRowRenderer',
            width: 21,
            minWidth: 21,
            maxWidth: 21,
            cellClass: 'pw-delete-icon-width',
            suppressMovable: true
          }
        ];

        this.itemCodeColumnDefs = [
          {
            headerName: this.itemCodeLabel,
            field: 'itemCode',
            flex: 1,
            suppressMovable: true
          },

          {
            headerName:
              translatedMessages['pw.discountExculdeConfig.isExcludedLabel'],
            field: 'isActive',
            editable: false,
            cellRenderer: params => {
              if (params.value) {
                return 'Active';
              } else {
                return 'In-Active';
              }
            },
            suppressMovable: true
          }
        ];
      });

    this.form = new FormGroup({
      itemCode: new FormControl('', [
        this.fieldValidatorsService.itemCodeField(this.itemCodeLabel)
      ]),
      // TODO : Add theme code field validator
      themeCode: new FormControl('', [
        this.fieldValidatorsService.themeCodeField(this.themeCodeLabel),
        this.fieldValidatorsService.minLength(4, this.themeCodeLabel),
        this.fieldValidatorsService.maxLength(7, this.themeCodeLabel)
      ])
    });
  }

  ngOnInit() {
    if (
      this.form.get('themeCode').value === '' ||
      this.form.get('themeCode').value === null
    ) {
      this.invalid = true;
    }

    this.form
      .get('themeCode')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data === '' || data === null) this.invalid = true;
        else this.invalid = false;
      });
  }

  ngAfterViewInit(): void {
    fromEvent(this.itemCodeSearch.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.form.value.itemCode;
        if (searchValue) {
          this.search(searchValue);
        } else this.clearExcludeItemCode();
      });
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }

  paginatorFn(event) {
    this.pageEvent = event;
    this.loadItemCodesFn();
  }
  search(searchValue: string) {
    this.searchItemCode = searchValue;
    this.loadItemCodesFn();
  }
  loadItemCodesFn() {
    this.loadItemCodes.emit({
      searchItemCode: this.searchItemCode,
      pageEvent: this.pageEvent
    });
  }

  downLoadFormatFn() {
    if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else this.downLoadFormat.emit();
  }

  uploadItemCodesFn(event) {
    if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else
      this.uploadItemCodes.emit({ event: event, fileInput: this.fileInput });
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

  addThemeCodeFn() {
    if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      if (this.form.get('themeCode').valid) {
        const themeCode = this.form.get('themeCode').value;
        this.addThemeCode.emit({ themeCode, excludeType: this.selectedTab });
        this.clearExcludeThemeCode();
      }
    }
  }

  clearExcludeThemeCode() {
    this.form.get('themeCode').reset();
  }

  clearExcludeItemCode() {
    this.form.get('itemCode').reset();
    this.searchItemCode = null;
    this.loadItemCodesFn();
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
    if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
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
            this.deleteThemeCode.emit({
              id: data.id,
              excludeType: DiscountExcludeConfigTabEnum.THEME_CODE
            });
          }
        });
    }
  }

  onCellKeyPress(event) {
    const keyPressed = event.event.key;
    console.log('Delete');
    // TODO:  Not getting Enter key event
    if (
      keyPressed === 'Enter' &&
      event.colDef.cellRenderer === 'deleteRowRenderer'
    ) {
      this.openConfirmDialogForDelete(event.data.id);
    }
  }

  selectionChange(id, status) {
    console.log(id, status);
    this.activateThemeCode.emit({ id, status });
  }
  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    this.currentRowInfo = this.excludeItemCodes[this.currentRowIndex][
      this.currentRowField
    ];
  }

  focusOut(event) {
    this.isFocusing = false;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
