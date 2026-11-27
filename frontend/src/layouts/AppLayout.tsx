
import { useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Leaf } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()

  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <div className="flex min-h-screen bg-background">

      {isSidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={closeSidebar}
          aria-label="Close sidebar overlay"
        />
      )}

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      <div className="flex min-w-0 flex-1 flex-col">

        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="mx-auto w-full max-w-[1600px] flex-1 p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="border-t border-border/70 bg-card/70 px-5 py-5 sm:px-8">
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/30">
                <Leaf size={15} className="text-foreground" />
              </div>

              <span className="font-medium text-foreground">EcoRoute</span>
              <span>· Smart Electric Mobility</span>
            </div>

            <p>Find better routes. Travel greener.</p>

            <span>Project Version 1.0</span>

          </div>
        </footer>

      </div>
    </div>
  )
}

export default AppLayout
