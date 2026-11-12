export function AboutView() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 overflow-y-auto p-6">
      <h1 className="text-2xl font-semibold">About GhostGarage</h1>
      <p className="text-sm leading-relaxed text-gg-muted">
        GhostGarage is a personal portfolio project: a browser-based premium automotive configurator
        built with React, Three.js, and React Three Fiber. All vehicles are fictional concept models
        generated procedurally with Three.js primitives — they are not production car geometry and
        are not affiliated with any manufacturer.
      </p>
      <p className="text-sm leading-relaxed text-gg-muted">
        Prices, horsepower figures, and upgrade packages are simulated for demonstration. Nothing
        here is a real quotation or performance claim.
      </p>
      <ul className="list-disc space-y-1 pl-5 text-sm text-gg-muted">
        <li>Interactive 3D showroom with orbit controls</li>
        <li>Paint, wheels, body kit, lighting, and performance customization</li>
        <li>localStorage garage with shareable configuration URLs</li>
        <li>Screenshot export of the current canvas view</li>
      </ul>
    </div>
  )
}
