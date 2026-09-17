import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getRepositories,
  createRepository,
  updateRepository,
  deleteRepository,
} from "../services/api";
import RepositoryCard from "../components/RepositoryCard";
import RepositoryModal from "../components/RepositoryModal";

function Dashboard() {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRepository, setEditingRepository] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });

  async function loadRepositories() {
    try {
      setLoading(true);
      setError("");
      const response = await getRepositories();
      setRepositories(response.data);
    } catch (error) {
      setError(error.message || "Failed to load repositories.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRepositories();
  }, []);

  function openCreateModal() {
    setEditingRepository(null);
    setForm({ name: "", description: "" });
    setError("");
    setModalOpen(true);
  }

  function openEditModal(repository) {
    setEditingRepository(repository);
    setForm({
      name: repository.name,
      description: repository.description || "",
    });
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit() {
    try {
      if (!form.name.trim()) {
        setError("Repository name is required.");
        return;
      }

      setError("");

      if (editingRepository) {
        await updateRepository(editingRepository.id, {
          name: form.name.trim(),
          description: form.description.trim(),
        });
      } else {
        await createRepository({
          name: form.name.trim(),
          description: form.description.trim(),
        });
      }

      setModalOpen(false);
      await loadRepositories();
    } catch (error) {
      setError(error.message || "Repository operation failed.");
    }
  }

  async function handleDelete(repository) {
    const confirmed = window.confirm(`Delete repository "${repository.name}"?`);
    if (!confirmed) return;

    try {
      setError("");
      await deleteRepository(repository.id);
      await loadRepositories();
    } catch (error) {
      setError(error.message || "Failed to delete repository.");
    }
  }

  function handleOpen(repository) {
    navigate(`/repositories/${repository.id}`);
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="absolute inset-0 -z-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-white/10 bg-[#070b18]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-lg shadow-blue-950/30 transition hover:scale-105 hover:border-blue-500/40"
            >
              <img
                src="/logo.png"
                alt="HAKI"
                className="h-full w-full object-contain"
              />
            </Link>

            <div>
              <h1 className="text-xl font-bold tracking-tight">HAKI</h1>
              <p className="text-xs font-medium text-slate-500">
                Version Control System
              </p>
            </div>
          </div>

          <div className="hidden rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-400 sm:block">
         < h1 class= "rohit" >
        Minor Project</h1>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <section className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              Workspace
            </div>

            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Repositories
            </h2>

            <p className="mt-3 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
              Manage your HAKI repositories, open projects, and organize your
              code in one place.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:-translate-y-0.5 hover:bg-blue-500 active:translate-y-0"
          >
            <span className="text-lg leading-none">+</span>
            New Repository
          </button>
        </section>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-300">
              Your repositories
            </p>

            {!loading && (
              <p className="mt-1 text-xs text-slate-600">
                {repositories.length}{" "}
                {repositories.length === 1
                  ? "repository"
                  : "repositories"}
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-900/70 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="text-lg text-red-400 hover:text-white"
            >
              ×
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-52 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
              />
            ))}
          </div>
        ) : repositories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-white/[0.02] px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 text-2xl">
              📁
            </div>

            <h3 className="mt-5 text-xl font-semibold">
              No repositories yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Create your first HAKI repository and start managing your
              project files.
            </p>

            <button
              onClick={openCreateModal}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-500"
            >
              Create Repository
            </button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {repositories.map((repository) => (
              <RepositoryCard
                key={repository.id}
                repository={repository}
                onOpen={handleOpen}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <RepositoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        editing={Boolean(editingRepository)}
      />
    </div>
  );
}

export default Dashboard;