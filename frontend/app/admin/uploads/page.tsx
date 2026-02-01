"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/utils/api";
import toast from "react-hot-toast";

type UploadResult = {
  url: string;
  publicId: string;
  resourceType: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
  folder?: string;
};

export default function AdminUploadsPage() {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [folder, setFolder] = useState("peaktech/uploads");
  const [resourceType, setResourceType] = useState<'auto' | 'image' | 'video' | 'raw'>("auto");
  const [result, setResult] = useState<UploadResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFiles = (files: FileList | null) => {
    setResult(null);
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setFileDataUrl(dataUrl);
      setPreview(dataUrl.startsWith("data:image") ? dataUrl : null);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const onUpload = async () => {
    if (!fileDataUrl) return toast.error("Select a file first");
    try {
      setLoading(true);
      const res = await apiFetch("/admin/uploads", {
        method: "POST",
        body: JSON.stringify({ file: fileDataUrl, folder, resourceType }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Upload failed");
      }
      const json = await res.json();
      const data = json?.data as UploadResult;
      setResult(data);
      toast.success("Uploaded successfully");
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Admin Uploads</h1>
      <p className="mt-2 text-sm text-gray-500">Upload images, videos, or files to Cloudinary and copy the URL.</p>

      <div
        className={`mt-6 rounded-xl border border-dashed p-8 transition-colors ${dragOver ? 'bg-secondary' : 'bg-white'}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <div className="flex flex-col items-center gap-4">
          {preview ? (
            <img src={preview} alt="Preview" className="max-h-64 rounded-lg border" />
          ) : (
            <div className="text-center text-gray-500">
              <div className="mb-2 text-xl">Drag & drop your file here</div>
              <div className="text-sm">or click to choose</div>
            </div>
          )}
          <label className="cursor-pointer rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800">
            Choose File
            <input type="file" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          </label>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium">Folder</label>
          <input
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="mt-2 w-full rounded-md border bg-white px-3 py-2"
            placeholder="peaktech/uploads"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Type</label>
          <select
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value as any)}
            className="mt-2 w-full rounded-md border bg-white px-3 py-2"
          >
            <option value="auto">Auto</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="raw">File (raw)</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={onUpload}
            disabled={loading || !fileDataUrl}
            className="w-full rounded-md bg-primary px-4 py-2 font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Uploading…' : 'Upload'}
          </button>
        </div>
      </div>

      {result && (
        <div className="mt-8 rounded-lg border bg-white p-4">
          <div className="text-sm text-gray-500">Result</div>
          <div className="mt-2">
            <div className="break-all text-sm">
              <span className="font-medium">URL:</span> {result.url}
            </div>
            <div className="mt-1 text-sm">
              <span className="font-medium">Public ID:</span> {result.publicId}
            </div>
            <div className="mt-1 text-sm">
              <span className="font-medium">Type:</span> {result.resourceType} {result.format ? `(${result.format})` : ''}
            </div>
            <div className="mt-3">
              <a href={result.url} target="_blank" className="rounded-md bg-gray-900 px-3 py-2 text-white">Open</a>
              <button
                className="ml-2 rounded-md border px-3 py-2"
                onClick={() => { navigator.clipboard.writeText(result.url); toast.success('Copied URL'); }}
              >Copy URL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
