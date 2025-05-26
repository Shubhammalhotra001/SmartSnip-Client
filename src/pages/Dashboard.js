import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './dashboard.css';

export default function Dashboard() {
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [summary, setSummary] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterTag, setFilterTag] = useState('');

  // Fetch bookmarks
  const fetchBookmarks = async (tag = '') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view bookmarks.');
        return;
      }
      const res = await axios.get(`http://localhost:5000/api/bookmarks${tag ? `?tag=${encodeURIComponent(tag)}` : ''}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setError('');
      setBookmarks(Array.isArray(res.data.bookmarks) ? res.data.bookmarks : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookmarks.');
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchBookmarks();
  }, []);

  // Handle tag filter
  useEffect(() => {
    fetchBookmarks(filterTag);
  }, [filterTag]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to save bookmarks.');
        setIsLoading(false);
        return;
      }
      const tagArray = tags.split(',').map((tag) => tag.trim()).filter(Boolean);
      await axios.post(
        'http://localhost:5000/api/bookmarks',
        { url, tags: tagArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchBookmarks(filterTag);
      setSuccess('Bookmark saved successfully');
      setUrl('');
      setTags('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving bookmark.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsDeleting((prev) => ({ ...prev, [id]: true }));
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to delete bookmarks.');
        return;
      }
      await axios.delete(`http://localhost:5000/api/bookmarks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchBookmarks(filterTag);
      setSuccess('Bookmark deleted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting bookmark.');
    } finally {
      setIsDeleting((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleViewSummary = (bookmark) => {
    console.log('Bookmark data:', bookmark); // Debugging log to inspect API response
    setSelectedBookmark(bookmark);
    if (!bookmark || !bookmark.summary || bookmark.summary === 'Summary could not be generated.') {
      setSummary('Unable to display summary. It may not have been generated yet.');
    } else {
      setSummary(bookmark.summary);
    }
    setShowSummary(true);
  };

  const handleCloseSummary = () => {
    setShowSummary(false);
    setSummary('');
    setSelectedBookmark(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 lg:px-8 py-6 relative overflow-hidden font-inter">
      <div id="particles-js" className="absolute inset-0 z-0" />
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-black/90 animate-pulse-slow z-1" />
      <motion.header
        className="flex justify-between items-center mb-8 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-extrabold text-white">SmartSnip</h1>
        <motion.button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-medium hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg"
          whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(220, 38, 38, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          aria-label="Logout"
        >
          Logout
        </motion.button>
      </motion.header>

      <main className="relative z-10">
        <motion.form
          onSubmit={handleSubmit}
          className="mb-8 flex flex-col sm:flex-row gap-3 bg-black/30 backdrop-blur-2xl rounded-xl p-4 border border-gray-700/50 glow-effect"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="flex-1 p-3 rounded-lg bg-black/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all duration-300 font-inter placeholder-gray-500"
            placeholder="Enter URL (e.g., https://example.com)"
            aria-label="URL input"
          />
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="flex-1 p-3 rounded-lg bg-black/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all duration-300 font-inter placeholder-gray-500"
            placeholder="Tags (comma-separated)"
            aria-label="Tags input"
          />
          <motion.button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 text-black font-medium hover:from-gold-600 hover:to-gold-700 disabled:opacity-50 transition-all duration-300 font-inter flex items-center justify-center gap-2 shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(212, 160, 23, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            aria-label="Save bookmark"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            ) : (
              'Save'
            )}
          </motion.button>
        </motion.form>

        <AnimatePresence>
          {success && (
            <motion.p
              className="text-gold-400 text-lg mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              {success}
            </motion.p>
          )}
          {error && (
            <motion.p
              className="text-red-400 text-lg mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <input
            type="text"
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="w-full p-3 rounded-lg bg-black/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all duration-300 font-inter placeholder-gray-500"
            placeholder="Filter by tag (e.g., news)"
            aria-label="Filter bookmarks by tag"
          />
        </motion.div>

        <section>
          <motion.h2
            className="text-xl font-medium mb-4 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Bookmarks
          </motion.h2>
          {bookmarks.length === 0 ? (
            <motion.p
              className="text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              No bookmarks yet. Add a URL above.
            </motion.p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookmarks.map((bookmark, index) => (
                <motion.li
                  key={bookmark._id}
                  className="flex flex-col p-4 rounded-xl bg-black/30 backdrop-blur-lg border border-gray-700/50 glow-effect"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={bookmark.favicon || `https://www.google.com/s2/favicons?domain=${bookmark.url}`}
                        alt={`${bookmark.title} favicon`}
                        className="w-5 h-5"
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/16')}
                      />
                      <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white font-medium hover:text-gold-400 transition-all duration-200"
                      >
                        {bookmark.title || 'Untitled'}
                      </a>
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        onClick={() => handleViewSummary(bookmark)}
                        className="px-3 py-1 text-sm rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 text-black hover:from-gold-600 hover:to-gold-700 transition-all duration-200 shadow-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={`View summary for ${bookmark.title}`}
                      >
                        Summary
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(bookmark._id)}
                        disabled={isDeleting[bookmark._id]}
                        className="px-3 py-1 text-sm rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 disabled:opacity-50 transition-all duration-200 shadow-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={`Delete bookmark ${bookmark.title}`}
                      >
                        {isDeleting[bookmark._id] ? (
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                          </svg>
                        ) : (
                          'Delete'
                        )}
                      </motion.button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {bookmark.tags && bookmark.tags.length > 0 ? (
                      bookmark.tags.map((tag) => (
                        <motion.span
                          key={tag}
                          className="px-2 py-1 text-xs rounded-md bg-black/50 border border-gray-600 text-gray-300 cursor-pointer hover:bg-gold-500/20 hover:text-gold-400 transition-all duration-200"
                          whileHover={{ scale: 1.05 }}
                          onClick={() => setFilterTag(tag)}
                        >
                          {tag}
                        </motion.span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">No tags</span>
                    )}
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <AnimatePresence>
        {showSummary && selectedBookmark && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleCloseSummary}
            role="dialog"
            aria-modal="true"
            aria-labelledby="summary-title"
          >
            <motion.div
              className="bg-black/30 backdrop-blur-2xl rounded-xl p-6 w-full max-w-3xl border border-gray-700/50 glow-effect"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 id="summary-title" className="text-xl font-medium text-white mb-4">{selectedBookmark.title || 'Untitled'}</h3>
              <p className="text-sm text-gray-300 mb-2">
                <strong>URL:</strong>{' '}
                <a
                  href={selectedBookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-400 hover:text-gold-300 transition-all duration-200"
                >
                  {selectedBookmark.url}
                </a>
              </p>
              <div className="mb-4 flex flex-wrap gap-2">
                <strong className="text-sm text-gray-300">Tags:</strong>
                {selectedBookmark.tags && selectedBookmark.tags.length > 0 ? (
                  selectedBookmark.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-md bg-black/50 border border-gray-600 text-gray-300"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">No tags</span>
                )}
              </div>
              <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 border border-gray-600">
                <h4 className="text-base font-medium text-white mb-3">Summary</h4>
                <p className="text-base text-gray-300">{summary}</p>
              </div>
              <motion.button
                onClick={handleCloseSummary}
                className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 text-black hover:from-gold-600 hover:to-gold-700 transition-all duration-200 shadow-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close summary"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}