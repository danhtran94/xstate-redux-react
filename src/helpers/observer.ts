import { BehaviorSubject, Observable } from "rxjs";

export function $toSub<T>(observable$: Observable<T>, initValue?: T): BehaviorSubject<T> {
  const subject = new BehaviorSubject(initValue ? initValue : undefined);

  observable$.subscribe(
    (x: T) => {
      subject.next(x);
    },
    (err: any) => {
      subject.error(err);
    },
    () => {
      subject.complete();
    },
  );

  return subject;
}
