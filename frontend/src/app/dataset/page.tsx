"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { datasetService } from "@/services/dataset";
import { statsService, DatasetStats } from "@/services/stats";
import { PageContainer } from "@/components/layout/PageContainer";
import { TableRowSkeleton, SignCardSkeleton } from "@/components/skeletons";
import { Search, LayoutGrid, Table as TableIcon, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function DatasetPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [page, setPage] = useState(1);

  const { data: stats } = useQuery<DatasetStats>({
    queryKey: ["dataset-stats"],
    queryFn: () => statsService.getDatasetStats(),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["signs", page, search, category, language],
    queryFn: () =>
      datasetService.getSigns({
        page,
        limit: 10,
        search: search || undefined,
        category: category || undefined,
        language: language || undefined,
      }),
  });

  return (
    <PageContainer className="space-y-6">
      {/* Top Bar Stats — fetched from backend */}
      <div className="p-4 rounded-lg bg-surface border border-border flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-text-secondary">
          <span>Total Signs: <strong className="text-text-primary">{stats?.total_signs ?? "—"}</strong></span>
          <span>Approved Samples: <strong className="text-status-approved">{stats?.total_approved_samples ?? "—"}</strong></span>
          <span>Languages: <strong className="text-text-primary">{stats?.languages?.join(", ") ?? "—"}</strong></span>
          <span>Version: <strong className="text-accent-primary">{stats?.dataset_version ?? "—"}</strong></span>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-1 bg-surface-elevated p-1 rounded border border-border">
          <button
            onClick={() => setViewMode("table")}
            className={`p-1.5 rounded transition-colors ${
              viewMode === "table" ? "bg-surface text-accent-primary" : "text-text-muted hover:text-text-primary"
            }`}
            title="Table View"
          >
            <TableIcon size={14} />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded transition-colors ${
              viewMode === "grid" ? "bg-surface text-accent-primary" : "text-text-muted hover:text-text-primary"
            }`}
            title="Grid View"
          >
            <LayoutGrid size={14} />
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search signs by English label or Bengali meaning..."
            className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded text-text-primary text-sm focus:outline-none focus:border-accent-primary"
          />
        </div>

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="bg-surface border border-border rounded px-3 py-2 text-xs font-mono text-text-secondary focus:outline-none focus:border-accent-primary"
        >
          <option value="">All Categories</option>
          {stats?.categories?.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            setPage(1);
          }}
          className="bg-surface border border-border rounded px-3 py-2 text-xs font-mono text-text-secondary focus:outline-none focus:border-accent-primary"
        >
          <option value="">All Dialects</option>
          {stats?.languages?.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {/* Main Content */}
      {viewMode === "table" ? (
        <div className="bg-surface border border-border rounded-lg overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-border bg-surface-elevated text-text-muted uppercase tracking-wider">
                <th className="py-3 px-4">Sign Gloss</th>
                <th className="py-3 px-4">Bengali Meaning</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4 text-center">Approved Samples</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={7} />
                ))
              ) : data?.items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-text-muted">
                    No signs matched your search filters.
                  </td>
                </tr>
              ) : (
                data?.items.map((sign) => (
                  <tr key={sign.id} className="hover:bg-surface-elevated/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-text-primary">{sign.label}</td>
                    <td className="py-3 px-4 font-bengali text-sm text-text-primary">{sign.bengali_meaning}</td>
                    <td className="py-3 px-4 text-text-secondary">{sign.category}</td>
                    <td className="py-3 px-4 text-text-secondary">{sign.language}</td>
                    <td className="py-3 px-4 text-center text-accent-primary font-bold">{sign.approved_samples}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-status-approved/10 text-status-approved text-[10px]">
                        ACTIVE
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/dataset/${sign.id}`}
                        className="inline-flex items-center space-x-1 text-accent-primary hover:underline"
                      >
                        <span>Details</span>
                        <ExternalLink size={12} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => <SignCardSkeleton key={i} />)
          ) : data?.items.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs font-mono text-text-muted">
              No signs matched your search query.
            </div>
          ) : (
            data?.items.map((sign) => (
              <div
                key={sign.id}
                className="bg-surface border border-border p-4 rounded-md flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-sm font-bold text-text-primary">{sign.label}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-elevated text-text-secondary">
                      {sign.language}
                    </span>
                  </div>
                  <div className="font-bengali text-base text-text-secondary mt-1">{sign.bengali_meaning}</div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs font-mono">
                  <span className="text-text-muted">Samples: <strong className="text-accent-primary">{sign.approved_samples}</strong></span>
                  <Link
                    href={`/dataset/${sign.id}`}
                    className="text-accent-primary hover:underline flex items-center space-x-1"
                  >
                    <span>View</span>
                    <ExternalLink size={11} />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {data && data.total_pages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-border font-mono text-xs text-text-secondary">
          <div>
            Showing Page <strong>{data.page}</strong> of <strong>{data.total_pages}</strong> ({data.total} signs)
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded bg-surface border border-border disabled:opacity-30 hover:bg-surface-elevated"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
              disabled={page >= data.total_pages}
              className="p-1.5 rounded bg-surface border border-border disabled:opacity-30 hover:bg-surface-elevated"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
