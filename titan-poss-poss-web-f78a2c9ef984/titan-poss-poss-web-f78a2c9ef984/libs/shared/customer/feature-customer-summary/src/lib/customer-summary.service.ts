import { takeUntil } from 'rxjs/operators';
import { Injectable, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomerSummaryComponent } from './customer-summary.component';
import {
  CustomerSummaryAbstraction,
  CustomErrors,
  CreatedCustomerResponse,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';

@Injectable()
export class CustomerSummaryService implements CustomerSummaryAbstraction {
  customerSummaryDetails: CreatedCustomerResponse;

  constructor(
    private dialog: MatDialog,
    private customerFacade: CustomerFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  public open(customerId): EventEmitter<any> {
    const destroy$ = new Subject();
    this.customerFacade.loadSelectedCustomerDetail(customerId, true);

    this.customerFacade
      .getSelectedCustomerDetail()
      .pipe(takeUntil(destroy$))
      .subscribe(customerDetail => {
        this.customerSummaryDetails = customerDetail;
        if (
          this.customerSummaryDetails &&
          this.customerSummaryDetails !== null &&
          this.dialog.openDialogs.length === 0
        ) {
          const dialogref = this.dialog.open(CustomerSummaryComponent, {
            width: 'auto',
            autoFocus: false,
            data: this.customerSummaryDetails
          });
          dialogref
            .afterClosed()
            .pipe(takeUntil(destroy$))
            .subscribe((dailogResponse: any) => {
              event.emit(dailogResponse);
              destroy$.next();
              destroy$.complete();
            });
        }
      });

    const event = new EventEmitter<any>();
    this.customerFacade
      .getError()
      .pipe(takeUntil(destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error, destroy$);
        }
      });

    return event;
  }

  errorHandler(error: CustomErrors, destroy$: Subject<any>) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      })
      .events.pipe(takeUntil(destroy$))
      .subscribe();
  }
}
