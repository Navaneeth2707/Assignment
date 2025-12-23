import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchArticles } from "../api/articles";

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles()
      .then(res => {
        const updatedBlogs = res.data.filter(
          blog => blog.is_updated === 1
        );

        setBlogs(updatedBlogs);
        if (updatedBlogs.length === 0) setShowAlert(true);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* 🔐 TOP BAR */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          📝 Blog Articles
        </h1>

        <button
          onClick={() => navigate("/admin")}
          className="bg-gray-900 text-white px-5 py-2 rounded-lg
                     hover:bg-gray-700 transition"
        >
          Admin
        </button>
      </div>

      {/* 🚨 ALERT */}
      {showAlert && (
        <div className="mb-6 p-4 rounded-lg bg-yellow-100 border border-yellow-400 text-yellow-800">
          ⚠️ No updated blogs available.  
          Please update articles from the <b>Admin Panel</b>.
        </div>
      )}

      {/* ✅ BLOGS */}
      {!showAlert && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map(blog => (
            <div
              key={blog.id}
              onClick={() =>
                navigate(`/blog/${blog.id}`, { state: blog })
              }
              className="cursor-pointer bg-white rounded-xl shadow-md p-6
                         hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {blog.title}
              </h2>

            

              <div className="mt-4 text-blue-600 font-medium">
                Read More →
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BlogList;
