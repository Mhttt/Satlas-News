import { Connection } from 'typeorm'

declare global {
  
    var connection: Connection;
    var DEFAULT_HEADERS = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
    }
}