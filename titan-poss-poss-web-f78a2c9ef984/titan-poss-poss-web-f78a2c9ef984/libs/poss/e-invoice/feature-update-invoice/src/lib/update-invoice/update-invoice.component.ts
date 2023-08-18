import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { PermissionService } from '@poss-web/shared/permission/ui-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

import {
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  OverlayNotificationServiceAbstraction,
  CustomErrors,
  OverlayNotificationType,
  PossHomeKeyEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';
import { getPossHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { Observable, Subject, combineLatest } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-update-invoice',
  templateUrl: './update-invoice.component.html'
})
export class UpdateInvoiceComponent implements OnInit, OnDestroy {
  isLoading$: Observable<boolean>;
  destroy$: Subject<null> = new Subject<null>();
  invoices$: Observable<number[]>;
  isCopyInvoices$: Observable<boolean>;
  enableResendButton = true;
  triggerFailedInvoiceCall = true;
  isLoading = false;
  permissions$: Observable<any[]>;

  COPY_INVOICE_TAB = 'Copy Invoices';

  UPDATE_INVOICE_TAB = 'Update E-Invoice';

  constructor(
    public commonFacade: CommonFacade,
    public router: Router,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction,
    private permissionfacade: PermissionFacade,
    private permissionService: PermissionService,
    private elementPermission: ElementPermissionService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.commonFacade.resetInvoices();
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.componentInit();

    combineLatest([
      this.elementPermission.loadPermission(
        this.COPY_INVOICE_TAB,
        this.permissions$
      ),
      this.elementPermission.loadPermission(
        this.UPDATE_INVOICE_TAB,
        this.permissions$
      )
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([val1, val2]) => {
        const availableTransactionCodes = [...val2.transactionCodes];
        const hasRequestPermission = availableTransactionCodes.find(key =>
          this.permissionService.hasPermission(key)
        );
        if (hasRequestPermission) {
          this.getStatus();
        }
      });
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  componentInit() {
    this.isLoading$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.UPDATE_INVOICE,
      CommomStateAttributeNameEnum.LOADING
    );
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.UPDATE_INVOICE,
        CommomStateAttributeNameEnum.HAS_ERROR
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.invoices$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.UPDATE_INVOICE,
      CommomStateAttributeNameEnum.FAILED_INVOICES
    );
    this.invoices$.pipe(takeUntil(this.destroy$)).subscribe(invoices => {
      if (invoices && invoices.length && this.triggerFailedInvoiceCall) {
        this.commonFacade.triggerFailedInvoices();
        this.isLoading = true;
        this.triggerFailedInvoiceCall = false;
        this.triggerFailedInvoicesAlert();
      }
    });

    this.isCopyInvoices$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.UPDATE_INVOICE,
      CommomStateAttributeNameEnum.COPIED_INVOICES
    );
    this.isCopyInvoices$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isCopyInvoices => {
        if (isCopyInvoices) {
          this.copyInvoiceSuccessNotifications();
        }
      });
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasBackdrop: true,
        hasClose: true,
        error: error
      })
      .events.pipe(take(1))
      .subscribe();
  }

  back() {
    this.router.navigate([getPossHomeRouteUrl()], {
      queryParams: {
        menu: PossHomeKeyEnum.UPDATE_E_INVOICE
      }
    });
  }

  resend() {
    this.commonFacade.triggerFailedInvoices();
    this.isLoading = true;
    this.triggerFailedInvoicesAlert();
  }

  getStatus() {
    this.commonFacade.loadFailedInvoices();
  }

  triggerFailedInvoicesAlert() {
    setTimeout(() => {
      this.isLoading = false;
      this.enableResendButton = false;
      this.showAlertPopUpForTriggerFailedInvoices(
        'pw.eivoice.triggeredFailedInvoicesMsg'
      );
    }, 5000);
  }

  showAlertPopUpForTriggerFailedInvoices(message: string) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message
      })
      .pipe(take(1))
      .subscribe(res => {
        if (res) {
          setTimeout(() => {
            this.enableResendButton = true;
          }, 10000);
        }
      });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  copyInvoice() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.eivoice.copyInvoicesMessage'
      })
      .pipe(take(1))
      .subscribe(res => {
        if (res) {
          this.commonFacade.loadCopiedInvoicesDocument();
        }
      });
  }

  copyInvoiceSuccessNotifications() {
   const key = 'pw.eivoice.copyInvoiceSuccessMessage';
   this.translate
    .get(key)
    .pipe(take(1))
    .subscribe((translatedMessage: string) => {
    this.overlayNotification
    .show({
    type: OverlayNotificationType.SUCCESS,
    message: translatedMessage ,
    hasBackdrop: true,
    hasClose: true
    })
  });

   }
}
