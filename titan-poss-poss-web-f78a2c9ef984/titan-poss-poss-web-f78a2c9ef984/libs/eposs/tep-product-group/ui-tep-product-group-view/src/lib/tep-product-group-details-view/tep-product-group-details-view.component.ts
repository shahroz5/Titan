import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  TEPProductGroupMappingDetails,
  TEPProductGroupMappingGridData
} from '@poss-web/shared/models';
import {
  CheckboxCellComponent,
  DeleteRowComponent
} from '@poss-web/shared/components/ui-ag-grid';
import { fromEvent, Observable, Subject } from 'rxjs';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import {
  SortDialogService,
  Column
} from '@poss-web/shared/components/ui-sort-dialog';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'poss-web-tep-product-group-details-view',
  templateUrl: './tep-product-group-details-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TepProductGroupDetailsViewComponent implements OnInit, OnDestroy {
  destroy$: Subject<null> = new Subject<null>();
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
  fullValueTEPTranslate: string;
  fullValueTEPDedPercentTranslate: string;
  isAllowedToEditQuantityTranslate: string;
  isCutPieceAllowedTranslate: string;
  isInterBrandAllowedTranslate: string;
  typeOfExchangeTranslate: string;
  discountRecoveryPercentTranslate: string;
  isProportionedValueTranslate: string;
  removeTranslate: string;

  constructor(
    private translationService: TranslateService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private sortService: SortDialogService,
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
        'pw.tepProductGroupConfig.isProportionedValue',
        'pw.tepProductGroupConfig.discountRecoveryPercent',
        'pw.tepProductGroupConfig.remove'
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
      });
  }

  @Input() tepProductGroupMappingList$: Observable<
    TEPProductGroupMappingDetails[]
  >;
  @Input() totalElements: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSize: number[];
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() sortEmitter = new EventEmitter<string[]>();
  @Output() productGroupCodeGridSearch = new EventEmitter<string>();
  @Output() clearGridSearch = new EventEmitter<boolean>();

  pageSizeOptions: number[] = [];
  minPageSize = 0;
  tepProductGroupMappingGridData: TEPProductGroupMappingGridData[] = [];

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
  // Ag Grid end

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });

  maxSortLimit = 2;

  sortData: Column[] = [];
  sortBy: string;
  sortOrder: string;
  sort: string[] = [];

  ngOnInit(): void {
    this.pageSizeOptions = this.pageSize;
    this.minPageSize = this.pageSizeOptions.reduce(
      (set1: number, set2: number) => (set1 < set2 ? set1 : set2)
    );
    this.setGrid();
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

  defaultColDef = {
    wrapText: true,
    autoHeight: true,
    suppressMovable: true
  };

  // Ag Grid
  getContext() {
    return {
      validators: [],
      disableCheckBox: true
    };
  }

  gridReady(params: GridReadyEvent) {
    this.gridAPI = params.api;
    this.tepProductGroupMappingList$
      .pipe(takeUntil(this.destroy$))
      .subscribe(tepProductGroupMappingList => {
        this.tepProductGroupMappingGridData = [];
        tepProductGroupMappingList.forEach(data => {
          this.tepProductGroupMappingGridData.push({
            uuid: data.id,
            productGroups: data.productGroupCode,
            ...data.configDetails.data
          });
        });

        this.gridAPI?.setRowData(this.tepProductGroupMappingGridData);
      });
  }

  setGrid() {
    this.themeCodesColumnDefs = [
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
              this.sortData.forEach(sort=>{
                switch(sort.id)
                {
                  case 0: this.sortBy = 'productGroupCode';
                    break;
                  Default: break;
                }
                if (sort.id === 0) {
                  this.sortBy = 'productGroupCode';
                }
                this.sortOrder = sort.sortAscOrder ? 'asc' : 'desc';
                this.sort = [...this.sort, this.sortBy + ',' + this.sortOrder];
              })
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
