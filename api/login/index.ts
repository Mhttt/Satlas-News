import 'reflect-metadata';
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import SatlasRoute from "../helpers/SatlasRoute";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<any> {
  // Route redirects to aut0 login
};

export default SatlasRoute(httpTrigger, ['GET']);
