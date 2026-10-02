"use client";
import React, { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { datasetService } from "@/services/dataset";
import { contributionService } from "@/services/contributions";
import { TableRowSkeleton } from "@/components/skeletons";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { Upload, Trash2, Film, Image as ImageIcon, Play } from "lucide-react";
import { toast } from "sonner";

const API_BASE = "http://localhost:8200";

export default function AdminSignsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-signs"],
    queryFn: () => datasetService.getSigns({ limit: 100 }),
  });
  const [uploading, setUploading] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  /**
   * At most ONE preview may play at a time.
   *
   * The table used to render a looping <video autoPlay> per row. With 100 rows
   * that is 100 simultaneous decoders plus 100 HTTP streams, which stalls the
   * page and can wedge the backend. A preview is now opt-in: rows show a poster
   * and only the single `playingId` row mounts a video element at all.
   */
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handleUpload = async (signId: string, label: string, file: File) => {
    setUploading(signId);
    try {
      await contributionService.uploadSignMedia(signId, file);
      toast.success(`Reference media attached to ${label}`);
      setPlayingId(null);
      qc.invalidateQueries({ queryKey: ["admin-signs"] });
      qc.invalidateQueries({ queryKey: ["signs"] });
    } catch (e: any) {
      toast.error(e?.detail || "Upload failed (check file type)");
    } finally {
      setUploading(null);
      if (fileRefs.current[signId]) fileRefs.current[signId]!.value = "";
    }
  };

  const handleDelete = async (signId: string, label: string) => {
    try {
      await contributionService.deleteSignMedia(signId);
      toast.success(`Reference media removed from ${label}`);
      if (playingId === signId) setPlayingId(null);
      qc.invalidateQueries({ queryKey: ["admin-signs"] });
      qc.invalidateQueries({ queryKey: ["signs"] });
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="pb-3 border-b border-border">
        <div className="text-xs font-mono uppercase text-text-muted">SIGN CATALOG MANAGEMENT</div>
        <h1 className="text-2xl font-bold text-text-primary mt-1">Signs & Reference Media</h1>
        <p className="text-xs text-text-secondary mt-1">
          Attach one reference video (mp4/webm) or image (png/jpg) per sign. These play in Text → Sign sequential playback.
          Previews load on demand — click a video thumbnail to play it.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="border-b border-border bg-surface-elevated text-text-muted uppercase tracking-wider">
              <th className="py-3 px-4">Preview</th>
              <th className="py-3 px-4">Sign</th>
              <th className="py-3 px-4">Bengali</th>
              <th className="py-3 px-4">Media Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} columns={5} />)
            ) : (
              data?.items.map((sign) => {
                const media = (sign as any).reference_media as { type: string; url: string } | null;
                return (
                  <tr key={sign.id} className="hover:bg-surface-elevated/50 transition-colors">
                    <td className="py-3 px-4">
                      {media?.type === "video" && playingId === sign.id ? (
                        <VideoPlayer
                          src={`${API_BASE}${media.url}`}
                          muted loop autoPlay
                          onEnded={() => setPlayingId(null)}
                          className="h-16 w-28 rounded border border-border overflow-hidden"
                        />
                      ) : media?.type === "video" ? (
                        <button
                          type="button"
                          onClick={() => setPlayingId(sign.id)}
                          title="Play preview"
                          className="group relative h-16 w-28 rounded border border-border overflow-hidden bg-black flex items-center justify-center"
                        >
                          <Film size={18} className="text-text-muted" />

                          <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play size={16} className="text-white" />
                          </span>
                        </button>
                      ) : media?.type === "image" ? (
                        <img
                          src={`${API_BASE}${media.url}`}
                          alt={sign.label}
                          className="h-16 w-28 object-cover rounded border border-border"
                        />
                      ) : (
                        <div className="h-16 w-28 rounded border border-border bg-background flex items-center justify-center text-text-muted">
                          —
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-text-primary">{sign.label}</td>
                    <td className="py-3 px-4 font-bengali text-sm text-text-secondary">{sign.bengali_meaning}</td>
                    <td className="py-3 px-4">
                      {media ? (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${media.type === "video" ? "bg-accent-secondary/15 text-accent-secondary" : "bg-accent-primary/15 text-accent-primary"}`}>
                          {media.type === "video" ? <Film size={11} /> : <ImageIcon size={11} />}
                          {media.type.toUpperCase()} ATTACHED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-status-pending/15 text-status-pending">NO MEDIA</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/quicktime,image/png,image/jpeg,image/webp"
                          className="hidden"
                          ref={(el) => { fileRefs.current[sign.id] = el; }}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleUpload(sign.id, sign.label, f);
                          }}
                        />
                        <button
                          disabled={uploading === sign.id}
                          onClick={() => fileRefs.current[sign.id]?.click()}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-accent-primary text-black text-[11px] font-bold hover:bg-accent-primary/90 disabled:opacity-50 transition-colors"
                        >
                          <Upload size={12} />
                          {uploading === sign.id ? "UPLOADING..." : "UPLOAD"}
                        </button>
                        {media && (
                          <button
                            onClick={() => handleDelete(sign.id, sign.label)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-surface-elevated border border-border text-text-secondary hover:text-status-error text-[11px] font-bold transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}