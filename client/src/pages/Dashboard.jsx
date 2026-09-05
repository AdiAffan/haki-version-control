import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
      console.error("Failed to load repositories:", error);
      setError(error.message);
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
      console.error("Repository operation failed:", error);
      setError(error.message);
    }
  }

  async function handleDelete(repository) {
    const confirmed = window.confirm(
      `Delete repository "${repository.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteRepository(repository.id);

      await loadRepositories();
    } catch (error) {
      console.error("Failed to delete repository:", error);
      setError(error.message);
    }
  }

  function handleOpen(repository) {
    navigate(`/repositories/${repository.id}`);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Repositories
            </h1>

            <p className="mt-2 text-slate-400">
              Manage your HAKI repositories.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            + New Repository
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Repository content */}
        {loading ? (
          <div className="py-20 text-center text-slate-500">
            Loading repositories...
          </div>
        ) : repositories.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-800 px-6 py-20 text-center">
            <h2 className="text-xl font-semibold">
              No repositories yet
            </h2>

            <p className="mt-2 text-slate-500">
              Create your first HAKI repository to get started.
            </p>

            <button
              onClick={openCreateModal}
              className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-700"
            >
              Create Repository
            </button>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
      </div>

      {/* Repository modal */}
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