function RepositoryCard({ repository, onOpen, onEdit, onDelete }) {
  const updatedDate = repository.updatedAt
    ? new Date(repository.updatedAt).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Recently";

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-white/[0.055] sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-xl">
          📁
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-lg font-semibold text-white">{repository.name}</h3>
            <span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-slate-400">
              main
            </span>
          </div>
          <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
            {repository.description || "No description provided for this repository."}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-xs text-slate-600">Updated {updatedDate}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(repository)}
            className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(repository)}
            className="rounded-lg border border-red-900/70 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-950/50 hover:text-red-300"
          >
            Delete
          </button>
          <button
            onClick={() => onOpen(repository)}
            className="rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-blue-500"
          >
            Open Repository →
          </button>
        </div>
      </div>
    </article>
  );
}

export default RepositoryCard;
