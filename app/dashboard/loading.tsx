export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 
                    flex items-center justify-center">
      <div className="w-16 h-16 relative">
        <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-red-600 rounded-full 
                      border-t-transparent animate-spin"></div>
      </div>
    </div>
  )
} 