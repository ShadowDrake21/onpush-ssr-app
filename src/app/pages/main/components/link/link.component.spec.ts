import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkComponent } from './link.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { of } from 'rxjs';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

fdescribe('LinkComponent', () => {
  let fixture: ComponentFixture<LinkComponent>;
  let debugEl: DebugElement;
  let el: HTMLElement;
  let component: LinkComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkComponent, FontAwesomeModule, RouterLink],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            snapshot: {
              paramMap: {
                get: () => null,
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkComponent);
    debugEl = fixture.debugElement;
    el = debugEl.nativeElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Presence state', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Appearance state', () => {
    it('should have icon by defaut', () => {
      expect(el.querySelector('fa-icon')).toBeTruthy();
    });
  });

  describe('Content state', () => {
    it('should have a proper href', () => {
      component.link = '/main';
      fixture.detectChanges();

      const linkElement: HTMLLinkElement = debugEl.query(
        By.css('[data-testingId="link"]')
      ).nativeElement;
      expect(linkElement.getAttribute('ng-reflect-router-link')).toBe('/main');
    });
  });
});
