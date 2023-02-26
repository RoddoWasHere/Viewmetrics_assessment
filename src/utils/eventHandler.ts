import { Subject, Subscription } from "rxjs";

// const subject = new Subject<number>();

// subject.subscribe({
//   next: (v) => console.log(`observerA: ${v}`)
// });
// const subscriptionB = subject.subscribe({
//   next: (v) => console.log(`observerB: ${v}`)
// });

// subject.next(1);
// subject.next(2);

// subscriptionB.unsubscribe();

// subject.next(12);

// global.subject = subject;

export interface EventListener extends Subscription {}

export class EventHandler<T> {
  private subject = new Subject<T>();
  addEventListener(func: (data: T) => void): Subscription {
    return this.subject.subscribe({
      next: func
    });
  }
  emitEvent(data: T) {
    this.subject.next(data);
  }
}

/*
USE CASE:

const eH = new EventHandler<string>();
eH.addEventListener((d) => console.log("listener 1", d));
eH.addEventListener((d) => console.log("listener 2", d));
eH.emitEvent("123?");
*/