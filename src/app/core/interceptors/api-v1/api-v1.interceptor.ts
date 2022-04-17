import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import CvInfosJsonFile from '../../../../../__mocks__/v1/json-files/cv-infos.json';
import ExperiencesJsonFile from '../../../../../__mocks__/v1/json-files/experiences.json';
import FormationsJsonFile from '../../../../../__mocks__/v1/json-files/formations.json';
import InterestsJsonFile from '../../../../../__mocks__/v1/json-files/interests.json';
import ProjectsJsonFile from '../../../../../__mocks__/v1/json-files/projects.json';
import SkillsJsonFile from '../../../../../__mocks__/v1/json-files/skills.json';
import TagsJsonFile from '../../../../../__mocks__/v1/json-files/tags.json';
import UsersJsonFile from '../../../../../__mocks__/v1/json-files/users.json';
import { ApiResponsePayload } from '../../interfaces/api/api-response.payload';
import { ApiV1Path } from '../../interfaces/api/api-v1-path.type';
import { UserV1 } from '../../interfaces/models/v1/user.interface';

@Injectable()
export class ApiV1Interceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes('/v1/')) {
      if (request.method === 'GET' || request.url.includes('/login')) {
        const apiPath = request.url.split('/v1/')[1];
        return this.jsonFile(apiPath as ApiV1Path, request);

      } else {
        console.debug('ApiV1Interceptor', request.method, 'request:');
        console.debug('url:', request.url);
        console.debug('body:', request.body);
        return of(new HttpResponse({
          status: 200, body: {
            message: 'FAKE_BACKEND_NOT_IMPLEMENTED',
            details: request.method + ' requests need a fake backend to simulate API results.',
          } as ApiResponsePayload,
        }));
      }
    }

    return next.handle(request);
  }

  private jsonFile(apiPath: ApiV1Path, request: HttpRequest<any>): Observable<HttpEvent<any>> {
    let jsonFile: any;

    switch (apiPath) {
      case 'cv-infos':
        jsonFile = CvInfosJsonFile;
        break;
      case 'tags':
        jsonFile = TagsJsonFile;
        break;
      case 'skills':
        jsonFile = SkillsJsonFile;
        break;
      case 'experiences':
        jsonFile = ExperiencesJsonFile;
        break;
      case 'formations':
        jsonFile = FormationsJsonFile;
        break;
      case 'projects':
        jsonFile = ProjectsJsonFile;
        break;
      case 'interests':
        jsonFile = InterestsJsonFile;
        break;
      case 'login':
        return this.handleAuthRequest(request);
      default:
        console.warn(`ApiV1Interceptor Unknown request path: ${apiPath}!`);
        return EMPTY;
    }

    return of(new HttpResponse({ status: 200, body: jsonFile }));
  }

  private handleAuthRequest(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const userFound = UsersJsonFile.find((user) => (user.name === request.body.username && user.password === request.body.password));
    if (!userFound) {
      return throwError(() => new Error('User not found!'));
    }

    const jsonFile = {
      id: userFound.id,
      name: userFound.name,
      role: userFound.role,
    } as UserV1;

    return of(new HttpResponse({ status: 200, body: jsonFile }));
  }
}
