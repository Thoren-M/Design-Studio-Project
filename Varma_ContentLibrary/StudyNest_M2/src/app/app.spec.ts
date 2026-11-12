import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render navigation to all three features', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const links = Array.from(element.querySelectorAll('nav a'));

    expect(
      links.map((link) => ({
        text: link.textContent?.trim(),
        href: link.getAttribute('href')
      }))
    ).toEqual([
      { text: 'Flashcards', href: '/flashcards' },
      { text: 'Assignment Manager', href: '/assignments' },
      { text: 'Content Library', href: '/content-library' }
    ]);
  });
});