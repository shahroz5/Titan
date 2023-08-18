import { EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export const countryStateChange = (
  form: FormGroup,
  emitter: {
    countryChange: EventEmitter<string>;
    stateChange: EventEmitter<string>;
  },
  countryFormControlName: string,
  stateFormControlName: string,
  townFormControlName: string,
  destroy$: Subject<any>
) => {
  if (form.get(stateFormControlName).value !== null) {
    form.get(townFormControlName).enable();
  } else {
    form.get(townFormControlName).disable();
  }
  form
    .get(countryFormControlName)
    .valueChanges.pipe(takeUntil(destroy$))
    .subscribe(country => {
      form.get(stateFormControlName).reset();
      form.get(townFormControlName).reset();
      if (country !== null && country !== undefined) {
        emitter.countryChange.emit(country);
        form.get(stateFormControlName).enable();
      } else {
        form.get(stateFormControlName).disable();
      }
    });

  form
    .get(stateFormControlName)
    .valueChanges.pipe(takeUntil(destroy$))
    .subscribe(state => {
      form.get(townFormControlName).reset();
      if (state !== null && state !== undefined) {
        emitter.stateChange.emit(state);
        form.get(townFormControlName).enable();
      } else {
        form.get(townFormControlName).disable();
      }
    });
};

export const getFromMinDate = (
  form: FormGroup,
  toDateFormControlName: string,
  maxDays: number
): moment.Moment => {
  const toDate = form.get(toDateFormControlName).value as moment.Moment;
  if (toDate) {
    return subtractMaxMonths(moment(toDate), maxDays);
  }
  return null;
};

export const getToMaxDate = (
  form: FormGroup,
  fromDateFormControlName: string,
  maxDays: number
): moment.Moment => {
  const fromDate = form.get(fromDateFormControlName).value as moment.Moment;
  if (fromDate) {
    const minDate = addMaxMonths(moment(fromDate), maxDays);

    return minDate.valueOf() < moment().valueOf() ? minDate : moment();
  }
  return moment();
};
export const subtractMaxMonths = (
  date: moment.Moment,
  maxDays: number
): moment.Moment => {
  return date.subtract(maxDays, 'days');
};

export const addMaxMonths = (
  date: moment.Moment,
  maxDays: number
): moment.Moment => {
  return date.add(maxDays, 'days');
};

export const locationChange = (
  form: FormGroup,
  emitter: {
    locationFormControlName: EventEmitter<string[]>;
  },
  locationFormControlName: string,
  confirmedByRsoFormControlName: string,

  destroy$: Subject<any>
) => {
  console.log(
    'locationCodeChange',
    locationFormControlName,
    confirmedByRsoFormControlName
  );
  form
    .get(locationFormControlName)
    .valueChanges.pipe(takeUntil(destroy$))
    .subscribe(locationCode => {
      form.get(locationFormControlName)?.reset();

      if (locationCode !== null && locationCode !== undefined) {
        emitter.locationFormControlName.emit(locationCode);
        form.get(confirmedByRsoFormControlName).enable();
      } else {
        form.get(confirmedByRsoFormControlName).disable();
      }
    });
};
export const binGroupChange = (
  form: FormGroup,
  emitter: EventEmitter<string>,
  binGroupFormControlName: string,
  binCodeFormControlName: string,
  destroy$: Subject<any>
) => {
  form
    .get(binGroupFormControlName)
    .valueChanges.pipe(takeUntil(destroy$))
    .subscribe(binGroup => {
      form.get(binCodeFormControlName).reset();
      if (binGroup !== null && binGroup !== undefined) {
        emitter.emit(binGroup);
        form.get(binCodeFormControlName).enable();
      } else {
        form.get(binCodeFormControlName).disable();
      }
    });
};
