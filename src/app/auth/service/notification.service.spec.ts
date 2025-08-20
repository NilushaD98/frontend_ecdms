import { TestBed } from '@angular/core/testing';

import { NewNotificationService } from './newNotificationService';

describe('NotificationService', () => {
  let service: NewNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
