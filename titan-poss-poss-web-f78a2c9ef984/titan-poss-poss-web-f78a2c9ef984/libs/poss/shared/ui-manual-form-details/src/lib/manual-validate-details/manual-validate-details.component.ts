import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { ManualBillRequest, ManualBillDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-manual-validate-details',
  templateUrl: './manual-validate-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManualValidateDetailsComponent implements OnInit, OnChanges {
  @Input() billDetails: ManualBillRequest;
  @Input() currencyCode: string;
  billData: ManualBillDetails;
  weightCode = 'gm';
  weightCodes = 'gms';



  ngOnInit() {
    console.log(
      'NG ON INIT ManualValidateDetailsComponent :',
      this.billDetails
    );
  }

  ngOnChanges() {
    if (!!this.billDetails) {
      this.billData = this.billDetails?.manualBillDetails;
    }
    console.log('BILL DATA :', this.billData);
  }
}
