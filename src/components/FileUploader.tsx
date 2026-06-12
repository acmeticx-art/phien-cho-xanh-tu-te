/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, RotateCcw } from 'lucide-react';
import { UploadedFile } from '../types';

interface FileUploaderProps {
  id: string;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  label?: string;
  description?: string;
  uploadedFiles: UploadedFile[];
  onUploadSuccess: (files: UploadedFile[]) => void;
  onRemoveFile: (fileId: string) => void;
  presetSamples?: { name: string; url: string }[];
}

export default function FileUploader({
  id,
  accept = 'image/*',
  multiple = false,
  maxSizeMB = 10,
  label = 'Tải tài liệu / hình ảnh',
  description = 'Kéo thả file vào đây hoặc click để duyệt tìm',
  uploadedFiles,
  onUploadSuccess,
  onRemoveFile,
  presetSamples = []
}: FileUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const processFiles = (files: FileList) => {
    setError(null);
    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Size check
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`Dung lượng file "${file.name}" vượt quá hạn mức ${maxSizeMB}MB.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Simulate upload progress for each file
    validFiles.forEach((file) => {
      const fileId = 'file_' + Math.random().toString(36).substr(2, 9);
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      let progress = 0;
      const interval = setInterval(() => {
        progress += 25;
        setUploadProgress(prev => ({ ...prev, [fileId]: progress }));

        if (progress >= 100) {
          clearInterval(interval);
          
          // Generate dataURL for image preview or mock url for documents
          const reader = new FileReader();
          reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            const newFile: UploadedFile = {
              id: fileId,
              name: file.name,
              size: file.size,
              type: file.type,
              url: file.type.startsWith('image/') ? dataUrl : '#'
            };
            
            if (multiple) {
              onUploadSuccess([...uploadedFiles, newFile]);
            } else {
              onUploadSuccess([newFile]);
            }
            
            // Clean up progress bar after brief success display
            setTimeout(() => {
              setUploadProgress(prev => {
                const next = { ...prev };
                delete next[fileId];
                return next;
              });
            }, 800);
          };
          
          if (file.type.startsWith('image/')) {
            reader.readAsDataURL(file);
          } else {
            // Document
            const newFile: UploadedFile = {
              id: fileId,
              name: file.name,
              size: file.size,
              type: file.type,
              url: '#'
            };
            if (multiple) {
              onUploadSuccess([...uploadedFiles, newFile]);
            } else {
              onUploadSuccess([newFile]);
            }
            setTimeout(() => {
              setUploadProgress(prev => {
                const next = { ...prev };
                delete next[fileId];
                return next;
              });
            }, 800);
          }
        }
      }, 150);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const triggerInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleApplyPreset = (sampleName: string, sampleUrl: string) => {
    const fileId = 'preset_' + Math.random().toString(36).substr(2, 9);
    const mockFile: UploadedFile = {
      id: fileId,
      name: sampleName,
      size: 154 * 1024,
      type: 'image/jpeg',
      url: sampleUrl
    };
    if (multiple) {
      onUploadSuccess([...uploadedFiles, mockFile]);
    } else {
      onUploadSuccess([mockFile]);
    }
  };

  return (
    <div id={id} className="space-y-3 font-sans">
      <div className="flex justify-between items-baseline">
        <label className="block text-sm font-semibold text-slate-700">{label}</label>
        {presetSamples.length > 0 && (
          <div className="flex flex-wrap gap-1.5 justify-end">
            <span className="text-xs text-slate-400 self-center">Mẫu có sẵn:</span>
            {presetSamples.map((samp, sIdx) => (
              <button
                key={sIdx}
                type="button"
                onClick={() => handleApplyPreset(samp.name, samp.url)}
                className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/50 transition-colors cursor-pointer font-medium"
              >
                + {samp.name.split('.')[0]}
              </button>
            ))}
          </div>
        )}
      </div>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerInputClick}
        className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
          isDragActive 
            ? 'border-emerald-500 bg-emerald-50/50' 
            : 'border-slate-200 hover:border-emerald-400 bg-white hover:bg-slate-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-2.5 rounded-full bg-slate-100/80 text-slate-500 group-hover:bg-slate-200/80 transition-colors">
            <UploadCloud className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-xs font-semibold text-slate-700">{description}</p>
          <p className="text-[10px] text-slate-400">
            {accept.includes('image') ? 'Hỗ trợ JPG, PNG, WEBP' : 'Hỗ trợ PDF, Word, Excel, ZIP'} (Tối đa {maxSizeMB}MB)
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-150">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Progress Bars */}
      {Object.keys(uploadProgress).map((key) => (
        <div key={key} className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 relative overflow-hidden">
          <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
            <span className="truncate">Đang tải lên tài liệu...</span>
            <span>{uploadProgress[key]}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-150"
              style={{ width: `${uploadProgress[key]}%` }}
            ></div>
          </div>
        </div>
      ))}

      {/* Show uploaded items list */}
      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-1">
          {uploadedFiles.map((file) => {
            const isImage = file.type.startsWith('image/') || file.url.startsWith('data:image/') || file.url !== '#';
            return (
              <div 
                key={file.id} 
                className="relative overflow-hidden group border border-slate-200/85 rounded-xl bg-slate-50/50 p-2.5 flex items-center gap-2.5 shadow-xs transition-shadow hover:shadow-xs"
              >
                {isImage && file.url !== '#' ? (
                  <img 
                    src={file.url} 
                    alt={file.name} 
                    className="w-10 h-10 object-cover rounded-lg border border-slate-100 flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center flex-shrink-0 border border-emerald-100">
                    <FileText className="w-5 h-5" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {(file.size / 1024).toFixed(0)} KB
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveFile(file.id)}
                  className="rounded-full bg-slate-200 hover:bg-rose-100 text-slate-500 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                  title="Xóa tệp"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
