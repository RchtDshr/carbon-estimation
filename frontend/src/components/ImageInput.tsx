import { useState, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Upload, Image as ImageIcon, X, AlertCircle, Loader2 } from 'lucide-react';

interface ImageInputProps {
  onImageEstimate: (file: File) => Promise<void>;
  isLoading: boolean;
}

const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB in bytes
const ACCEPTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

export default function ImageInput({ onImageEstimate, isLoading }: ImageInputProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      return 'Please select a valid image format (JPEG, PNG, WebP, or GIF)';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be under 200MB';
    }
    return null;
  };

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      await onImageEstimate(selectedFile);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-blue-600" />
          Image Carbon Footprint Estimator
        </CardTitle>
        <CardDescription>
          Upload an image of a dish to estimate its carbon footprint
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* File Drop Zone */}
          <div
            className={`
              relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
              ${dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
              }
              ${error ? 'border-red-300 bg-red-50' : ''}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_FORMATS.join(',')}
              onChange={handleFileInput}
              className="hidden"
              disabled={isLoading}
            />

            {!selectedFile ? (
              <div className="space-y-4">
                <Upload className={`mx-auto h-12 w-12 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop your image here, or
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleBrowseClick}
                    disabled={isLoading}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    Browse Photos
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Supports JPEG, PNG, WebP, GIF • Max 200MB
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Image Preview */}
                {previewUrl && (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="mx-auto max-h-32 rounded-lg object-cover"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 border-red-300 text-red-600 hover:bg-red-50"
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                {/* File Info */}
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          {selectedFile && !error && (
            <Button 
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Image...
                </>
              ) : (
                'Estimate Carbon Footprint'
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
