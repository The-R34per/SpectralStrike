import { useState, useRef } from "react";
import * as exifr from "exifr";

function MetadataOSINT({ startScan, updateScan, finishScan }) {
  const [results, setResults] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  const loadExifr = () => {
    return new Promise((resolve, reject) => {
      if (window.exifr) return resolve(window.exifr);
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/exifr/dist/full.esm.js";
      script.type = "module";
      const script2 = document.createElement("script");
      script2.src = "https://cdn.jsdelivr.net/npm/exifr/dist/full.umd.cjs";
      script2.onload = () => resolve(window.exifr);
      script2.onerror = reject;
      document.head.appendChild(script2);
    });
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setResults(null);
    setFileName(file.name);
    setLoading(true);
    startScan("Extracting metadata...");
    updateScan(15);

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);

    try {
      updateScan(35);
      updateScan(60);

      const raw = await exifr.parse(file, {
        tiff: true,
        exif: true,
        gps: true,
        ifd1: true,
        iptc: true,
        xmp: true,
        ihdr: true,
      });

      updateScan(85);

      const meta = {
        fileName: file.name,
        fileType: file.type || "unknown",
        fileSize: formatSize(file.size),
        lastModified: new Date(file.lastModified).toISOString(),
      };

      // Camera info
      const camera = {};
      if (raw?.Make) camera.make = raw.Make;
      if (raw?.Model) camera.model = raw.Model;
      if (raw?.LensModel) camera.lens = raw.LensModel;
      if (raw?.Software) camera.software = raw.Software;

      // Capture settings
      const settings = {};
      if (raw?.ExposureTime) settings.exposure = `${raw.ExposureTime}s`;
      if (raw?.FNumber) settings.aperture = `f/${raw.FNumber}`;
      if (raw?.ISOSpeedRatings || raw?.ISO) settings.iso = raw.ISOSpeedRatings || raw.ISO;
      if (raw?.FocalLength) settings.focalLength = `${raw.FocalLength}mm`;
      if (raw?.Flash !== undefined) settings.flash = raw.Flash;
      if (raw?.WhiteBalance !== undefined) settings.whiteBalance = raw.WhiteBalance;

      // Timestamps
      const timestamps = {};
      if (raw?.DateTimeOriginal) timestamps.taken = raw.DateTimeOriginal.toISOString?.() || String(raw.DateTimeOriginal);
      if (raw?.CreateDate) timestamps.created = raw.CreateDate.toISOString?.() || String(raw.CreateDate);
      if (raw?.ModifyDate) timestamps.modified = raw.ModifyDate.toISOString?.() || String(raw.ModifyDate);

      // Image dimensions
      const dimensions = {};
      if (raw?.ImageWidth || raw?.ExifImageWidth) dimensions.width = raw.ImageWidth || raw.ExifImageWidth;
      if (raw?.ImageHeight || raw?.ExifImageHeight) dimensions.height = raw.ImageHeight || raw.ExifImageHeight;
      if (raw?.ColorSpace) dimensions.colorSpace = raw.ColorSpace;
      if (raw?.Orientation) dimensions.orientation = raw.Orientation;

      // GPS
      let gps = null;
      if (raw?.latitude && raw?.longitude) {
        gps = {
          lat: raw.latitude.toFixed(6),
          lng: raw.longitude.toFixed(6),
          mapsUrl: `https://www.google.com/maps?q=${raw.latitude},${raw.longitude}`,
        };
        if (raw?.GPSAltitude) gps.altitude = `${raw.GPSAltitude.toFixed(1)}m`;
      }

      // IPTC / XMP
      const authorship = {};
      if (raw?.Artist || raw?.creator) authorship.artist = raw.Artist || raw.creator;
      if (raw?.Copyright || raw?.rights) authorship.copyright = raw.Copyright || raw.rights;
      if (raw?.ImageDescription || raw?.description) authorship.description = raw.ImageDescription || raw.description;

      setResults({ meta, camera, settings, timestamps, dimensions, gps, authorship });
      finishScan("Metadata Extraction Complete");

    } catch (err) {
      console.error("EXIF error:", err);
      setError("Could not extract metadata. File may have no EXIF data, or is an unsupported format.");
      finishScan("Metadata Extraction Failed");
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const hasEntries = (obj) => obj && Object.keys(obj).length > 0;

  return (
    <div>
      <h2 style={{ marginBottom: 10 }}>Metadata Extraction</h2>
      <p style={{ marginBottom: 16, color: "#94a3b8" }}>
        Extract EXIF, GPS, camera, and authorship metadata from image files.
      </p>

      {/* Upload */}
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) {
            const dt = new DataTransfer();
            dt.items.add(file);
            fileRef.current.files = dt.files;
            handleFile({ target: { files: dt.files } });
          }
        }}
        style={{
          border: "2px dashed #1e293b",
          borderRadius: 8,
          padding: "28px 16px",
          textAlign: "center",
          cursor: "pointer",
          marginBottom: 16,
          background: "#0a0f1a",
          transition: "border-color 0.2s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = "#38bdf8"}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1e293b"}
      >
        <p style={{ color: "#64748b", marginBottom: 4 }}>
          {fileName ? `📎 ${fileName}` : "Click or drag & drop an image here"}
        </p>
        <p style={{ color: "#334155", fontSize: 12 }}>JPEG, PNG, TIFF, HEIC, WebP supported</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          style={{ display: "none" }}
        />
      </div>

      {loading && (
        <p style={{ color: "#38bdf8", marginBottom: 12 }}>Extracting metadata...</p>
      )}

      {error && (
        <p style={{ color: "#f97316", marginBottom: 12 }}>⚠ {error}</p>
      )}

      {/* Preview and Results */}
      {results && (
        <div style={{ marginTop: 10 }}>

          {/* Image preview */}
          {preview && (
            <img
              src={preview}
              alt="preview"
              style={{
                maxWidth: "100%",
                maxHeight: 220,
                borderRadius: 8,
                marginBottom: 16,
                border: "1px solid #1e293b",
                objectFit: "contain",
              }}
            />
          )}

          {/* File Info */}
          <Section title="File Info">
            <Row label="Name" value={results.meta.fileName} />
            <Row label="Type" value={results.meta.fileType} />
            <Row label="Size" value={results.meta.fileSize} />
            <Row label="Last Modified" value={results.meta.lastModified} />
          </Section>

          {hasEntries(results.dimensions) && (
            <Section title="Image">
              {results.dimensions.width && <Row label="Width" value={`${results.dimensions.width}px`} />}
              {results.dimensions.height && <Row label="Height" value={`${results.dimensions.height}px`} />}
              {results.dimensions.colorSpace && <Row label="Color Space" value={results.dimensions.colorSpace} />}
              {results.dimensions.orientation && <Row label="Orientation" value={results.dimensions.orientation} />}
            </Section>
          )}

          {hasEntries(results.camera) && (
            <Section title="Camera">
              {Object.entries(results.camera).map(([k, v]) => (
                <Row key={k} label={capitalize(k)} value={String(v)} />
              ))}
            </Section>
          )}

          {hasEntries(results.settings) && (
            <Section title="Capture Settings">
              {Object.entries(results.settings).map(([k, v]) => (
                <Row key={k} label={capitalize(k)} value={String(v)} />
              ))}
            </Section>
          )}

          {hasEntries(results.timestamps) && (
            <Section title="Timestamps">
              {Object.entries(results.timestamps).map(([k, v]) => (
                <Row key={k} label={capitalize(k)} value={String(v)} />
              ))}
            </Section>
          )}

          {hasEntries(results.authorship) && (
            <Section title="Authorship / Copyright">
              {Object.entries(results.authorship).map(([k, v]) => (
                <Row key={k} label={capitalize(k)} value={String(v)} />
              ))}
            </Section>
          )}

          {results.gps ? (
            <Section title="GPS Location">
              <Row label="Latitude" value={results.gps.lat} valueColor="#f97316" />
              <Row label="Longitude" value={results.gps.lng} valueColor="#f97316" />
              {results.gps.altitude && <Row label="Altitude" value={results.gps.altitude} />}
              <div style={{ marginTop: 8 }}>
                <a
                  href={results.gps.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#38bdf8",
                    fontSize: 13,
                    textDecoration: "none",
                    border: "1px solid #38bdf8",
                    borderRadius: 4,
                    padding: "4px 10px",
                  }}
                >
                  Open in Google Maps
                </a>
              </div>
              <p style={{ color: "#f97316", fontSize: 12, marginTop: 8 }}>
                GPS coordinates embedded — location data exposed
              </p>
            </Section>
          ) : (
            <Section title="GPS Location">
              <p style={{ color: "#22c55e", fontSize: 13 }}>No GPS data found.</p>
            </Section>
          )}

        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h3 style={{ marginBottom: 8, color: "#38bdf8", fontSize: 15 }}>{title}</h3>
      <div style={{
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: 8,
        padding: "12px 16px",
      }}>
        {children}
      </div>
    </div>
  );
}

function Row({ label, value, valueColor }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 14 }}>
      <span style={{ color: "#94a3b8" }}>{label}</span>
      <span style={{ color: valueColor || "#e2e8f0", fontFamily: "monospace", maxWidth: "65%", textAlign: "right", wordBreak: "break-all" }}>
        {value ?? "—"}
      </span>
    </div>
  );
}

function capitalize(str) {
  return str.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());
}

export default MetadataOSINT;
