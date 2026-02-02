export interface GeneratedImageResult {
  original: string;
  generated: string;
  prompt: string;
}

export interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
  selectedImage: string | null;
  onClear: () => void;
}

export interface ResultViewerProps {
  result: GeneratedImageResult;
  onReset: () => void;
}
