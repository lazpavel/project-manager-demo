import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectCreatePage } from './project-create.page';

describe('ProjectCreatePage', () => {
  let component: ProjectCreatePage;
  let fixture: ComponentFixture<ProjectCreatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
