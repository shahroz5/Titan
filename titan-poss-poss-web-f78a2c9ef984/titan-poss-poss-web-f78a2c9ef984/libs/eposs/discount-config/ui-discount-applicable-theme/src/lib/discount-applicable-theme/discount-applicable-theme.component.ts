import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  NewDiscountApplicableTheme,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-discount-applicable-theme',
  templateUrl: './discount-applicable-theme.component.html',
  styleUrls: ['./discount-applicable-theme.component.scss']
})
export class DiscountApplicableThemeComponent implements OnInit, OnDestroy {
  currentIndex = 1;
  applicableThemeForm: FormGroup;
  @Input() config: NewDiscountApplicableTheme;
  @Output() save = new EventEmitter<any>();
  destroy$ = new Subject<null>();
  constructor(
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  ngOnInit(): void {
    this.applicableThemeForm = new FormGroup({
      digit1: new FormControl(this.config.applicableThemes.data.digit1),
      digit2: new FormControl(this.config.applicableThemes.data.digit2),
      digit3: new FormControl(this.config.applicableThemes.data.digit3),
      digit4: new FormControl(this.config.applicableThemes.data.digit4),
      digit5: new FormControl(this.config.applicableThemes.data.digit5),
      digit6: new FormControl(this.config.applicableThemes.data.digit6),
      digit8: new FormControl(this.config.applicableThemes.data.digit8),
      digit9: new FormControl(this.config.applicableThemes.data.digit9),
      digit10: new FormControl(this.config.applicableThemes.data.digit10),
      digit11: new FormControl(this.config.applicableThemes.data.digit11),
      digit12: new FormControl(this.config.applicableThemes.data.digit12),
      digit13: new FormControl(this.config.applicableThemes.data.digit13),
      digit14: new FormControl(this.config.applicableThemes.data.digit14)
    });
  }

  saveFn() {
    console.log('details', this.config);
    if (this.config?.discountCode !== '' && !this.config?.isActive) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      const applicableTheme = this.applicableThemeForm.getRawValue();
      let confivalues = this.config;
      confivalues = {
        applicableThemes: {
          data: applicableTheme,
          type: this.config.applicableThemes.type
        }
      };
      this.save.emit(confivalues);
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
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
