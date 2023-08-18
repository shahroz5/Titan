import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import * as moment from 'moment';
import { DateformatService } from '../../services/dateformat.service';

export interface DialogData {
  datetime: string;
  dateTimeValidators: { minDate?: string; maxDate?: string };
}

@Component({
  selector: 'poss-web-mat-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit, OnChanges {
  @Input() datetime: string;
  @Input() field: any;
  @Output() dateTimeSelectChange: EventEmitter<any> = new EventEmitter();

  private dateTimeValidators: { minDate?: string; maxDate?: string };

  selectedDate: any;
  constructor(
    public dialog: MatDialog,
    private dateFormatService: DateformatService
  ) {}

  ngOnInit() {
    this.dateTimeValidators = this.field.dateTimeValidators;
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    this.datetime = changes.datetime.currentValue;
  }

  openCalenderTime(): void {
    const dialogRef = this.dialog.open(DialogDatePicker, {
      width: '450px',
      data: {
        datetime: this.datetime,
        dateTimeValidators: this.dateTimeValidators
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.datetime = result.format(this.dateFormatService.getDateFormat());
        this.dateTimeSelectChange.emit(this.datetime);
      }
    });
  }
}

@Component({
  selector: 'poss-web-dialog-date-picker',
  templateUrl: 'dialog-date-picker.html'
})
export class DialogDatePicker {
  selectedDate: moment.Moment;

  errorCheck = false;
  error: string;

  minDate: Date;
  maxDate: Date;

  constructor(
    public dialogRef: MatDialogRef<DialogDatePicker>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dateFormatService: DateformatService
  ) {
    if (this.data.dateTimeValidators) {
      if (this.data.dateTimeValidators.minDate) {
        const minDate = this.data.dateTimeValidators.minDate
          .split(',')
          .map(Number);
        this.minDate = new Date(minDate[0], minDate[1], minDate[2]);
      }

      if (this.data.dateTimeValidators.maxDate) {
        const maxDate = this.data.dateTimeValidators.maxDate
          .split(',')
          .map(Number);
        this.maxDate = new Date(maxDate[0], maxDate[1], maxDate[2]);
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  dateSelected($event: moment.Moment) {
    this.selectedDate = $event;
  }

  okClick() {
    if (this.selectedDate) {
      this.dialogRef.close(this.selectedDate);
    } else {
      this.errorCheck = true;
      this.error = 'Please select a date.';
    }
  }
}
