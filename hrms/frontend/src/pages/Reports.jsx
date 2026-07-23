import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { getEmployees } from '../services/employeeService'
import { getDepartments } from '../services/departmentService'
import { getAllLeaves } from '../services/leaveService'

const LEAVE_COLORS = { PENDING: '#f59e0b', APPROVED: '#10b981', REJECTED: '#ef4444', CANCELLED: '#9ca3af' }

export default function Reports() {
  const [deptData, setDeptData] = useState([])
  const [leaveData, setLeaveData] = useState([])

  useEffect(() => {
    Promise.all([getDepartments({ size: 100 }), getEmployees({ size: 200 })]).then(([deptRes, empRes]) => {
      const counts = deptRes.content.map((d) => ({
        name: d.name,
        employees: empRes.content.filter((e) => e.departmentName === d.name).length,
      }))
      setDeptData(counts)
    }).catch(() => {})

    getAllLeaves({ size: 200 }).then((d) => {
      const statusCounts = {}
      d.content.forEach((l) => { statusCounts[l.status] = (statusCounts[l.status] || 0) + 1 })
      setLeaveData(Object.entries(statusCounts).map(([name, value]) => ({ name, value })))
    }).catch(() => {})
  }, [])

  return (
    <div>
      <h2 className="page-title mb-1">Reports</h2>
      <p className="page-subtitle mb-6">Workforce and leave analytics</p>

      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-4 dark:text-gray-100">Employees by Department</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData}>
                <XAxis dataKey="name" fontSize={12} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="employees" fill="#4a56f0" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4 dark:text-gray-100">Leave Request Trends</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={leaveData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {leaveData.map((entry) => (
                    <Cell key={entry.name} fill={LEAVE_COLORS[entry.name] || '#a5b4fc'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
