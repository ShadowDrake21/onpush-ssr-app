// Angular stuff
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';

// components
import { LinkComponent } from './components/link/link.component';
import { MainComponent } from './main.component';

fdescribe('MainComponent', () => {
  let fixture: ComponentFixture<MainComponent>;
  let debugEl: DebugElement;
  let el: HTMLElement;
  let component: MainComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainComponent, FontAwesomeModule, LinkComponent, RouterModule],
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
    fixture = TestBed.createComponent(MainComponent);
    debugEl = fixture.debugElement;
    el = debugEl.nativeElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Presence state', () => {
    it('should title be presented', () => {
      const { titleElement } = retrieveTitle();

      expect(titleElement).not.toBeNull();
    });

    it('should imagesContainer be presented', () => {
      const imagesContainerDebugElement = debugEl.query(
        By.css('[data-testingId="imagesContainer"]')
      );

      expect(imagesContainerDebugElement).toBeTruthy();
    });

    it('should linksContainer be presented', () => {
      const linksContainerDebugElement = debugEl.query(
        By.css('[data-testingId="linksContainer"]')
      );

      expect(linksContainerDebugElement).toBeTruthy();
    });
  });

  describe('Content state', () => {
    it('should title contain a value', () => {
      const { titleElement } = retrieveTitle();

      expect(titleElement.textContent).toContain(
        'ChangeDetection.OnPush && SSR Application'
      );
    });

    it('should title connect with Github', () => {
      const { titleElement } = retrieveTitle();

      expect(titleElement.href).toEqual(`https://github.com/ShadowDrake21`);
    });

    it('should imageContainer contains 2 images', () => {
      const imagesContainerDebugElement = debugEl.query(
        By.css('[data-testingId="imagesContainer"]')
      );
      const imagesContainerElement: HTMLElement =
        imagesContainerDebugElement.nativeElement;

      expect(imagesContainerElement.querySelectorAll('img').length).toBe(2);
    });

    it('should linksContainer have 4 links', () => {
      const linksContainerDebugElement = debugEl.query(
        By.css('[data-testingId="linksContainer"]')
      );
      const linksContainerElement: HTMLElement =
        linksContainerDebugElement.nativeElement;

      expect(linksContainerElement.querySelectorAll('main-link').length).toBe(
        4
      );
    });
  });

  function retrieveTitle() {
    const titleDebugElement = debugEl.query(
      By.css('[data-testingId="mainTitle"]')
    );
    const titleElement: HTMLLinkElement = titleDebugElement.nativeElement;

    return { titleElement };
  }
});
