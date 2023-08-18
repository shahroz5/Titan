import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnInit
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Moment } from 'moment';

@Component({
  selector: 'poss-web-co-details-popup',
  templateUrl: './co-details-popup.component.html',
  styleUrls: ['./co-details-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoDetailsPopupComponent implements OnInit {
  @Input() coDetails = {};
  coDetailsForm: FormGroup;
  naLabel = 'N/A';
  daysLabel = 'Days';
  businessDate: Moment;

  constructor(
    public dialogRef: MatDialogRef<CoDetailsPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {
    this.coDetails = data.dataToBeLoaded;
    this.businessDate = data.businessDate;
  }

  ngOnInit(): void {}

  closePopup(): void {
    this.dialogRef.close(null);
  }

  getNoOfDays(deliveryDateTime) {
    return deliveryDateTime?.diff(this.businessDate, 'days');
  }
}
