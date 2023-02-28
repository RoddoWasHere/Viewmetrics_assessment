import { Subject, Subscription } from "rxjs";

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
const subscriptionA = eH.addEventListener((d) => console.log("listener 1", d));
const subscriptionB = eH.addEventListener((d) => console.log("listener 2", d));
eH.emitEvent("123?");

subscriptionA.unsubscribe();
subscriptionB.unsubscribe();

*/