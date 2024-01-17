import 'reflect-metadata';
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import ConnectionManager from '../database/ConnectionManager';
import SatlasRoute from "../helpers/SatlasRoute";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<any> {
  try {
    const c = await ConnectionManager.getConnection();

    return {
      // status: 200, /* Defaults to 200 */
      body: {
        message: 'Hello World this is SATLAS News!!',
        connection: c.isConnected ? 'yessir' : 'not connected :(',
        connectionName: c.name,
        entities: c.isConnected
          ? c.entityMetadatas.map((v, i) => {
              return {
                isConnected: v.connection.isConnected,
                connectionName: v.connection.name,
                tableName: v.givenTableName,
                targetName: v.targetName,
                properties: v.propertiesMap,
              };
            })
          : [],
        migrations: c.isConnected ? c.migrations : [],
        node_env: process.env.NODE_ENV
      },
    };
  }
  catch (err) {
    return {
      status: 500 /* Defaults to 200 */,
      body: {
        message: 'Error connecting to database',
        connection: err,
      },
    };
  }
};

export default SatlasRoute(httpTrigger, ['GET', 'POST']);
