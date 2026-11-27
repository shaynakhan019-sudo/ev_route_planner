import {
  MapPin,
  Route,
  Zap,
  ArrowRight,
  Navigation,
  BatteryCharging,
  Clock,
} from 'lucide-react'

function Dashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* Welcome Section */}
      <section className="rounded-2xl bg-primary text-primary-foreground p-8">
        <p className="text-sm opacity-80">SMART ELECTRIC MOBILITY</p>

        <h1 className="text-3xl font-bold mt-3">
          Plan smarter. Drive greener.
        </h1>

        <p className="mt-3 opacity-80 max-w-xl">
          Find efficient EV routes, compare pathfinding algorithms
          and explore charging locations.
        </p>

        <button className="mt-6 rounded-lg bg-background text-foreground px-5 py-3 font-semibold flex items-center gap-2">
          Plan a Route <ArrowRight size={18} />
        </button>
      </section>

      {/* Statistics */}
      <section>
        <h2 className="text-xl font-bold mb-4">Overview</h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          <StatCard
            title="Available Locations"
            value="15+"
            description="Locations in the route network"
            icon={<MapPin />}
          />

          <StatCard
            title="Pathfinding Algorithms"
            value="4"
            description="BFS, UCS, Greedy and A*"
            icon={<Route />}
          />

          <StatCard
            title="Charging Stations"
            value="Explore"
            description="Discover EV charging points"
            icon={<Zap />}
          />

        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>

        <div className="grid gap-4 sm:grid-cols-2">

          <ActionCard
            icon={<Navigation />}
            title="Plan a Journey"
            description="Find the best route between two locations."
          />

          <ActionCard
            icon={<BatteryCharging />}
            title="Find Charging Stations"
            description="Explore charging locations across the network."
          />

        </div>
      </section>

      {/* Recent Activity */}
      <section className="rounded-xl border bg-card p-6">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={20} />
          <h2 className="text-xl font-bold">Recent Activity</h2>
        </div>

        <p className="text-muted-foreground text-sm">
          Your recent route searches will appear here.
        </p>
      </section>

    </div>
  )
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="text-primary">{icon}</div>
      </div>

      <h3 className="text-3xl font-bold mt-4">{value}</h3>

      <p className="text-sm text-muted-foreground mt-2">
        {description}
      </p>
    </div>
  )
}

function ActionCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border bg-card p-6 hover:border-primary transition-colors">
      <div className="text-primary mb-3">{icon}</div>

      <h3 className="font-semibold text-lg">{title}</h3>

      <p className="text-sm text-muted-foreground mt-2">
        {description}
      </p>
    </div>
  )
}

export default Dashboard