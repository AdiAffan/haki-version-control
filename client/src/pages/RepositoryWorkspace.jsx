import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getRepository,
  getFiles,
  createFile,
  updateFile,
  deleteFile,
  getCommits,
  createCommit,
  getBranches,
  createBranch,
  deleteBranch,
} from "../services/api";

function RepositoryWorkspace() {
  const { id } = useParams();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState("code"); // 'code' | 'branches' | 'commits'

  // Data states
  const [repository, setRepository] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [branches, setBranches] = useState([]);
  const [commits, setCommits] = useState([]);

  // UI / Status states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [commitModalOpen, setCommitModalOpen] = useState(false);

  // Form states
  const [newFile, setNewFile] = useState({ name: "", path: "", content: "" });
  const [branchName, setBranchName] = useState("");
  const [creatingBranch, setCreatingBranch] = useState(false);
  const [commitMessage, setCommitMessage] = useState("");
  const [committing, setCommitting] = useState(false);

  async function loadWorkspace() {
    try {
      setLoading(true);
      setError("");

      const [repoRes, filesRes, commitsRes] = await Promise.all([
        getRepository(id),
        getFiles(id),
        getCommits(id),
      ]);

      let branchesData = [];
      try {
        const branchesRes = await getBranches(id);
        branchesData = branchesRes?.data || branchesRes || [];
      } catch (err) {
        console.warn("Branches endpoint unavailable:", err);
      }

      setRepository(repoRes?.data || repoRes);
      
      const fileList = filesRes?.data || filesRes || [];
      setFiles(fileList);
      if (fileList.length > 0) {
        setSelectedFile(fileList[0]);
      }

      setCommits(commitsRes?.data || commitsRes || []);
      setBranches(branchesData);
    } catch (err) {
      console.error("Failed to load workspace:", err);
      setError(err.message || "Failed to load repository workspace.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWorkspace();
  }, [id]);

  useEffect(() => {
    if (selectedFile) {
      setEditedContent(selectedFile.content || "");
    }
  }, [selectedFile]);

  async function handleCreateFile(event) {
    event.preventDefault();
    if (!newFile.name.trim() || !newFile.path.trim()) {
      setError("File name and path are required.");
      return;
    }

    try {
      setError("");
      const response = await createFile(id, {
        name: newFile.name.trim(),
        path: newFile.path.trim(),
        content: newFile.content,
      });
      const createdFile = response.data || response;
      setFiles((prev) => [...prev, createdFile]);
      setSelectedFile(createdFile);
      setNewFile({ name: "", path: "", content: "" });
      setCreateModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSaveFile() {
    if (!selectedFile) return;
    try {
      setSaving(true);
      setError("");
      const response = await updateFile(id, selectedFile.id, { content: editedContent });
      const updatedFile = response.data || response;
      setFiles((prev) => prev.map((f) => (f.id === updatedFile.id ? updatedFile : f)));
      setSelectedFile(updatedFile);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteFile() {
    if (!selectedFile) return;
    if (!window.confirm(`Delete file "${selectedFile.name}" permanently?`)) return;

    try {
      setError("");
      await deleteFile(id, selectedFile.id);
      const remaining = files.filter((f) => f.id !== selectedFile.id);
      setFiles(remaining);
      setSelectedFile(remaining.length > 0 ? remaining[0] : null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreateCommit(event) {
    event.preventDefault();
    if (!commitMessage.trim()) return;

    try {
      setCommitting(true);
      setError("");
      const response = await createCommit(id, commitMessage.trim());
      const newCommit = response.data || response;
      setCommits((prev) => [newCommit, ...prev]);
      setCommitMessage("");
      setCommitModalOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setCommitting(false);
    }
  }

  async function handleCreateBranch(event) {
    event.preventDefault();
    if (!branchName.trim()) return;

    try {
      setCreatingBranch(true);
      setError("");
      const response = await createBranch(id, { name: branchName.trim() });
      setBranches((prev) => [...prev, response.data || response]);
      setBranchName("");
      setBranchModalOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreatingBranch(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <span className="text-sm font-mono tracking-wide">Loading workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 font-sans text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top App Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 transition hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Repositories
            </Link>
            <span className="text-slate-700">/</span>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-white">{repository?.name}</span>
              <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                Public
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setError("");
                setCommitMessage("");
                setCommitModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-1.5 text-xs font-medium text-slate-200 shadow-sm transition hover:border-slate-600 hover:bg-slate-800"
            >
              <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="3" strokeWidth={2} />
                <path strokeLinecap="round" strokeWidth={2} d="M12 3v6m0 6v6" />
              </svg>
              Commit Changes
            </button>
            <button
              onClick={() => {
                setError("");
                setNewFile({ name: "", path: "", content: "" });
                setCreateModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-500"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New File
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mx-auto flex max-w-7xl gap-6 px-6">
          <button
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-2 border-b-2 py-2.5 text-xs font-medium transition ${
              activeTab === "code"
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Files ({files.length})
          </button>
          <button
            onClick={() => setActiveTab("branches")}
            className={`flex items-center gap-2 border-b-2 py-2.5 text-xs font-medium transition ${
              activeTab === "branches"
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2" />
            </svg>
            Branches ({branches.length})
          </button>
          <button
            onClick={() => setActiveTab("commits")}
            className={`flex items-center gap-2 border-b-2 py-2.5 text-xs font-medium transition ${
              activeTab === "commits"
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Commits ({commits.length})
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-6">
        {error && (
          <div className="mb-4 flex items-center justify-between rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-xs text-rose-300">
            <span>{error}</span>
            <button onClick={() => setError("")} className="font-bold hover:text-rose-100">×</button>
          </div>
        )}

        {/* TAB 1: CODE / FILE EXPLORER */}
        {activeTab === "code" && (
          <div className="grid flex-1 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl md:grid-cols-[260px_1fr]">
            {/* Sidebar */}
            <aside className="flex flex-col border-b border-slate-800 bg-slate-950/40 md:border-b-0 md:border-r">
              <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Files</span>
                <span className="rounded bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                  {files.length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {files.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-500">
                    No files yet.
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {files.map((file) => {
                      const isSelected = selectedFile?.id === file.id;
                      return (
                        <button
                          key={file.id}
                          onClick={() => setSelectedFile(file)}
                          className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs transition ${
                            isSelected
                              ? "bg-indigo-600/15 font-medium text-indigo-300"
                              : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                          }`}
                        >
                          <svg className={`h-4 w-4 shrink-0 ${isSelected ? "text-indigo-400" : "text-slate-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="truncate">{file.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </aside>

            {/* Editor Workspace */}
            <section className="flex flex-col bg-slate-900/60">
              {selectedFile ? (
                <>
                  <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-200">{selectedFile.name}</span>
                      <span className="font-mono text-[11px] text-slate-500">({selectedFile.path})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDeleteFile}
                        className="rounded px-2.5 py-1 text-xs text-rose-400 transition hover:bg-rose-950/40 hover:text-rose-300"
                      >
                        Delete
                      </button>
                      <button
                        onClick={handleSaveFile}
                        disabled={saving}
                        className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>

                  <div className="relative flex-1">
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      spellCheck="false"
                      className="h-full min-h-[500px] w-full resize-none bg-slate-950/80 p-4 font-mono text-xs leading-relaxed text-slate-200 outline-none"
                      placeholder="Write code here..."
                    />
                  </div>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center p-12 text-center text-slate-500">
                  <svg className="mb-3 h-10 w-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">Select a file on the left or create a new one to begin editing.</p>
                </div>
              )}
            </section>
          </div>
        )}

        {/* TAB 2: BRANCHES */}
        {activeTab === "branches" && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Repository Branches</h3>
                <p className="text-xs text-slate-400">Manage and switch between active code branches.</p>
              </div>
              <button
                onClick={() => {
                  setError("");
                  setBranchName("");
                  setBranchModalOpen(true);
                }}
                className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-500"
              >
                New Branch
              </button>
            </div>

            <div className="divide-y divide-slate-800/80 rounded-lg border border-slate-800 bg-slate-950">
              {branches.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">No branches found.</div>
              ) : (
                branches.map((branch) => (
                  <div key={branch.id} className="flex items-center justify-between px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <svg className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2" />
                      </svg>
                      <span className="font-mono text-xs font-medium text-slate-200">{branch.name}</span>
                    </div>
                    <span className="rounded bg-slate-800/80 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                      {branch.commitId || "HEAD"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: COMMITS */}
        {activeTab === "commits" && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Commit Log</h3>
                <p className="text-xs text-slate-400">Chronological history of repository snapshot saves.</p>
              </div>
            </div>

            <div className="relative pl-6 before:absolute before:bottom-0 before:left-2 before:top-2 before:w-[2px] before:bg-slate-800">
              {commits.length === 0 ? (
                <div className="py-8 text-xs text-slate-500">No commits recorded yet.</div>
              ) : (
                <div className="space-y-6">
                  {commits.map((commit) => (
                    <div key={commit.id} className="relative flex items-start justify-between gap-4">
                      <div className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-indigo-500 bg-slate-950" />
                      <div>
                        <p className="text-xs font-semibold text-slate-200">{commit.message}</p>
                        <p className="mt-1 text-[11px] text-slate-500">
                          {new Date(commit.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span className="shrink-0 rounded border border-slate-800 bg-slate-950 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                        {commit.id?.slice(0, 8) || "hash"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* CREATE FILE MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Create New File</h3>
            <form onSubmit={handleCreateFile} className="mt-4 space-y-3">
              <div>
                <label className="text-[11px] font-medium text-slate-400">File Name</label>
                <input
                  type="text"
                  value={newFile.name}
                  onChange={(e) => setNewFile({ ...newFile, name: e.target.value })}
                  placeholder="index.js"
                  className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-400">File Path</label>
                <input
                  type="text"
                  value={newFile.path}
                  onChange={(e) => setNewFile({ ...newFile, path: e.target.value })}
                  placeholder="src/index.js"
                  className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-indigo-500"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE BRANCH MODAL */}
      {branchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Create Branch</h3>
            <form onSubmit={handleCreateBranch} className="mt-4 space-y-3">
              <div>
                <label className="text-[11px] font-medium text-slate-400">Branch Name</label>
                <input
                  type="text"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="feature/auth"
                  className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBranchModalOpen(false)}
                  className="rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingBranch}
                  className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  {creatingBranch ? "Creating..." : "Create Branch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMMIT MODAL */}
      {commitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Commit Changes</h3>
            <form onSubmit={handleCreateCommit} className="mt-4 space-y-3">
              <div>
                <label className="text-[11px] font-medium text-slate-400">Commit Message</label>
                <textarea
                  rows="3"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="Explain what changed..."
                  className="mt-1.5 w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCommitModalOpen(false)}
                  className="rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={committing}
                  className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  {committing ? "Saving..." : "Commit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RepositoryWorkspace;