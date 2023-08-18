import { getHomePageUrl } from '@poss-web/shared/util-site-routes';
import { MatDialog } from '@angular/material/dialog';
import { ErrorEnums, ErrorTranslateKeyMap } from '@poss-web/shared/util-error';
import { takeUntil, delay } from 'rxjs/operators';
import { OverlayRef } from '@angular/cdk/overlay';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, ValidatorFn } from '@angular/forms';
import {
  OverlayNotificationEventRef,
  OverlayNotificationType,
  OverlayNotificationEventType,
  OverLayNotificationConfig,
  ShortcutServiceAbstraction,
  Command
} from '@poss-web/shared/models';

import {
  OVERLAY_NOTIFICATION_DATA,
  OVERLAY_REF
} from './overlay-notification.token';

import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  ChangeDetectionStrategy,
  ViewChildren,
  QueryList,
  ElementRef,
  OnInit
} from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { MatButton } from '@angular/material/button';
import {
  FieldValidatorsService,
  fieldValidation
} from '@poss-web/shared/util-field-validators';
import { Router } from '@angular/router';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';

const buttonFocusKey = 'Global.OVERLAY_FOCUS';
@Component({
  selector: 'poss-web-overlay-notification',
  templateUrl: './overlay-notification.component.html',
  styleUrls: ['./overlay-notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverlayNotificationComponent implements OnDestroy, OnInit {
  @ViewChildren(MatButton, { read: ElementRef }) buttons: QueryList<ElementRef>;
  events = new EventEmitter<OverlayNotificationEventRef>();
  remarkEvent = new EventEmitter<string>();
  overlayNotificationTypes = OverlayNotificationType;
  progressValue = 0;
  notificationIntervalRef: Observable<any>;
  notificationForm: FormGroup;
  translatedErrorMsgKey: string;
  eventTypeRef = OverlayNotificationEventType;
  remarksLabel: string;
  private destroy$ = new Subject<void>();
  remarksMaxCharLimit = fieldValidation.remarkField.maxLength;
  navigateToHome = false;
  errorMsgDynamicValues: {};
  locationCode: string;

  constructor(
    @Inject(OVERLAY_NOTIFICATION_DATA) public data: OverLayNotificationConfig,
    @Inject(OVERLAY_REF) private overlayRef: OverlayRef,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    private dialog: MatDialog,
    shortcutService: ShortcutServiceAbstraction,
    private fieldValidatorsService: FieldValidatorsService,
    private router: Router,
    private authFacade: AuthFacade
  ) {
    this.translate
      .get(['pw.overlayNotifcation.remarksLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedLabel: any) => {
        this.remarksLabel =
          translatedLabel['pw.overlayNotifcation.remarksLabel'];
      });

    shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe((command: Command) => {
        if (command.name === buttonFocusKey) {
          this.focus();
        }
      });

    if (
      this.data.type !== OverlayNotificationType.CUSTOM &&
      this.data.type !== OverlayNotificationType.ERROR
    ) {
      if (this.data.type === OverlayNotificationType.TIMER) {
        of(true)
          .pipe(delay(this.data.time), takeUntil(this.destroy$))
          .subscribe(() => this.emitEvent(OverlayNotificationEventType.CLOSE));
      }
      if (this.data.hasRemarks) {
        const validators: ValidatorFn[] = [
          this.fieldValidatorsService.remarkField(this.remarksLabel)
        ];
        if (this.data.isRemarksMandatory) {
          validators.push(
            this.fieldValidatorsService.requiredField(this.remarksLabel)
          );
        }
        this.notificationForm = this.formBuilder.group({
          remarks: [data.remarksValue ? data.remarksValue : null, validators]
        });
      }
    } else if (this.data.type === OverlayNotificationType.ERROR) {
      this.errorHandler(data.error.code, data.error.dynamicValues, data.error);
    }

    if (data.hasClose && !this.navigateToHome) {
      this.overlayRef
        .keydownEvents()
        .pipe(takeUntil(this.destroy$))
        .subscribe((event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            event.stopPropagation();
            this.emitEvent(OverlayNotificationEventType.CLOSE);
          }
        });
    }
  }

  ngOnInit(): void {
    if (this.notificationForm) {
      this.notificationForm.get('remarks').valueChanges.subscribe(remarks => {
        this.remarkEvent.emit(
          String(this.notificationForm.get('remarks').value).trim()
        );
      });
    }

    this.authFacade
      .getLocationCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.locationCode = data;
      });
  }

  emitEvent(eventType: OverlayNotificationEventType) {
    if (
      this.data.hasRemarks === true &&
      eventType !== OverlayNotificationEventType.CLOSE
    ) {
      if (this.notificationForm.get('remarks').valid) {
        this.events.emit({
          eventType,
          data: String(this.notificationForm.get('remarks').value).trim()
        });
      } else {
        this.notificationForm.get('remarks').markAsTouched();
      }
    } else {
      this.events.emit({ eventType, data: null });
    }
  }

  navigateToHomeFn() {
    this.router.navigate([getHomePageUrl()]);
  }

  emitMultiActionEvent(
    selectedId: number,
    hasRemarksValidation: boolean = true
  ) {
    if (this.data.hasRemarks === true && hasRemarksValidation) {
      if (this.notificationForm.get('remarks').valid) {
        this.events.emit({
          selectedId,
          data: this.notificationForm.get('remarks').value
        });
      } else {
        this.notificationForm.get('remarks').markAsTouched();
      }
    } else {
      this.events.emit({
        selectedId,
        data: null
      });
    }
  }

  focus() {
    if (
      this.buttons &&
      this.buttons.first &&
      this.buttons.first.nativeElement
    ) {
      this.dialog.closeAll();
      this.buttons.first.nativeElement.focus();
    }
  }

  errorHandler(errorCode: string, dynamicValues: any, error) {
    //check if the error is the custom error
    if (ErrorTranslateKeyMap.has(errorCode)) {
      //Obtain the transation key which will be use to obtain the translated error message
      //based on the language selected. Default is the english language(refer en.json from asset folder).
      this.translatedErrorMsgKey = ErrorTranslateKeyMap.get(errorCode);
      if (errorCode === ErrorEnums.ERR_SALE_113) {
        this.navigateToHome = true;
      }
      if (dynamicValues && Object.entries(dynamicValues).length !== 0) {
        this.errorMsgDynamicValues = {};
        Object.entries(dynamicValues).forEach(([key, value]) => {
          this.errorMsgDynamicValues[key] = value;
        });
      }
    } else {
      if (error?.error?.status === 504) {
        this.translatedErrorMsgKey = 'pw.errorMessages.ERR-GATEWAY-TIMEOUT';
      } else {
        this.translatedErrorMsgKey = 'pw.errorMessages.ERR-GERNERIC';
      }
    }
  }

  ngOnDestroy(): void {
    this.locationCode = '';
    this.destroy$.next();
    this.destroy$.complete();
  }
}
