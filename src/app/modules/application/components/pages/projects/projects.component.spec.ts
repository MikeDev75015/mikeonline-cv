import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng2-mock-component';
import { lastValueFrom, of } from 'rxjs';
import { addTags } from '../../../../../../../__mocks__/helper';
import { dataServiceMock } from '../../../../../../../__mocks__/services/data-service.mock';
import { utilsServiceMock } from '../../../../../../../__mocks__/services/utils-service.mock';
import { waitTimeout } from '../../../../../../../__mocks__/timeout.mock';
import projectListMock from '../../../../../../../__mocks__/v1/json-files/projects.json';
import tagListMock from '../../../../../../../__mocks__/v1/json-files/tags.json';
import { AlertModule } from '../../../../../core';
import { ProjectV1 } from '../../../../../core/interfaces/models/v1/project.interface';
import { DataService, UtilsService } from '../../../../../shared';
import { ProjectsComponent } from './projects.component';

const unsortedProjectListMock = addTags(projectListMock, tagListMock);
const technoList: string[] = ['1', '2', '3'];
const unsortedProjectsWithTechnoListMock = unsortedProjectListMock.map((each) => ({ ...each, technoList }));
const sortedProjectListMock = UtilsService.sortObjectList(unsortedProjectsWithTechnoListMock, 'asc', 'position', 'number');
const projectMock1: ProjectV1 = sortedProjectListMock[0];

describe('PortfolioComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  const isDataLoadedSpy = jest.spyOn(dataServiceMock, 'isDataLoaded');
  const getStoreDataSpy = jest.spyOn(dataServiceMock, 'getStoreData');
  const sortObjectListSpy = jest.spyOn(UtilsService, 'sortObjectList');
  const initTechnoListWithTagListSpy = jest.spyOn(utilsServiceMock, 'initTechnoListWithTagList');

  const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
  const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ProjectsComponent,
        MockComponent({
          selector: 'app-portfolio-item',
          inputs: ['siteDemo'],
        }),
        MockComponent({
          selector: 'app-page-layout',
          inputs: ['pageTitle', 'elementsNumber', 'isLoadingData$'],
        }),
      ],
      providers: [
        { provide: DataService, useValue: dataServiceMock },
        { provide: UtilsService, useValue: utilsServiceMock },
      ],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        AlertModule,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should not call getStoreData DataService method if data are not loaded', async () => {
      isDataLoadedSpy.mockImplementation(() => of(false));
      fixture.detectChanges();

      expect(await lastValueFrom(component.isLoadingData$)).toBeTruthy();
      expect(getStoreDataSpy).not.toHaveBeenCalled();
      expect(initTechnoListWithTagListSpy).not.toHaveBeenCalled();
      expect(sortObjectListSpy).not.toHaveBeenCalled();
    });

    it('should call getStoreData DataService method if data are loaded', async () => {
      isDataLoadedSpy.mockImplementation(() => of(true));
      getStoreDataSpy.mockImplementation(() => Promise.resolve(unsortedProjectListMock));
      initTechnoListWithTagListSpy.mockImplementation(() => technoList);
      sortObjectListSpy.mockImplementation(() => sortedProjectListMock);
      fixture.detectChanges();

      expect(await lastValueFrom(component.isLoadingData$)).toBeFalsy();
      expect(getStoreDataSpy).toHaveBeenCalledTimes(1);
      expect(initTechnoListWithTagListSpy).toHaveBeenCalledTimes(unsortedProjectListMock.length);
      unsortedProjectListMock.forEach((project, i) => {
        expect(initTechnoListWithTagListSpy).toHaveBeenNthCalledWith(i + 1, project.tagList);
      });
      expect(sortObjectListSpy).toHaveBeenCalledTimes(1);
      expect(component.projectList).toStrictEqual(sortedProjectListMock);
    });
  });

  describe('onLoadBackgroundImage', () => {
    it('should set background image url and start animation after component timeout', async () => {
      fixture.detectChanges();
      expect(component.backgroundImage).toStrictEqual('');
      expect(component.showImage).toBeFalsy();
      expect(component['timeoutCreated']).not.toBeDefined();

      component.onLoadBackgroundImage(projectMock1 as ProjectV1);

      expect(clearTimeoutSpy).not.toHaveBeenCalled();
      expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
      expect(component['timeoutCreated']).toBeDefined();

      await waitTimeout(component['onLoadTimeout']);

      expect(component.backgroundImage).toStrictEqual(projectMock1.pictureList[0].src);
      expect(component.showImage).toBeTruthy();
      expect(component['timeoutCreated']).toBe(null);
    });
  });

  describe('onRemoveBackgroundImage', () => {
    beforeEach(async () => {
      fixture.detectChanges();
    });

    it('should clear timeout created if exist before remove background image', async () => {
      component.onLoadBackgroundImage(projectMock1);
      expect(component['timeoutCreated']).toBeDefined();

      component.onRemoveBackgroundImage();

      expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
      expect(clearTimeoutSpy).toHaveBeenCalledWith(expect.any(Number));
      expect(component['timeoutCreated']).toBe(null);
    });

    it('should remove background image and stop animation', async () => {
      component.onLoadBackgroundImage(projectMock1);
      await waitTimeout(component['onLoadTimeout']);

      expect(component.backgroundImage).toStrictEqual(projectMock1.pictureList[0].src);
      expect(component.showImage).toBeTruthy();
      expect(component['timeoutCreated']).toBe(null);

      component.onRemoveBackgroundImage();

      expect(component.backgroundImage).toStrictEqual('');
      expect(component.showImage).toBeFalsy();
      expect(component['timeoutCreated']).toBe(null);
    });
  });
});
