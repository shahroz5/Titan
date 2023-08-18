import { Injectable, NgZone } from '@angular/core';
import { CustomErrors } from '@poss-web/shared/models';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  constructor(private readonly zone: NgZone) {}

  default(message: string) {
    this.show(message);
  }

  info(message: string) {
    this.show(message);
  }

  success(message: string) {
    this.show(message);
  }

  warn(message: string) {
    this.show(message);
  }

  error(error: CustomErrors) {
    this.logErrorToConsole(error);
  }

  private show(message: string) {
    console.log(`Notification:${message}`);
  }

  private logErrorToConsole(error: CustomErrors) {
    console.log(`Notification:${error.message}`);
  }
}
