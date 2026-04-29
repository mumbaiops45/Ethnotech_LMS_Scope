import Layout from "../../components/layout";

export default function InstructorDashboard() {
  return (
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Instructor Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's an overview of your teaching activity.</p>
        </div>

        {/* Stats cards - temporary placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
            <p className="text-sm text-gray-500">Total Courses</p>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
            <p className="text-sm text-gray-500">Active Students</p>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-500">Pending Assignments</p>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-purple-500">
            <p className="text-sm text-gray-500">Upcoming Live Sessions</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>

        {/* Recent activity / quick links */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition">
                📚 Create a new course
              </button>
              <button className="w-full text-left px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition">
                📝 Create an assignment
              </button>
              <button className="w-full text-left px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition">
                🎥 Schedule a live session
              </button>
              <button className="w-full text-left px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition">
                📢 Send batch announcement
              </button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
            <p className="text-gray-400 text-center py-6">No recent activity yet.</p>
          </div>
        </div>
      </div>
  );
}