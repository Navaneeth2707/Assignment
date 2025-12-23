import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LOADING_STEPS = [
  "🔍 Looking for the best content on Google…",
  "📊 Comparing top-ranked sources…",
  "🕸️ Carefully web scraping useful information…",
  "🧠 Cleaning & organizing the content…",
  "✍️ Improving article quality…",
  "🚀 Final checks & optimization…"
];

function Admin() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(null); // extract | improve | delete
  const [statusText, setStatusText] = useState("");
  const [articles, setArticles] = useState([]);
  const [canWebScrape, setCanWebScrape] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [success, setSuccess] = useState(false);

  const sleep = ms => new Promise(res => setTimeout(res, ms));

  /* --------------------------------
     PROGRESS BAR (ONLY FOR IMPROVE)
  --------------------------------- */
  useEffect(() => {
    if (!loading || mode !== "improve") return;

    const interval = setInterval(() => {
      setProgress(prev => (prev < 96 ? prev + Math.random() * 2.5 : prev));
    }, 700);

    return () => clearInterval(interval);
  }, [loading, mode]);

  /* --------------------------------
     ROTATING STATUS (ONLY FOR IMPROVE)
  --------------------------------- */
  useEffect(() => {
    if (!loading || mode !== "improve") return;

    const interval = setInterval(() => {
      setStepIndex(prev => (prev + 1) % LOADING_STEPS.length);
      setStatusText(LOADING_STEPS[stepIndex]);
    }, 4000);

    return () => clearInterval(interval);
  }, [loading, mode, stepIndex]);

  /* --------------------------------
     DELETE ALL ARTICLES
  --------------------------------- */
  const handleDeleteAll = async () => {
    const confirmed = window.confirm(
      "⚠️ This will permanently delete ALL articles.\nAre you sure?"
    );
    if (!confirmed) return;

    try {
      setMode("delete");
      setLoading(true);
      setStatusText("🗑️ Deleting all articles…");

      await axios.delete("http://localhost:4000/api/articles");

      setArticles([]);
      setCanWebScrape(false);
      setSuccess(false);

      setLoading(false);
      setMode(null);

      alert("✅ All articles deleted successfully");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete articles");
      setLoading(false);
      setMode(null);
    }
  };

  /* --------------------------------
     STEP 1: EXTRACT BLOGS (SIMPLE)
  --------------------------------- */
  const handleExtract = async () => {
    try {
      setMode("extract");
      setLoading(true);
      setArticles([]);
      setCanWebScrape(false);
      setSuccess(false);
      setStatusText("Extracting latest blogs…");

      await axios.get("http://localhost:4000/scrape-init");
      await sleep(12000);

      const res = await axios.get("http://localhost:4000/api/articles");

      if (res.data.length > 0) {
        setArticles(res.data);
        setCanWebScrape(true);
      }

      setLoading(false);
      setMode(null);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setMode(null);
    }
  };

  /* --------------------------------
     STEP 2: IMPROVE & PUBLISH (FANCY)
  --------------------------------- */
  const handleExtractAndScrape = async () => {
    try {
      setMode("improve");
      setLoading(true);
      setProgress(0);
      setStatusText(LOADING_STEPS[0]);

      await axios.get("http://localhost:5000/scrape-enrich-organize");
      await sleep(30000);

      while (true) {
        const res = await axios.get("http://localhost:4000/api/articles");

        const allUpdated =
          res.data.length > 0 &&
          res.data.every(a => a.is_updated === 1);

        if (allUpdated) {
          setProgress(100);
          setSuccess(true);
          await sleep(2000);
          navigate("/");
          return;
        }

        await sleep(5000);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setMode(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white p-6">
      <div className="max-w-5xl mx-auto">

        {/* BACK */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 text-indigo-300 hover:underline"
        >
          ← Back to Blogs
        </button>

        {/* HEADER */}
        <h1 className="text-4xl font-extrabold mb-2">
          🤖 Content Assistant
        </h1>
        <p className="text-gray-300 mb-8">
          Extract, improve, publish — safely and step by step.
        </p>

        {/* BUTTONS */}
        <div className="flex gap-4 flex-wrap mb-6">
          <button
            onClick={handleExtract}
            disabled={loading}
            className="bg-indigo-600 px-6 py-3 rounded-xl font-semibold
                       hover:bg-indigo-500 transition disabled:opacity-40"
          >
            Step 1: Extract Blogs
          </button>

          {canWebScrape && !loading && (
            <button
              onClick={handleExtractAndScrape}
              className="bg-emerald-600 px-6 py-3 rounded-xl font-semibold
                         hover:bg-emerald-500 transition animate-pulse"
            >
              Step 2: Improve & Publish 🚀
            </button>
          )}

          {!loading && (
            <button
              onClick={handleDeleteAll}
              className="bg-red-600 px-6 py-3 rounded-xl font-semibold
                         hover:bg-red-500 transition"
            >
              🗑️ Clear All Articles
            </button>
          )}
        </div>

        {/* STEP 1 LOADING */}
        {loading && mode === "extract" && (
          <div className="mt-10 bg-white/10 rounded-xl p-6 text-center">
            <div className="animate-spin mx-auto h-10 w-10 border-b-2 border-white rounded-full"></div>
            <p className="mt-4">{statusText}</p>
          </div>
        )}

        {/* STEP 2 LOADING */}
        {loading && mode === "improve" && (
          <div className="mt-10 bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
            <p className="text-lg font-medium mb-4">{statusText}</p>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-emerald-400 to-blue-500 h-3 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* EXTRACTED TITLES */}
        {!loading && articles.length > 0 && (
          <div className="mt-10 bg-white text-gray-900 p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-4">
              📋 Extracted Articles
            </h2>

            <ul className="space-y-2">
              {articles.map(a => (
                <li
                  key={a.id}
                  className="p-3 bg-gray-100 rounded-md"
                >
                  {a.title}
                </li>
              ))}
            </ul>

            <div className="mt-6 p-4 bg-blue-100 text-blue-800 rounded-lg">
              👍 Review titles, then continue to Step 2.
            </div>
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="mt-10 bg-green-100 text-green-900 p-6 rounded-2xl shadow-xl">
            🎉 Blogs published successfully!
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
