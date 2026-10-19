export function usePublicAsset() {
  const { baseURL, cdnURL } = useRuntimeConfig().app
  const prefix = (cdnURL || baseURL).replace(/\/$/, '')
  return (path: string) => prefix + '/' + path.replace(/^\//, '')
}
