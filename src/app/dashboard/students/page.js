export default function DashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Welcome 👋</h2>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded shadow">
          <h3>Total Leads</h3>
          <p className="text-2xl font-bold">120</p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h3>Total Students</h3>
          <p className="text-2xl font-bold">80</p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h3>Total Courses</h3>
          <p className="text-2xl font-bold">12</p>
        </div>
      </div>
    </div>
  );
}