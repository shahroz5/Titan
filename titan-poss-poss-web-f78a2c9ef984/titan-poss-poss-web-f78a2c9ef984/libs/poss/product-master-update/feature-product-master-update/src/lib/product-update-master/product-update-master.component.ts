import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  CustomErrors,
  OverlayNotificationEventRef,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { ProductMasterUpdateFacade } from 'libs/poss/product-master-update/data-access-product-master-update/src/lib/+state/product-master-update.facades';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-product-update-master',
  templateUrl: './product-update-master.component.html',
  styleUrls: ['./product-update-master.component.scss']
})
export class ProductUpdateMasterComponent implements OnInit {
  updateForm: FormGroup;
  destroy$ = new Subject();
  isLoading$: Observable<boolean>;
  updateResponse: any;
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;
  constructor(
    private router: Router,
    private fieldValidatorsService: FieldValidatorsService,
    public translate: TranslateService,
    private productMasterUpdateFacade: ProductMasterUpdateFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.productMasterUpdateFacade.getIsLoading();
    this.updateForm = new FormGroup({
      itemCode: new FormControl('', [
        this.fieldValidatorsService.requiredField('Item Code')
      ]),
      lotNumber: new FormControl('', [
        this.fieldValidatorsService.requiredField('Lot Number')
      ])
    });
    this.productMasterUpdateFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.productMasterUpdateFacade
      .getUpdateResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          this.showSuccessMessageNotification();
        }
      });
  }
  updateProductMaster() {
    this.productMasterUpdateFacade.loadProductMasterUpdate(
      this.updateForm.get('itemCode').value,
      this.updateForm.get('lotNumber').value
    );
  }
  back() {
    this.router.navigate([`configuration/home`]);
  }
  showSuccessMessageNotification() {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.CUSTOM,
        message: '',
        hasBackdrop: true,
        hasClose: true,
        template: this.confirmSuccessNotificationTemplate
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.back();
      });
  }
  errorHandler(error: CustomErrors) {
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
