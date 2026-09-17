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
} from "../services/api";

function RepositoryWorkspace() {
  const { id } = useParams();

  const [repository, setRepository] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [saving, setSaving] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [newFile, setNewFile] = useState({
    name: "",
    path: "",
    content: "",
  });

  const [commits, setCommits] = useState([]);
  const [commitModalOpen, setCommitModalOpen] = useState(false);
  const [commitMessage, setCommitMessage] = useState("");
  const [committing, setCommitting] = useState(false);

  function openCreateFileModal() {
    setError("");

    setNewFile({
      name: "",
      path: "",
      content: "",
    });

    setCreateModalOpen(true);
  }

  async function handleCreateFile(event) {
    event.preventDefault();

    try {
      setError("");

      if (!newFile.name.trim()) {
        setError("File name is required.");
        return;
      }

      if (!newFile.path.trim()) {
        setError("File path is required.");
        return;
      }

      const response = await createFile(id, {
        name: newFile.name.trim(),
        path: newFile.path.trim(),
        content: newFile.content,
      });

      const createdFile = response.data;

      setFiles((currentFiles) => [
        ...currentFiles,
        createdFile,
      ]);

      setSelectedFile(createdFile);
      setEditedContent(createdFile.content || "");

      setNewFile({
        name: "",
        path: "",
        content: "",
      });

      setCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create file:", error);
      setError(error.message || "Failed to create file.");
    }
  }

  async function handleUploadFile(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploading(true);
      setError("");

      const content = await file.text();

      const response = await createFile(id, {
        name: file.name,
        path: file.name,
        content,
      });

      const uploadedFile = response.data;

      setFiles((currentFiles) => [
        ...currentFiles,
        uploadedFile,
      ]);

      setSelectedFile(uploadedFile);
      setEditedContent(content);
    } catch (error) {
      console.error("Failed to upload file:", error);
      setError(error.message || "Failed to upload file.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function handleSaveFile() {
    if (!selectedFile) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await updateFile(
        id,
        selectedFile.id,
        {
          content: editedContent,
        }
      );

      const updatedFile = response.data;

      setFiles((currentFiles) =>
        currentFiles.map((file) =>
          file.id === updatedFile.id
            ? updatedFile
            : file
        )
      );

      setSelectedFile(updatedFile);
    } catch (error) {
      console.error("Failed to save file:", error);
      setError(error.message || "Failed to save file.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteFile() {
    if (!selectedFile) {
      return;
    }

    const confirmed = window.confirm(
      `Delete file "${selectedFile.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteFile(id, selectedFile.id);

      const remainingFiles = files.filter(
        (file) => file.id !== selectedFile.id
      );

      setFiles(remainingFiles);

      if (remainingFiles.length > 0) {
        setSelectedFile(remainingFiles[0]);
        setEditedContent(
          remainingFiles[0].content || ""
        );
      } else {
        setSelectedFile(null);
        setEditedContent("");
      }
    } catch (error) {
      console.error("Failed to delete file:", error);
      setError(error.message || "Failed to delete file.");
    }
  }

  async function handleCreateCommit(event) {
    event.preventDefault();

    if (!commitMessage.trim()) {
      setError("Commit message is required.");
      return;
    }

    try {
      setCommitting(true);
      setError("");

      const response = await createCommit(
        id,
        commitMessage.trim()
      );

      const newCommit = response.data;

      setCommits((currentCommits) => [
        newCommit,
        ...currentCommits,
      ]);

      setCommitMessage("");
      setCommitModalOpen(false);
    } catch (error) {
      console.error("Failed to create commit:", error);
      setError(
        error.message || "Failed to create commit."
      );
    } finally {
      setCommitting(false);
    }
  }

  async function loadWorkspace() {
    try {
      setLoading(true);
      setError("");

      const repositoryResponse = await getRepository(id);
      const filesResponse = await getFiles(id);
      const commitsResponse = await getCommits(id);

      setRepository(repositoryResponse.data);
      setFiles(filesResponse.data);
      setCommits(commitsResponse.data);

      if (filesResponse.data.length > 0) {
        setSelectedFile(filesResponse.data[0]);
        setEditedContent(
          filesResponse.data[0].content || ""
        );
      } else {
        setSelectedFile(null);
        setEditedContent("");
      }
    } catch (error) {
      console.error(
        "Failed to load repository:",
        error
      );
      setError(
        error.message || "Failed to load repository."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWorkspace();
  }, [id]);

  useEffect(() => {
    if (selectedFile) {
      setEditedContent(
        selectedFile.content || ""
      );
    }
  }, [selectedFile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="flex min-h-[80vh] items-center justify-center">
          <p className="text-slate-500">
            Loading repository...
          </p>
        </div>
      </div>
    );
  }

  if (error && !repository) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-red-400">
            {error}
          </div>

          <Link
            to="/"
            className="mt-6 inline-block text-sm text-blue-400 hover:text-blue-300"
          >
            ← Back to repositories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="text-sm text-slate-500 transition hover:text-white"
              >
                Repositories
              </Link>

              <span className="text-slate-700">
                /
              </span>

              <h1 className="text-xl font-bold">
                {repository?.name}
              </h1>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {repository?.description ||
                "No description"}
            </p>
          </div>

          <div className="flex items-center gap-3">

            <span className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
              main
            </span>

            <button
              onClick={openCreateFileModal}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              + New File
            </button>

            <label className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
              {uploading
                ? "Uploading..."
                : "⬆ Upload File"}

              <input
                type="file"
                accept=".html,.htm,.css,.js,.jsx,.ts,.tsx,.json,.md,.txt,.svg,.xml"
                className="hidden"
                onChange={handleUploadFile}
                disabled={uploading}
              />
            </label>

          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-6">

        {error && (
          <div className="mb-5 flex items-center justify-between gap-4 rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-400">
            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="text-lg hover:text-white"
            >
              ×
            </button>
          </div>
        )}

        <div className="grid min-h-[600px] overflow-hidden rounded-xl border border-slate-800 bg-slate-900 md:grid-cols-[280px_1fr]">

          <aside className="border-b border-slate-800 bg-slate-950 md:border-b-0 md:border-r">

            <div className="border-b border-slate-800 px-5 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Files
              </h2>

              <p className="mt-1 text-xs text-slate-600">
                {files.length}{" "}
                {files.length === 1
                  ? "file"
                  : "files"}
              </p>
            </div>

            <div className="p-3">

              {files.length === 0 ? (

                <div className="px-3 py-10 text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-2xl">
                    📂
                  </div>

                  <h3 className="mt-5 text-sm font-semibold text-slate-300">
                    No files yet
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-600">
                    Create a new file or upload a
                    file from your computer.
                  </p>

                  <div className="mt-5 flex flex-col gap-2">

                    <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700">
                      ⬆ Upload File

                      <input
                        type="file"
                        accept=".html,.htm,.css,.js,.jsx,.ts,.tsx,.json,.md,.txt,.svg,.xml"
                        className="hidden"
                        onChange={handleUploadFile}
                        disabled={uploading}
                      />
                    </label>

                    <button
                      onClick={openCreateFileModal}
                      className="rounded-lg border border-slate-800 px-4 py-2.5 text-sm text-blue-400 transition hover:bg-slate-900 hover:text-blue-300"
                    >
                      + Create File
                    </button>

                  </div>
                </div>

              ) : (

                <div className="space-y-1">

                  {files.map((file) => (

                    <button
                      key={file.id}
                      onClick={() =>
                        setSelectedFile(file)
                      }
                      className={`w-full rounded-lg px-3 py-3 text-left text-sm transition ${
                        selectedFile?.id === file.id
                          ? "bg-slate-800 text-white"
                          : "text-slate-400 hover:bg-slate-900 hover:text-white"
                      }`}
                    >

                      <div className="flex items-center gap-3">

                        <span className="text-slate-500">
                          {file.name
                            ?.toLowerCase()
                            .endsWith(".svg")
                            ? "🖼️"
                            : "📄"}
                        </span>

                        <div className="min-w-0">

                          <p className="truncate font-medium">
                            {file.name}
                          </p>

                          {file.path !==
                            file.name && (
                            <p className="truncate text-xs text-slate-600">
                              {file.path}
                            </p>
                          )}

                        </div>

                      </div>

                    </button>

                  ))}

                </div>

              )}

            </div>
          </aside>

          <main className="flex min-w-0 flex-col">

            {selectedFile ? (

              <>

                <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">

                  <div className="min-w-0">

                    <h2 className="truncate font-semibold text-white">
                      {selectedFile.name}
                    </h2>

                    <p className="mt-1 truncate text-xs text-slate-600">
                      {selectedFile.path}
                    </p>

                  </div>

                  <div className="ml-4 flex shrink-0 items-center gap-3">

                    <button
                      onClick={handleDeleteFile}
                      className="rounded-lg border border-red-900 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-950"
                    >
                      Delete
                    </button>

                    <button
                      onClick={handleSaveFile}
                      disabled={saving}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving
                        ? "Saving..."
                        : "Save File"}
                    </button>

                  </div>

                </div>

                <div className="flex-1 bg-slate-950 p-6">

                  <textarea
                    value={editedContent}
                    onChange={(event) =>
                      setEditedContent(
                        event.target.value
                      )
                    }
                    spellCheck="false"
                    className="h-full min-h-[500px] w-full resize-none rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-sm leading-7 text-slate-300 outline-none focus:border-blue-500"
                    placeholder="File content..."
                  />

                </div>

              </>

            ) : (

              <div className="flex flex-1 items-center justify-center p-10 text-center">

                <div>

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-2xl">
                    ⬆
                  </div>

                  <h2 className="mt-5 text-lg font-semibold">
                    Upload a file
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Select a file from your computer
                    to add it to this repository.
                  </p>

                  <label className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700">
                    ⬆ Upload File

                    <input
                      type="file"
                      accept=".html,.htm,.css,.js,.jsx,.ts,.tsx,.json,.md,.txt,.svg,.xml"
                      className="hidden"
                      onChange={handleUploadFile}
                      disabled={uploading}
                    />
                  </label>

                  <p className="mt-3 text-xs text-slate-600">
                    HTML, CSS, JS, JSX, JSON, SVG,
                    Markdown, TXT and XML supported
                  </p>

                </div>

              </div>

            )}

          </main>
        </div>

        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900 px-5 py-4">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>

              <p className="text-sm font-medium text-slate-300">
                Latest commit
              </p>

              {commits.length > 0 ? (

                <>

                  <p className="mt-1 text-sm text-slate-400">
                    {commits[0].message}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    {new Date(
                      commits[0].createdAt
                    ).toLocaleString()}
                  </p>

                </>

              ) : (

                <p className="mt-1 text-xs text-slate-600">
                  No commits yet
                </p>

              )}

            </div>

            <button
              onClick={() => {
                setError("");
                setCommitMessage("");
                setCommitModalOpen(true);
              }}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              Commit Changes
            </button>

          </div>

        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-slate-800 bg-slate-900">

          <div className="border-b border-slate-800 px-5 py-4">

            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Commit History
            </h2>

            <p className="mt-1 text-xs text-slate-600">
              {commits.length}{" "}
              {commits.length === 1
                ? "commit"
                : "commits"}
            </p>

          </div>

          {commits.length === 0 ? (

            <div className="px-5 py-10 text-center">

              <p className="text-sm text-slate-600">
                No commits yet
              </p>

            </div>

          ) : (

            <div className="max-h-[250px] overflow-y-auto">

              <div className="divide-y divide-slate-800">

                {commits.map((commit) => (

                  <div
                    key={commit.id}
                    className="px-5 py-4 transition hover:bg-slate-950"
                  >

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                      <div className="min-w-0">

                        <p className="font-medium text-white">
                          {commit.message}
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          {new Date(
                            commit.createdAt
                          ).toLocaleString()}
                        </p>

                      </div>

                      <span className="shrink-0 rounded-md bg-slate-950 px-2 py-1 font-mono text-xs text-slate-600">
                        {commit.id}
                      </span>

                    </div>

                    {commit.parentId && (

                      <p className="mt-2 text-xs text-slate-700">
                        Parent:{" "}
                        <span className="font-mono">
                          {commit.parentId}
                        </span>
                      </p>

                    )}

                  </div>

                ))}

              </div>

            </div>

          )}

        </div>

      </div>

      {createModalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">

          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">

            <div className="flex items-center justify-between">

              <h2 className="text-xl font-semibold">
                Create File
              </h2>

              <button
                onClick={() =>
                  setCreateModalOpen(false)
                }
                className="text-xl text-slate-500 hover:text-white"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleCreateFile}
              className="mt-6 space-y-5"
            >

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  File Name
                </label>

                <input
                  type="text"
                  value={newFile.name}
                  onChange={(event) =>
                    setNewFile({
                      ...newFile,
                      name: event.target.value,
                    })
                  }
                  placeholder="README.md"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  File Path
                </label>

                <input
                  type="text"
                  value={newFile.path}
                  onChange={(event) =>
                    setNewFile({
                      ...newFile,
                      path: event.target.value,
                    })
                  }
                  placeholder="src/index.js"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />

                <p className="mt-2 text-xs text-slate-600">
                  Example: src/components/App.jsx
                </p>

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Initial Content
                </label>

                <textarea
                  value={newFile.content}
                  onChange={(event) =>
                    setNewFile({
                      ...newFile,
                      content: event.target.value,
                    })
                  }
                  placeholder="Enter file contents..."
                  rows="8"
                  className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 font-mono text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />

              </div>

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setCreateModalOpen(false)
                  }
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Create File
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {commitModalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">

          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">

            <div className="flex items-center justify-between">

              <h2 className="text-xl font-semibold text-white">
                Commit Changes
              </h2>

              <button
                onClick={() =>
                  setCommitModalOpen(false)
                }
                className="text-xl text-slate-500 hover:text-white"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleCreateCommit}
              className="mt-6 space-y-5"
            >

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Commit Message
                </label>

                <input
                  type="text"
                  value={commitMessage}
                  onChange={(event) =>
                    setCommitMessage(
                      event.target.value
                    )
                  }
                  placeholder="Describe your changes..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />

              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">

                <p className="text-xs uppercase tracking-wider text-slate-600">
                  Snapshot
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  This commit will store the current
                  state of{" "}
                  <span className="text-white">
                    {files.length}
                  </span>{" "}
                  {files.length === 1
                    ? "file"
                    : "files"}
                  .
                </p>

              </div>

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setCommitModalOpen(false)
                  }
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={committing}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {committing
                    ? "Committing..."
                    : "Create Commit"}
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