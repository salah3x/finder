import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFriendsPage } from './add-friends.page';

describe('AddFriendsPage', () => {
  let component: AddFriendsPage;
  let fixture: ComponentFixture<AddFriendsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddFriendsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFriendsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
