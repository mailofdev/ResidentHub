import { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createObjectPreview, revokeObjectPreview } from '@/core/firebase/storage'

export function FileUploadField({
  accept,
  multiple,
  onChange,
  maxSizeLabel,
}: {
  accept?: string
  multiple?: boolean
  onChange: (files: File[]) => void
  maxSizeLabel?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<Array<{ name: string; url: string }>>([])

  function handleFiles(fileList: FileList | null) {
    const files = Array.from(fileList || [])
    previews.forEach((preview) => revokeObjectPreview(preview.url))
    setPreviews(
      files.map((file) => ({
        name: file.name,
        url: file.type.startsWith('image/') ? createObjectPreview(file) : '',
      })),
    )
    onChange(files)
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center">
        <Upload className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />
        <p className="text-sm font-medium">Upload files</p>
        {maxSizeLabel ? <p className="mt-1 text-xs text-muted-foreground">{maxSizeLabel}</p> : null}
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => inputRef.current?.click()}
        >
          Choose files
        </Button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>
      {previews.length ? (
        <ul className="space-y-2">
          {previews.map((preview) => (
            <li
              key={preview.name}
              className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
            >
              <div className="flex min-w-0 items-center gap-3">
                {preview.url ? (
                  <img src={preview.url} alt="" className="h-10 w-10 rounded object-cover" />
                ) : null}
                <span className="truncate">{preview.name}</span>
              </div>
              <X className="h-4 w-4 text-muted-foreground" />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
