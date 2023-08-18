import { Injectable } from '@angular/core';
import { PrintingFacade } from '@poss-web/shared/printing/data-access-printing';
import { Observable } from 'rxjs';
import {
  PrintPayload,
  CustomErrors,
  PrintingServiceAbstraction,
  NotificationPayload
} from '@poss-web/shared/models';

@Injectable({
  providedIn: 'root'
})
export class PrintingService implements PrintingServiceAbstraction {
  constructor(private printingFacade: PrintingFacade) {}

  loadPrintData(printdata: PrintPayload) {
    this.printingFacade.loadPrintData(printdata);
  }

  getPrintError(): Observable<CustomErrors> {
    return this.printingFacade.getHasError();
  }
  resetPrint() {
    this.printingFacade.resetPrint();
  }
  getPrinterIsLoading(): Observable<boolean> {
    return this.printingFacade.getIsLoading();
  }

  loadNotificationPrint(notificationData: NotificationPayload) {
    this.printingFacade.loadNotificationPrint(notificationData);
  }

  getIsNotificationPrintSuccess(): Observable<boolean> {
    return this.printingFacade.getIsNotifcationPrintSuccess();
  }

  getIsNotificationMailSent(): Observable<boolean> {
    return this.printingFacade.getIsNotificationMailSent();
  }

  getIsPrintingSuccess(): Observable<boolean> {
    return this.printingFacade.getIsPrintSuccess();
  }

  getIsMailSent(): Observable<boolean> {
    return this.printingFacade.getIsMailSent();
  }
}
