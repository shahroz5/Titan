import { NotificationService } from '@poss-web/shared/util-notification';
import { CustomErrors } from '@poss-web/shared/models';
import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Inject } from '@angular/core';

/** Application-wide error handler that adds a UI notification to the error handling
 * provided by the default Angular ErrorHandler.
 */
@Injectable({
  providedIn: 'root'
})
export class AppErrorHandler extends ErrorHandler {
  constructor(
    private notificationsService: NotificationService,
    @Inject('env') private environment
  ) {
    super();
    console.log('AppErrorHandler Init');
  }

  handleError(error: Error | HttpErrorResponse) {
    const customError: CustomErrors = {
      code: '',
      message: '',
      traceId: '',
      timeStamp: '',
      error
    };

    let displayMessage = 'An error occurred.';

    if (!this.environment.production) {
      displayMessage += ' See console for details.';
    }

    this.notificationsService.error(customError);
    if (this.environment.production === false) {
      super.handleError(error);
    }
  }
}
