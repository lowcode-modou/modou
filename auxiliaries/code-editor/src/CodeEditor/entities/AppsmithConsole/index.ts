export enum Severity {
  // Everything, irrespective of what the user should see or not
  // DEBUG = "debug",
  // Something the dev user should probably know about
  INFO = 'info',
  // Doesn't break the app, but can cause slowdowns / ux issues/ unexpected behaviour
  WARNING = 'warning',
  // Can cause an error in some cases/ single widget, app will work in other cases
  ERROR = 'error',
  // Makes the app unusable, can't progress without fixing this.
  // CRITICAL = "critical",
}
