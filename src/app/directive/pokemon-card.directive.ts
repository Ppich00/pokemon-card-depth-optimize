import {Directive, ElementRef, inject, NgZone, OnInit, Renderer2,} from '@angular/core';
import {BehaviorSubject, combineLatest, debounceTime, finalize, fromEvent, switchMap, takeUntil, tap,} from 'rxjs';
import {runOutsideNgZone} from "../utils/runOutZone";

@Directive({
  selector: '[appPokemonCard]',
  standalone: true,
})
export class PokemonCardDirective implements OnInit {
  readonly MAX_DEPTH = 0.0005;
  el = inject<ElementRef<HTMLElement>>(ElementRef);
  zone = inject(NgZone);
  renderer = inject(Renderer2);
  depthY$ = new BehaviorSubject(0.0);
  depthX$ = new BehaviorSubject(0);
  style$ = combineLatest([this.depthY$, this.depthX$]).pipe(
    tap(([depthY, depthX]) => {
      this.renderer.setStyle(
        this.el.nativeElement,
        'transform',
        `matrix3d(
          1,0,0,${depthY},
          0,1,0,${depthX},
          0,0,1,0,
          0,0,0,1)`
      );
    }, runOutsideNgZone())
  );
  onMouseDown$ = fromEvent(this.el.nativeElement, 'pointerdown').pipe(
    tap((e) => e.preventDefault())
  );
  constructor() {}

  ngOnInit(): void {
    this.style$.subscribe((style) => {});
    this.renderer.setStyle(
      this.el.nativeElement,
      'transition',
      'all 0.6s cubic-bezier(0.855,1.650,0.625,0.680) 0s'
    );
    this.mouseMove(this.el)
      .pipe(finalize(() => console.log('finally this.el')))
      .subscribe();

    this.onMouseDown$.subscribe();
  }

  mouseMove(element: ElementRef<HTMLElement>) {
    const onMouseEnter$ = fromEvent(element.nativeElement, 'pointerenter');
    const onMouseMove$ = fromEvent<PointerEvent>(
      element.nativeElement,
      'pointermove'
    ).pipe(
      tap((native) => {
        const el = native.target as Element;
        const rect = el.getBoundingClientRect();

        const absolute = {
          x: native.clientX - rect.left,
          y: native.clientY - rect.top,
        };
        const percent = {
          x: Math.round((100 / rect.width) * absolute.x),
          y: Math.round((100 / rect.height) * absolute.y),
        };
        const center = {
          x: percent.x - 50,
          y: percent.y - 50,
        };
        this.depthY$.next(((this.MAX_DEPTH * (center.x * 2)) / 100) * -1);
        this.depthX$.next(((this.MAX_DEPTH * (center.y * 2)) / 100) * -1);
      })
    );
    const onMouseOut$ = fromEvent<PointerEvent>(
      element.nativeElement,
      'mouseout'
    ).pipe(
      debounceTime(500),
      tap((native) => {
        const el = native.target as Element;
        const rect = el.getBoundingClientRect();
        const absolute = {
          x: native.clientX - rect.left,
          y: native.clientY - rect.top,
        };
        const percent = {
          x: Math.round((100 / rect.width) * absolute.x),
          y: Math.round((100 / rect.height) * absolute.y),
        };
        const center = {
          x: percent.x - 50,
          y: percent.y - 50,
        };

        this.depthY$.next(0);
        this.depthX$.next(0);
      })
    );

    return onMouseEnter$.pipe(
      switchMap(() => onMouseMove$.pipe(takeUntil(onMouseOut$)))
    );
  }
}
