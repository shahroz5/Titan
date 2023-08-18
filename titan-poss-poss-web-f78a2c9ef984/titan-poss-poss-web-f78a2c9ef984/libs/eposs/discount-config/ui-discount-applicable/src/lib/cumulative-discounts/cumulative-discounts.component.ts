import {
  DiscountTypeEnum,
  CumulativeDiscountConfig
} from '@poss-web/shared/models';
import { take, takeUntil } from 'rxjs/operators';
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
  AfterViewInit
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-cumulative-discounts',
  templateUrl: './cumulative-discounts.component.html',
  styleUrls: ['./cumulative-discounts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CumulativeDiscountsComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @Input() selectedDiscount: DiscountTypeEnum;
  @Input() config: CumulativeDiscountConfig;
  @Output() update = new EventEmitter<CumulativeDiscountConfig>();
  @Output() formDirtyCheck = new EventEmitter<any>();
  destroy$ = new Subject();

  form: FormGroup;



  ngOnInit() {
    this.form = new FormGroup({
      isSameStore: new FormControl(this.config.isSameStore),
      isFamilyTree: new FormControl(this.config.isFamilyTree)
    });

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const value = this.form.value;
      this.update.emit({
        isSameStore: value.isSameStore,
        isOtherStore: !value.isOtherStore,
        isFamilyTree: value.isFamilyTree
      });
    });
  }
  ngAfterViewInit(): void {
    this.form.valueChanges.pipe(take(1)).subscribe(val => {
      this.formDirtyCheck.emit(this.form.dirty);
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
