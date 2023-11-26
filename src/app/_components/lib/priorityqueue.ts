interface QueueNode<T> {
    element: T;
    priority: number;
  }
  
  class MinHeap<T> {
    private heap: QueueNode<T>[];
  
    constructor() {
      this.heap = [];
    }
  
    enqueue(element: T, priority: number): void {
      const node: QueueNode<T> = { element, priority };
      this.heap.push(node);
      this.bubbleUp(this.heap.length - 1);
    }
  
    dequeue(): QueueNode<T> | null {
      if (this.isEmpty()) {
        return null;
      }
  
      const minNode: QueueNode<T> = this.heap[0];
      const endNode: QueueNode<T> = this.heap.pop() as QueueNode<T>;
  
      if (this.heap.length > 0) {
        this.heap[0] = endNode;
        this.sinkDown(0);
      }
  
      return minNode;
    }
  
    private bubbleUp(index: number): void {
      const node: QueueNode<T> = this.heap[index];
  
      while (index > 0) {
        const parentIndex: number = Math.floor((index - 1) / 2);
        const parent: QueueNode<T> = this.heap[parentIndex];
  
        if (node.priority >= parent.priority) {
          break;
        }
  
        this.heap[parentIndex] = node;
        this.heap[index] = parent;
        index = parentIndex;
      }
    }
  
    private sinkDown(index: number): void {
      const length: number = this.heap.length;
      const node: QueueNode<T> = this.heap[index];
  
      while (true) {
        let leftChildIndex: number = 2 * index + 1;
        let rightChildIndex: number = 2 * index + 2;
        let swapIndex: number | null = null;
  
        if (leftChildIndex < length) {
          const leftChild: QueueNode<T> = this.heap[leftChildIndex];
          if (leftChild.priority < node.priority) {
            swapIndex = leftChildIndex;
          }
        }
  
        if (rightChildIndex < length) {
          const rightChild: QueueNode<T> = this.heap[rightChildIndex];
          if (
            (swapIndex === null && rightChild.priority < node.priority) ||
            (swapIndex !== null && rightChild.priority < this.heap[swapIndex].priority)
          ) {
            swapIndex = rightChildIndex;
          }
        }
  
        if (swapIndex === null) {
          break;
        }
  
        this.heap[index] = this.heap[swapIndex];
        this.heap[swapIndex] = node;
        index = swapIndex;
      }
    }
  
    isEmpty(): boolean {
      return this.heap.length === 0;
    }
  
    print(): void {
      console.log(this.heap);
    }
  }
  
  // Example usage:
  const priorityQueue = new MinHeap<string>();
  priorityQueue.enqueue('Task 1', 2);
  priorityQueue.enqueue('Task 2', 1);
  priorityQueue.enqueue('Task 3', 3);
  priorityQueue.enqueue('Task 4', 2);
  
  priorityQueue.print(); // Output: [{element: "Task 2", priority: 1}, {element: "Task 4", priority: 2}, {element: "Task 3", priority: 3}, {element: "Task 1", priority: 2}]
  
  console.log(priorityQueue.dequeue()); // Output: {element: "Task 2", priority: 1}
  