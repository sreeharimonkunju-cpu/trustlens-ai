import { useRef } from "react";
import { FileImage, Upload, X } from "lucide-react";

export function UploadDropzone({ label, file, onFile, onRemove, accept = "image/png,image/jpeg,application/pdf" }: {
  label: string; file: File | null; onFile: (f: File) => void; onRemove: () => void; accept?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const handle = (files: FileList | null) => {
    const f = files?.[0];
    if (f) onFile(f);
  };
  return <div className="upload-wrap">
    <div className="upload-label">{label}</div>
    {!file ? <div className="dropzone" onClick={() => input.current?.click()}
      onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("drag"); }}
      onDragLeave={(e) => e.currentTarget.classList.remove("drag")}
      onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove("drag"); handle(e.dataTransfer.files); }}>
      <input ref={input} type="file" hidden accept={accept} onChange={(e) => handle(e.target.files)} />
      <div className="upload-icon"><Upload size={22}/></div>
      <strong>Drop your file here</strong>
      <span>or <b>Browse Files</b></span>
      <small>PNG · JPG · JPEG · PDF · Max 10 MB</small>
    </div> :
    <div className="file-preview">
      {file.type.startsWith("image/") ? <img src={URL.createObjectURL(file)} alt="Uploaded document preview"/> : <div className="pdf-placeholder"><FileImage size={28}/><span>PDF</span></div>}
      <div className="file-info"><strong>{file.name}</strong><span>{(file.size / 1024 / 1024).toFixed(2)} MB</span><em>Ready for screening</em></div>
      <button className="icon-btn danger" onClick={onRemove}><X size={17}/></button>
    </div>}
  </div>;
}