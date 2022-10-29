import { inject, NgZone } from '@angular/core';
import { MonoTypeOperatorFunction, Observable, Subscription } from 'rxjs';

export function runOutsideNgZone<T>(): MonoTypeOperatorFunction<T> {
  const zone = inject(NgZone);
  return (source: Observable<T>) =>
    new Observable<T>((subscriber) => {
      let subscription: Subscription;
      zone.runOutsideAngular(() => {
        subscription = source.subscribe(subscriber);
      });

      // @ts-ignore
      return subscription;
    });
}
