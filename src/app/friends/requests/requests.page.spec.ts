import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsPage } from './requests.page';

describe('RequestsPage', () => {
  let component: RequestsPage;
  let fixture: ComponentFixture<RequestsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RequestsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
