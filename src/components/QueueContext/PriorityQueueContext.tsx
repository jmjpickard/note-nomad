import React, { createContext, useContext, useState, ReactNode } from "react";
import PriorityQueue from "./PriorityQueue"; // Adjust the import path as needed

type PriorityQueueContextType<T> = {
  enqueue: (element: T) => void;
  dequeue: () => T | undefined;
  queue: T[];
  length: number;
};

const PriorityQueueContext = createContext<
  PriorityQueueContextType<any> | undefined
>(undefined);

export const usePriorityQueue = <T,>(): PriorityQueueContextType<T> => {
  const context = useContext(PriorityQueueContext);
  if (!context) {
    throw new Error(
      "usePriorityQueue must be used within a PriorityQueueProvider"
    );
  }
  return context as PriorityQueueContextType<T>;
};

type PriorityQueueProviderProps<T extends { index: number; id: string }> = {
  children: ReactNode;
  initialItems?: T[];
};

export const PriorityQueueProvider = <T extends { index: number; id: string }>({
  children,
  initialItems,
}: PriorityQueueProviderProps<T>) => {
  const [priorityQueue, setPriorityQueue] = useState(
    new PriorityQueue<T>(initialItems)
  );

  const enqueue = (element: T) => {
    const newQueue = new PriorityQueue<T>(priorityQueue.getItems());
    newQueue.enqueue(element);
    setPriorityQueue(newQueue);
  };

  const dequeue = () => {
    const newQueue = new PriorityQueue<T>(priorityQueue.getItems());
    const elem = newQueue.dequeue();
    setPriorityQueue(newQueue);
    return elem;
  };

  const contextValue: PriorityQueueContextType<T> = {
    enqueue,
    dequeue,
    queue: priorityQueue.getItems(),
    length: priorityQueue.length(),
  };

  return (
    <PriorityQueueContext.Provider value={contextValue}>
      {children}
    </PriorityQueueContext.Provider>
  );
};
