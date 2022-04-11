import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse,
} from '@angular/common/http';
import { EMPTY, Observable, of } from 'rxjs';
import { ApiV0Path } from '../../services/api-v0/models/api-v0-path.type';

import CvInfosJsonFile from '../../../__mocks__/json-files/cv-infos.json';
import TagsJsonFile from '../../../__mocks__/json-files/tags.json';
import SkillsJsonFile from '../../../__mocks__/json-files/skills.json';
import ExperiencesJsonFile from '../../../__mocks__/json-files/experiences.json';
import FormationsJsonFile from '../../../__mocks__/json-files/formations.json';
import ProjectsJsonFile from '../../../__mocks__/json-files/projects.json';
import InterestsJsonFile from '../../../__mocks__/json-files/interests.json';

@Injectable()
export class ApiV0Interceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!request.url.includes('/v0/')) {
      return next.handle(request);
    }

    const apiPath = request.url.split('/v0/')[1];
    return ApiV0Interceptor.jsonFile(apiPath as ApiV0Path);
  }

  private static jsonFile(apiPath: ApiV0Path):Observable<HttpEvent<any>> {
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

      default:
        console.warn(`Unknown path: ${apiPath}!`);
        return EMPTY;
    }

    return of(new HttpResponse({ status: 200, body: jsonFile }));
  }
}
