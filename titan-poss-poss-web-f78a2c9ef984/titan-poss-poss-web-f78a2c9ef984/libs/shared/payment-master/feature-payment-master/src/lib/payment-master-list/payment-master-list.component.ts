import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

import { getMasterHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { PaymentMasterFacade } from '@poss-web/shared/payment-master/data-access-payment-master';
import { ErrorEnums } from '@poss-web/shared/util-error';
import {
  PaymentMaster,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  priceGroupEnum,
  paymentMasterEnum,
  MasterMenuKeyEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';

import { Observable, Subject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { PaymentMasterDetailComponent } from '@poss-web/shared/payment-master/ui-payment-master-detail';
import { fieldValidation } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-payment-master-list',
  templateUrl: './payment-master-list.component.html'
})
export class PaymentMasterListComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  paymentMasterList$: Observable<PaymentMaster[]>;
  totalElements$: Observable<number>;
  error$: Observable<CustomErrors>;
  isLoading$: Observable<boolean>;
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  destroy$ = new Subject<null>();
  pageSizeOptions: number[];
  searchErrorCode: string;
  invalidSearch: boolean;
  isEditable: boolean;
  noDataFoundMessage: string;

  constructor(
    private dialog: MatDialog,
    private paymentMasterFacade: PaymentMasterFacade,
    private appSettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private router: Router,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.paymentModeEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.paymentModeEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
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
  ngOnInit() {
    this.paymentMasterFacade.loadReset();
    this.searchErrorCode = ErrorEnums.ERR_PAY_001;
    this.isLoading$ = this.paymentMasterFacade.getIsloading();
    this.error$ = this.paymentMasterFacade.getError();
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.initialPageEvent.pageSize = pageSize;
        this.loadPaymentMasterList();
        this.paymentMasterList$ = this.paymentMasterFacade.getPaymentMasterList();
        this.totalElements$ = this.paymentMasterFacade.getTotalElements();
      });
    this.paymentMasterFacade
      .getPaymentMaster()
      .pipe(takeUntil(this.destroy$))
      .subscribe(paymentMaster => {
        if (paymentMaster) {
          const paymentMasterDetails: PaymentMaster = {
            ...paymentMaster,
            isEditable: this.isEditable
          };

          const dialogRef = this.dialog.open(PaymentMasterDetailComponent, {
            width: '500px',
            height: 'auto',
            data: paymentMasterDetails,
            disableClose: true
          });

          dialogRef
            .afterClosed()
            .pipe(takeUntil(this.destroy$))
            .subscribe(formData => {
              if (formData) {
                this.alertPopupService
                  .open({
                    type: AlertPopupTypeEnum.CONFIRM,
                    message: 'pw.alertPopup.saveConfirmation'
                  })
                  .pipe(takeUntil(this.destroy$))
                  .subscribe((res: boolean) => {
                    if (res) {
                      this.paymentMasterFormDetails(formData);
                    }
                  });
              }
            });
        }
      });

    this.paymentMasterFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasSaved => {
        if (hasSaved === true) {
          this.loadPaymentMasterList();
          this.showSuccessMessageNotification('pw.paymentMaster.saveMsg');
        } else this.overlayNotification.close();
      });
    this.paymentMasterFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated === true) {
          this.clearSearch();
          this.showSuccessMessageNotification('pw.paymentMaster.updateMsg');
          this.loadPaymentMasterList();
        } else this.overlayNotification.close();
      });
    this.paymentMasterFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  search(searchValue) {
    if (fieldValidation.paymentCodeField.pattern.test(searchValue)) {
      this.invalidSearch = false;

      this.paymentMasterFacade.searchPaymentMaster(searchValue);
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    this.invalidSearch = false;
    this.searchForm.reset();
    this.loadPaymentMasterList();
  }
  loadPaymentMasterList() {
    this.paymentMasterFacade.loadPaymentMasterList(this.initialPageEvent);
  }
  loadPaginateData(event: PageEvent) {
    this.initialPageEvent = event;
    this.loadPaymentMasterList();
  }

  loadPaymentMasterByPaymentCode(event) {
    this.isEditable = event.isEditable;
    this.paymentMasterFacade.loadPaymentMasterByPaymentCode(event.paymentCode);
  }

  updateisActive(obj) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.paymentMasterFacade.loadUpdatePaymentMaster(obj);
        } else {
          this.loadPaymentMasterList();
        }
      });
  }

  addNew(paymentCode: string) {
    if (paymentCode !== paymentMasterEnum.NEW) {
      this.paymentMasterFacade.loadPaymentMasterByPaymentCode(paymentCode);
    } else {
      const neFormData: any = {
        paymentCode: priceGroupEnum.NEW,
        description: '',
        isReferenceMandatory: false,
        referenceOne: '',
        referenceTwo: '',
        referenceThree: '',

        customerDependent: true,
        paymentGroup: '',
        isEditable: false
      };
      const dialogRef = this.dialog.open(PaymentMasterDetailComponent, {
        width: '500px',
        height: 'auto',
        data: neFormData,
        disableClose: true
      });
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          if (data) {
            this.alertPopupService
              .open({
                type: AlertPopupTypeEnum.CONFIRM,
                message: 'pw.alertPopup.saveConfirmation'
              })
              .pipe(takeUntil(this.destroy$))
              .subscribe((res: boolean) => {
                if (res) {
                  this.paymentMasterFormDetails(data);
                }
              });
          }
        });
    }
  }

  paymentMasterFormDetails(data: any) {
    if (data.mode === paymentMasterEnum.new) {
      this.paymentMasterFacade.loadSavePaymentMaster({
        paymentGroup: data.paymentGroup,

        data: {
          customerDependent: data.customerDependent,
          paymentCode: data.paymentCode,
          description: data.description,
          fieldDetails: [
            {
              fieldCode: data.referenceOne.replace(/\s+/g, '_').toLowerCase(),
              fieldName: data.referenceOne,
              fieldType: null,
              fieldRegex: null
            },
            {
              fieldCode: data.referenceTwo.replace(/\s+/g, '_').toLowerCase(),
              fieldName: data.referenceTwo,
              fieldType: null,
              fieldRegex: null
            },
            {
              fieldCode: data.referenceThree.replace(/\s+/g, '_').toLowerCase(),
              fieldName: data.referenceThree,
              fieldType: null,
              fieldRegex: null
            }
          ],

          isActive: true
        }
      });
    } else if (data.mode === paymentMasterEnum.edit) {
      this.paymentMasterFacade.loadUpdatePaymentMaster({
        paymentCode: data.paymentCode,
        paymentGroup: data.paymentGroup,
        data: {
          description: data.description,
          fieldDetails: [
            {
              fieldCode: data.referenceOne.replace(/\s+/g, '_').toLowerCase(),
              fieldName: data.referenceOne,
              fieldType: null,
              fieldRegex: null
            },
            {
              fieldCode: data.referenceTwo.replace(/\s+/g, '_').toLowerCase(),
              fieldName: data.referenceTwo,
              fieldType: null,
              fieldRegex: null
            },
            {
              fieldCode: data.referenceThree.replace(/\s+/g, '_').toLowerCase(),
              fieldName: data.referenceThree,
              fieldType: null,
              fieldRegex: null
            }
          ],
          customerDependent: data.customerDependent
        }
      });
    }
  }

  showSuccessMessageNotification(key: any) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMsg,

            hasBackdrop: true
          })
          .events.subscribe();
      });
  }

  errorHandler(error: CustomErrors) {
    if (error.code === this.searchErrorCode) {
      // We are not showing error for location not found from search.
      return;
    }
    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      hasClose: true,
      error: error
    });
  }
  back() {
    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: {
        menu: MasterMenuKeyEnum.PAYMENT_MENU_KEY
      }
    });
    this.paymentMasterFacade.loadReset();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
