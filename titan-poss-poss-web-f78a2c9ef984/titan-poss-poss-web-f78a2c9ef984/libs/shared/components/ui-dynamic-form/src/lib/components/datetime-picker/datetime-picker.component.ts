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
  selector: 'poss-web-mat-datetime-picker',
  templateUrl: './datetime-picker.component.html',
  styleUrls: ['./datetime-picker.component.scss']
})
export class DatetimePickerComponent implements OnInit, OnChanges {
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
    const dialogRef = this.dialog.open(DialogDateTimePicker, {
      width: '450px',
      data: {
        datetime: this.datetime,
        dateTimeValidators: this.dateTimeValidators
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.datetime = result.format(
          this.dateFormatService.getDateTimeFormat()
        );
        this.dateTimeSelectChange.emit(this.datetime);
      }
    });
  }
}

@Component({
  selector: 'poss-web-dialog-datetime-picker',
  templateUrl: 'dialog-datetime-picker.html'
})
export class DialogDateTimePicker {
  selectedDate: moment.Moment;
  hours: number[] = [];
  minutes: number[] = [];
  seconds: number[] = [];
  meridies = ['AM', 'PM'];

  hour: number;
  minute: number;
  second: number;
  meridie: string;

  errorCheck = false;
  error: string;

  minDate: Date;
  maxDate: Date;

  constructor(
    public dialogRef: MatDialogRef<DialogDateTimePicker>,
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

    this.selectedDate = moment(
      this.data.datetime,
      this.dateFormatService.getDateTimeFormat()
    );

    for (let i = 0; i <= 12; i++) {
      this.hours.push(i);
    }
    for (let i = 0; i <= 59; i++) {
      this.minutes.push(i);
      this.seconds.push(i);
    }

    this.hour = this.selectedDate.toDate().getHours();
    this.minute = this.selectedDate.toDate().getMinutes();
    this.second = this.selectedDate.toDate().getSeconds();

    if (this.data.datetime) {
      if (this.hour > 12) {
        this.hour -= 12;
        this.meridie = 'PM';
      } else {
        if (this.hour === 12) {
          this.meridie = 'PM';
        } else {
          this.meridie = 'AM';
        }
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
      if (
        this.hour == null ||
        this.minute == null ||
        this.second == null ||
        this.meridie == null
      ) {
        this.errorCheck = true;
        this.error = 'Please select time';
      } else {
        this.errorCheck = false;
        if (this.meridie === 'PM') {
          this.hour += 12;
        }

        this.selectedDate = this.selectedDate.set({
          hour: this.hour,
          minute: this.minute,
          second: this.second
        });
        this.dialogRef.close(this.selectedDate);
      }
    } else {
      this.errorCheck = true;
      this.error = 'Please select a date.';
    }
  }
}
