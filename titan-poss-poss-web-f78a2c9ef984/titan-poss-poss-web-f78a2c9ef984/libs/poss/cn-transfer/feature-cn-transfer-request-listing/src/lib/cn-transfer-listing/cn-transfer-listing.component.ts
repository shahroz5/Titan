import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { Subject, Observable, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  cnTransferTabEnum,
  CNDetailsInfo,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  CustomErrors,
  SelectDropDownOption,
  CNStatusEnum,
  CreditNoteAPITypes
} from '@poss-web/shared/models';
import {
  getCreditNoteTransferSentDetailsUrl,
  getCreditNoteTransferReceivedDetailsUrl
} from '@poss-web/shared/util-site-routes';
import {
  fieldValidation,
  FieldValidatorsService
} from '@poss-web/shared/util-field-validators';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { CreditNoteTransferFacade } from '@poss-web/poss/cn-transfer/data-access-cn-transfer';

@Component({
  selector: 'poss-web-cn-transfer-listing',
  templateUrl: './cn-transfer-listing.component.html'
})
export class CnTransferListingComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  @ViewChild('searchBox', { static: true })
  private searchBox: ElementRef;

  @ViewChild('fiscalYearSearchBox', { static: true })
  private fiscalYearSearchBox: ElementRef;

  cnTransferTabEnumRef = cnTransferTabEnum;
  sentRequests: CNDetailsInfo[] = [];
  count = 0;
  pageSize = 4;
  initalPageSize = 8;
  isLoading$: Observable<boolean>;
  destroy$ = new Subject<null>();
  listingPageFormGroup: FormGroup;
  statusColor: string;
  invalidSearch = false;
  currentFiscalYear: string;
  tab: string;

  receivedRequestsStatus: SelectDropDownOption[] = [
    { description: 'APPROVED', value: 'APPROVED' },
    { description: 'PENDING', value: 'PENDING' },
    { description: 'REJECTED', value: 'REJECTED' }
  ];
  sentRequestsStatus: SelectDropDownOption[] = [
    { description: 'ALL', value: 'ALL' },
    { description: 'PENDING', value: 'PENDING' },
    { description: 'APPROVED', value: 'APPROVED' },
    { description: 'REJECTED', value: 'REJECTED' },
    { description: 'CANCELLED', value: 'CANCELLED' },
    { description: 'CLOSED', value: 'CLOSED' }
  ];

  readonly statusField: string = 'status';
  readonly CNNumField: string = 'cnNumber';
  readonly fiscalYearField: string = 'fiscalYear';
  readonly fiscalYearLabelKey: string = 'pw.creditNote.fiscalYearLabel';
  readonly cnNumberLabelKey: string = 'pw.creditNote.cnNumberLabel';

  constructor(
    private cnTransferFacade: CreditNoteTransferFacade,
    private router: Router,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private fieldValidatorsService: FieldValidatorsService,
    private bodeodFacade: SharedBodEodFacade
  ) {
    this.translate
      .get(
        [
          this.fiscalYearLabelKey,
          this.cnNumberLabelKey
        ]
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.listingPageFormGroup = new FormGroup({
          cnNumber: new FormControl('', [
            this.fieldValidatorsService.numbersField(translatedMsg[this.cnNumberLabelKey])
          ]),
          fiscalYear: new FormControl(this.currentFiscalYear, [
            this.fieldValidatorsService.fiscalYearField(translatedMsg[this.fiscalYearLabelKey]),
            this.fieldValidatorsService.max(
              Number(this.currentFiscalYear),
              translatedMsg[this.fiscalYearLabelKey]
            )
          ]),
          status: new FormControl(CNStatusEnum.PENDING)
        });
      })

  }
  ngOnChanges(changes: SimpleChanges): void {

    if (changes && changes['tab']) {
      this.listingPageFormGroup.patchValue(
        { status: CNStatusEnum.PENDING },
        { emitEvent: false }
      );
      this.cnTransferFacade.resetListPage();
      this.listingPageFormGroup.patchValue({
        fiscalYear: this.currentFiscalYear
      });
      if (this.currentFiscalYear) {
        this.loadRequests(0);
      }
    }

  }
  ngOnInit(): void {
    this.bodeodFacade.loadLatestBusinessDay();
    this.cnTransferFacade.resetCnTransfer();
    this.tab = this.router.url.split('/').pop();

    this.translate
      .get(
        [
          this.fiscalYearLabelKey,
          this.cnNumberLabelKey
        ]
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.bodeodFacade
      .getFiscalYear()
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: number) => {
        if (fiscalYear) {
          this.currentFiscalYear = fiscalYear.toString();
          this.listingPageFormGroup.patchValue({
            fiscalYear: this.currentFiscalYear
          });
          const fiscalYearCtrl = this.listingPageFormGroup.get(this.fiscalYearField);
          fiscalYearCtrl.setValidators([
            this.fieldValidatorsService.fiscalYearField(translatedMsg[this.fiscalYearLabelKey]),
            this.fieldValidatorsService.max(
              Number(this.currentFiscalYear),
              translatedMsg[this.fiscalYearLabelKey]
            )
          ]);
          fiscalYearCtrl.updateValueAndValidity();
          this.loadRequests(0);
        }
      });
      })


    this.cnTransferFacade
      .getRaisedTransferRequests()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.sentRequests = data;
        }
      });
    this.cnTransferFacade
      .getRaisedTransferRequestsTotalCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.count = data;
        }
      });
    this.isLoading$ = this.cnTransferFacade.getIsLoading();
    this.cnTransferFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }
  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.listingPageFormGroup.get(this.CNNumField).value;
        if (searchValue) {
          this.searchCNNumber(searchValue);
        } else {
          this.clearSearch();
        }
      });

    fromEvent(this.fiscalYearSearchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.listingPageFormGroup.get(this.fiscalYearField).value;
        if (searchValue) {
          this.searchFiscalYear(searchValue);
        } else {
          this.clearFiscalYearSearch();
        }
      });
  }
  onSelected(event: any): void {
    if (this.tab === cnTransferTabEnum.SENT_REQUESTS) {
      this.router.navigate([
        getCreditNoteTransferSentDetailsUrl(this.tab, event.processId)
      ]);
    } else {
      this.router.navigate([
        getCreditNoteTransferReceivedDetailsUrl(
          this.tab,
          event.processId,
          event.taskId,
          event.taskName
        )
      ]);
    }
  }
  loadRequests(pageIndex: number): void {
    if (pageIndex === 0) {
      this.cnTransferFacade.resetListPage();
    }
    if (this.tab === cnTransferTabEnum.SENT_REQUESTS) {
      this.cnTransferFacade.loadRequests({
        tab: this.tab,
        page: pageIndex,
        approvalStatus: this.getApprovalStatus(),
        size: pageIndex === 0 ? 8 : 4,
        workflowType: CreditNoteAPITypes.CREDIT_NOTE_TRANSFER,
        payload: {
          filterParams: {
            docNo: this.getDocNo()
          },
          dateRangeType: CNStatusEnum.ALL,
          fiscalYear: this.getFiscalYear()
        }
      });
    }
    if (this.tab === cnTransferTabEnum.RECEIVED_REQUESTS) {
      this.cnTransferFacade.loadRequests({
        tab: this.tab,
        page: pageIndex,
        size: pageIndex === 0 ? 8 : 4,
        approvalStatus: this.getApprovalStatus(),
        workflowType: CreditNoteAPITypes.CREDIT_NOTE_TRANSFER,
        payload: {
          dateRangeType: CNStatusEnum.ALL,
          docNo: this.getDocNo(),
          fiscalYear: this.getFiscalYear()
        }
      });
    }
  }

  getApprovalStatus() {
    if (this.tab === cnTransferTabEnum.SENT_REQUESTS) {
      if ((!!this.listingPageFormGroup.get(this.statusField).value &&
        this.listingPageFormGroup.get(this.statusField).value !== CNStatusEnum.ALL)) {
          return this.listingPageFormGroup.get(this.statusField).value;
      } else {
        return null;
      }
    }
    if (this.tab === cnTransferTabEnum.RECEIVED_REQUESTS) {
      if (!!this.listingPageFormGroup.get(this.statusField).value && this.listingPageFormGroup.get(this.statusField).value !== CNStatusEnum.ALL) {
        return this.listingPageFormGroup.get(this.statusField).value
      } else {
        return null;
      }
    }
  }
  getDocNo() {
    if (!!this.listingPageFormGroup.get(this.CNNumField).value) {
      return this.listingPageFormGroup.get(this.CNNumField).value;
    } else {
      return null;
    }
  }
  getFiscalYear() {
    if (!!this.listingPageFormGroup.get(this.fiscalYearField).value) {
      return this.listingPageFormGroup.get(this.fiscalYearField).value;
    } else {
      return null;
    }
  }
  clearSearch() {
    this.invalidSearch = false;
    this.listingPageFormGroup.get(this.CNNumField).reset();
    this.loadRequests(0);
  }
  searchCNNumber(searchValue) {
    if (
      fieldValidation.requestNumberField.pattern.test(searchValue) &&
      this.listingPageFormGroup.valid
    ) {
      this.invalidSearch = false;
      this.loadRequests(0);
    } else {
      this.invalidSearch = true;
    }
  }
  searchFiscalYear(searchValue) {
    if (
      fieldValidation.numbersField.pattern.test(searchValue) &&
      this.listingPageFormGroup.valid
    ) {
      this.invalidSearch = false;
      this.loadRequests(0);
    } else {
      this.invalidSearch = true;
    }
  }

  clearFiscalYearSearch() {
    this.invalidSearch = false;
    this.listingPageFormGroup.get(this.fiscalYearField).reset();
    this.loadRequests(0);
  }
  getStatusColor(status: string): string {
    let description;
    if (commonTranslateKeyMap.has(status)) {
      description = commonTranslateKeyMap.get(status);
    }
    this.translate
      .get([description.status, description.statusColor])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.statusColor = translatedMessages[description.statusColor];
      });
    return this.statusColor;
  }
  /**
   * Error handler method
   * @param error:error Object
   */
  errorHandler(error: any) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
