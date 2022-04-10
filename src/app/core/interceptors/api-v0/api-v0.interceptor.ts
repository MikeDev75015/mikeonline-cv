import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse,
} from '@angular/common/http';
import { EMPTY, Observable, of } from 'rxjs';

import CvInfosJsonFile from './json-files/cv-infos.json';
import TagsJsonFile from './json-files/tags.json';
import SkillsJsonFile from './json-files/skills.json';
import ExperiencesJsonFile from './json-files/experiences.json';
import FormationsJsonFile from './json-files/formations.json';
import ProjectsJsonFile from './json-files/projects.json';
import InterestsJsonFile from './json-files/interests.json';

@Injectable()
export class ApiV0Interceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!request.url.includes('/v0/')) {
      return next.handle(request);
    }

    const apiPath = request.url.split('/v0/')[1];
    return ApiV0Interceptor.jsonFile(apiPath);
  }

  private static jsonFile(apiPath: string):Observable<HttpEvent<any>> {
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
