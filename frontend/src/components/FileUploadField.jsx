import { useState } from 'react';
import api from '../api/axios';

export default function FileUploadField({ label, kind, value, onChange }) {
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setError('');
    setProgress(0);
    try {
      const { data } = await api.post('/uploads/presign', {
        fileName: file.name,
        fileType: file.type,
        kind,
      });

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', data.uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable) {
            setProgress(Math.round((evt.loaded / evt.total) * 100));
          }
        };
        xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status})`)));
        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.send(file);
      });

      onChange(data.publicUrl);
      setProgress(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Upload failed');
      setProgress(null);
    }
  };

  return (
    <label>
      {label}
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="https:// or upload a file below" />
      <input type="file" accept={kind === 'poster' || kind === 'banner' ? 'image/*' : 'video/*'} onChange={handleFile} />
      {progress !== null && <span className="upload-progress">Uploading... {progress}%</span>}
      {error && <span className="form-error">{error}</span>}
    </label>
  );
}
