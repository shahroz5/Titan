import {
  Component,
  Input,
  OnChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { ManualBillRequest, ManualBillDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-ab-approval-details',
  templateUrl: './manual-ab-approval-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManualAbApprovalDetailsComponent implements OnChanges {
  @Input() billDetails: ManualBillRequest;
  @Input() currencyCode: string;
  billData: ManualBillDetails;
  weightCode = 'gm';

  ngOnChanges() {
    if (!!this.billDetails) {
      this.billData = this.billDetails?.manualBillDetails;
    }
  }
}
