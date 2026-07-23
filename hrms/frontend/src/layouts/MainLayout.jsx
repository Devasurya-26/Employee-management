import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard, Users, Building2, BadgeCheck, CalendarCheck,
  CalendarDays, Megaphone, User, LogOut, FileBarChart, Sparkles,
  IndianRupee, Moon, Sun
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItem = "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
const active = "bg-primary-50 text-primary-700 shadow-sm dark:bg-primary-500/10 dark:text-primary-300"
const inactive = "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"

export default function MainLayout() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const adminLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/employees', label: 'Employees', icon: Users },
    { to: '/departments', label: 'Departments', icon: Building2 },
    { to: '/designations', label: 'Designations', icon: BadgeCheck },
    { to: '/leaves', label: 'Leave Approvals', icon: CalendarDays },
    { to: '/payroll', label: 'Payroll', icon: IndianRupee },
    { to: '/announcements', label: 'Announcements', icon: Megaphone },
    { to: '/reports', label: 'Reports', icon: FileBarChart },
  ]

  const employeeLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/attendance', label: 'My Attendance', icon: CalendarCheck },
    { to: '/leaves', label: 'My Leaves', icon: CalendarDays },
    { to: '/payroll', label: 'My Salary', icon: IndianRupee },
    { to: '/announcements', label: 'Announcements', icon: Megaphone },
    { to: '/profile', label: 'My Profile', icon: User },
  ]

  const links = isAdmin ? adminLinks : employeeLinks

  return (
    <div className="flex min-h-screen bg-surface dark:bg-gray-950">
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col dark:bg-gray-900 dark:border-gray-800">
        <div className="px-5 py-5 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-[15px] text-gray-900 leading-tight dark:text-white">Smart HRMS</h1>
            <p className="text-[11px] text-gray-400 leading-tight">Employee Management</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-3 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `${navItem} ${isActive ? active : inactive}`}
            >
              <Icon size={17} strokeWidth={2.2} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`${navItem} ${inactive} w-full mb-1`}
          >
            {darkMode ? <Sun size={17} strokeWidth={2.2} /> : <Moon size={17} strokeWidth={2.2} />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <div className="flex items-center gap-3 mb-3 px-1 mt-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center font-semibold text-sm shadow-sm">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate dark:text-gray-100">{user?.username}</p>
              <p className="text-[11px] text-gray-400">{isAdmin ? 'Administrator' : 'Employee'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className={`${navItem} ${inactive} w-full`}>
            <LogOut size={17} strokeWidth={2.2} />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-8 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
