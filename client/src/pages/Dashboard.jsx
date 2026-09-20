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

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

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
    setForm({
      name: "",
      description: "",
    });

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
    const confirmed = window.confirm(
      `Delete repository "${repository.name}"?`
    );

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
    <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 top-40 h-[520px] w-[520px] rounded-full border-[70px] border-blue-600/10 blur-sm" />

        <div className="absolute -right-60 top-[-180px] h-[620px] w-[620px] rounded-full border-[90px] border-cyan-500/10 blur-sm" />

        <div className="absolute left-1/3 top-0 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-indigo-600/10 blur-[130px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030712_90%)]" />

      </div>

      <header className="relative z-10 border-b border-white/[0.08] bg-[#050914]/80 backdrop-blur-2xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-5 sm:px-8">

          <div className="flex items-center gap-3">

            <Link
              to="/"
              className="group flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-cyan-400/20 bg-slate-900 shadow-[0_0_25px_rgba(6,182,212,0.08)] transition duration-300 hover:scale-105 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(6,182,212,0.25)]"
            >
              <img
                src="/logo.png"
                alt="HAKI"
                className="h-full w-full object-contain"
              />
            </Link>

            <div>
              <h1 className="text-xl font-bold tracking-wide text-white">
                HAKI
              </h1>

              <p className="text-xs font-medium text-slate-500">
                Version Control System
              </p>
            </div>

          </div>

          <div className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 sm:flex">

            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />

            <span className="text-sm font-medium text-slate-400">
              Local workspace
            </span>

          </div>

        </div>

      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">

        <section className="mb-12 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#111b30]/90 via-[#0b1222]/90 to-[#070b16]/90 p-7 shadow-[0_0_60px_rgba(15,23,42,0.4)] sm:p-10">

          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">

            <div>

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-300">

                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#22d3ee]" />

                Developer Workspace

              </div>

              <h2 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-100 sm:text-6xl">

                Build.
                <span className="text-cyan-400"> Commit.</span>
                <br />
                <span className="text-blue-400">Track.</span>

              </h2>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">

                HAKI gives you a focused, Git-like workspace for repositories,
                files, branches and commit history.

              </p>

            </div>

            <button
              onClick={openCreateModal}
              className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-xl border border-blue-400/30 bg-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-[0_0_30px_rgba(37,99,235,0.25)] transition duration-300 hover:-translate-y-1 hover:bg-blue-500 hover:shadow-[0_0_40px_rgba(37,99,235,0.45)]"
            >
              <span className="text-xl">+</span>
              New Repository
              <span className="transition duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>

          </div>

        </section>

        {error && (

          <div className="mb-7 flex items-center justify-between gap-4 rounded-xl border border-red-500/30 bg-red-950/30 px-5 py-4 text-sm text-red-300 shadow-[0_0_25px_rgba(239,68,68,0.05)]">

            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="text-xl text-red-400 transition hover:text-white"
            >
              ×
            </button>

          </div>

        )}

        <section className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-white/10 bg-[#0b1222]/80 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30">

            <p className="text-sm font-medium text-slate-500">
              Repositories
            </p>

            <h3 className="mt-4 text-4xl font-bold text-white">
              {loading ? "—" : repositories.length}
            </h3>

            <p className="mt-3 text-xs text-slate-600">
              Local projects
            </p>

          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b1222]/80 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-400/30">

            <p className="text-sm font-medium text-slate-500">
              Architecture
            </p>

            <h3 className="mt-4 text-3xl font-bold text-blue-400">
              REST
            </h3>

            <p className="mt-4 text-xs text-slate-600">
              React + Express
            </p>

          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b1222]/80 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-purple-400/30">

            <p className="text-sm font-medium text-slate-500">
              Storage
            </p>

            <h3 className="mt-4 text-3xl font-bold text-purple-400">
              JSON
            </h3>

            <p className="mt-4 text-xs text-slate-600">
              Simple and portable
            </p>

          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b1222]/80 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30">

            <p className="text-sm font-medium text-slate-500">
              Default Branch
            </p>

            <h3 className="mt-4 text-3xl font-bold text-emerald-400">
              main
            </h3>

            <p className="mt-4 text-xs text-slate-600">
              Branch-aware workspace
            </p>

          </div>

        </section>

        <section>

          <div className="mb-6 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-semibold text-slate-100">
                Your Repositories
              </h2>

              {!loading && (

                <p className="mt-2 text-sm text-slate-500">
                  {repositories.length}{" "}
                  {repositories.length === 1
                    ? "repository"
                    : "repositories"}
                </p>

              )}

            </div>

            <span className="hidden rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-slate-500 sm:block">
              Workspace
            </span>

          </div>

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

            <div className="rounded-3xl border border-dashed border-slate-700 bg-white/[0.02] px-6 py-20 text-center shadow-[0_0_40px_rgba(15,23,42,0.2)]">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/5 text-3xl shadow-[0_0_30px_rgba(6,182,212,0.08)]">
                📁
              </div>

              <h3 className="mt-6 text-xl font-semibold text-slate-200">
                No repositories yet
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                Create your first HAKI repository and start managing your
                project files.
              </p>

              <button
                onClick={openCreateModal}
                className="mt-7 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(37,99,235,0.2)] transition duration-300 hover:bg-blue-500 hover:shadow-[0_0_35px_rgba(37,99,235,0.4)]"
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

        </section>

      </main>

      <footer className="relative z-10 mx-auto max-w-7xl border-t border-white/[0.06] px-5 py-6 text-center text-xs text-slate-600 sm:px-8">
        HAKI Version Control · Built with React + Express
      </footer>

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
