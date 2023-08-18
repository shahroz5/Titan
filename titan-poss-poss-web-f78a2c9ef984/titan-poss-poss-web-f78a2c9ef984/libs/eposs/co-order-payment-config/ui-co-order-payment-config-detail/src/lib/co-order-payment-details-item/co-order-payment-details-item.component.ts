import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import {
  ProductGroup,
  CoOrderPaymentsRequest,
  ProductGroupMappingServiceAbstraction,
  CoOrderPaymentResponse,
  ProductGroupMappingFormType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  ConfigTypeEnum,
  ShortcutServiceAbstraction
} from '@poss-web/shared/models';
import { Subject, fromEvent } from 'rxjs';
import { FormArray, FormGroup, FormControl } from '@angular/forms';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {
  SortDialogService,
  Column
} from '@poss-web/shared/components/ui-sort-dialog';
import {
  FieldValidatorsService,
  fieldValidation
} from '@poss-web/shared/util-field-validators';
import { takeUntil, debounceTime, take } from 'rxjs/operators';
import { DeleteRowComponent } from '@poss-web/shared/components/ui-ag-grid';
import { CoOrderPaymentPopupComponent } from '../co-order-payment-popup/co-order-payment-popup.component';
import { PageEvent } from '@angular/material/paginator';

export const sortShortcutKey = 'CoOrderPaymentDetailsItemComponent.SORT';
const componentName = 'CoOrderPaymentDetailsItemComponent';

