import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import {
  getInStockHomeRouteUrl
} from '@poss-web/shared/util-site-routes';
import { UpdateHallmarkFacade } from '@poss-web/eposs/update-hallmark/data-access-update-hallmark';
import { CustomErrors, OverlayNotificationServiceAbstraction, OverlayNotificationType, UpdateHallmarkDetails } from '@poss-web/shared/models';
import { take, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';


@Component({
  selector: 'poss-web-update-item-hallmark-details',
  templateUrl: './update-item-hallmark-details.component.html',
  styleUrls: ['./update-item-hallmark-details.component.scss']
})
export class UpdateItemHallmarkDetailsComponent implements OnInit {

  formGroup: FormGroup;
  destroy$: Subject<null> = new Subject<null>();
  isLoading$: Observable<boolean>;

  itemCodeLabel: string = '';
  lotNumberLabel: string = '';
  isHallmarkedLabel: string = '';

  @ViewChild('form') form;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fieldValidatorsService: FieldValidatorsService,
    private formbuilder: FormBuilder,
    private facade: UpdateHallmarkFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
  ) {
    this.translate
      .get([
        'pw.updateHallmark.itemCodeLabel',
        'pw.updateHallmark.lotNumberLabel',
        'pw.updateHallmark.isHallmarkedLabel'
      ])
      .subscribe((translatedLabels: any) => {
        this.itemCodeLabel =
          translatedLabels['pw.updateHallmark.itemCodeLabel'];
        this.lotNumberLabel =
          translatedLabels['pw.updateHallmark.lotNumberLabel'];
        this.isHallmarkedLabel =
          translatedLabels['pw.updateHallmark.isHallmarkedLabel'];

      });
  }

  ngOnInit(): void {

    this.isLoading$ = this.facade.getIsLoading();
    this.facade.resetError();

    this.facade
    .getIsHallmarkDetailsUpdated()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      if(data) {
        this.updateNotification('pw.instock.hallmarkDetailsUpdateMsg')
      }
    });

    this.facade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.createForm()

  }

  createForm() {
    this.formGroup = this.formbuilder.group({
      itemCode: ['', [this.fieldValidatorsService.itemCodeField(this.itemCodeLabel), this.fieldValidatorsService.requiredField(this.itemCodeLabel)]],
      lotNumber: ['', [this.fieldValidatorsService.itemCodeField(this.lotNumberLabel), this.fieldValidatorsService.requiredField(this.lotNumberLabel)]],
      isHallmarked: [{value: true, disabled: true}]
    });
  }

  save() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      let payload: UpdateHallmarkDetails = {
        itemCode : this.formGroup.get('itemCode').value,
        lotNumber: this.formGroup.get('lotNumber').value,
        isHallmark: true
      }
      this.facade.updateHallmarkDetails(payload);
    }
  }

  back() {
    this.router.navigate([getInStockHomeRouteUrl()]);
  }

  updateNotification(updatedkey) {
    this.translate
      .get([updatedkey])
      .pipe(take(1))
      .subscribe((translatedMsg: any) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SUCCESS,
            hasBackdrop: false,
            hasClose: true,
            message: translatedMsg[updatedkey]
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe(x => {
              //this.formGroup.reset();
              this.form.resetForm();
              this.formGroup.get('isHallmarked').setValue(true);
              //this.formGroup.markAsUntouched();
              //this.formGroup.markAsPristine();
            }
          );
      });
  }

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
