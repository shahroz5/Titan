import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  TaxDetailsConfig,
  TaxDetailsSelect,
  StateTaxConfigurationStateDetails,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-tax-details',
  templateUrl: './tax-details.component.html',
  styleUrls: ['./tax-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaxDetailsComponent implements OnInit, OnDestroy {
  constructor(
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  @Input() stateTaxDetailsList: Observable<TaxDetailsConfig[]>;
  @Input() stateTaxConfigurationStateDetails: StateTaxConfigurationStateDetails;
  @Input() taxComponentDetails: Observable<string[]>;
  @Input() allTaxClassList: Observable<string[]>;

  @Output() stateTaxDetailsChecked = new EventEmitter<TaxDetailsSelect>();
  @Output() stateTaxDetailsCheckedAll = new EventEmitter<boolean>();
  @Output() taxClassEdit = new EventEmitter<boolean>();

  destroy$ = new Subject<null>();

  atleastOneSelected = false;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowInfo: number | string;

  ngOnInit() {
    this.stateTaxDetailsList.pipe(takeUntil(this.destroy$)).subscribe(list => {
      if (list.filter(data => data.isSelected).length) {
        this.atleastOneSelected = true;
      } else {
        this.atleastOneSelected = false;
      }
    });
    // (stateTaxDetailsList | async).filter(d => d.isSelected).length
  }

  taxListCheck($event: MatCheckboxChange, taxDetailsId: string) {
    this.stateTaxDetailsChecked.emit({ checked: $event.checked, taxDetailsId });
  }

  taxListCheckAll($event: MatCheckboxChange) {
    this.stateTaxDetailsCheckedAll.emit($event.checked);
  }

  editTaxClass(edit: boolean) {
    if (
      this.stateTaxConfigurationStateDetails &&
      this.stateTaxConfigurationStateDetails?.stateCode !== '' &&
      !this.stateTaxConfigurationStateDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else this.taxClassEdit.emit(edit);
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

  getTaxComponentValue(data: { [x: string]: number }, item: string) {
    return data ? (data[item] === undefined ? '' : data[item]) : '';
  }

  // extractTaxComponent() {
  //   this.stateTaxConfigurationStateDetails.taxComponent.tax.forEach(el => {
  //     this.taxComponent.push(el.taxCode);
  //   });
  //   this.stateTaxConfigurationStateDetails.taxComponent.cess.forEach(el => {
  //     this.taxComponent.push(el.cessCode);
  //   });
  // }

  onfocus(key: string, data: number) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.focusedHeaderName = translatedMessage;
      })
    this.isFocusing = true;
    this.currentRowInfo = data;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
