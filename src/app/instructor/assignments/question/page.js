"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiSearch, FiTrash2, FiEdit2, FiPlus, FiX, FiSave,
  FiChevronLeft, FiChevronRight, FiHelpCircle, FiCheckCircle,
  FiBookOpen, FiTag, FiStar, FiAward
} from "react-icons/fi";

import { getQuestions, createQuestion, updateQuestion, deleteQuestion } from "../../../../../service/login.service";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Card view, better with 6 per page

  // Form state – only MCQ, no type selector
  const [formData, setFormData] = useState({
    text: "",
    subject: "",
    topic: "",
    difficulty: "easy",
    marks: 2,
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
    explanation: "",
  });

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await getQuestions();
      setQuestions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load questions");
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const resetForm = () => {
    setFormData({
      text: "",
      subject: "",
      topic: "",
      difficulty: "easy",
      marks: 2,
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
      explanation: "",
    });
    setEditingQuestion(null);
  };

  const openModal = (question = null) => {
    if (question) {
      setEditingQuestion(question);
      setFormData({
        text: question.text || "",
        subject: question.subject || "",
        topic: question.topic || "",
        difficulty: question.difficulty || "easy",
        marks: question.marks || 2,
        options: question.options?.length === 4
          ? [...question.options]
          : [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
        explanation: question.explanation || "",
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (idx, field, value) => {
    const newOptions = [...formData.options];
    newOptions[idx][field] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleCorrectToggle = (idx) => {
    const newOptions = formData.options.map((opt, i) => ({
      ...opt,
      isCorrect: i === idx,
    }));
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.text.trim()) return toast.error("Question text is required");
    if (!formData.subject.trim()) return toast.error("Subject is required");
    if (!formData.topic.trim()) return toast.error("Topic is required");
    if (formData.options.some(opt => !opt.text.trim())) {
      return toast.error("All four options must have text");
    }
    if (!formData.options.some(opt => opt.isCorrect)) {
      return toast.error("You must select the correct answer");
    }

    // Ensure type is always mcq
    const payload = { ...formData, type: "mcq" };

    try {
      if (editingQuestion) {
        await updateQuestion(editingQuestion._id, payload);
        toast.success("Question updated");
      } else {
        await createQuestion(payload);
        toast.success("Question created");
      }
      closeModal();
      fetchQuestions();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await deleteQuestion(id);
        toast.success("Question deleted");
        fetchQuestions();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  // Filter by search
  const filteredQuestions = questions.filter(q =>
    q.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.topic?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const difficultyColors = {
    easy: "bg-emerald-100 text-emerald-800 border-emerald-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    hard: "bg-rose-100 text-rose-800 border-rose-200",
  };

  const difficultyIcons = {
    easy: <FiStar className="text-emerald-600" />,
    medium: <FiAward className="text-amber-600" />,
    hard: <FiHelpCircle className="text-rose-600" />,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-3 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6 md:mb-10 flex flex-col md:flex-row md:justify-between md:items-center gap-4 text-center md:text-left">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-[var(--primary)] bg-clip-text text-transparent">
              Question Bank
            </h1>

            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              Create, edit, and manage your MCQ questions
            </p>
          </div>

          <button
            onClick={() => openModal()}
            className="w-full sm:w-auto justify-center mt-2 md:mt-0 bg-[var(--primary)] text-white px-5 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
          >
            <FiPlus size={20} /> New Question
          </button>
        </div>

        {/* Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

          <div className="relative w-full md:flex-1 md:max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search by text, subject, or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
            />
          </div>

          <div className="w-full md:w-auto text-sm font-medium text-slate-600 bg-slate-100 px-4 py-2 rounded-full flex items-center justify-center gap-2">
            <FiHelpCircle className="text-[var(--primary)]" />
            <span>Total: {filteredQuestions.length} questions</span>
          </div>
        </div>

        {/* Question Cards */}
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12 md:p-16 text-center border border-slate-100">
            <FiHelpCircle className="text-5xl md:text-6xl text-slate-300 mx-auto mb-4" />

            <h3 className="text-lg md:text-xl font-semibold text-slate-700">
              No questions yet
            </h3>

            <p className="text-slate-500 mt-2 text-sm md:text-base">
              Click "New Question" to build your question bank.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {paginatedQuestions.map((q) => (
                <div
                  key={q._id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 overflow-hidden"
                >

                  {/* Card Header */}
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 px-4 sm:px-5 pt-4 pb-3 border-b border-slate-50">

                    <div className="flex flex-wrap gap-2 sm:gap-3">

                      <div
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${difficultyColors[q.difficulty]}`}
                      >
                        {difficultyIcons[q.difficulty]}
                        <span className="capitalize">{q.difficulty}</span>
                      </div>

                      <span className="capitalize px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--primary)]/10">
                        {q.type}
                      </span>

                      <span className="flex items-center gap-1 text-xs">
                        <FiBookOpen size={12} /> {q.subject}
                      </span>

                      <span className="flex items-center gap-1 text-xs">
                        <FiTag size={12} /> {q.topic}
                      </span>

                      <span className="text-xs bg-[var(--primary)]/10 px-2 py-0.5 rounded-md">
                        {q.marks} marks
                      </span>
                    </div>

                    <div className="flex gap-2 self-end lg:self-auto">
                      <button
                        onClick={() => openModal(q)}
                        className="p-1.5 rounded-full text-[var(--primary)] hover:bg-[var(--primary)]/10 transition"
                      >
                        <FiEdit2 size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(q._id)}
                        className="p-1.5 rounded-full text-rose-600 hover:bg-rose-50 transition"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 pt-3">
                    <p className="font-medium text-slate-800 mb-4 text-sm sm:text-base break-words">
                      {q.text}
                    </p>

                    <div className="flex justify-between gap-2">
                      {q.options.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg"
                        >
                          <span className="min-w-6 w-6 h-6 flex items-center justify-center rounded-full bg-[var(--primary)] text-white text-xs font-semibold">
                            {String.fromCharCode(65 + index)}
                          </span>

                          <p className="text-sm text-slate-700 break-words">
                            {option.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-3 mt-8 md:mt-10">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition"
                >
                  <FiChevronLeft />
                </button>

                <span className="text-sm text-slate-600 text-center">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition"
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">

            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto shadow-2xl">

              <div className="sticky top-0 bg-white border-b border-slate-100 px-4 sm:px-6 py-4 flex justify-between items-center z-10">
                <h2 className="text-lg sm:text-2xl font-bold bg-[var(--primary)] bg-clip-text text-transparent">
                  {editingQuestion
                    ? "Edit Question"
                    : "Create New MCQ Question"}
                </h2>

                <button
                  onClick={closeModal}
                  className="text-[var(--primary)] transition"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-4 sm:p-6 space-y-5 sm:space-y-6"
              >

                {/* Question */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Question Text <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    name="text"
                    rows="3"
                    value={formData.text}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="Enter your question here..."
                    required
                  />
                </div>

                {/* Subject & Topic */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Subject <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., JavaScript"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Topic <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="topic"
                      value={formData.topic}
                      onChange={handleChange}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Data Types"
                      required
                    />
                  </div>
                </div>

                {/* Difficulty & Marks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Difficulty
                    </label>

                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleChange}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Marks
                    </label>

                    <input
                      type="number"
                      name="marks"
                      value={formData.marks}
                      onChange={handleChange}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
                      min="1"
                      step="1"
                    />
                  </div>
                </div>

                {/* Options */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Options (4 options, one correct)
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="space-y-3">
                    {formData.options.map((opt, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200"
                      >

                        <div className="flex items-center gap-3 flex-1">
                          <span className="w-7 h-7 flex items-center justify-center rounded-full bg-[var(--primary)] text-white text-xs font-semibold">
                            {String.fromCharCode(65 + idx)}
                          </span>

                          <input
                            type="text"
                            placeholder={`Option ${idx + 1}`}
                            value={opt.text}
                            onChange={(e) =>
                              handleOptionChange(idx, "text", e.target.value)
                            }
                            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 bg-white"
                            required
                          />
                        </div>

                        <label
                          className="flex items-center gap-1.5 cursor-pointer text-sm text-slate-600 self-end sm:self-auto"
                          onClick={() => handleCorrectToggle(idx)}
                        >
                          <div className="text-lg">
                            {opt.isCorrect ? (
                              <FiCheckCircle className="text-green-500" />
                            ) : (
                              <FiCheckCircle className="text-slate-300" />
                            )}
                          </div>

                          <span
                            className={
                              opt.isCorrect
                                ? "text-[var(--primary)] font-medium"
                                : ""
                            }
                          >
                            Correct
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explanation */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Explanation (optional)
                  </label>

                  <textarea
                    name="explanation"
                    rows="2"
                    value={formData.explanation}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500"
                    placeholder="Explain why the correct answer is right..."
                  />
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100">

                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-full sm:w-auto px-5 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 bg-[var(--primary)] text-white rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2 shadow-md"
                  >
                    <FiSave />
                    {editingQuestion ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}