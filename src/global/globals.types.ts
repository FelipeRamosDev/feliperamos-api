import ErrorModel from '../models/ErrorModel';

declare global {
  var toError: (message: string, name?: string) => ErrorModel;
}
