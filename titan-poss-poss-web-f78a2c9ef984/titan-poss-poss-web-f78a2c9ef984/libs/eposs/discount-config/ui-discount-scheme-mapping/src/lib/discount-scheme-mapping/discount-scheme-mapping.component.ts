import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnDestroy,
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
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  DiscountExcludeConfigTabEnum,
  DiscountExcludeSchemeCode
} from '@poss-web/shared/models';
import { FormGroup, FormControl } from '@angular/forms';
import { GridReadyEvent, GridApi } from 'ag-grid-community';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-discount-scheme-mapping',
  templateUrl: './discount-scheme-mapping.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscountSchemeMappingComponent implements OnInit, OnDestroy {
  @Input() excludeSchemeCodes: DiscountExcludeSchemeCode[] = [];
  @Input() excludeSchemeCodesCount: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[] = [];
  @Input() minPageSize = 0;
  @Input() discountDetails;
  @Output() addSchemeCode = new EventEmitter<any>();
  @Output() deleteSchemeCode = new EventEmitter<{
    id: string;
    excludeType: any;
  }>();
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() loadItemCodes = new EventEmitter<{
    searchItemCode: string;
    pageEvent: PageEvent;
  }>();
  @Output() activateSchemeCode = new EventEmitter<{
    id: string;
    status: string;
    excludeType: any;
  }>();

  destroy$: Subject<null> = new Subject<null>();
  api: GridApi;
  animateRows = true;
  autoHeight = true;
  context = this;
  SchemeCodesColumnDefs = [];
  itemCodeColumnDefs = [];


  domLayout = 'autoHeight';
  rowHeight = '35';

  form: FormGroup;
  component: DiscountSchemeMappingComponent = this;
  @ViewChild('itemCodeSearch', { static: true })
  itemCodeSearch: ElementRef;

  schemeCodeLabel: string;

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
        'pw.discountExculdeConfig.schemeCodePlaceholder',
        'pw.discountExculdeConfig.removeLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.schemeCodeLabel =
          translatedMessages['pw.discountExculdeConfig.schemeCodePlaceholder'];

        this.SchemeCodesColumnDefs = [
          {
            headerName: this.schemeCodeLabel,
            field: 'schemeCode',
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
      });
  }

  ngOnInit() {
    this.form = new FormGroup({
      schemeCode: new FormControl('', [
        this.fieldValidatorsService.schemeCodeField(this.schemeCodeLabel)
        // this.fieldValidatorsService.minLength(1, this.schemeCodeLabel),
        // this.fieldValidatorsService.maxLength(25, this.schemeCodeLabel)
      ])
    });
    this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
    if (
      this.form.get('schemeCode').value === '' ||
      this.form.get('schemeCode').value === null
    ) {
      this.invalid = true;
    }

    this.form
      .get('schemeCode')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data === '' || data === null) this.invalid = true;
        else this.invalid = false;
      });
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
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

  addSchemeCodeFn() {
    if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      if (this.form.get('schemeCode').valid) {
        const schemeCode = this.form.get('schemeCode').value;
        this.addSchemeCode.emit({
          schemeCode,
          excludeType: DiscountExcludeConfigTabEnum.SCHEME_CODE
        });
        this.clearExcludeSchemeCode();
      }
    }
  }

  clearExcludeSchemeCode() {
    this.form.get('schemeCode').reset();
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
            this.deleteSchemeCode.emit({
              id: data.id,
              excludeType: DiscountExcludeConfigTabEnum.SCHEME_CODE
            });
          }
        });
    }
  }

  onCellKeyPress(event) {
    const keyPressed = event.event.key;
    if (
      keyPressed === 'Enter' &&
      event.colDef.cellRenderer === 'deleteRowRenderer'
    ) {
      this.openConfirmDialogForDelete(event.data.id);
    }
  }

  selectionChange(id, status) {
    this.activateSchemeCode.emit({
      id,
      status,
      excludeType: DiscountExcludeConfigTabEnum.SCHEME_CODE
    });
  }
  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    this.currentRowInfo = this.excludeSchemeCodes[this.currentRowIndex][
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
