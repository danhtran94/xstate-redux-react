import { useEffect, useState } from "react";
import { Observable } from "rxjs";

export function use$<T>(observable$: Observable<T>, initialValue?: T) {
  const [value, update] = useState<T | undefined>(initialValue);

  useEffect(() => {
    const s = observable$.subscribe(update);
    return () => s.unsubscribe();
  }, [observable$]);

  return value;
}
