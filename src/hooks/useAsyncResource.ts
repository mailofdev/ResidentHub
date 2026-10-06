import { useCallback, useEffect, useState } from 'react'

/**
 * Generic async resource loader for list pages.
 * Keeps fetch logic out of presentation components' ad-hoc effects.
 */
export function useAsyncResource<T>(
  loader: () => Promise<T>,
  deps: unknown[],
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const reload = useCallback(() => {
    setReloadKey((value) => value + 1)
  }, [])

  useEffect(() => {
    let active = true

    queueMicrotask(() => {
      if (!active) return
      setLoading(true)
      setError(null)

      loader()
        .then((result) => {
          if (!active) return
          setData(result)
        })
        .catch((err: unknown) => {
          if (!active) return
          setError(err instanceof Error ? err.message : 'Something went wrong')
          setData(null)
        })
        .finally(() => {
          if (!active) return
          setLoading(false)
        })
    })

    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey])

  return { data, loading, error, reload, setData }
}
