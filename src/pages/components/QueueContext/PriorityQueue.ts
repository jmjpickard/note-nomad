class PriorityQueue<T extends { index: number; id: string }> {
  private items: T[];

  constructor(initialItems?: T[]) {
    this.items = initialItems || [];
  }

  enqueue(element: T): void {
    if (this.items.some((item) => item.id === element.id)) {
      this.items = this.items.map((item) =>
        item.id === element.id ? element : item
      );
      return;
    }
    if (this.isEmpty()) {
      this.items.push(element);
    } else {
      let added = false;
      for (let i = 0; i < this.items.length; i++) {
        if (element.index < this.items[i]!.index) {
          this.items.splice(i, 0, element);
          added = true;
          break;
        }
      }
      if (!added) {
        this.items.push(element);
      }
    }
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  length(): number {
    return this.items.length;
  }

  getItems(): T[] {
    return this.items;
  }
}

export default PriorityQueue;
