'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

interface AdminPaginationProps {
  total: number
  page: number
  pageSize: number
}

export function AdminPagination({ total, page, pageSize }: AdminPaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const totalPages = Math.ceil(total / pageSize)

  if (totalPages <= 1) return null

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(p))
    router.push(`${pathname}?${params.toString()}`)
  }

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className="flex items-center justify-between px-1 py-3 border-t border-white/[0.06]">
      <span className="font-[family-name:var(--font-body)] text-xs text-[#6b7280]">
        {from}–{to} of {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1.5 text-xs font-medium text-[#9ca3af] border border-white/[0.08] hover:border-white/20 hover:text-[#e2e3e1] disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-[family-name:var(--font-body)]"
        >
          Previous
        </button>
        <span className="px-3 py-1.5 text-xs font-medium text-[#e2e3e1] font-[family-name:var(--font-body)]">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1.5 text-xs font-medium text-[#9ca3af] border border-white/[0.08] hover:border-white/20 hover:text-[#e2e3e1] disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-[family-name:var(--font-body)]"
        >
          Next
        </button>
      </div>
    </div>
  )
}
