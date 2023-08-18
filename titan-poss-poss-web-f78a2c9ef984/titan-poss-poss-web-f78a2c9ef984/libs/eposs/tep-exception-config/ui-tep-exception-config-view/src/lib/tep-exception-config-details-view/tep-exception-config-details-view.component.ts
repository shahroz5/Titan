import { Component, Input, OnInit } from '@angular/core';
import { TEPExceptionConfig, TEPExceptionTypeEnum } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-tep-exception-config-details-view',
  templateUrl: './tep-exception-config-details-view.component.html'
})
export class TepExceptionConfigDetailsViewComponent implements OnInit {

  @Input() tepExceptionConfigDetails: TEPExceptionConfig;
  startDate: Date;
  endDate: Date;
  ngOnInit(): void {
    this.startDate = new Date(this.tepExceptionConfigDetails?.startDate);
    this.endDate = new Date(this.tepExceptionConfigDetails?.endDate);

    let exceptionType = '';
    if (this.tepExceptionConfigDetails.configId) {
      if (
        parseInt(
          this.tepExceptionConfigDetails?.offerDetails?.data?.deductionPercent.toString(),
          10
        )
      ) {
        exceptionType = TEPExceptionTypeEnum.DEDUCTIONPERCENTAGE;
      } else {
        exceptionType = TEPExceptionTypeEnum.FLATTEPEXCHANGEVALUE;
      }
    }
  }
}
