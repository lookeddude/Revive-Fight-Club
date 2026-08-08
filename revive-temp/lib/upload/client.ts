/**
 * Client-side upload helper — uses the /api/admin/upload API route.
 * Call this from any Client Component that needs to upload images.
 *
 * @param file     - The File object selected by the user
 * @param bucket   - Supabase storage bucket name (default: revive-gallery)
 * @param folder   - Folder path within the bucket (default: uploads)
 * @returns        - Public URL string on success, null on failure
 */
export async function uploadFileToStorage(
  file: File,
  bucket = 'revive-gallery',
  folder = 'uploads'
): Promise<{ url: string; path: string } | null> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('bucket', bucket)
  fd.append('folder', folder)

  try {
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: fd,
      // No Content-Type header — browser sets it with boundary automatically
    })

    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      console.error('[uploadFileToStorage]', res.status, json.error)
      return null
    }

    const json = await res.json()
    return { url: json.url, path: json.path }
  } catch (err) {
    console.error('[uploadFileToStorage] network error:', err)
    return null
  }
}

/**
 * Returns a human-readable error from a failed upload response.
 */
export async function getUploadError(res: Response): Promise<string> {
  try {
    const json = await res.json()
    return json.error ?? 'Upload failed.'
  } catch {
    return 'Upload failed.'
  }
}
