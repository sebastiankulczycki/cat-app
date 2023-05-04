import { HttpErrorResponse } from '@angular/common/http';
import { delay, finalize, of, pipe, take, tap, throwError } from 'rxjs';
import { IFact } from '../../interfaces/facts.interface';
import { ErrorDialogService } from '../error-dialog.service';
import { LoaderService } from '../loader.service';
import { HttpFactsService } from './facts.http.service';
import { FactsService } from './facts.service';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

describe('FactsService', () => {
  let factsService: FactsService;
  let httpServiceSpy: jasmine.SpyObj<HttpFactsService>;
  let loaderServiceSpy: jasmine.SpyObj<LoaderService>;
  let dialogServiceSpy: jasmine.SpyObj<ErrorDialogService>;

  beforeEach(() => {
    const httpSpy = jasmine.createSpyObj('HttpFactsService', ['getFacts']);
    const loaderSpy = jasmine.createSpyObj('LoaderService', [
      'showLoader',
      'hideLoader',
    ]);
    const dialogSpy = jasmine.createSpyObj('ErrorDialogService', [
      'openErrorDialog',
    ]);

    TestBed.configureTestingModule({
      providers: [
        FactsService,
        { provide: HttpFactsService, useValue: httpSpy },
        { provide: LoaderService, useValue: loaderSpy },
        { provide: ErrorDialogService, useValue: dialogSpy },
      ],
    });

    factsService = TestBed.inject(FactsService);
    httpServiceSpy = TestBed.inject(
      HttpFactsService
    ) as jasmine.SpyObj<HttpFactsService>;
    loaderServiceSpy = TestBed.inject(
      LoaderService
    ) as jasmine.SpyObj<LoaderService>;
    dialogServiceSpy = TestBed.inject(
      ErrorDialogService
    ) as jasmine.SpyObj<ErrorDialogService>;
  });

  describe('getFacts', () => {
    const mockFacts: IFact[] = [
      { sentence: 'Fact 1' },
      { sentence: 'Fact 2' },
      { sentence: 'Fact 3' },
    ];
    let mockCount = 3;

    it('should get facts from the server', () => {
      httpServiceSpy.getFacts.and.returnValue(of(mockFacts));
      factsService.getFacts(mockCount);
      expect(httpServiceSpy.getFacts).toHaveBeenCalledWith(mockCount);
    });

    it('should update the facts$ observable', () => {
      httpServiceSpy.getFacts.and.returnValue(of(mockFacts));
      factsService.getFacts(mockCount);

      factsService.facts$.subscribe((facts) => {
        expect(facts).toEqual(mockFacts);
      });
    });

    it('should show loader when get facts occured', () => {
      httpServiceSpy.getFacts.and.returnValue(of(mockFacts));
      factsService.getFacts(mockCount);
      expect(loaderServiceSpy.showLoader).toHaveBeenCalledTimes(1);
    });

    it('should hide loader when get facts finalized', (done) => {
      httpServiceSpy.getFacts.and.returnValue(of(mockFacts));
      factsService.getFacts(mockCount);
      setTimeout(() => {
        expect(loaderServiceSpy.hideLoader).toHaveBeenCalledTimes(1);
        done();
      }, 2000);
    });

    it('should filter out duplicate facts from the response', fakeAsync(() => {
      const duplicateFacts: IFact[] = [
        { sentence: 'Fact 1' },
        { sentence: 'Fact 2' },
      ];
      const allFacts = [...mockFacts, ...duplicateFacts];
      httpServiceSpy.getFacts.and.returnValue(of(allFacts));
      factsService.getFacts(mockCount);
      tick(2000);
      factsService.facts$.subscribe((facts) => {
        expect(facts).toEqual(mockFacts);
      });
    }));

    it('should handle a 404 error by showing an error dialog', () => {
      const mockError = new HttpErrorResponse({
        error: 'Not found',
        status: 404,
      });
      httpServiceSpy.getFacts.and.returnValue(throwError(() => mockError));
      factsService.getFacts(mockCount);

      expect(dialogServiceSpy.openErrorDialog).toHaveBeenCalledWith(
        'No facts found'
      );
    });
  });
});
