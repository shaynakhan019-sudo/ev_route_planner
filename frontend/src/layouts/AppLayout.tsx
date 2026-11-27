
import { Outlet } from 'react-router'
import { Leaf } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">

        <Header />

        <main className="mx-auto w-full max-w-[1600px] flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        <footer className="border-t border-border/70 bg-card/70 px-5 py-5 sm:px-8">
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/30">
                <Leaf size={15} className="text-foreground" />
              </div>

              <span className="font-medium text-foreground">
                EcoRoute
              </span>

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
