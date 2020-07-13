class RequiredParameterError extends Error {
  constructor(value) {
    super(`${value} must be provided.`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequiredParameterError);
    }
  }
}

exports.RequiredParameterError = RequiredParameterError;

// const AppError = (settings, appError) => {
//   settings = settings || {};

//   this.name = "App Error";

//   this.type = settings.type || "Application";
//   this.message = settings.message || "An error occurred.";
//   this.detail = settings.detail || "";
//   this.extendedInfo = settings.extendedInfo || "";
//   this.errorCode = settings.errorCode || "";

//   // This is just a flag that will indicate if the error is a custom AppError. If this
//   // is not an AppError, this property will be undefined, which is a Falsey.
//   this.isAppError = true;

//   // Capture the current stacktrace and store it in the property "this.stack". By
//   // providing the implementationContext argument, we will remove the current
//   // constructor (or the optional factory function) line-item from the stacktrace; this
//   // is good because it will reduce the implementation noise in the stack property.
//   // --
//   // Rad More: https://code.google.com/p/v8-wiki/wiki/JavaScriptStackTraceApi#Stack_trace_collection_for_custom_exceptions
//   Error.captureStackTrace(this, implementationContext || AppError);
// };

// exports.appError = (settings, implementationContext) => {
//   return new AppError(settings, implementationContext);
// };
