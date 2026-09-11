import { useRef, useState } from "react";
import { Camera, FileImage, RefreshCw, Upload, X } from "lucide-react";

export function UploadDropzone({
  label,
  file,
  onFile,
  onRemove,
  accept = "image/png,image/jpeg,application/pdf",
  allowCamera = true,
}: {
  label: string;
  file: File | null;
  onFile: (f: File) => void;
  onRemove: () => void;
  accept?: string;
  allowCamera?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handle = (files: FileList | null) => {
    const f = files?.[0];
    if (f) onFile(f);
  };

  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      alert("Could not access camera. Please upload an image file instead.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth || 640;
    canvas.height = v.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(v, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const captured = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: "image/jpeg" });
        onFile(captured);
      }
      stopCamera();
    }, "image/jpeg", 0.92);
  };

  return (
    <div className="upload-wrap">
      <div className="upload-header-row">
        <span className="upload-label">{label}</span>
        {allowCamera && !file && !cameraActive && (
          <button type="button" className="camera-pill-btn" onClick={startCamera}>
            <Camera size={13} /> Use Camera
          </button>
        )}
      </div>

      {cameraActive ? (
        <div className="camera-viewfinder">
          <video ref={videoRef} autoPlay playsInline muted className="camera-video" />
          <div className="camera-actions">
            <button type="button" className="secondary-btn" onClick={stopCamera}>
              Cancel
            </button>
            <button type="button" className="primary-btn" onClick={capturePhoto}>
              <Camera size={16} /> Snap Photo
            </button>
          </div>
        </div>
      ) : !file ? (
        <div
          className="dropzone"
          onClick={() => input.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add("drag");
          }}
          onDragLeave={(e) => e.currentTarget.classList.remove("drag")}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove("drag");
            handle(e.dataTransfer.files);
          }}
        >
          <input ref={input} type="file" hidden accept={accept} onChange={(e) => handle(e.target.files)} />
          <div className="upload-icon">
            <Upload size={22} />
          </div>
          <strong>Drag & drop document or snapshot</strong>
          <span>
            or <b className="browse-link">Browse Files</b>
          </span>
          <small>PNG · JPG · JPEG · PDF · High Resolution Recommended</small>
        </div>
      ) : (
        <div className="file-preview">
          {file.type.startsWith("image/") ? (
            <img src={URL.createObjectURL(file)} alt="Uploaded document preview" />
          ) : (
            <div className="pdf-placeholder">
              <FileImage size={28} />
              <span>PDF</span>
            </div>
          )}
          <div className="file-info">
            <strong>{file.name}</strong>
            <span>{(file.size / 1024 / 1024).toFixed(2)} MB · {file.type || "Document"}</span>
            <em>● Ready for Neural Screening</em>
          </div>
          <button className="icon-btn danger" type="button" onClick={onRemove} title="Remove file">
            <X size={17} />
          </button>
        </div>
      )}
    </div>
  );
}