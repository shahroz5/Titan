import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { GridReadyEvent, GridApi } from 'ag-grid-community';
import { PageEvent } from '@angular/material/paginator';
import { Observable, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { CurrencyFormatterService, DateFormatterService } from '@poss-web/shared/components/ui-formatters';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { AlertPopupServiceAbstraction, AlertPopupTypeEnum, PermissionData } from '@poss-web/shared/models';
import { DeleteRowComponent } from '@poss-web/shared/components/ui-ag-grid';


@Component({
  selector: 'poss-web-config-detail',
  templateUrl: './config-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigDetailComponent implements OnInit, OnDestroy {

  defaultColDef = {
    suppressMovable: true
  };
  ColumnDefs = [];
  api: GridApi;
  context = this;
  component: ConfigDetailComponent = this;
  destroy$: Subject<null> = new Subject<null>();
  domLayout = 'autoHeight';
  rowHeight = '35';
  animateRows = true;

  empNameHeader: string;
  empCodeHeader: string;
  empMobileNumHeader: string;
  eligibleAmountHeader: number;
  approvalDateHeader: string;
  validityDateHeader: string;
  applicableCFACodesHeader: string;
  applicableLocationCodesHeader: string;
  marginPercentageHeader: string;
  validationOTPHeader: string;
  partialRedeemableAmtHeader: string;


  @Input() empLoanConfigDetails = [];
  @Input() minPageSize = 0;
  @Input() pageSizeOptions: number[] = [];
  @Input() empLoanConfigDetailsCount: number;
  @Input() loadPermission$: Observable<any[]>;
  @Input() pageEvent: PageEvent;

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() downLoadFormat = new EventEmitter<null>();
  @Output() uploadFile = new EventEmitter<{
    event: any;
    fileInput: any;
  }>();
  @Output() deleteEmpLoanConfig = new EventEmitter<string>();

  @ViewChild('fileInput') fileInput;

  EMP_LOAN_CONFIG_PERMISSION = 'EmployeeLoanConfig_fileUpload_fileDownload'

  constructor(private translate: TranslateService,
    private dateFormatterService: DateFormatterService,
    private currencyFormatterService: CurrencyFormatterService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private elementPermission: ElementPermissionService,
    @Inject(POSS_WEB_CURRENCY_CODE) public defaultCurrencyCode
    ) {
    this.translate
      .get([
        'pw.employeeLoanConfiguration.empNameHeaderLabel',
        'pw.employeeLoanConfiguration.empCodeHeaderLabel',
        'pw.employeeLoanConfiguration.empMobileNumHeaderLabel',
        'pw.employeeLoanConfiguration.eligibleAmountHeaderLabel',
        'pw.employeeLoanConfiguration.approvalDateHeaderLabel',
        'pw.employeeLoanConfiguration.validityDateHeaderLabel',
        'pw.employeeLoanConfiguration.applicableCFACodesHeaderLabel',
        'pw.employeeLoanConfiguration.applicableLocationCodesHeaderLabel',
        'pw.employeeLoanConfiguration.marginPercentageHeaderLabel',
        'pw.employeeLoanConfiguration.validationOTPHeaderLabel',
        'pw.employeeLoanConfiguration.partialRedeemableAmtHeaderLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.empNameHeader = translatedMessages['pw.employeeLoanConfiguration.empNameHeaderLabel'];
        this.empCodeHeader =  translatedMessages['pw.employeeLoanConfiguration.empCodeHeaderLabel'];
        this.empMobileNumHeader = translatedMessages['pw.employeeLoanConfiguration.empMobileNumHeaderLabel'];
        this.eligibleAmountHeader = translatedMessages['pw.employeeLoanConfiguration.eligibleAmountHeaderLabel'];
        this.approvalDateHeader = translatedMessages['pw.employeeLoanConfiguration.approvalDateHeaderLabel'];
        this.validityDateHeader = translatedMessages['pw.employeeLoanConfiguration.validityDateHeaderLabel'];
        this.applicableCFACodesHeader = translatedMessages['pw.employeeLoanConfiguration.applicableCFACodesHeaderLabel'];
        this.applicableLocationCodesHeader = translatedMessages['pw.employeeLoanConfiguration.applicableLocationCodesHeaderLabel'];
        this.marginPercentageHeader = translatedMessages['pw.employeeLoanConfiguration.marginPercentageHeaderLabel'];
        this.validationOTPHeader = translatedMessages['pw.employeeLoanConfiguration.validationOTPHeaderLabel'];
        this.partialRedeemableAmtHeader = translatedMessages['pw.employeeLoanConfiguration.partialRedeemableAmtHeaderLabel'];
      });
  }

  ngOnInit(): void {
    this.loadColumnDef();
  }

  loadColumnDef() {
    this.ColumnDefs = [
      {
        headerName: this.empNameHeader,
        field: 'empName',
        suppressMovable: true,
        resizable: true,
        flex: 1
      },
      {
        headerName: this.empCodeHeader,
        field: 'empCode',
        suppressMovable: true,
        resizable: true,
        width: 100,
        minWidth: 80,
      },
      {
        headerName: this.empMobileNumHeader,
        field: 'empMobileNum',
        suppressMovable: true,
        resizable: true,
        width: 100,
        minWidth: 80,
      },
      {
        headerName: this.eligibleAmountHeader,
        field: 'eligibleAmount',
        valueFormatter: params => {
          return this.currencyFormatterService.format(
            params.value,
            this.defaultCurrencyCode,
            false
          );
        },
        suppressMovable: true,
        resizable: true,
        width: 100,
        minWidth: 80,
      },
      {
        headerName: this.approvalDateHeader,
        field: 'approvalDate',
        valueFormatter: params => {
          return this.dateFormatterService.format(params.value);
        },
        suppressMovable: true,
        resizable: true,
        width: 100,
        minWidth: 80,
      },
      {
        headerName: this.validityDateHeader,
        field: 'validityDate',
        valueFormatter: params => {
          return this.dateFormatterService.format(params.value);
        },
        suppressMovable: true,
        resizable: true,
        width: 100,
        minWidth: 80,
      },
      {
        headerName: this.applicableCFACodesHeader,
        field: 'applicableCFACodes',
        suppressMovable: true,
        resizable: true,
        flex: 1
      },
      {
        headerName: this.applicableLocationCodesHeader,
        field: 'applicableLocationCodes',
        suppressMovable: true,
        resizable: true,
        flex: 1
      },
      {
        headerName: this.marginPercentageHeader,
        field: 'marginPercentage',
        suppressMovable: true,
        resizable: true,
        width: 80,
        minWidth: 60,
      },
      {
        headerName: this.validationOTPHeader,
        field: 'validationOTP',
        suppressMovable: true,
        resizable: true,
        width: 80,
        minWidth: 60,
      },
      {
        headerName: this.partialRedeemableAmtHeader,
        field: 'partialRedeemableAmt',
        valueFormatter: params => {
          return this.currencyFormatterService.format(
            params.value,
            this.defaultCurrencyCode,
            false
          );
        },
        suppressMovable: true,
        resizable: true,
        width: 85,
        minWidth: 60,
      },
      {
        headerName: '',
        cellRenderer: 'deleteRowRenderer',
        width: 25,
        minWidth: 25,
        maxWidth: 25,
        cellClass: 'pw-delete-icon-width',
        suppressMovable: true
      }
    ];
  }

  getComponents() {
    return {
      deleteRowRenderer: DeleteRowComponent
    };
  }
  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }

  downLoadFormatFn() {
    this.downLoadFormat.emit();
  }

  uploadConfigDetails(event) {
    this.uploadFile.emit({ event: event, fileInput: this.fileInput });
  }

  getContext() {
    return {
      componentParent: this.component
    };
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

  openConfirmDialogForDelete(data: any) {
    this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.employeeLoanConfiguration.deleteConfirmMessage'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res === true) {
            this.deleteEmpLoanConfig.emit(data.id);
          }
        });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPermission = (element: string): Observable<PermissionData> =>
    this.elementPermission.loadPermission(element, this.loadPermission$);
}
