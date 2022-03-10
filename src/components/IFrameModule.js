export default function IFrameModule({ module }) {
  if (!module.isOpen) {
    return null
  }

  const url = new URL(module.moduleURL)
  console.log(url.toString())
  const config = encodeURIComponent(JSON.stringify(module.config))
  url.searchParams.append('config', config)
  console.log('config', url.toString())
  return (
    <div >
      {/* <iframe
        id="atomic-module-iframe"
        // ref={module.iframeRef}
        src={url}
        title="Atomic Module"
      /> */}
    </div>
  )
}
