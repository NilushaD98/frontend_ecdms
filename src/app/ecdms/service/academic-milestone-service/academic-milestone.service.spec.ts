import { TestBed } from '@angular/core/testing';

import { AcademicMilestoneService } from './academic-milestone.service';

describe('AcademicMilestoneService', () => {
  let service: AcademicMilestoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcademicMilestoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
