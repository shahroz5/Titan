import * as moment from 'moment';
export abstract class CommonBaseComponent {
  private actionTimings = [];
  // timeTrackingLog : to log time tracking based in config file values
  constructor(public timeTrackingLog: boolean = false) {}
  //  Method to clear state data
  // public abstract clearStateData();

  // actionDescription : description of specific action
  // specificActionLog : to log specific action
  public startTracking(actionDescription: string, specificActionLog = true) {
    if (specificActionLog && this.timeTrackingLog) {
      // to clear existing start of given action
      this.actionTimings.forEach(element => {
        if (element.description === actionDescription) {
          const index = this.actionTimings.indexOf(element);
          if (index > -1) {
            this.actionTimings.splice(index, 1);
          }
        }
      });
      // to push the action description and start time of action
      this.actionTimings.push({
        description: actionDescription,
        time: new Date().getTime()
      });
      // to log start time of action
      console.log(
        `Time Tracking: Start --- ${actionDescription}`,
        ` --- `,
        moment(new Date().getTime()).format('LTS')
      );
    }
  }

  public stopTracking(actionDescription: string, specificActionLog = true) {
    if (specificActionLog) {
      let timeElapsed: number;

      this.actionTimings.forEach(element => {
        if (element.description === actionDescription) {
          timeElapsed = new Date().getTime() - element.time;
          // to log stop time of action
          console.log(
            `Time Tracking: Stop --- ${actionDescription}`,
            ` --- `,
            moment(new Date().getTime()).format('LTS'),
            `[` +
              `Seconds -- ` +
              timeElapsed / 1000 +
              ` sec` +
              `, Milli Seconds -- ` +
              timeElapsed +
              ' ms' +
              `]`
          );
          // to clear logged action
          const index = this.actionTimings.indexOf(element);
          if (index > -1) {
            this.actionTimings.splice(index, 1);
          }
        }
      });
    }
  }

  // to clear log time data
  public clearLogData() {
    this.actionTimings = [];
  }
}
