import {Injectable} from '@angular/core';
import * as moment from 'moment';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../../environments/environment';

const fileDateFormat = 'YYYY-MM-DD[_]HH-mm-ss[_]';
const jsonDateFormat = 'L[ ]LTS';

interface ILogsPayload {
  appName: string;
  fileName: string;
  toWrite: {
    jsonDate: string;
    toWrite: any;
  };
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  logsEnabled = environment.ACTIVATED_LOGS;
  urlBackend = environment.BACKEND_URL;
  appName = environment.APP_NAME;

  constructor(
    private readonly http: HttpClient
  ) {}

  public log = this.logsEnabled ? console.log : this.writeLog;
  public err = this.logsEnabled ? console.error : this.writeErr;
  public warn = this.logsEnabled ? console.warn : this.writeWarn;

  private writeLog(log: any, ...optionalParams: any[]) {
    this.sendToWriteFile(this.fileFormat('log', this.buildMsg(log, optionalParams)))
      .then(console.log).catch(console.error);
  }

  private writeErr(err: any, ...optionalParams: any[]) {
    this.sendToWriteFile(this.fileFormat('error', this.buildMsg(err, optionalParams)))
      .then(console.log).catch(console.error);
  }

  private writeWarn(warn: any, ...optionalParams: any[]) {
    this.sendToWriteFile(this.fileFormat('warning', this.buildMsg(warn, optionalParams)))
      .then(console.log).catch(console.error);
  }

  private buildMsg(msg: any, optionalParams: any[]): any {
    if (!optionalParams.length) { return msg; }
    const builtMsg: { [key: string]: any } = {};
    [msg, ...optionalParams].forEach((v, i) => {
      builtMsg[i] = v;
    });
    return builtMsg;
  }

  private fileFormat(type: 'log' | 'error' | 'warning', toWrite: any): ILogsPayload {
    const date = moment();
    return {
      appName: this.appName,
      fileName: date.format(fileDateFormat) + type + '.json',
      toWrite: {
        jsonDate: date.format(jsonDateFormat),
        toWrite
      }
    };
  }

  private sendToWriteFile(payload: ILogsPayload): Promise<any> {
    return this.http.post<any>(environment.BACKEND_URL + '/write-json-logs', payload).toPromise();
  }
}

/*
environment.ACTIVATED_LOGS
You must specify the boolean environment variable <<ACTIVATED_LOGS>>

environment.URL_BACKEND
You must specify the environment variable <<URL_BACKEND>>
Example:
 - http: // localhost: 5000
 - https://mon-serveur.com

environment.APP_NAME
You must specify the environment variable <<APP_NAME>>
*/

/* SERVER ROUTE TO WRITE LOGS
server.post('/write-json-logs', (req, res) => {
    const {appName, fileName, toWrite} = req.body;
    console.log({appName, fileName, toWrite});
    const partList = fileName.split('-');
    const path = './logs/' + appName + '/' + partList[0] + '/' + partList[1] + '/' + partList[2].split('_')[0];
        fs.mkdir(path, { recursive: true }, (errM) => {
        if (errM) res.status(503).send({...errM, status: 'error'});

        fs.writeFile(path + '/' + fileName, jsonFormat(toWrite, jsonFileConfig), 'utf8', function (errW) {
            if (errW) res.status(503).send({...errW, status: 'error'});

            res.status(200).send({status: 'success'});
        });
    });
});
 */
