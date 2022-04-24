import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { addTags } from '../../../../../__mocks__/helper';
import CvInfosJsonFile from '../../../../../__mocks__/v1/json-files/cv-infos.json';
import ExperiencesJsonFile from '../../../../../__mocks__/v1/json-files/experiences.json';
import FormationsJsonFile from '../../../../../__mocks__/v1/json-files/formations.json';
import InterestsJsonFile from '../../../../../__mocks__/v1/json-files/interests.json';
import ProjectsJsonFile from '../../../../../__mocks__/v1/json-files/projects.json';
import SkillsJsonFile from '../../../../../__mocks__/v1/json-files/skills.json';
import TagsJsonFile from '../../../../../__mocks__/v1/json-files/tags.json';
import { ApiResponsePayload } from '../../interfaces/api/api-response.payload';
import { ApiV1Path } from '../../interfaces/api/api-v1-path.enum';

@Injectable()
export class ApiV1Interceptor implements HttpInterceptor {
  private static jsonFile(apiPath: ApiV1Path): Observable<HttpEvent<any>> {
    let body: any;

    switch (apiPath) {
      case ApiV1Path.CV_INFOS:
        body = CvInfosJsonFile;
        break;
      case ApiV1Path.TAGS:
        body = TagsJsonFile;
        break;
      case ApiV1Path.SKILLS:
        body = addTags(SkillsJsonFile);
        break;
      case ApiV1Path.EXPERIENCES:
        body = addTags(ExperiencesJsonFile);
        break;
      case ApiV1Path.FORMATIONS:
        body = addTags(FormationsJsonFile);
        break;
      case ApiV1Path.PROJECTS:
        body = addTags(ProjectsJsonFile);
        break;
      case ApiV1Path.INTERESTS:
        body = InterestsJsonFile;
        break;
      default:
        body = { message: 'API_V1_INTERCEPTOR_ERROR', details: `Unknown v1 path: ${apiPath}!` } as ApiResponsePayload;
    }

    return of(new HttpResponse({ status: 200, body }));
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes('/v1/')) {
      if (request.method === 'GET') {
        const apiPath = request.url.split('/v1/')[1] as ApiV1Path;
        console.debug('apiPath:', apiPath);
        return ApiV1Interceptor.jsonFile(apiPath);

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
}
