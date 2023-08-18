import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  CnMasterDetail,
  CnMasterDetails,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-cn-master-detail-item',
  templateUrl: './cn-master-detail-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CnMasterDetailItemComponent implements OnInit, OnDestroy {
  @Input() cnMasterDetail$: Observable<CnMasterDetail>;

  @Output() saveCnMasterDetail = new EventEmitter<CnMasterDetails>();
  cnMasterForm: FormGroup;
  destroy$: Subject<null> = new Subject<null>();
  cnMasterDetail: CnMasterDetail;

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  ngOnInit(): void {
    if (this.cnMasterDetail$) {
      this.cnMasterDetail$
        .pipe(takeUntil(this.destroy$))
        .subscribe((cnDetail: CnMasterDetail) => {
          this.cnMasterDetail = cnDetail;
        });
    }
    this.translate
      .get(['pw.cnMaster.descriptionLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.cnMasterForm = new FormGroup({
          creditNoteType: new FormControl({
            value: this.cnMasterDetail
              ? this.cnMasterDetail.creditNoteType
              : '',
            disabled: true
          }),

          description: new FormControl(
            this.cnMasterDetail ? this.cnMasterDetail.description : '',
            [
              this.fieldValidatorsService.requiredField(
                translatedMessages['pw.cnMaster.descriptionLabel']
              ),
              this.fieldValidatorsService.descriptionField(
                translatedMessages['pw.cnMaster.descriptionLabel']
              )
            ]
          ),
          allowedForGHS: new FormControl(
            this.cnMasterDetail
              ? this.cnMasterDetail.IsAllowedForGHSGrammageAccount
              : false
          ),
          allowedForeGHS: new FormControl(
            this.cnMasterDetail ? this.cnMasterDetail.IsAllowedforEghs : false
          ),
          isActive: new FormControl(
            this.cnMasterDetail ? this.cnMasterDetail.isActive : false
          )
        });
      });
  }

  saveDetail() {
    if (this.cnMasterDetail?.description && !this.cnMasterDetail?.isActive) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      if (this.cnMasterForm.valid) {
        const formData = this.cnMasterForm.getRawValue();
        const cnDetailUpdate = {
          description: formData.description,
          isActive: formData.isActive,
          configDetails: {
            data: {
              IsAllowedForGHSGrammageAccount: formData.allowedForGHS,
              IsAllowedforEghs: formData.allowedForeGHS
            }
          }
        };
        this.saveCnMasterDetail.emit(cnDetailUpdate);
      }
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
