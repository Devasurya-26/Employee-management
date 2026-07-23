import { useEffect, useState } from 'react'
import { Users, Building2, CalendarCheck, CalendarDays } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { getDashboardSummary } from '../services/dashboardService'
import { useAuth } from '../context/AuthContext'

const COLORS = ['#4f46e5', '#a5b4fc', '#f59e0b', '#10b981']

export default function Dashboard() {
  const { user, isAdmin } = useAuth()
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    getDashboardSummary().then(setSummary).catch(() => {})
  }, [])

  const cards = summary ? [
    { label: 'Total Employees', value: summary.totalEmployees, icon: Users, color: 'bg-primary-50 text-primary-600' },
    { label: 'Departments', value: summary.totalDepartments, icon: Building2, color: 'bg-amber-50 text-amber-600' },
    { label: 'Present Today', value: summary.presentToday, icon: CalendarCheck, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Pending Leaves', value: summary.pendingLeaves, icon: CalendarDays, color: 'bg-rose-50 text-rose-600' },
  ] : []

  const chartData = summary ? [
    { name: 'Present Today', value: summary.presentToday || 0 },
    { name: 'Pending Leaves', value: summary.pendingLeaves || 0 },
    { name: 'Other Employees', value: Math.max((summary.totalEmployees || 0) - (summary.presentToday || 0), 0) },
  ] : []

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Welcome back, {user?.username} 👋</h2>
      <p className="text-gray-500 text-sm mb-6">{isAdmin ? "Here's what's happening across the organization." : "Here's your daily overview."}</p>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card flex items-center gap-4">
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${color}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold">{value ?? '-'}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">Workforce Snapshot</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {chartData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
