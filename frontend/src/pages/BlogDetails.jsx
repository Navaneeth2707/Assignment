import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchArticleById } from "../api/articles";

function BlogDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [blog, setBlog] = useState(location.state || null);

  useEffect(() => {
    if (!blog) {
      fetchArticleById(id)
        .then(res => setBlog(res.data))
        .catch(console.error);
    }
  }, [blog, id]);

  // Remove unwanted markdown characters
  const cleanContent = (text = "") => text.replace(/\*/g, "");

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading article…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* BACK */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 text-sm text-blue-600 hover:underline"
        >
          ← Back to Blogs
        </button>

        {/* TITLE */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
          {blog.title}
        </h1>

        {/* CONTENT */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <p className="text-gray-800 leading-7 whitespace-pre-line">
            {cleanContent(blog.content)}
          </p>

          {/* SOURCE */}
          <div className="mt-8 border-t pt-4">
            <a
              href={blog.source_url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 font-medium hover:underline"
            >
              🔗 View original source
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

export default BlogDetails;
