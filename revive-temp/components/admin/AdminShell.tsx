'use client'

import { useState } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { AdminTopbar } from './AdminTopbar'
import type { AdminProfile } from '@/lib/auth/getAdminSession'

interface AdminShellProps {
  title: string
  profile: AdminProfile
  children: React.ReactNode
}

export function AdminShell({ title, profile, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0a0b0a] flex">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        role={profile.role}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-60">
        <AdminTopbar
          title={title}
          profile={profile}
          onMenuToggle={() => setSidebarOpen(prev => !prev)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
