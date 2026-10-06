import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
  type UploadTaskSnapshot,
} from 'firebase/storage'
import { getFirebaseStorage } from './firebase.config'

export interface UploadOptions {
  path: string
  file: File
  maxSizeBytes?: number
  allowedMimeTypes?: string[]
  onProgress?: (progress: number) => void
}

export interface UploadResult {
  path: string
  url: string
  contentType: string
  size: number
  name: string
}

function validateFile(
  file: File,
  options: Pick<UploadOptions, 'maxSizeBytes' | 'allowedMimeTypes'>,
) {
  if (options.maxSizeBytes && file.size > options.maxSizeBytes) {
    throw new Error(`File exceeds maximum size of ${Math.round(options.maxSizeBytes / 1024 / 1024)}MB`)
  }
  if (options.allowedMimeTypes && !options.allowedMimeTypes.includes(file.type)) {
    throw new Error('File type is not allowed')
  }
}

export async function uploadFile(options: UploadOptions): Promise<UploadResult> {
  validateFile(options.file, options)

  const storageRef = ref(getFirebaseStorage(), options.path)
  const task = uploadBytesResumable(storageRef, options.file, {
    contentType: options.file.type,
  })

  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      (snapshot: UploadTaskSnapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        options.onProgress?.(progress)
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        resolve({
          path: options.path,
          url,
          contentType: options.file.type,
          size: options.file.size,
          name: options.file.name,
        })
      },
    )
  })
}

export async function uploadFiles(
  files: File[],
  getPath: (file: File, index: number) => string,
  options?: Omit<UploadOptions, 'path' | 'file' | 'onProgress'> & {
    onFileProgress?: (index: number, progress: number) => void
  },
): Promise<UploadResult[]> {
  const results: UploadResult[] = []
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i]
    if (!file) continue
    const result = await uploadFile({
      file,
      path: getPath(file, i),
      maxSizeBytes: options?.maxSizeBytes,
      allowedMimeTypes: options?.allowedMimeTypes,
      onProgress: (progress) => options?.onFileProgress?.(i, progress),
    })
    results.push(result)
  }
  return results
}

export async function deleteFile(path: string): Promise<void> {
  await deleteObject(ref(getFirebaseStorage(), path))
}

export function createObjectPreview(file: File): string {
  return URL.createObjectURL(file)
}

export function revokeObjectPreview(url: string): void {
  URL.revokeObjectURL(url)
}
