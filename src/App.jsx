import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [loading, setloading] = useState(false);
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await axios.get("https://excel-record-bk.vercel.app/records");
      setRecords(res.data);
    } catch (err) {
      alert("Failed to fetch records");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");
    const formData = new FormData();
    formData.append("file", file);

    try {
      setloading(true);
      const res = await axios.post(
        "https://excel-record-bk.vercel.app/upload",
        formData
      );
      alert(res.data.message);
      setFile(null);
      e.target.reset();
      fetchRecords();
    } catch (err) {
      console.error(err);
      setloading(false);
      alert("Upload failed");
    }
  };

  const filteredRecords = records.filter((r) => {
    const keyword = searchTerm.toLowerCase();
    return (
      r.Empcode?.toLowerCase().includes(keyword) ||
      r.FirstName?.toLowerCase().includes(keyword) ||
      r.LastName?.toLowerCase().includes(keyword) ||
      r.Dept?.toLowerCase().includes(keyword) ||
      r.Region?.toLowerCase().includes(keyword)
    );
  });

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex-grow p-4 md:p-8">
        <h1 className="text-xl md:text-2xl font-bold mb-4 text-center">
          📤 Excel Upload & Record Viewer
        </h1>

        <form
          onSubmit={handleUpload}
          className="bg-white p-4 rounded shadow mb-6 flex flex-col gap-2 sm:flex-row sm:items-center"
        >
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="flex-1 border rounded px-2 py-1"
          />
          <button
            disabled={loading}
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2 sm:mt-0"
          >
            {loading ? "Uploading" : "Upload"}
          </button>
        </form>

        <input
          type="text"
          placeholder="Search by name, empcode, dept..."
          className="w-full p-2 border rounded mb-4"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <div className="overflow-x-auto rounded shadow">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 text-left whitespace-nowrap">Empcode</th>
                <th className="p-2 text-left whitespace-nowrap">First Name</th>
                <th className="p-2 text-left whitespace-nowrap">Last Name</th>
                <th className="p-2 text-left whitespace-nowrap">Dept</th>
                <th className="p-2 text-left whitespace-nowrap">Region</th>
                <th className="p-2 text-left whitespace-nowrap">Branch</th>
                <th className="p-2 text-left whitespace-nowrap">Hiredate</th>
                <th className="p-2 text-left whitespace-nowrap">Salary</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((rec, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="p-2 whitespace-nowrap">{rec.Empcode}</td>
                    <td className="p-2 whitespace-nowrap">{rec.FirstName}</td>
                    <td className="p-2 whitespace-nowrap">{rec.LastName}</td>
                    <td className="p-2 whitespace-nowrap">{rec.Dept}</td>
                    <td className="p-2 whitespace-nowrap">{rec.Region}</td>
                    <td className="p-2 whitespace-nowrap">{rec.Branch}</td>
                    <td className="p-2 whitespace-nowrap">
                      {rec.Hiredate
                        ? new Date(rec.Hiredate).toLocaleDateString()
                        : ""}
                    </td>
                    <td className="p-2 whitespace-nowrap">{rec.Salary}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-2 text-center" colSpan="8">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-200 text-center py-3 text-sm text-gray-700">
        Build and Design by <span className="font-semibold">Shubham</span>
      </footer>
    </div>
  );
}

export default App;
