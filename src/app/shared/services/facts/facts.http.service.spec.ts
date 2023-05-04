import { HttpFactsService } from './facts.http.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

describe('HttpFactsService', () => {
  let httpFactsService: HttpFactsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpFactsService],
    });

    httpFactsService = TestBed.inject(HttpFactsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should return an array of facts with the specified count', () => {
    const mockApiResponse = {
      data: ['Fact 1', 'Fact 2'],
      error: null,
    };

    const count = 2;

    httpFactsService.getFacts(count).subscribe((facts) => {
      expect(facts.length).toBe(count);
      expect(facts[0].sentence).toBe('Fact 1');
      expect(facts[1].sentence).toBe('Fact 2');
    });

    const req = httpTestingController.expectOne(
      `https://meowfacts.herokuapp.com/?count=${count}`
    );
    expect(req.request.method).toEqual('GET');
    req.flush(mockApiResponse);
  });

  it('should return a fact', () => {
    const mockApiResponse = {
      data: ['Fact'],
      error: null,
    };

    httpFactsService.getFact().subscribe((fact) => {
      expect(fact.sentence).toBe('Fact');
    });

    const req = httpTestingController.expectOne(
      'https://meowfacts.herokuapp.com/'
    );
    expect(req.request.method).toEqual('GET');
    req.flush(mockApiResponse);
  });
});
