import {
  Component,
  Input,
  OnChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { ManualBillRequest, ManualBillDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-manual-ab-validate-details',
  templateUrl: './manual-ab-validate-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManualAbValidateDetailsComponent implements OnChanges {
  @Input() billDetails: ManualBillRequest;
  @Input() currencyCode: string;
  billData: ManualBillDetails;
  weightCode = 'gm';
  weightCodes = 'gms';


  ngOnChanges() {
    if (!!this.billDetails) {
      this.billData = this.billDetails?.manualBillDetails;
    }
  }
}
