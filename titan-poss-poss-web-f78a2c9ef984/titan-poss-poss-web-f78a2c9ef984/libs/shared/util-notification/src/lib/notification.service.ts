import { Injectable, NgZone } from '@angular/core';
import { CustomErrors } from '@poss-web/shared/models';

/**
 * Notification Service takes the responsibility to rect to various notification or alert like error occurance,
 * application notification.
 * Notification service decides
 * * Whether to log the error and display the custom error message to user.
 * * To emit an action if the notification type is actionable
 * * To emit an action if the notification type is informational
 * @todo Currently notifiation service is login the error message to console.
 *        But logging service need to be created to handle the logging functionality
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
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
