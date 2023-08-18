import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import {
  CheckboxCellComponent,
  DeleteRowComponent
} from '@poss-web/shared/components/ui-ag-grid';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  TEPProductGroupConfigDetails,
  TEPProductGroupMappingDetails,
  TEPProductGroupMappingGridData
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import {
  SortDialogService,
  Column
} from '@poss-web/shared/components/ui-sort-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'poss-web-tep-product-group-form',
  templateUrl: './tep-product-group-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TepProductGroupFormComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() pageSizeOptions: number[];
  @Input() pageSize = 10;
  @Input() minPageSize;
  @Input() pageEvent: PageEvent;
  configNameTranslate: string;
  productGroupsTranslate: string;
  tepAllowedTranslate: string;
  goldDedPercentTranslate: string;
  silverDedPercentTranslate: string;
  platinumDedPercentTranslate: string;
  ucpDedPercentTranslate: string;
  ucpDedFlatTranslate: string;
  stoneChargesApplicableTranslate: string;
  stoneValueDeductionPercentTranslate: string;
  cmMandatoryTranslate: string;
  dedPercentCMUnavailTranslate: string;
  wtTolerancePercentTranslate: string;
  transTEPsalebinTranslate: string;
  refundDedPercentTranslate: string;
  isCmDeductionAllowed: string;
  cmDeductionPercent: string;
  fullValueTEPTranslate: string;
  fullValueTEPDedPercentTranslate: string;
  isAllowedToEditQuantityTranslate: string;
  isCutPieceAllowedTranslate: string;
  isInterBrandAllowedTranslate: string;
  typeOfExchangeTranslate: string;
  discountRecoveryPercentTranslate: string;
  isProportionedValueTranslate: string;
  removeTranslate: string;
  isFocusing = false;
  focusedHeaderName: string;

  component: any = this;
  currentRowIndex: any;
  currentRowField: any;

  maxSortLimit = 2;

  @Output() sortEmitter = new EventEmitter<string[]>();

  sortData: Column[] = [];
  sortBy: string;
  sortOrder: string;
  sort: string[] = [];

  constructor(
    public fb: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService,
    private translationService: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private cdr: ChangeDetectorRef,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private dialog: MatDialog,
    private sortService: SortDialogService
  ) {
    this.translationService
      .get([
        'pw.tepProductGroupConfig.configName',
        'pw.tepProductGroupConfig.productGroups',
        'pw.tepProductGroupConfig.tepAllowed',
        'pw.tepProductGroupConfig.goldDedPercent',
        'pw.tepProductGroupConfig.silverDedPercent',
        'pw.tepProductGroupConfig.platinumDedPercent',
        'pw.tepProductGroupConfig.ucpDedPercent',
        'pw.tepProductGroupConfig.ucpDedFlat',
        'pw.tepProductGroupConfig.stoneChargesApplicable',
        'pw.tepProductGroupConfig.stoneValueDeductionPercent',
        'pw.tepProductGroupConfig.cmMandatory',
        'pw.tepProductGroupConfig.dedPercentCMUnavail',
        'pw.tepProductGroupConfig.wtTolerancePercent',
        'pw.tepProductGroupConfig.transTEPsalebin',
        'pw.tepProductGroupConfig.refundDedPercent',
        'pw.tepProductGroupConfig.fullValueTEP',
        'pw.tepProductGroupConfig.fullValueTEPDedPercent',
        'pw.tepProductGroupConfig.isAllowedToEditQuantity',
        'pw.tepProductGroupConfig.isCutPieceAllowed',
        'pw.tepProductGroupConfig.isInterBrandAllowed',
        'pw.tepProductGroupConfig.typeOfExchange',
        'pw.tepProductGroupConfig.isProportio nedValue',
        'pw.tepProductGroupConfig.discountRecoveryPercent',
        'pw.tepProductGroupConfig.remove',
        'pw.tepProductGroupConfig.isCmDeductionApplicable',
        'pw.tepProductGroupConfig.cmDeductionApplicable'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.configNameTranslate =
          translatedMsg['pw.tepProductGroupConfig.configName'];
        this.productGroupsTranslate =
          translatedMsg['pw.tepProductGroupConfig.productGroups'];
        this.tepAllowedTranslate =
          translatedMsg['pw.tepProductGroupConfig.tepAllowed'];
        this.goldDedPercentTranslate =
          translatedMsg['pw.tepProductGroupConfig.goldDedPercent'];
        this.silverDedPercentTranslate =
          translatedMsg['pw.tepProductGroupConfig.silverDedPercent'];
        this.platinumDedPercentTranslate =
          translatedMsg['pw.tepProductGroupConfig.platinumDedPercent'];
        this.ucpDedPercentTranslate =
          translatedMsg['pw.tepProductGroupConfig.ucpDedPercent'];
        this.ucpDedFlatTranslate =
          translatedMsg['pw.tepProductGroupConfig.ucpDedFlat'];
        this.stoneChargesApplicableTranslate =
          translatedMsg['pw.tepProductGroupConfig.stoneChargesApplicable'];
        this.stoneValueDeductionPercentTranslate =
          translatedMsg['pw.tepProductGroupConfig.stoneValueDeductionPercent'];
        this.cmMandatoryTranslate =
          translatedMsg['pw.tepProductGroupConfig.cmMandatory'];
        this.dedPercentCMUnavailTranslate =
          translatedMsg['pw.tepProductGroupConfig.dedPercentCMUnavail'];
        this.wtTolerancePercentTranslate =
          translatedMsg['pw.tepProductGroupConfig.wtTolerancePercent'];
        this.transTEPsalebinTranslate =
          translatedMsg['pw.tepProductGroupConfig.transTEPsalebin'];
        this.refundDedPercentTranslate =
          translatedMsg['pw.tepProductGroupConfig.refundDedPercent'];
        this.fullValueTEPTranslate =
          translatedMsg['pw.tepProductGroupConfig.fullValueTEP'];
        this.fullValueTEPDedPercentTranslate =
          translatedMsg['pw.tepProductGroupConfig.fullValueTEPDedPercent'];
        this.isAllowedToEditQuantityTranslate =
          translatedMsg['pw.tepProductGroupConfig.isAllowedToEditQuantity'];
        this.isCutPieceAllowedTranslate =
          translatedMsg['pw.tepProductGroupConfig.isCutPieceAllowed'];
        this.isInterBrandAllowedTranslate =
          translatedMsg['pw.tepProductGroupConfig.isInterBrandAllowed'];
        this.typeOfExchangeTranslate =
          translatedMsg['pw.tepProductGroupConfig.typeOfExchange'];
        this.discountRecoveryPercentTranslate =
          translatedMsg['pw.tepProductGroupConfig.discountRecoveryPercent'];
        this.isProportionedValueTranslate =
          translatedMsg['pw.tepProductGroupConfig.isProportionedValue'];
        this.removeTranslate = translatedMsg['pw.tepProductGroupConfig.remove'];
        this.isCmDeductionAllowed =
          translatedMsg['pw.tepProductGroupConfig.isCmDeductionApplicable'];
        this.cmDeductionPercent =
          translatedMsg['pw.tepProductGroupConfig.cmDeductionApplicable'];
      });
  }

  @Input() tepProductGroupConfigDetails: TEPProductGroupConfigDetails;
  @Input() tepProductGroupMappingList$: Observable<
    TEPProductGroupMappingDetails[]
  >;
  @Input() totalElements: number;
  // @Input() pageEvent: PageEvent;
  // @Input() pageSize: number[];
  @Input() updated$: Observable<boolean>;

  @Output() tepProductGroupConfigDetailsFormOutput = new EventEmitter<
    TEPProductGroupConfigDetails
  >();
  @Output() openProductGroupMapping = new EventEmitter<boolean>();
  @Output() removeProductGroupMapping = new EventEmitter<{
    id: string;
    productGroupCode: string;
  }>();
  @Output() openLocationMappingEvent = new EventEmitter<boolean>();
  @Output() productGroupCodeGridSearch = new EventEmitter<string>();
  @Output() clearGridSearch = new EventEmitter<boolean>();
  // @Output() paginator = new EventEmitter<PageEvent>();
  @Output() editGridValue = new EventEmitter<TEPProductGroupMappingGridData>();

  defaultColDef = {
    wrapText: true,
    autoHeight: true,
    suppressMovable: true
  };

  // pageSizeOptions: number[] = [];
  // minPageSize = 0;

  tepProductGroupConfigDetailsForm: FormGroup;

  destroy$: Subject<null> = new Subject<null>();

  hasSelectedRow = false;
  disabled = true;
  checked = false;

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });

  // Ag Grid
  gridAPI: GridApi;
  columnDefs = [];
  rowData = [];
  domLayout = 'autoHeight';
  rowHeight = 35;
  animateRows = true;
  context = this;
  themeCodesColumnDefs = [];
  itemCodeColumnDefs = [];
  tepProductGroupMappingGridData: TEPProductGroupMappingGridData[] = [];
  selectedConfig: TEPProductGroupMappingGridData;
  // Ag Grid end

  ngOnChanges() {
    if (this.tepProductGroupConfigDetails.configId) {
      this.disabled = false;
    }
  }

  formatToolTip(params: any) {
    return params;
  }

  changeEvent(event) {
    this.tepProductGroupConfigDetailsForm.markAsDirty();
    this.checked = event.checked;
  }

  ngOnInit(): void {
    // this.pageSizeOptions = this.pageSize;
    /* this.minPageSize = this.pageSizeOptions.reduce(
      (set1: number, set2: number) => (set1 < set2 ? set1 : set2)
    ); */

    this.checked = this.tepProductGroupConfigDetails?.isActive;

    this.updated$.pipe(takeUntil(this.destroy$)).subscribe(updated => {
      if (updated) {
        this.searchForm?.reset();
      }
    });

    this.tepProductGroupConfigDetailsForm = new FormGroup({
      configName: new FormControl(
        this.tepProductGroupConfigDetails?.description || '',
        [
          this.fieldValidatorsService.requiredField(this.configNameTranslate),
          this.fieldValidatorsService.descriptionField(
            this.configNameTranslate
          ),
          this.fieldValidatorsService.maxLength(100, this.configNameTranslate)
        ]
      )
    });
    this.setGrid();

    this.tepProductGroupMappingList$
      .pipe(takeUntil(this.destroy$))
      .subscribe(tepProductGroupMappingList => {
        this.hasSelectedRow = false;
        this.tepProductGroupMappingGridData = [];
        tepProductGroupMappingList.forEach(data => {
          this.tepProductGroupMappingGridData.push({
            uuid: data.id,
            productGroups: data.productGroupCode,
            ...data.configDetails.data
          });
        });

        this.gridAPI?.setRowData(this.tepProductGroupMappingGridData);

        this.cdr.detectChanges();
      });
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.searchForm.value.searchValue;

        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }
  search(searchValue: string) {
    this.productGroupCodeGridSearch.emit(searchValue);
  }
  clearSearch() {
    this.searchForm.reset();
    this.clearGridSearch.emit(true);
  }

  // Ag Grid
  getContext() {
    return {
      validators: [],
      disableCheckBox: true,
      componentParent: this.component
    };
  }

  gridReady(params: GridReadyEvent) {
    this.gridAPI = params.api;
  }

  setGrid() {
    this.themeCodesColumnDefs = [
      {
        checkboxSelection: true,
        minWidth: 35,
        width: 40,
        pinned: 'left',
        suppressMovable: true,
        lockPinned: true
      },
      {
        headerName: this.productGroupsTranslate, //'Product Groups',
        field: 'productGroups',
        minWidth: 105,
        width: 105,
        resizable: true,
        suppressMovable: true,
        pinned: 'left',
        lockPinned: true
      },
      {
        headerName: this.tepAllowedTranslate, // 'TEP Allowed',
        field: 'isTepAllowed',
        minWidth: 90,
        width: 90,
        resizable: true,
        suppressMovable: true,
        cellRendererFramework: CheckboxCellComponent
      },
      {
        headerName: this.goldDedPercentTranslate, // 'Gold Ded. %',
        field: 'goldDeductionPercent',
        minWidth: 115,
        width: 115,
        resizable: true,
        suppressMovable: true
      },
      {
        headerName: this.silverDedPercentTranslate, // 'Silver Ded. %',
        field: 'silverDeductionPercent',
        minWidth: 120,
        width: 120,
        resizable: true,
        suppressMovable: true
      },
      {
        headerName: this.platinumDedPercentTranslate, //'Platinum  Ded. %',
        field: 'platinumDeductionPercent',
        minWidth: 140,
        width: 140,
        resizable: true,
        suppressMovable: true
      },
      {
        headerName: this.ucpDedPercentTranslate, // 'UCP Ded. %',
        field: 'ucpDeductionPercent',
        minWidth: 120,
        width: 120,
        resizable: true,
        suppressMovable: true
      },
      {
        headerName: this.ucpDedFlatTranslate, //'UCP Ded. (Flat)',
        field: 'ucpDeductionFlatValue',
        minWidth: 120,
        width: 120,
        resizable: true,
        suppressMovable: true
      },
      {
        headerName: this.stoneChargesApplicableTranslate, //'Stone charges Applicable',
        field: 'isStoneChargesApplicable',
        minWidth: 160,
        width: 160,
        resizable: true,
        suppressMovable: true,
        cellRendererFramework: CheckboxCellComponent
      },
      {
        headerName: this.stoneValueDeductionPercentTranslate, //'Stone Value Deduction %',
        field: 'stoneDeductionPercent',
        minWidth: 155,
        width: 155,
        resizable: true,
        suppressMovable: true
      },
      {
        headerName: this.cmMandatoryTranslate, // 'CM Mandatory',
        field: 'isCMMandatory',
        minWidth: 100,
        width: 100,
        resizable: true,
        suppressMovable: true,
        cellRendererFramework: CheckboxCellComponent
      },
      {
        headerName: this.dedPercentCMUnavailTranslate, //'Ded. %(CM Unavail)',
        field: 'cmUnavailableDeductionPercent',
        minWidth: 150,
        width: 100,
        resizable: true,
        suppressMovable: true
      },
      {
        headerName: this.wtTolerancePercentTranslate, // 'Wt. Tolerance %',
        field: 'weightTolerancePercent',
        minWidth: 115,
        width: 115,
        resizable: true,
        suppressMovable: true
      },
      {
        headerName: this.transTEPsalebinTranslate, // 'Trans TEP sale bin',
        field: 'isTEPSaleBin',
        minWidth: 115,
        width: 115,
        resizable: true,
        suppressMovable: true,
        cellRendererFramework: CheckboxCellComponent
      },
      {
        headerName: this.refundDedPercentTranslate, //'Refund Ded. %',
        field: 'refundDeductionPercent',
        minWidth: 120,
        width: 120,
        resizable: true,
        suppressMovable: true
      },
      {
        headerName: this.fullValueTEPTranslate, // 'Full Value TEP',
        field: 'isFVTAllowed',
        minWidth: 120,
        width: 120,
        resizable: true,
        suppressMovable: true,
        cellRendererFramework: CheckboxCellComponent
      },
      {
        headerName: this.fullValueTEPDedPercentTranslate, // 'Full Value TEP Ded. %',
        field: 'fvtDeductionPercent',
        minWidth: 165,
        width: 165,
        resizable: true,
        suppressMovable: true
      },
      {
        headerName: this.isCutPieceAllowedTranslate, // 'Is Cut Piece Allowed',
        field: 'isCutPieceTepAllowed',
        minWidth: 130,
        width: 130,
        resizable: true,
        suppressMovable: true,
        cellRendererFramework: CheckboxCellComponent
      },
      {
        headerName: this.isInterBrandAllowedTranslate, // 'Is Inter Brand Allowed',
        field: 'isInterBrandTepAllowed',
        minWidth: 140,
        width: 140,
        resizable: true,
        suppressMovable: true,
        cellRendererFramework: CheckboxCellComponent
      },
      {
        headerName: this.typeOfExchangeTranslate, //'Type Of Exchange',
        field: 'typeOfExchange',
        minWidth: 150,
        width: 100,
        resizable: true,
        suppressMovable: true
      },
      {
        headerName: this.discountRecoveryPercentTranslate, //'Discount recovery %',
        field: 'recoverDiscountPercent',
        minWidth: 160,
        width: 160,
        resizable: true,
        suppressMovable: true
      },
      {
        headerName: this.isProportionedValueTranslate, //'Is proportioned value',
        field: 'isProportionedValue',
        minWidth: 165,
        width: 165,
        resizable: true,
        suppressMovable: true,
        cellRendererFramework: CheckboxCellComponent
      },
      {
        headerName: this.isCmDeductionAllowed, // 'Full Value TEP',
        field: 'isCmDeductionAllowed',
        minWidth: 120,
        width: 120,
        resizable: true,
        suppressMovable: true,
        cellRendererFramework: CheckboxCellComponent
      },
      {
        headerName: this.cmDeductionPercent, // 'Full Value TEP Ded. %',
        field: 'cmDeductionPercent',
        minWidth: 165,
        width: 165,
        resizable: true,
        suppressMovable: true
      },
      {
        headerName: '', // 'Remove',
        field: 'id',
        cellRenderer: 'deleteRowRenderer',
        width: 21,
        minWidth: 21,
        maxWidth: 21,
        cellClass: 'pw-delete-icon-width',
        headerClass: 'pw-delete-icon-width'
      }
    ];

    this.sortService.DataSource = [
      {
        id: 0,
        sortByColumnName: this.productGroupsTranslate,
        sortAscOrder: false
      }
    ];
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
      this.openConfirmDialogForDelete(event);
    }
  }

  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
  }

  focusOut(event) {
    this.isFocusing = false;
  }

  openConfirmDialogForDelete(event: any) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.tepProductGroupConfig.areYouSureToRemove'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res === true) {
          this.removeProductGroupMapping.emit({
            id: this.tepProductGroupMappingGridData[event.rowIndex].uuid,
            productGroupCode: this.tepProductGroupMappingGridData[
              event.rowIndex
            ].productGroups
          });
        }
      });
  }

  onGridSizeChanged(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
  }

  selectionChanged(grid) {
    if (grid.api.getSelectedRows().length) {
      this.selectedConfig = grid.api.getSelectedRows()[0];
      this.hasSelectedRow = true;
    } else {
      this.hasSelectedRow = false;
    }
  }

  paginator(event: any) {
    this.gridAPI.paginationSetPageSize(event.pageSize);
    this.gridAPI.paginationGoToPage(event.pageIndex);
  }

  // Ag Grid End

  onSubmit() {
    if (
      this.tepProductGroupConfigDetails?.description !== '' &&
      !this.tepProductGroupConfigDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      if (this.tepProductGroupConfigDetailsForm.valid) {
        this.tepProductGroupConfigDetailsForm.markAsPristine();
        const formData = this.tepProductGroupConfigDetailsForm.getRawValue();
        const data: TEPProductGroupConfigDetails = {
          configId: this.tepProductGroupConfigDetails.configId,
          description: formData.configName,
          itemCode: null,
          configDetails: {
            data: null,
            type: null
          },
          configType: 'TEP_ITEM',
          startDate: formData.fromDate,
          endDate: formData.toDate,
          isActive: this.checked,
          customerMobileNos: this.tepProductGroupConfigDetails
            .customerMobileNos,
          isOfferEnabled: null,
          offerDetails: {
            type: null,
            data: null
          }
        };

        this.tepProductGroupConfigDetailsFormOutput.emit(data);
      }
    }
  }

  editValue() {
    if (
      this.tepProductGroupConfigDetails?.description !== '' &&
      !this.tepProductGroupConfigDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else this.editGridValue.emit(this.selectedConfig);
  }

  emitProductGroupMapping() {
    if (
      this.tepProductGroupConfigDetails?.description !== '' &&
      !this.tepProductGroupConfigDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.openProductGroupMapping.emit(true);
    }
  }
  showMessage(key: string) {
    this.translationService
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

  openLocationMapping() {
    if (
      this.tepProductGroupConfigDetails?.description !== '' &&
      !this.tepProductGroupConfigDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else this.openLocationMappingEvent.emit(true);
  }

  openSortDailog() {
    this.dialog.closeAll();
    this.sortService
      .openDialog(this.maxSortLimit, this.sortData)
      .pipe(take(1))
      .subscribe((sortResult: { data: Column[]; actionfrom: string }) => {
        this.sort = [];
        if (sortResult.actionfrom === 'apply') {
          const sortData = sortResult.data;
          if (sortData == null || sortData.length === 0) {
            this.sortData = [];
            this.sortOrder = null;
            this.sortBy = null;
          } else {
            this.sortData = sortData;
            if (sortData.length > 0) {
              this.sortData.forEach(sort => {
                switch (sort.id) {
                  case 0:
                    this.sortBy = 'productGroupCode';
                    break;
                    Default: break;
                }
                if (sort.id === 0) {
                  this.sortBy = 'productGroupCode';
                }
                this.sortOrder = sort.sortAscOrder ? 'asc' : 'desc';
                this.sort = [...this.sort, this.sortBy + ',' + this.sortOrder];
              });
            }
          }
          this.sortEmitter.emit(this.sort);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
