
export interface ProcessingItem {
  id: string;
  file: File;
  handle: FileSystemFileHandle;
  parentHandle: FileSystemDirectoryHandle;
  relativePath: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  originalUrl: string;
  resultUrl?: string;
  error?: string;
  progress: number;
}

export interface BatchConfig {
  mode: 'ai' | 'resize';
  prompt: string;
  targetWidth: number;
  aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
  model: string;
  concurrency: number;
}

export type AppStatus = 'idle' | 'scanning' | 'ready' | 'processing' | 'done';
