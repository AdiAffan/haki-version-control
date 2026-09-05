import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  getRepository,
  getFiles,
} from "../services/api";

function RepositoryWorkspace() {
  const { id } = useParams();

  const [repository, setRepository] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadWorkspace() {
    try {
      setLoading(true);
      setError("");

      const repositoryResponse = await getRepository(id);
      const filesResponse = await getFiles(id);

      setRepository(repositoryResponse.data);
      setFiles(filesResponse.data);

      if (filesResponse.data.length > 0) {
        setSelectedFile(filesResponse.data[0]);
      }
    } catch (error) {
      console.error("Failed to load repository:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWorkspace();
  }, [id]);

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

  if (error) {
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

      {/* Repository header */}
      <div className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="text-sm text-slate-500 hover:text-white"
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
              {repository?.description || "No description"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
              main
            </span>

            <button
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700"
            >
              New File
            </button>
          </div>
        </div>
      </div>

      {/* Workspace */}
      <div className="mx-auto max-w-7xl px-6 py-6">

        <div className="grid min-h-[600px] overflow-hidden rounded-xl border border-slate-800 bg-slate-900 md:grid-cols-[280px_1fr]">

          {/* File sidebar */}
          <aside className="border-b border-slate-800 bg-slate-950 md:border-b-0 md:border-r">

            <div className="border-b border-slate-800 px-5 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Files
              </h2>

              <p className="mt-1 text-xs text-slate-600">
                {files.length} {files.length === 1 ? "file" : "files"}
              </p>
            </div>

            <div className="p-3">

              {files.length === 0 ? (
                <div className="px-3 py-8 text-center">
                  <p className="text-sm text-slate-600">
                    No files yet
                  </p>

                  <button className="mt-3 text-sm text-blue-400 hover:text-blue-300">
                    Create your first file
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  {files.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full rounded-lg px-3 py-3 text-left text-sm transition ${
                        selectedFile?.id === file.id
                          ? "bg-slate-800 text-white"
                          : "text-slate-400 hover:bg-slate-900 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500">
                          📄
                        </span>

                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            {file.name}
                          </p>

                          {file.path !== file.name && (
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

          {/* File viewer */}
          <main className="flex min-w-0 flex-col">

            {selectedFile ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
                  <div>
                    <h2 className="font-semibold text-white">
                      {selectedFile.name}
                    </h2>

                    <p className="mt-1 text-xs text-slate-600">
                      {selectedFile.path}
                    </p>
                  </div>

                  <span className="rounded-md bg-slate-800 px-3 py-1 text-xs text-slate-500">
                    Read only
                  </span>
                </div>

                <div className="flex-1 overflow-auto bg-slate-950 p-6">
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-7 text-slate-300">
                    {selectedFile.content || "Empty file"}
                  </pre>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center p-10 text-center">
                <div>
                  <div className="text-4xl">
                    📄
                  </div>

                  <h2 className="mt-4 text-lg font-semibold">
                    Select a file
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Select a file from the sidebar to view its contents.
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Commit information */}
        <div className="mt-5 flex flex-col justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 px-5 py-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-slate-300">
              Latest commit
            </p>

            <p className="mt-1 text-xs text-slate-600">
              No commits yet
            </p>
          </div>

          <button className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white">
            Commit Changes
          </button>
        </div>

      </div>
    </div>
  );
}

export default RepositoryWorkspace;