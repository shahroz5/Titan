import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import {
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  StatusTypesEnum
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: []
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  @Input() transactionType: CommomStateAttributeTypeEnum;
  orderNumber = 0;
  status: string;
  StatusTypesEnumRef = StatusTypesEnum;
  destroy$: Subject<null> = new Subject<null>();

  constructor(private commonFacade: CommonFacade) {}

  ngOnInit(): void {
    if (this.transactionType) {
      console.log('TRANSACTION TYPE 123 :', this.transactionType);
      this.commonFacade
        .getCommonFacadeAttributes(
          this.transactionType,
          CommomStateAttributeNameEnum.ORDER_NUMBER
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          if (data) {
            this.orderNumber = data.orderNo;
            this.status = data.status;
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
