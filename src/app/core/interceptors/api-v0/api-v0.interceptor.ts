import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse,
} from '@angular/common/http';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { IUser } from '../../interfaces/models/user.interface';
import { ApiV0Path } from '../../services/api-v0/models/api-v0-path.type';

import CvInfosJsonFile from '../../../__mocks__/json-files/cv-infos.json';
import TagsJsonFile from '../../../__mocks__/json-files/tags.json';
import SkillsJsonFile from '../../../__mocks__/json-files/skills.json';
import ExperiencesJsonFile from '../../../__mocks__/json-files/experiences.json';
import FormationsJsonFile from '../../../__mocks__/json-files/formations.json';
import ProjectsJsonFile from '../../../__mocks__/json-files/projects.json';
import InterestsJsonFile from '../../../__mocks__/json-files/interests.json';
import UsersJsonFile from '../../../__mocks__/json-files/users.json';

@Injectable()
export class ApiV0Interceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!request.url.includes('/v0/')) {
      return next.handle(request);
    }

    const apiPath = request.url.split('/v0/')[1];
    return ApiV0Interceptor.jsonFile(apiPath as ApiV0Path, request.body);
  }

  private static jsonFile(apiPath: ApiV0Path, payload: any):Observable<HttpEvent<any>> {
    let jsonFile: any;

    switch (apiPath) {
      case 'cv-infos':
        jsonFile = CvInfosJsonFile;
        break;
      case 'tags':
        jsonFile = TagsJsonFile;
        break;
      case 'competences':
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
        const userFound = UsersJsonFile.find((user) => (user.name === payload.username && user.password === payload.password));
        if (!userFound) {
          return throwError(() => new Error('User not found!'));
        }
        jsonFile = {
          id: userFound.id,
          name: userFound.name,
          role: userFound.role,
        } as IUser;
        break;

      default:
        console.warn(`Unknown path: ${apiPath}!`);
        return EMPTY;
    }

    return of(new HttpResponse({ status: 200, body: jsonFile }));
  }
}
