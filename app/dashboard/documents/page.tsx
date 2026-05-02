"use client"

import * as React from "react"
import { Download, Eye, MoreHorizontal, Trash2, Upload } from "lucide-react"
import { toast } from "sonner"

import { deleteFile, isApiError, listFiles, uploadFile } from "@/backend"
import type { FileMetadataDTO } from "@/backend"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatBytes, formatDate } from "@/lib/format"

const PAGE_LIMIT = 10

export default function DocumentsPage() {
  const [fileTitle, setFileTitle] = React.useState("")
  const [file, setFile] = React.useState<File | null>(null)
  const [uploading, setUploading] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [page, setPage] = React.useState(1)
  const [total, setTotal] = React.useState(0)
  const [items, setItems] = React.useState<FileMetadataDTO[]>([])

  const [deleteTarget, setDeleteTarget] =
    React.useState<FileMetadataDTO | null>(null)
  const [deleting, setDeleting] = React.useState(false)

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT))

  const load = React.useCallback(async (p: number) => {
    setLoading(true)
    try {
      const data = await listFiles(p, PAGE_LIMIT)
      setItems(data.items)
      setTotal(data.total)
      setPage(data.page)
    } catch (error) {
      const message = isApiError(error)
        ? error.message
        : "Failed to load files."
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    queueMicrotask(() => {
      void load(1)
    })
  }, [load])

  function onDrop(event: React.DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    const dropped = event.dataTransfer.files?.[0]
    if (dropped && dropped.type === "application/pdf") {
      setFile(dropped)
      toast.success(`Selected ${dropped.name}`)
    } else if (dropped) {
      toast.error("Only PDF files are supported.")
    }
  }

  function onFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const picked = event.target.files?.[0]
    if (picked && picked.type === "application/pdf") {
      setFile(picked)
    } else if (picked) {
      toast.error("Only PDF files are supported.")
    }
  }

  async function handleUpload(event: React.FormEvent) {
    event.preventDefault()
    if (!file) {
      toast.error("Choose a PDF to upload.")
      return
    }
    const title = fileTitle.trim()
    if (!title) {
      toast.error("Enter a document title.")
      return
    }
    setUploading(true)
    try {
      await uploadFile(file, title)
      toast.success("File uploaded and indexed.")
      setFile(null)
      setFileTitle("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      await load(1)
    } catch (error) {
      const message = isApiError(error) ? error.message : "Upload failed."
      toast.error(message)
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget?.file_id) {
      return
    }
    setDeleting(true)
    try {
      await deleteFile(deleteTarget.file_id)
      toast.success("File deleted.")
      setDeleteTarget(null)
      const nextPage = items.length === 1 && page > 1 ? page - 1 : page
      await load(nextPage)
    } catch (error) {
      const message = isApiError(error) ? error.message : "Delete failed."
      toast.error(message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="font-heading text-sm font-medium">Documents</h1>
        <p className="mt-1 text-xs/relaxed text-muted-foreground">
          Upload PDFs to your internal evidence store. Files are chunked and
          indexed for use with Fact Check.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-sm">Upload PDF</CardTitle>
          <CardDescription className="text-xs">
            Provide a display title and drop a PDF, or browse from disk.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="file-title">File title</Label>
              <Input
                id="file-title"
                value={fileTitle}
                onChange={(e) => setFileTitle(e.target.value)}
                placeholder="Annual report 2024"
                disabled={uploading}
              />
            </div>
            <div className="grid gap-2">
              <Label>PDF file</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="sr-only"
                onChange={onFileInputChange}
                disabled={uploading}
              />
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    fileInputRef.current?.click()
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onDrop={onDrop}
                className="flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-border bg-muted/20 px-4 py-8 text-xs text-muted-foreground hover:bg-muted/30"
              >
                <Upload className="size-5 text-muted-foreground" />
                <p>
                  {file
                    ? file.name
                    : "Drag & drop a PDF here, or click to browse"}
                </p>
              </div>
            </div>
            <Button
              type="submit"
              disabled={uploading || !file || !fileTitle.trim()}
            >
              {uploading ? "Uploading…" : "Upload & index"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="font-heading text-sm">
              Evidence library
            </CardTitle>
            <CardDescription className="text-xs">
              Newest uploads first.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void load(page)}
            disabled={loading}
          >
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4">
          {loading ? (
            <div className="grid gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="border border-dashed border-border px-4 py-8 text-center text-xs text-muted-foreground">
              No documents yet. Upload a PDF to seed your internal evidence
              store.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Title</TableHead>
                    <TableHead className="text-xs">Filename</TableHead>
                    <TableHead className="text-xs">Size</TableHead>
                    <TableHead className="text-xs">Uploaded</TableHead>
                    <TableHead className="text-xs">Open</TableHead>
                    <TableHead className="w-[3rem] text-xs">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((row) => (
                    <TableRow key={row.file_id}>
                      <TableCell className="max-w-[12rem] truncate text-xs">
                        {row.file_title ?? "—"}
                      </TableCell>
                      <TableCell className="max-w-[10rem] truncate text-xs text-muted-foreground">
                        {row.file_name ?? "—"}
                      </TableCell>
                      <TableCell className="text-xs tabular-nums">
                        {formatBytes(row.file_size ?? undefined)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(row.uploaded_at ?? undefined)}
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="flex flex-wrap items-center gap-0.5">
                          {row.view_url ? (
                            <Button variant="ghost" size="icon-xs" asChild>
                              <a
                                href={row.view_url}
                                target="_blank"
                                rel="noreferrer noopener"
                                title="View in browser"
                              >
                                <Eye className="size-4" />
                                <span className="sr-only">View in browser</span>
                              </a>
                            </Button>
                          ) : null}
                          {row.download_url ? (
                            <Button variant="ghost" size="icon-xs" asChild>
                              <a
                                href={row.download_url}
                                target="_blank"
                                rel="noreferrer noopener"
                                title="Download file"
                                download
                              >
                                <Download className="size-4" />
                                <span className="sr-only">Download file</span>
                              </a>
                            </Button>
                          ) : null}
                          {!row.view_url && !row.download_url ? (
                            <span className="text-muted-foreground">—</span>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="size-7"
                              aria-label="Row actions"
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => setDeleteTarget(row)}
                            >
                              <Trash2 className="size-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!loading && items.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => void load(page - 1)}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => void load(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={deleteTarget != null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete document</DialogTitle>
            <DialogDescription>
              This removes the file from storage and your evidence index. This
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deleteTarget ? (
            <p className="text-xs">
              <span className="text-muted-foreground">Title: </span>
              {deleteTarget.file_title ??
                deleteTarget.file_name ??
                deleteTarget.file_id}
            </p>
          ) : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void handleDelete()}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
