import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoUploadPage } from './photo-upload.page';

describe('PhotoUploadPage', () => {
  let component: PhotoUploadPage;
  let fixture: ComponentFixture<PhotoUploadPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PhotoUploadPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoUploadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
