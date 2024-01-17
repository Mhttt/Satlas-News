import { AzureFunction, Context,HttpRequest } from "@azure/functions";
import ConnectionManager from "../database/ConnectionManager";

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': '*',
}

function SatlasRoute(handler: AzureFunction, methods: string[]) {
  async function handle(context: Context, req: HttpRequest): Promise<any> {
    const method = req.method!.toUpperCase();

    if (!methods.includes(method)) {
      context.res = {
        status: method === 'OPTIONS' ? 200 : 400,
        body: {
          message: method === 'OPTIONS' ? 'Allowed' : 'Method not allowed',
        },
        headers,
      }
      return;
    }

    await ConnectionManager.getConnection();

    const result = await handler(context, req);

    context.res = {
      status: result.status,
      body: result.body,
      headers,
    }
  }

  return handle;
}


export default SatlasRoute;