@Component({
  selector: 'poss-web-co-order-payment-details-item',
  templateUrl: './co-order-payment-details-item.component.html',
  styleUrls: ['./co-order-payment-details-item.component.scss']
})
export class CoOrderPaymentDetailsItemComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() formData;
  @Input() productGroups: ProductGroup[];
  @Input() coOrderPaymentConfigDetails: CoOrderPaymentResponse[];
  @Input() allCoOrderPaymentConfigDetails: CoOrderPaymentResponse[];
  @Input() coOrderPaymentConfig: any = [];
  @Input() isCleared: boolean;
  @Output() responseEvent = new EventEmitter<CoOrderPaymentsRequest>();
  @Output() removeEvent = new EventEmitter<CoOrderPaymentsRequest>();
  @Output() openLocationMappingPopUp = new EventEmitter<boolean>();

  @Input() pageEvent: PageEvent;
  @Input() totalCount: number;
  @Input() pageSize: number[];
  @Input() selectedConfigDetails;

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() searchProductGroup = new EventEmitter<any>();
  @Output() clearProductGroupSearch = new EventEmitter<boolean>();

  selectedProductGroups = [];
  gridApi: GridApi;
  formGroup: FormGroup = new FormGroup({});
  parentForm: FormArray = new FormArray([]);
  addedProductGroups: any[] = [];
  removeProductGroups: any[] = [];
  configId: string;
  columnDefs = [];
  destroy$: Subject<null> = new Subject<null>();
  disableEdit = true;

  productGroupCodeLabel: string;
  frozenMetalRate: string;
  nonFrozenMetalRate: string;
  bestRate: string;

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  defaultColDef = {
    suppressMovable: false
  };
  pageSizeOptions = [];
  minPageSize: number;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;
  maxSortLimit = 1;

  @Output() sortEmitter = new EventEmitter<string[]>();

  sortData: Column[] = [];
  sortBy: string;
  sortOrder: string;
  sort: string[] = [];

  constructor(
    private translate: TranslateService,
    private productGroupMappingServiceAbstraction: ProductGroupMappingServiceAbstraction,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private fieldValidatorsService: FieldValidatorsService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private sortService: SortDialogService,
    private shortcutService: ShortcutServiceAbstraction
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes && changes['productGroups']) ||
      changes['coOrderPaymentConfig'] ||
      changes['coOrderPaymentConfigDetails']
    ) {
      this.disableEdit = true;

      this.parentForm.clear();
      this.coOrderPaymentConfigDetails.forEach(item => {
        this.createFormControls(item);
      });
      if (this.gridApi) {
        this.gridApi.setRowData(this.coOrderPaymentConfigDetails);
      }
      this.cdr.markForCheck();
    }
    if (changes && changes['allCoOrderPaymentConfigDetails']) {
      this.selectedProductGroups = this.allCoOrderPaymentConfigDetails.map(
        selectedProductGroups => ({
          id: selectedProductGroups.productGroupCode,
          uuid: selectedProductGroups.id
        })
      );
    }
  }

  ngOnInit() {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(param => {
        this.configId = param['_configId'];
        this.cdr.markForCheck();
      });
    this.pageSizeOptions = this.pageSize;
    this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
    this.translate
      .get([
        'pw.coOrderPaymentConfig.productGroup',
        'pw.coOrderPaymentConfig.description'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: 30,
            minWidth: 30,
            suppressMovable: true
          },
          {
            headerName:
              translatedMessages['pw.coOrderPaymentConfig.productGroup'],
            field: 'productGroupCode',
            width: 150,
            minWidth: 100,
            suppressMovable: true,
            lockPinned: true
          },
          {
            headerName:
              translatedMessages['pw.coOrderPaymentConfig.description'],
            field: 'description',
            editable: false,
            width: 250,
            minWidth: 200,
            suppressMovable: true,
            valueFormatter: params => {
              let range = '';

              this.productGroups.forEach(productGroup => {
                if (
                  productGroup.productGroupCode === params.data.productGroupCode
                ) {
                  range = productGroup.description;
                }
              });

              return range;
            }
          },
          {
            headerName: 'IBT',
            children: [
              {
                headerName: 'Frozen Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'ibtMetalRateFrozenPercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'ibtMetalRateFrozenPercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              },
              {
                headerName: 'Non Frozen Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'ibtMetalRateNonFrozenPercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'ibtMetalRateNonFrozenPercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              },
              {
                headerName: 'Best Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'ibtBestRatePercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'ibtBestRatePercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              }
            ]
          },
          {
            headerName: 'MTR',
            children: [
              {
                headerName: 'Frozen Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'mtrMetalRateFrozenPercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'mtrMetalRateFrozenPercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              },
              {
                headerName: 'Non Frozen Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'mtrMetalRateNonFrozenPercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'mtrMetalRateNonFrozenPercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              },
              {
                headerName: 'Best Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'mtrBestRatePercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'mtrBestRatePercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              }
            ]
          },
          {
            headerName: 'PROD',
            children: [
              {
                headerName: 'Frozen Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'prodMetalRateFrozenPercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'prodMetalRateFrozenPercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              },
              {
                headerName: 'Non Frozen Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'prodMetalRateNonFrozenPercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'prodMetalRateNonFrozenPercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              },
              {
                headerName: 'Best Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'prodBestRatePercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'prodBestRatePercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              }
            ]
          },
          {
            headerName: 'COM',
            children: [
              {
                headerName: 'Frozen Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'comMetalRateFrozenPercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'comMetalRateFrozenPercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              },
              {
                headerName: 'Non Frozen Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'comMetalRateNonFrozenPercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'comMetalRateNonFrozenPercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              },
              {
                headerName: 'Best Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'comBestRatePercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'comBestRatePercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              }
            ]
          },
          {
            headerName: 'Auto Approval',
            children: [
              {
                headerName: 'Frozen Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'autoApprovalFrozenPercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'autoApprovalFrozenPercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              },
              {
                headerName: 'Non Frozen Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'autoApprovalNonFrozenPercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'autoApprovalNonFrozenPercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              },
              {
                headerName: 'Best Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'autoApprovalBestRatePercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'autoApprovalBestRatePercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              }
            ]
          },

          {
            headerName: '',
            width: 40,
            minWidth: 40,
            maxWidth: 40,
            cellClass: 'pw-delete-icon-width',
            headerClass: 'pw-delete-icon-width',
            cellRenderer: 'deleteRowRenderer',
            suppressRowClickSelection: 'true',
            onCellClicked: this.remove.bind(this)
          }
        ];

        this.productGroupCodeLabel =
          translatedMessages['pw.coOrderPaymentConfig.productGroup'];
      });

    this.translate
      .get(['pw.coOrderPaymentConfig.productGroup'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.sortService.DataSource = [
          {
            id: 0,
            sortByColumnName:
              translatedMessages['pw.coOrderPaymentConfig.productGroup'],
            sortAscOrder: false
          }
        ];
      });
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

  getComponents() {
    return {
      deleteRowRenderer: DeleteRowComponent
    };
  }

  onSave() {
    if (
      this.selectedConfigDetails?.description &&
      !this.selectedConfigDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.responseEvent.emit(this.prepareResponse());
      this.parentForm.reset();
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

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.gridApi.sizeColumnsToFit();
    }
  }

  getAllRows() {
    const rowData = [];
    this.gridApi.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  search(searchValue) {
    if (fieldValidation.productCodeField.pattern.test(searchValue.trim())) {
      this.searchProductGroup.emit(searchValue.trim());
    } else {
      this.gridApi.setRowData([]);
    }
  }

  clearSearch() {
    this.searchForm.reset();
    this.clearProductGroupSearch.emit();
  }

  prepareResponse() {
    const addArray = [];
    const updateArray = [];
    for (const value of this.parentForm.value) {
      if (value.id === '') {
        addArray.push({
          productGroupCode: value.productGroupCode,
          ruleDetails: {
            data: {
              ibt: {
                gold: {
                  metalRateFrozenPercent:
                    value.ibtMetalRateFrozenPercentforGold,
                  metalRateNonFrozenPercent:
                    value.ibtMetalRateNonFrozenPercentforGold,
                  bestRatePercent: value.ibtBestRatePercentforGold
                },
                platinum: {
                  metalRateFrozenPercent:
                    value.ibtMetalRateFrozenPercentforPlatinum,
                  metalRateNonFrozenPercent:
                    value.ibtMetalRateNonFrozenPercentforPlatinum,
                  bestRatePercent: value.ibtBestRatePercentforPlatinum
                }
              },
              mtr: {
                gold: {
                  metalRateFrozenPercent:
                    value.mtrMetalRateFrozenPercentforGold,
                  metalRateNonFrozenPercent:
                    value.mtrMetalRateNonFrozenPercentforGold,
                  bestRatePercent: value.mtrBestRatePercentforGold
                },
                platinum: {
                  metalRateFrozenPercent:
                    value.mtrMetalRateFrozenPercentforPlatinum,
                  metalRateNonFrozenPercent:
                    value.mtrMetalRateNonFrozenPercentforPlatinum,
                  bestRatePercent: value.mtrBestRatePercentforPlatinum
                }
              },
              prod: {
                gold: {
                  metalRateFrozenPercent:
                    value.prodMetalRateFrozenPercentforGold,
                  metalRateNonFrozenPercent:
                    value.prodMetalRateNonFrozenPercentforGold,
                  bestRatePercent: value.prodBestRatePercentforGold
                },
                platinum: {
                  metalRateFrozenPercent:
                    value.prodMetalRateFrozenPercentforPlatinum,
                  metalRateNonFrozenPercent:
                    value.prodMetalRateNonFrozenPercentforPlatinum,
                  bestRatePercent: value.prodBestRatePercentforPlatinum
                }
              },
              com: {
                gold: {
                  metalRateFrozenPercent:
                    value.comMetalRateFrozenPercentforGold,
                  metalRateNonFrozenPercent:
                    value.comMetalRateNonFrozenPercentforGold,
                  bestRatePercent: value.comBestRatePercentforGold
                },
                platinum: {
                  metalRateFrozenPercent:
                    value.comMetalRateFrozenPercentforPlatinum,
                  metalRateNonFrozenPercent:
                    value.comMetalRateNonFrozenPercentforPlatinum,
                  bestRatePercent: value.comBestRatePercentforPlatinum
                }
              },
              autoApproval: {
                gold: {
                  metalRateFrozenPercent:
                    value.autoApprovalFrozenPercentforGold,
                  metalRateNonFrozenPercent:
                    value.autoApprovalNonFrozenPercentforGold,
                  bestRatePercent: value.autoApprovalBestRatePercentforGold
                },
                platinum: {
                  metalRateFrozenPercent:
                    value.autoApprovalFrozenPercentforPlatinum,
                  metalRateNonFrozenPercent:
                    value.autoApprovalNonFrozenPercentforPlatinum,
                  bestRatePercent: value.autoApprovalBestRatePercentforPlatinum
                }
              }
            },
            type: ConfigTypeEnum.ORDER_CO_PAYMENT_CONFIG
          }
        });
      } else if (
        value.id !== '' &&
        value.id !== undefined &&
        value.id !== null
      ) {
        updateArray.push({
          rangeId: value.rangeId,
          id: value.id,
          ruleDetails: {
            data: {
              ibt: {
                gold: {
                  metalRateFrozenPercent:
                    value.ibtMetalRateFrozenPercentforGold,
                  metalRateNonFrozenPercent:
                    value.ibtMetalRateNonFrozenPercentforGold,
                  bestRatePercent: value.ibtBestRatePercentforGold
                },
                platinum: {
                  metalRateFrozenPercent:
                    value.ibtMetalRateFrozenPercentforPlatinum,
                  metalRateNonFrozenPercent:
                    value.ibtMetalRateNonFrozenPercentforPlatinum,
                  bestRatePercent: value.ibtBestRatePercentforPlatinum
                }
              },
              mtr: {
                gold: {
                  metalRateFrozenPercent:
                    value.mtrMetalRateFrozenPercentforGold,
                  metalRateNonFrozenPercent:
                    value.mtrMetalRateNonFrozenPercentforGold,
                  bestRatePercent: value.mtrBestRatePercentforGold
                },
                platinum: {
                  metalRateFrozenPercent:
                    value.mtrMetalRateFrozenPercentforPlatinum,
                  metalRateNonFrozenPercent:
                    value.mtrMetalRateNonFrozenPercentforPlatinum,
                  bestRatePercent: value.mtrBestRatePercentforPlatinum
                }
              },
              prod: {
                gold: {
                  metalRateFrozenPercent:
                    value.prodMetalRateFrozenPercentforGold,
                  metalRateNonFrozenPercent:
                    value.prodMetalRateNonFrozenPercentforGold,
                  bestRatePercent: value.prodBestRatePercentforGold
                },
                platinum: {
                  metalRateFrozenPercent:
                    value.prodMetalRateFrozenPercentforPlatinum,
                  metalRateNonFrozenPercent:
                    value.prodMetalRateNonFrozenPercentforPlatinum,
                  bestRatePercent: value.prodBestRatePercentforPlatinum
                }
              },
              com: {
                gold: {
                  metalRateFrozenPercent:
                    value.comMetalRateFrozenPercentforGold,
                  metalRateNonFrozenPercent:
                    value.comMetalRateNonFrozenPercentforGold,
                  bestRatePercent: value.comBestRatePercentforGold
                },
                platinum: {
                  metalRateFrozenPercent:
                    value.comMetalRateFrozenPercentforPlatinum,
                  metalRateNonFrozenPercent:
                    value.comMetalRateNonFrozenPercentforPlatinum,
                  bestRatePercent: value.comBestRatePercentforPlatinum
                }
              },
              autoApproval: {
                gold: {
                  metalRateFrozenPercent:
                    value.autoApprovalFrozenPercentforGold,
                  metalRateNonFrozenPercent:
                    value.autoApprovalNonFrozenPercentforGold,
                  bestRatePercent: value.autoApprovalBestRatePercentforGold
                },
                platinum: {
                  metalRateFrozenPercent:
                    value.autoApprovalFrozenPercentforPlatinum,
                  metalRateNonFrozenPercent:
                    value.autoApprovalNonFrozenPercentforPlatinum,
                  bestRatePercent: value.autoApprovalBestRatePercentforPlatinum
                }
              }
            },
            type: ConfigTypeEnum.ORDER_CO_PAYMENT_CONFIG
          }
        });
      }
    }

    return {
      addProducts: addArray,
      updateProducts: updateArray
    };
  }

  createFormControls(rowNode) {
    this.formGroup = new FormGroup({});
    this.formGroup = new FormGroup({
      description: new FormControl(rowNode.description),
      productGroupCode: new FormControl(
        rowNode.productGroupCode,
        this.fieldValidatorsService.requiredField(this.productGroupCodeLabel)
      ),
      ibtMetalRateFrozenPercentforGold: new FormControl(
        rowNode.ibtMetalRateFrozenPercentforGold,
        [
          this.fieldValidatorsService.requiredField(
            'Metal Frozen Rate Percent for Gold'
          )
        ]
      ),
      ibtMetalRateFrozenPercentforPlatinum: new FormControl(
        rowNode.ibtMetalRateFrozenPercentforPlatinum,
        [
          this.fieldValidatorsService.requiredField(
            'Metal Frozen Rate Percent for Platinum'
          )
        ]
      ),
      ibtMetalRateNonFrozenPercentforGold: new FormControl(
        rowNode.ibtMetalRateNonFrozenPercentforGold,
        [
          this.fieldValidatorsService.requiredField(
            'Metal Non Frozen Rate Percent for Gold'
          )
        ]
      ),
      ibtMetalRateNonFrozenPercentforPlatinum: new FormControl(
        rowNode.ibtMetalRateNonFrozenPercentforPlatinum,
        [
          this.fieldValidatorsService.requiredField(
            'Metal Non Frozen Rate Percent for Platinum'
          )
        ]
      ),
      ibtBestRatePercentforGold: new FormControl(
        rowNode.ibtBestRatePercentforGold,
        [this.fieldValidatorsService.requiredField('Best Gold Rate Percent')]
      ),
      ibtBestRatePercentforPlatinum: new FormControl(
        rowNode.ibtBestRatePercentforPlatinum,
        [
          this.fieldValidatorsService.requiredField(
            'Best Platinum Rate Percent'
          )
        ]
      ),
      mtrMetalRateFrozenPercentforGold: new FormControl(
        rowNode.mtrMetalRateFrozenPercentforGold,
        [
          this.fieldValidatorsService.requiredField(
            'Metal Frozen Rate Percent for Gold'
          )
        ]
      ),
      mtrMetalRateFrozenPercentforPlatinum: new FormControl(
        rowNode.mtrMetalRateFrozenPercentforPlatinum,
        [
          this.fieldValidatorsService.requiredField(
            'Metal Frozen Rate Percent for Platinum'
          )
        ]
      ),
      mtrMetalRateNonFrozenPercentforGold: new FormControl(
        rowNode.mtrMetalRateNonFrozenPercentforGold,
        [
          this.fieldValidatorsService.requiredField(
            'Metal Non Frozen Rate Percent for Gold'
          )
        ]
      ),
      mtrMetalRateNonFrozenPercentforPlatinum: new FormControl(
        rowNode.mtrMetalRateNonFrozenPercentforPlatinum,
        [
          this.fieldValidatorsService.requiredField(
            'Metal Non Frozen Rate Percent for Platinum'
          )
        ]
      ),
      mtrBestRatePercentforGold: new FormControl(
        rowNode.mtrBestRatePercentforGold,
        [this.fieldValidatorsService.requiredField('Best Gold Rate Percent')]
      ),
      mtrBestRatePercentforPlatinum: new FormControl(
        rowNode.mtrBestRatePercentforPlatinum,
        [
          this.fieldValidatorsService.requiredField(
            'Best Platinum Rate Percent'
          )
        ]
      ),
      prodMetalRateFrozenPercentforGold: new FormControl(
        rowNode.prodMetalRateFrozenPercentforGold,
        [
          this.fieldValidatorsService.requiredField(
            'Metal Frozen Rate Percent for Gold'
          )
        ]
      ),
      prodMetalRateFrozenPercentforPlatinum: new FormControl(
        rowNode.prodMetalRateFrozenPercentforPlatinum,
        [
          this.fieldValidatorsService.requiredField(
            'Metal Frozen Rate Percent for Platinum'
          )
        ]
      ),
      prodMetalRateNonFrozenPercentforGold: new FormControl(
        rowNode.prodMetalRateNonFrozenPercentforGold,
        [
          this.fieldValidatorsService.requiredField(
            'Metal Non Frozen Rate Percent for Gold'
          )
        ]
      ),
      prodMetalRateNonFrozenPercentforPlatinum: new FormControl(
        rowNode.prodMetalRateNonFrozenPercentforPlatinum,
        [
          this.fieldValidatorsService.requiredField(
            'Metal Non Frozen Rate Percent for Platinum'
          )
        ]
      ),
      prodBestRatePercentforGold: new FormControl(
        rowNode.prodBestRatePercentforGold,
        [this.fieldValidatorsService.requiredField('Best Gold Rate Percent')]
      ),
      prodBestRatePercentforPlatinum: new FormControl(
        rowNode.prodBestRatePercentforPlatinum,
        [
          this.fieldValidatorsService.requiredField(
            'Best Platinum Rate Percent'
          )
        ]
      ),
      comMetalRateFrozenPercentforGold: new FormControl(
        rowNode.comMetalRateFrozenPercentforGold,
        [
          this.fieldValidatorsService.requiredField(
            'Metal Frozen Rate Percent for Gold'
          )
        ]
      ),
      comMetalRateFrozenPercentforPlatinum: new FormControl(
        rowNode.comMetalRateFrozenPercentforPlatinum,
        [
          this.fieldValidatorsService.requiredField(
            'Metal Frozen Rate Percent for Platinum'
          )
        ]
      ),
      comMetalRateNonFrozenPercentforGold: new FormControl(
        rowNode.comMetalRateNonFrozenPercentforGold,
        [
          this.fieldValidatorsService.requiredField(
            'Metal Non Frozen Rate Percent for Gold'
          )
        ]
      ),
      comMetalRateNonFrozenPercentforPlatinum: new FormControl(
        rowNode.comMetalRateNonFrozenPercentforPlatinum,
        [
          this.fieldValidatorsService.requiredField(
            'Metal Non Frozen Rate Percent for Platinum'
          )
        ]
      ),
      comBestRatePercentforGold: new FormControl(
        rowNode.comBestRatePercentforGold,
        [this.fieldValidatorsService.requiredField('Best Gold Rate Percent')]
      ),
      comBestRatePercentforPlatinum: new FormControl(
        rowNode.comBestRatePercentforPlatinum,
        [
          this.fieldValidatorsService.requiredField(
            'Best Platinum Rate Percent'
          )
        ]
      ),
      autoApprovalFrozenPercentforGold: new FormControl(
        rowNode.autoApprovalFrozenPercentforGold,
        [
          this.fieldValidatorsService.requiredField(
            'Metal Frozen Rate Percent for Gold'
          )
        ]
      ),
      autoApprovalFrozenPercentforPlatinum: new FormControl(
        rowNode.autoApprovalFrozenPercentforPlatinum,
        [
          this.fieldValidatorsService.requiredField(
            'Metal Frozen Rate Percent for Platinum'
          )
        ]
      ),
      autoApprovalNonFrozenPercentforGold: new FormControl(
        rowNode.autoApprovalNonFrozenPercentforGold,
        [
          this.fieldValidatorsService.requiredField(
            'Metal Non Frozen Rate Percent for Gold'
          )
        ]
      ),
      autoApprovalNonFrozenPercentforPlatinum: new FormControl(
        rowNode.autoApprovalNonFrozenPercentforPlatinum,
        [
          this.fieldValidatorsService.requiredField(
            'Metal Non Frozen Rate Percent for Platinum'
          )
        ]
      ),
      autoApprovalBestRatePercentforGold: new FormControl(
        rowNode.autoApprovalBestRatePercentforGold,
        [this.fieldValidatorsService.requiredField('Best Gold Rate Percent')]
      ),
      autoApprovalBestRatePercentforPlatinum: new FormControl(
        rowNode.autoApprovalBestRatePercentforPlatinum,
        [
          this.fieldValidatorsService.requiredField(
            'Best Platinum Rate Percent'
          )
        ]
      ),
      id: new FormControl(rowNode.id)
    });

    this.parentForm.push(this.formGroup);
  }

  openLocationMapping() {
    if (
      this.selectedConfigDetails?.description &&
      !this.selectedConfigDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.openLocationMappingPopUp.emit(true);
    }
  }

  openProductGroupMapping() {
    if (
      this.selectedConfigDetails?.description &&
      !this.selectedConfigDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.addedProductGroups = [];
      this.productGroupMappingServiceAbstraction
        .openProductGroupMappingWithForm({
          selectedProductGroup: this.selectedProductGroups,
          formType: ProductGroupMappingFormType.CO_ORDER_PAYMENT_CONFIG
        })
        .subscribe(res => {
          if (res) {
            if (res.type === 'apply') {
              if (
                !(
                  res.data.prouctGroups.addedProductGroups.length === 0 &&
                  res.data.prouctGroups.removeProductGroups.length === 0
                )
              ) {
                const addedProductGroups = [];
                const removeProductGroups = [];
                this.selectedProductGroups = this.selectedProductGroups.concat(
                  res.data.prouctGroups.addedProductGroups
                );
                for (const added of res.data.prouctGroups.addedProductGroups) {
                  addedProductGroups.push({
                    id: added.id,
                    description: added.description
                  });
                }
                for (const removed of res.data.prouctGroups
                  .removeProductGroups) {
                  removeProductGroups.push({
                    id: removed.id ? removed.id : '',
                    uuid: removed.uuid ? removed.uuid : ''
                  });
                }
                for (const productGroupCode of addedProductGroups) {
                  this.onAddProductGroupToGrid(
                    productGroupCode,
                    res.data.config
                  );
                }
                let removeArray = [];
                if (removeProductGroups.length) {
                  for (const removedItem of removeProductGroups) {
                    if (removedItem.uuid !== '') {
                      this.selectedProductGroups = this.selectedProductGroups.filter(
                        item => item.uuid === item.uuid
                      );
                      removeArray = removeProductGroups
                        .filter(item => item.uuid)
                        .map(item => item.uuid);
                    } else {
                      this.selectedProductGroups = this.selectedProductGroups.filter(
                        item => item.id === removedItem.id
                      );
                      this.gridApi.applyTransaction({
                        remove: [
                          this.getRowNodeByCellValue(removedItem.id).data
                        ]
                      });
                      this.gridApi.redrawRows();
                    }
                  }
                }
                const addArray = [];

                for (const value of this.parentForm.value) {
                  if (value.id === '') {
                    addArray.push({
                      productGroupCode: value.productGroupCode,
                      ruleDetails: {
                        data: {
                          ibtMetalRateFrozenPercentforGold:
                            value.ibtMetalRateFrozenPercentforGold,
                          ibtMetalRateFrozenPercentforPlatinum:
                            value.ibtMetalRateFrozenPercentforPlatinum,
                          ibtMetalRateNonFrozenPercentforGold:
                            value.ibtMetalRateNonFrozenPercentforGold,
                          ibtMetalRateNonFrozenPercentforPlatinum:
                            value.ibtMetalRateNonFrozenPercentforPlatinum,
                          ibtBestRatePercentforGold:
                            value.ibtBestRatePercentforGold,
                          ibtBestRatePercentforPlatinum:
                            value.ibtBestRatePercentforPlatinum,
                          mtrMetalRateFrozenPercentforGold:
                            value.mtrMetalRateFrozenPercentforGold,
                          mtrMetalRateFrozenPercentforPlatinum:
                            value.mtrMetalRateFrozenPercentforPlatinum,
                          mtrMetalRateNonFrozenPercentforGold:
                            value.mtrMetalRateNonFrozenPercentforGold,
                          mtrMetalRateNonFrozenPercentforPlatinum:
                            value.mtrMetalRateNonFrozenPercentforPlatinum,
                          mtrBestRatePercentforGold:
                            value.mtrBestRatePercentforGold,
                          mtrBestRatePercentforPlatinum:
                            value.mtrBestRatePercentforPlatinum,
                          prodMetalRateFrozenPercentforGold:
                            value.prodMetalRateFrozenPercentforGold,
                          prodMetalRateFrozenPercentforPlatinum:
                            value.prodMetalRateFrozenPercentforPlatinum,
                          prodMetalRateNonFrozenPercentforGold:
                            value.prodMetalRateNonFrozenPercentforGold,
                          prodMetalRateNonFrozenPercentforPlatinum:
                            value.prodMetalRateNonFrozenPercentforPlatinum,
                          prodBestRatePercentforGold:
                            value.prodBestRatePercentforGold,
                          prodBestRatePercentforPlatinum:
                            value.prodBestRatePercentforPlatinum,
                          comMetalRateFrozenPercentforGold:
                            value.comMetalRateFrozenPercentforGold,
                          comMetalRateFrozenPercentforPlatinum:
                            value.comMetalRateFrozenPercentforPlatinum,
                          comMetalRateNonFrozenPercentforGold:
                            value.comMetalRateNonFrozenPercentforGold,
                          comMetalRateNonFrozenPercentforPlatinum:
                            value.comMetalRateNonFrozenPercentforPlatinum,
                          comBestRatePercentforGold:
                            value.comBestRatePercentforGold,
                          comBestRatePercentforPlatinum:
                            value.comBestRatePercentforPlatinum,
                          autoApprovalFrozenPercentforGold:
                            value.autoApprovalFrozenPercentforGold,
                          autoApprovalFrozenPercentforPlatinum:
                            value.autoApprovalFrozenPercentforPlatinum,
                          autoApprovalNonFrozenPercentforGold:
                            value.autoApprovalNonFrozenPercentforGold,
                          autoApprovalNonFrozenPercentforPlatinum:
                            value.autoApprovalNonFrozenPercentforPlatinum,
                          autoApprovalBestRatePercentforGold:
                            value.autoApprovalBestRatePercentforGold,
                          autoApprovalBestRatePercentforPlatinum:
                            value.autoApprovalBestRatePercentforPlatinum
                        },
                        type: ConfigTypeEnum.ORDER_CO_PAYMENT_CONFIG
                      }
                    });
                  }
                }
                this.parentForm.markAsDirty();
                // this.responseEvent.emit({
                //   addProducts: addArray,
                //   removeProducts: removeArray
                // });
              }
            }
          }
        });
    }
  }

  getRowNodeByCellValue(value: string) {
    let rowNode = null;
    this.gridApi.forEachNode(node => {
      if (node.data.productGroupCode === value) {
        rowNode = node;
      }
    });

    return rowNode;
  }

  deleteFormControls(rowIndex) {
    this.parentForm.removeAt(rowIndex);
  }

  remove(params) {
    if (
      this.selectedConfigDetails?.description &&
      !this.selectedConfigDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      if (params.data.id === '') {
        this.gridApi.applyTransaction({ remove: [params.data] });
      } else {
        this.removeEvent.emit({
          removeProducts: [params.data.id]
        });
      }
      this.selectedProductGroups = this.selectedProductGroups.filter(
        data => data.id !== params.data.productGroupCode
      );

      this.deleteFormControls(params.rowIndex);
    }
  }

  onAddProductGroupToGrid(productGroupCode, configPercent) {
    const newItem = {
      ibtMetalRateFrozenPercentforGold:
        configPercent.ibtMetalRateFrozenPercentforGold,
      ibtMetalRateFrozenPercentforPlatinum:
        configPercent.ibtMetalRateFrozenPercentforPlatinum,
      ibtMetalRateNonFrozenPercentforGold:
        configPercent.ibtMetalRateNonFrozenPercentforGold,
      ibtMetalRateNonFrozenPercentforPlatinum:
        configPercent.ibtMetalRateNonFrozenPercentforPlatinum,
      ibtBestRatePercentforGold: configPercent.ibtBestRatePercentforGold,
      ibtBestRatePercentforPlatinum:
        configPercent.ibtBestRatePercentforPlatinum,
      mtrMetalRateFrozenPercentforGold:
        configPercent.mtrMetalRateFrozenPercentforGold,
      mtrMetalRateFrozenPercentforPlatinum:
        configPercent.mtrMetalRateFrozenPercentforPlatinum,
      mtrMetalRateNonFrozenPercentforGold:
        configPercent.mtrMetalRateNonFrozenPercentforGold,
      mtrMetalRateNonFrozenPercentforPlatinum:
        configPercent.mtrMetalRateNonFrozenPercentforPlatinum,
      mtrBestRatePercentforGold: configPercent.mtrBestRatePercentforGold,
      mtrBestRatePercentforPlatinum:
        configPercent.mtrBestRatePercentforPlatinum,
      prodMetalRateFrozenPercentforGold:
        configPercent.prodMetalRateFrozenPercentforGold,
      prodMetalRateFrozenPercentforPlatinum:
        configPercent.prodMetalRateFrozenPercentforPlatinum,
      prodMetalRateNonFrozenPercentforGold:
        configPercent.prodMetalRateNonFrozenPercentforGold,
      prodMetalRateNonFrozenPercentforPlatinum:
        configPercent.prodMetalRateNonFrozenPercentforPlatinum,
      prodBestRatePercentforGold: configPercent.prodBestRatePercentforGold,
      prodBestRatePercentforPlatinum:
        configPercent.prodBestRatePercentforPlatinum,
      comMetalRateFrozenPercentforGold:
        configPercent.comMetalRateFrozenPercentforGold,
      comMetalRateFrozenPercentforPlatinum:
        configPercent.comMetalRateFrozenPercentforPlatinum,
      comMetalRateNonFrozenPercentforGold:
        configPercent.comMetalRateNonFrozenPercentforGold,
      comMetalRateNonFrozenPercentforPlatinum:
        configPercent.comMetalRateNonFrozenPercentforPlatinum,
      comBestRatePercentforGold: configPercent.comBestRatePercentforGold,
      comBestRatePercentforPlatinum:
        configPercent.comBestRatePercentforPlatinum,
      autoApprovalFrozenPercentforGold:
        configPercent.autoApprovalFrozenPercentforGold,
      autoApprovalFrozenPercentforPlatinum:
        configPercent.autoApprovalFrozenPercentforPlatinum,
      autoApprovalNonFrozenPercentforGold:
        configPercent.autoApprovalNonFrozenPercentforGold,
      autoApprovalNonFrozenPercentforPlatinum:
        configPercent.autoApprovalNonFrozenPercentforPlatinum,
      autoApprovalBestRatePercentforGold:
        configPercent.autoApprovalBestRatePercentforGold,
      autoApprovalBestRatePercentforPlatinum:
        configPercent.autoApprovalBestRatePercentforPlatinum,
      productGroupCode: productGroupCode.id,
      description: productGroupCode.description,
      id: ''
    };
    this.gridApi.applyTransaction({ add: [newItem] });
    this.createFormControls(newItem);
    this.cdr.markForCheck();
  }

  gridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setRowData(this.coOrderPaymentConfigDetails);
    this.gridApi.redrawRows();
  }

  onEdit() {
    if (
      this.selectedConfigDetails?.description &&
      !this.selectedConfigDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      const dialogRef = this.dialog.open(CoOrderPaymentPopupComponent, {
        width: '650px',
        height: 'auto',
        disableClose: true,
        data: {
          selectedDetails:
            this.gridApi.getSelectedNodes().length === 1
              ? this.gridApi.getSelectedNodes()[0].data
              : null
        }
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.updateRowData(res.data);
          this.updateFormControls(res.data);
          this.gridApi.deselectAll();
        }
      });
    }
  }

  updateRowData(res) {
    const updatedData = this.gridApi.getSelectedNodes();
    updatedData.forEach(rowNode => {
      rowNode.data.ibtMetalRateFrozenPercentforGold = res.ibtMetalRateFrozenPercentforGold
        ? res.ibtMetalRateFrozenPercentforGold
        : rowNode.data.ibtMetalRateFrozenPercentforGold;
      rowNode.data.ibtMetalRateFrozenPercentforPlatinum = res.ibtMetalRateFrozenPercentforPlatinum
        ? res.ibtMetalRateFrozenPercentforPlatinum
        : rowNode.data.ibtMetalRateFrozenPercentforPlatinum;
      rowNode.data.ibtMetalRateNonFrozenPercentforGold = res.ibtMetalRateNonFrozenPercentforGold
        ? res.ibtMetalRateNonFrozenPercentforGold
        : rowNode.data.ibtMetalRateNonFrozenPercentforGold;
      rowNode.data.ibtMetalRateNonFrozenPercentforPlatinum = res.ibtMetalRateNonFrozenPercentforPlatinum
        ? res.ibtMetalRateNonFrozenPercentforGold
        : rowNode.data.ibtMetalRateNonFrozenPercentforPlatinum;
      rowNode.data.ibtBestRatePercentforGold = res.ibtBestRatePercentforGold
        ? res.ibtBestRatePercentforGold
        : rowNode.data.ibtBestRatePercentforGold;
      rowNode.data.ibtBestRatePercentforPlatinum = res.ibtBestRatePercentforPlatinum
        ? res.ibtBestRatePercentforPlatinum
        : rowNode.data.ibtBestRatePercentforPlatinum;
      rowNode.data.mtrMetalRateFrozenPercentforGold = res.mtrMetalRateFrozenPercentforGold
        ? res.mtrMetalRateFrozenPercentforGold
        : rowNode.data.mtrMetalRateFrozenPercentforGold;
      rowNode.data.mtrMetalRateFrozenPercentforPlatinum = res.mtrMetalRateFrozenPercentforPlatinum
        ? res.mtrMetalRateFrozenPercentforPlatinum
        : rowNode.data.mtrMetalRateFrozenPercentforPlatinum;
      rowNode.data.mtrMetalRateNonFrozenPercentforGold = res.mtrMetalRateNonFrozenPercentforGold
        ? res.mtrMetalRateNonFrozenPercentforGold
        : rowNode.data.mtrMetalRateNonFrozenPercentforGold;
      rowNode.data.mtrMetalRateNonFrozenPercentforPlatinum = res.mtrMetalRateNonFrozenPercentforPlatinum
        ? res.mtrMetalRateNonFrozenPercentforGold
        : rowNode.data.mtrMetalRateNonFrozenPercentforPlatinum;
      rowNode.data.mtrBestRatePercentforGold = res.mtrBestRatePercentforGold
        ? res.mtrBestRatePercentforGold
        : rowNode.data.mtrBestRatePercentforGold;
      rowNode.data.mtrBestRatePercentforPlatinum = res.mtrBestRatePercentforPlatinum
        ? res.mtrBestRatePercentforPlatinum
        : rowNode.data.mtrBestRatePercentforPlatinum;

      rowNode.data.prodMetalRateFrozenPercentforGold = res.prodMetalRateFrozenPercentforGold
        ? res.prodMetalRateFrozenPercentforGold
        : rowNode.data.prodMetalRateFrozenPercentforGold;
      rowNode.data.prodMetalRateFrozenPercentforPlatinum = res.prodMetalRateFrozenPercentforPlatinum
        ? res.prodMetalRateFrozenPercentforPlatinum
        : rowNode.data.prodMetalRateFrozenPercentforPlatinum;
      rowNode.data.prodMetalRateNonFrozenPercentforGold = res.prodMetalRateNonFrozenPercentforGold
        ? res.prodMetalRateNonFrozenPercentforGold
        : rowNode.data.prodMetalRateNonFrozenPercentforGold;
      rowNode.data.prodMetalRateNonFrozenPercentforPlatinum = res.prodMetalRateNonFrozenPercentforPlatinum
        ? res.prodMetalRateNonFrozenPercentforGold
        : rowNode.data.prodMetalRateNonFrozenPercentforPlatinum;
      rowNode.data.prodBestRatePercentforGold = res.prodBestRatePercentforGold
        ? res.prodBestRatePercentforGold
        : rowNode.data.prodBestRatePercentforGold;
      rowNode.data.prodBestRatePercentforPlatinum = res.prodBestRatePercentforPlatinum
        ? res.prodBestRatePercentforPlatinum
        : rowNode.data.prodBestRatePercentforPlatinum;

      rowNode.data.comMetalRateFrozenPercentforGold = res.comMetalRateFrozenPercentforGold
        ? res.comMetalRateFrozenPercentforGold
        : rowNode.data.comMetalRateFrozenPercentforGold;
      rowNode.data.comMetalRateFrozenPercentforPlatinum = res.comMetalRateFrozenPercentforPlatinum
        ? res.comMetalRateFrozenPercentforPlatinum
        : rowNode.data.comMetalRateFrozenPercentforPlatinum;
      rowNode.data.comMetalRateNonFrozenPercentforGold = res.comMetalRateNonFrozenPercentforGold
        ? res.comMetalRateNonFrozenPercentforGold
        : rowNode.data.comMetalRateNonFrozenPercentforGold;
      rowNode.data.comMetalRateNonFrozenPercentforPlatinum = res.comMetalRateNonFrozenPercentforPlatinum
        ? res.comMetalRateNonFrozenPercentforGold
        : rowNode.data.comMetalRateNonFrozenPercentforPlatinum;
      rowNode.data.comBestRatePercentforGold = res.comBestRatePercentforGold
        ? res.comBestRatePercentforGold
        : rowNode.data.comBestRatePercentforGold;
      rowNode.data.comBestRatePercentforPlatinum = res.comBestRatePercentforPlatinum
        ? res.comBestRatePercentforPlatinum
        : rowNode.data.comBestRatePercentforPlatinum;

      rowNode.data.autoApprovalFrozenPercentforGold = res.autoApprovalFrozenPercentforGold
        ? res.autoApprovalFrozenPercentforGold
        : rowNode.data.autoApprovalFrozenPercentforGold;
      rowNode.data.autoApprovalFrozenPercentforPlatinum = res.autoApprovalFrozenPercentforPlatinum
        ? res.autoApprovalFrozenPercentforPlatinum
        : rowNode.data.autoApprovalFrozenPercentforPlatinum;
      rowNode.data.autoApprovalNonFrozenPercentforGold = res.autoApprovalNonFrozenPercentforGold
        ? res.autoApprovalNonFrozenPercentforGold
        : rowNode.data.autoApprovalNonFrozenPercentforGold;
      rowNode.data.autoApprovalNonFrozenPercentforPlatinum = res.autoApprovalNonFrozenPercentforPlatinum
        ? res.autoApprovalNonFrozenPercentforGold
        : rowNode.data.autoApprovalNonFrozenPercentforPlatinum;
      rowNode.data.autoApprovalBestRatePercentforGold = res.autoApprovalBestRatePercentforGold
        ? res.autoApprovalBestRatePercentforGold
        : rowNode.data.autoApprovalBestRatePercentforGold;
      rowNode.data.autoApprovalBestRatePercentforPlatinum = res.autoApprovalBestRatePercentforPlatinum
        ? res.autoApprovalBestRatePercentforPlatinum
        : rowNode.data.autoApprovalBestRatePercentforPlatinum;
      if (rowNode.data.id !== '') {
        this.removeProductGroups = this.removeProductGroups.concat([
          rowNode.data.id
        ]);
      }
      const res1 = this.gridApi.applyTransaction({ update: [rowNode.data] });
      this.gridApi.redrawRows({ rowNodes: res1.update });
    });
  }

  updateFormControls(res) {
    this.gridApi.getSelectedNodes().forEach(node => {
      this.parentForm.controls[node.rowIndex].patchValue({
        ibtMetalRateFrozenPercentforGold: res.ibtMetalRateFrozenPercentforGold
          ? res.ibtMetalRateFrozenPercentforGold
          : this.parentForm.controls[node.rowIndex].get(
              'ibtMetalRateFrozenPercentforGold'
            ).value,
        ibtMetalRateFrozenPercentforPlatinum: res.ibtMetalRateFrozenPercentforPlatinum
          ? res.ibtMetalRateFrozenPercentforPlatinum
          : this.parentForm.controls[node.rowIndex].get(
              'ibtMetalRateFrozenPercentforPlatinum'
            ).value,
        ibtMetalRateNonFrozenPercentforGold: res.ibtMetalRateNonFrozenPercentforGold
          ? res.ibtMetalRateNonFrozenPercentforGold
          : this.parentForm.controls[node.rowIndex].get(
              'ibtMetalRateNonFrozenPercentforGold'
            ).value,
        ibtMetalRateNonFrozenPercentforPlatinum: res.ibtMetalRateNonFrozenPercentforPlatinum
          ? res.ibtMetalRateNonFrozenPercentforPlatinum
          : this.parentForm.controls[node.rowIndex].get(
              'ibtMetalRateNonFrozenPercentforPlatinum'
            ).value,
        ibtBestRatePercentforGold: res.ibtBestRatePercentforGold
          ? res.ibtBestRatePercentforGold
          : this.parentForm.controls[node.rowIndex].get(
              'ibtBestRatePercentforGold'
            ).value,
        ibtBestRatePercentforPlatinum: res.ibtBestRatePercentforPlatinum
          ? res.ibtBestRatePercentforPlatinum
          : this.parentForm.controls[node.rowIndex].get(
              'ibtBestRatePercentforPlatinum'
            ).value,
        mtrMetalRateFrozenPercentforGold: res.mtrMetalRateFrozenPercentforGold
          ? res.mtrMetalRateFrozenPercentforGold
          : this.parentForm.controls[node.rowIndex].get(
              'mtrMetalRateFrozenPercentforGold'
            ).value,
        mtrMetalRateFrozenPercentforPlatinum: res.mtrMetalRateFrozenPercentforPlatinum
          ? res.mtrMetalRateFrozenPercentforPlatinum
          : this.parentForm.controls[node.rowIndex].get(
              'mtrMetalRateFrozenPercentforPlatinum'
            ).value,
        mtrMetalRateNonFrozenPercentforGold: res.mtrMetalRateNonFrozenPercentforGold
          ? res.mtrMetalRateNonFrozenPercentforGold
          : this.parentForm.controls[node.rowIndex].get(
              'mtrMetalRateNonFrozenPercentforGold'
            ).value,
        mtrMetalRateNonFrozenPercentforPlatinum: res.mtrMetalRateNonFrozenPercentforPlatinum
          ? res.mtrMetalRateNonFrozenPercentforPlatinum
          : this.parentForm.controls[node.rowIndex].get(
              'mtrMetalRateNonFrozenPercentforPlatinum'
            ).value,
        mtrBestRatePercentforGold: res.mtrBestRatePercentforGold
          ? res.mtrBestRatePercentforGold
          : this.parentForm.controls[node.rowIndex].get(
              'mtrBestRatePercentforGold'
            ).value,
        mtrBestRatePercentforPlatinum: res.mtrBestRatePercentforPlatinum
          ? res.mtrBestRatePercentforPlatinum
          : this.parentForm.controls[node.rowIndex].get(
              'mtrBestRatePercentforPlatinum'
            ).value,
        prodMetalRateFrozenPercentforGold: res.prodMetalRateFrozenPercentforGold
          ? res.prodMetalRateFrozenPercentforGold
          : this.parentForm.controls[node.rowIndex].get(
              'prodMetalRateFrozenPercentforGold'
            ).value,
        prodMetalRateFrozenPercentforPlatinum: res.prodMetalRateFrozenPercentforPlatinum
          ? res.prodMetalRateFrozenPercentforPlatinum
          : this.parentForm.controls[node.rowIndex].get(
              'prodMetalRateFrozenPercentforPlatinum'
            ).value,
        prodMetalRateNonFrozenPercentforGold: res.prodMetalRateNonFrozenPercentforGold
          ? res.prodMetalRateNonFrozenPercentforGold
          : this.parentForm.controls[node.rowIndex].get(
              'prodMetalRateNonFrozenPercentforGold'
            ).value,
        prodMetalRateNonFrozenPercentforPlatinum: res.prodMetalRateNonFrozenPercentforPlatinum
          ? res.prodMetalRateNonFrozenPercentforPlatinum
          : this.parentForm.controls[node.rowIndex].get(
              'prodMetalRateNonFrozenPercentforPlatinum'
            ).value,
        prodBestRatePercentforGold: res.prodBestRatePercentforGold
          ? res.prodBestRatePercentforGold
          : this.parentForm.controls[node.rowIndex].get(
              'prodBestRatePercentforGold'
            ).value,
        prodBestRatePercentforPlatinum: res.prodBestRatePercentforPlatinum
          ? res.prodBestRatePercentforPlatinum
          : this.parentForm.controls[node.rowIndex].get(
              'prodBestRatePercentforPlatinum'
            ).value,
        comMetalRateFrozenPercentforGold: res.comMetalRateFrozenPercentforGold
          ? res.comMetalRateFrozenPercentforGold
          : this.parentForm.controls[node.rowIndex].get(
              'comMetalRateFrozenPercentforGold'
            ).value,
        comMetalRateFrozenPercentforPlatinum: res.comMetalRateFrozenPercentforPlatinum
          ? res.comMetalRateFrozenPercentforPlatinum
          : this.parentForm.controls[node.rowIndex].get(
              'comMetalRateFrozenPercentforPlatinum'
            ).value,
        comMetalRateNonFrozenPercentforGold: res.comMetalRateNonFrozenPercentforGold
          ? res.comMetalRateNonFrozenPercentforGold
          : this.parentForm.controls[node.rowIndex].get(
              'comMetalRateNonFrozenPercentforGold'
            ).value,
        comMetalRateNonFrozenPercentforPlatinum: res.comMetalRateNonFrozenPercentforPlatinum
          ? res.comMetalRateNonFrozenPercentforPlatinum
          : this.parentForm.controls[node.rowIndex].get(
              'comMetalRateNonFrozenPercentforPlatinum'
            ).value,
        comBestRatePercentforGold: res.comBestRatePercentforGold
          ? res.comBestRatePercentforGold
          : this.parentForm.controls[node.rowIndex].get(
              'comBestRatePercentforGold'
            ).value,
        comBestRatePercentforPlatinum: res.comBestRatePercentforPlatinum
          ? res.ibtBestRatePercentforPlatinum
          : this.parentForm.controls[node.rowIndex].get(
              'comBestRatePercentforPlatinum'
            ).value,
        autoApprovalFrozenPercentforGold: res.autoApprovalFrozenPercentforGold
          ? res.autoApprovalFrozenPercentforGold
          : this.parentForm.controls[node.rowIndex].get(
              'autoApprovalFrozenPercentforGold'
            ).value,
        autoApprovalFrozenPercentforPlatinum: res.autoApprovalFrozenPercentforPlatinum
          ? res.autoApprovalFrozenPercentforPlatinum
          : this.parentForm.controls[node.rowIndex].get(
              'autoApprovalFrozenPercentforPlatinum'
            ).value,
        autoApprovalNonFrozenPercentforGold: res.autoApprovalNonFrozenPercentforGold
          ? res.autoApprovalNonFrozenPercentforGold
          : this.parentForm.controls[node.rowIndex].get(
              'autoApprovalNonFrozenPercentforGold'
            ).value,
        autoApprovalNonFrozenPercentforPlatinum: res.autoApprovalNonFrozenPercentforPlatinum
          ? res.autoApprovalNonFrozenPercentforPlatinum
          : this.parentForm.controls[node.rowIndex].get(
              'autoApprovalNonFrozenPercentforPlatinum'
            ).value,
        autoApprovalBestRatePercentforGold: res.autoApprovalBestRatePercentforGold
          ? res.autoApprovalBestRatePercentforGold
          : this.parentForm.controls[node.rowIndex].get(
              'autoApprovalBestRatePercentforGold'
            ).value,
        autoApprovalBestRatePercentforPlatinum: res.autoApprovalBestRatePercentforPlatinum
          ? res.autoApprovalBestRatePercentforPlatinum
          : this.parentForm.controls[node.rowIndex].get(
              'autoApprovalBestRatePercentforPlatinum'
            ).value
      });
    });
    this.parentForm.markAsDirty();
    this.cdr.markForCheck();
  }

  onSelectionChanged(event) {
    if (this.gridApi.getSelectedNodes().length) {
      this.disableEdit = false;
    } else {
      this.disableEdit = true;
    }
  }
  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    const node = this.gridApi.getDisplayedRowAtIndex(this.currentRowIndex);
    this.currentRowInfo = this.gridApi.getValue(this.currentRowField, node);
  }

  focusOut(event) {
    this.isFocusing = false;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
