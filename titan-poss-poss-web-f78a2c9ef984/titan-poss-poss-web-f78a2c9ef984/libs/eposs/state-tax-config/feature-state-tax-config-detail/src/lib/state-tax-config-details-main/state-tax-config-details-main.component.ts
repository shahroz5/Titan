import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';

import { StateTaxConfigurationFacade } from '@poss-web/eposs/state-tax-config/data-access-state-tax-config';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  CustomErrors,
  StateData,
  TaxDetailsConfig,
  TaxDetailsSelect,
  StateTaxConfigurationStateDetails,
  TaxDetailsPopup,
  TaxsList,
  OverlayNotificationType,
  TaxDetailsSubmit,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import { MatDialog } from '@angular/material/dialog';
import { TaxDetailsPopupComponent } from '@poss-web/eposs/state-tax-config/ui-state-tax-config-detail';
import { takeUntil, take } from 'rxjs/operators';
import {
  getStateTaxConfigurationDetailsRouteUrl,
  getStateTaxConfigurationRouteUrl
} from '@poss-web/shared/util-site-routes';

@Component({
  selector: 'poss-web-state-tax-config-details-main',
  templateUrl: './state-tax-config-details-main.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateTaxConfigDetailsMainComponent implements OnInit, OnDestroy {
  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private appsettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private stateTaxConfigurationFacade: StateTaxConfigurationFacade,
    public dialog: MatDialog
  ) {}

  isLoading$: Observable<boolean>;
  hasError$: Observable<CustomErrors>;
  allStateList$: Observable<StateData[]>;
  allTaxSystemList$: Observable<string[]>;
  stateTaxDetailsList$: Observable<TaxDetailsConfig[]>;
  stateTaxConfigurationStateDetails$: Observable<
    StateTaxConfigurationStateDetails
  >;
  taxComponentDetails$: Observable<string[]>;
  allTaxClassList$: Observable<string[]>;
  allTaxsList$: Observable<TaxsList[]>;
  isNew = true;
  destroy$ = new Subject<null>();

  showViewOnly: boolean;
  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.showViewOnly = params?.showViewOnly === 'true' ? true : false;
      });
    this.stateTaxConfigurationFacade.resetState();

    this.stateTaxConfigurationFacade.loadAllStateList();
    this.stateTaxConfigurationFacade.loadAllTaxSystemList();
    this.stateTaxConfigurationFacade.loadAllTaxClassList();
    this.stateTaxConfigurationFacade.loadAllTaxsList();

    this.stateTaxConfigurationStateDetails$ = this.stateTaxConfigurationFacade.getTaxDetailsStateDetails();
    this.stateTaxDetailsList$ = this.stateTaxConfigurationFacade.getTaxDetailsListing();
    this.taxComponentDetails$ = this.stateTaxConfigurationFacade.getTaxComponentDetails();
    this.allStateList$ = this.stateTaxConfigurationFacade.getAllStateList();
    this.allTaxSystemList$ = this.stateTaxConfigurationFacade.getAllTaxSystemList();
    this.allTaxClassList$ = this.stateTaxConfigurationFacade.getAllTaxClassList();
    this.allTaxsList$ = this.stateTaxConfigurationFacade.getAllTaxsList();

    this.hasError$ = this.stateTaxConfigurationFacade.getError();
    this.isLoading$ = this.stateTaxConfigurationFacade.getIsLoading();

    this.stateTaxConfigurationFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.stateTaxConfigurationFacade
      .getTaxDetailsStateDetailsSaveResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.router.navigate([
            getStateTaxConfigurationDetailsRouteUrl(),
            data.id
          ]);
          this.showNotification('pw.statetaxconfiguration.successMsg');
        }
      });

    this.stateTaxConfigurationFacade
      .getTaxDetailsStateDetailsEditResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data1 => {
        if (data1) {
          this.showNotification('pw.statetaxconfiguration.successMsg');
        }
      });

    this.stateTaxConfigurationFacade
      .getTaxDetailsSaveResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data1 => {
        if (data1) {
          this.showNotification('pw.statetaxconfiguration.successMsg');
          this.stateTaxConfigurationFacade.loadTaxDetailsList(configId);
        }
      });

    const configId = this.activatedRoute.snapshot.params['_configId'];
    if (configId) {
      this.isNew = false;
      this.stateTaxConfigurationFacade.loadStateTaxDetails(configId);
      this.stateTaxConfigurationFacade.loadTaxDetailsList(configId);
    }
  }

  stateTaxDetailsChecked($event: TaxDetailsSelect) {
    this.stateTaxConfigurationFacade.selectTaxDetailsCheckbox($event);
  }

  stateTaxDetailsCheckedAll(checked: boolean) {
    this.stateTaxConfigurationFacade.selectAllTaxDetailsCheckbox(checked);
  }

  stateTaxConfigurationStateFormDetails(
    $event: StateTaxConfigurationStateDetails
  ) {
    const configId = this.activatedRoute.snapshot.params['_configId'];
    if (configId) {
      this.stateTaxConfigurationFacade.editStateTaxConfigurationStateDetails(
        $event,
        configId
      );
    } else {
      this.stateTaxConfigurationFacade.saveStateTaxConfigurationStateDetails(
        $event
      );
    }
  }

  taxDetailsEdit(mode: boolean) {
    // True - Edit, false - Add new
    const data: TaxDetailsPopup = {
      taxComponent$: this.taxComponentDetails$,
      allTaxClassList$: this.allTaxClassList$,
      stateTaxDetailsList$: this.stateTaxDetailsList$,
      mode
    };
    const dialogRef = this.dialog.open(TaxDetailsPopupComponent, {
      width: '500px',
      height: 'auto',
      data: data,
      disableClose: true
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((taxDetailsFormData: TaxDetailsSubmit) => {
        if (taxDetailsFormData) {
          const configId = this.activatedRoute.snapshot.params['_configId'];
          if (configId) {
            this.stateTaxConfigurationFacade.editStateTaxConfigurationTaxDetails(
              taxDetailsFormData,
              configId
            );
          }
        }
      });
  }

  showNotification(key: string) {
    this.overlayNotification.close();

    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMsg,
            time: 2000,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe();
      });
  }

  errorHandler(error: CustomErrors) {
    // if (error.code === this.searchErrorCode) {
    //   return;
    // }
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  backArrow() {
    this.stateTaxConfigurationFacade.resetState();
    this.router.navigate([getStateTaxConfigurationRouteUrl()]);
  }
}
