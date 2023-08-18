import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateformatService {



  getDateFormat() {
    return 'DD-MM-YYYY';
  }

  getDateTimeFormat() {
    return 'DD-MM-YYYY HH:mm:ss';
  }
}
