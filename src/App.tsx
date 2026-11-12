import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { TopNav } from '@/components/layout/TopNav'
import { BottomToolbar } from '@/components/layout/BottomToolbar'
import { AboutView } from '@/components/layout/AboutView'
import { SettingsView } from '@/components/layout/SettingsView'
import { GarageHero } from '@/components/layout/GarageHero'
import { LeftPanel } from '@/components/configurator/LeftPanel'
import { RightPanel } from '@/components/configurator/RightPanel'
import { SavedBuildsView } from '@/components/configurator/SavedBuildsView'
import { MobileSheet } from '@/components/configurator/MobileSheet'
import { ShowroomScene } from '@/three/showroom/ShowroomScene'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { Toast } from '@/components/ui/Toast'
import { useGarageStore } from '@/store/useGarageStore'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

export default function App() {
  const view = useGarageStore((s) => s.view)
  const loading = useGarageStore((s) => s.loading)
  const hydrateFromUrl = useGarageStore((s) => s.hydrateFromUrl)
  const [ready, setReady] = useState(false)

  useKeyboardShortcuts()

  useEffect(() => {
    hydrateFromUrl()
    setReady(true)
  }, [hydrateFromUrl])

  const showShowroom = view === 'configure' || view === 'garage'

  return (
    <div className="relative flex h-full flex-col bg-gg-bg" data-testid="app-root">
      <AnimatePresence>{(loading || !ready) && <LoadingScreen />}</AnimatePresence>

      <TopNav />

      <main className="relative flex min-h-0 flex-1 flex-col">
        {view === 'saved' && (
          <div className="absolute inset-0 z-10 overflow-y-auto bg-gg-bg">
            <SavedBuildsView />
          </div>
        )}
        {view === 'about' && (
          <div className="absolute inset-0 z-10 overflow-y-auto bg-gg-bg">
            <AboutView />
          </div>
        )}
        {view === 'settings' && (
          <div className="absolute inset-0 z-10 overflow-y-auto bg-gg-bg">
            <SettingsView />
          </div>
        )}

        {showShowroom && (
          <>
            <div className="absolute inset-0">
              <ShowroomScene />
            </div>

            {view === 'garage' && (
              <div className="absolute inset-0 z-20 bg-gg-bg/75 backdrop-blur-md">
                <GarageHero />
              </div>
            )}

            {view === 'configure' && (
              <>
                <div className="pointer-events-none absolute inset-0 z-20 hidden md:flex">
                  <div className="pointer-events-auto m-3 w-72 lg:w-80">
                    <div className="h-[calc(100%-5rem)]">
                      <LeftPanel />
                    </div>
                  </div>
                  <div className="flex-1" />
                  <div className="pointer-events-auto m-3 w-72 lg:w-80">
                    <div className="h-[calc(100%-5rem)]">
                      <RightPanel />
                    </div>
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col">
                  <MobileSheet />
                  <BottomToolbar />
                </div>
              </>
            )}

            {view === 'garage' && (
              <div className="absolute inset-x-0 bottom-0 z-30">
                <BottomToolbar />
              </div>
            )}
          </>
        )}
      </main>

      <Toast />
    </div>
  )
}
