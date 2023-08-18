import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  AlertPopupServiceAbstraction,
  CnPriorityConfig,
  CnPriorityConfigResponse,
  CnTypeList,
  ConfigTypeEnum,
  AlertPopupTypeEnum,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'poss-web-cn-priority-config-detail-item',
  templateUrl: './cn-priority-config-detail-item.component.html',
  styleUrls: ['./cn-priority-config-detail-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CnPriorityConfigDetailItemComponent implements OnInit, OnDestroy {
  @Input() vertical = true;
  @Input() horizontal = false;
  @Input() wrap = true;
  @Input() changes = true;
  @Input() cnTypeList$: Observable<CnTypeList[]>;

  @Input() cnPriorityConfig$: Observable<CnPriorityConfigResponse>;

  @Output() saveCnPriorityConfig = new EventEmitter<CnPriorityConfig>();
  @Output() openLocationMappingEvent = new EventEmitter<boolean>();

  destroy$ = new Subject<any>();
  configId: string;
  cnPriorityConfigDetails: any;
  currentIndex = 1;
  hasChange = false;
  addedCnType: any[] = [];
  cnPriorityList: any[] = [];
  cnPriorityConfigForm: FormGroup;
  cnTypeList = [];
  constructor(
    public activatedRoute: ActivatedRoute,
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService,
    private router: Router,
    private dialog: MatDialog,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  locationMapping() {
    if (
      this.cnPriorityConfigDetails?.description &&
      !this.cnPriorityConfigDetails.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else this.openLocationMappingEvent.emit(true);
  }

  initForm(cnPriorityDetailConfig: CnPriorityConfigResponse) {
    this.translateService
      .get(['pw.cnPriorityConfig.configName'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.cnPriorityConfigForm = new FormGroup({
          configName: new FormControl(
            cnPriorityDetailConfig.description
              ? cnPriorityDetailConfig.description
              : '',
            [
              this.fieldValidatorsService.requiredField(
                translatedMessages['pw.cnPriorityConfig.configName']
              ),
              this.fieldValidatorsService.nameWithSpaceField(
                translatedMessages['pw.cnPriorityConfig.configName']
              )
            ]
          ),

          isActive: new FormControl(
            cnPriorityDetailConfig.isActive
              ? cnPriorityDetailConfig.isActive
              : false
          )
        });
      });
    if (this.configId !== 'new') {
      this.cnPriorityConfigForm.get('configName').disable();
    }
  }

  ngOnInit() {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.configId = params['_configId'];
      });

    this.cnPriorityConfig$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cnPriorityConfigDetail => {
        this.configId = cnPriorityConfigDetail.configId;
        this.initForm(cnPriorityConfigDetail);
        this.cnPriorityConfigDetails = cnPriorityConfigDetail;
        this.cnPriorityList = [];

        if (
          this.configId === 'new' ||
          (cnPriorityConfigDetail &&
            cnPriorityConfigDetail.priorityDetails &&
            cnPriorityConfigDetail.priorityDetails.length === 0)
        ) {
          this.cnTypeList$.pipe(takeUntil(this.destroy$)).subscribe(cnType => {
            this.cnTypeList = cnType;
            if (this.cnTypeList.length !== 0) {
              for (const cnPriority of this.cnTypeList) {
                const existCNType = this.cnPriorityList.find(
                  cn => cn.cnType === cnPriority.id
                );
                if (existCNType === null || existCNType === undefined) {
                  this.cnPriorityList.push({
                    cnType: cnPriority.id
                  });
                }
              }
            }
          });
        } else {
          for (const cnPriority of cnPriorityConfigDetail.priorityDetails) {
            this.cnPriorityList.push({
              cnType: cnPriority.cnType
            });
          }
        }
      });
    if (this.configId !== 'new') {
      this.cnPriorityConfigForm.get('configName').disable();
    }
  }

  drop(event: CdkDragDrop<{ title: string; poster: string }[]>) {
    this.hasChange = true;

    moveItemInArray(
      this.cnPriorityList,
      event.previousIndex,
      event.currentIndex
    );
  }
  moveUp(previousIndex: number, currentIndex: number) {
    this.hasChange = true;
    this.currentIndex = previousIndex;

    moveItemInArray(this.cnPriorityList, previousIndex, currentIndex);
  }
  moveDown(previousIndex: number, currentIndex: number) {
    this.hasChange = true;
    this.currentIndex = previousIndex;

    moveItemInArray(this.cnPriorityList, previousIndex, currentIndex);
  }

  saveDetail() {
    if (
      this.cnPriorityConfigDetails &&
      this.cnPriorityConfigDetails?.description &&
      !this.cnPriorityConfigDetails.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      if (this.cnPriorityConfigForm.valid) {
        for (const cnType of this.cnPriorityList) {
          this.addedCnType.push({
            cnType: cnType.cnType,
            priority: this.cnPriorityList.indexOf(cnType) + 1
          });
        }
        const formValues = this.cnPriorityConfigForm.getRawValue();
        const saveCnPriorityConfig = {
          description: formValues.configName,
          isActive: formValues.isActive,
          ruleDetails: {
            data: {
              priorityDetails: this.addedCnType
            },
            type: ConfigTypeEnum.CN_PRIORITY_CONFIG
          }
        };
        this.alertPopupService
          .open({
            type: AlertPopupTypeEnum.CONFIRM,
            message: 'pw.alertPopup.saveConfirmation'
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: boolean) => {
            if (res) {
              this.saveCnPriorityConfig.emit(saveCnPriorityConfig);
            }
          });
      }
      this.hasChange = false;
      this.addedCnType = [];
    }
  }
  showMessage(key: string) {
    this.translateService
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
    this.cnPriorityList = [];
    this.addedCnType = [];
    this.destroy$.next();
    this.destroy$.complete();
  }
}
