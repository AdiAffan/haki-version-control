function RepositoryCard({
  repository,
  onOpen,
  onEdit,
  onDelete,
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">
            {repository.name}
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            {repository.description || "No description"}
          </p>
        </div>

        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
          main
        </span>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={() => onOpen(repository)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Open
        </button>

        <button
          onClick={() => onEdit(repository)}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(repository)}
          className="rounded-lg border border-red-900 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-950"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default RepositoryCard;