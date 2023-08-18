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
import {} from '@poss-web/shared/ui-master-form-models';
import {
  CnTypeList,
  CnValidationResponse,
  ConfigTypeEnum
} from '@poss-web/shared/models';
import { ActivatedRoute } from '@angular/router';

import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-cn-validation-view-detail-item',
  templateUrl: './cn-validation-view-detail-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CnValidationViewDetailItemComponent implements OnInit, OnDestroy {
  @Input() cnValidation$: Observable<CnValidationResponse>;
  @Input() cnTypeList$: Observable<CnTypeList[]>;

  @Output() openLocationMappingEvent = new EventEmitter<boolean>();

  configTypeEnumRef = ConfigTypeEnum;

  destroy$ = new Subject<any>();
  ruleId: string;
  ruleType: string;
  residualValueAmountLabel: string;
  cnValidationDetail: any;
  constructor(public activatedRoute: ActivatedRoute) {}

  locationMapping() {
    this.openLocationMappingEvent.emit(true);
  }

  ngOnInit() {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.ruleId = params['_ruleId'];
        this.ruleType = params['_ruleType'];
      });

    this.cnValidation$.pipe(takeUntil(this.destroy$)).subscribe(cnDetail => {
      if (cnDetail) {
        this.ruleId = cnDetail.ruleId;
        this.ruleType = cnDetail.ruleType;
        this.cnValidationDetail = cnDetail;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
