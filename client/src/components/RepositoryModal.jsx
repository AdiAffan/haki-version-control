function RepositoryModal({ isOpen, onClose, onSubmit, form, setForm, editing }) {
  if (!isOpen) return null;

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0b1120] p-6 shadow-2xl shadow-black/50 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-400">HAKI Workspace</div>
            <h2 className="text-2xl font-bold text-white">
              {editing ? "Edit Repository" : "Create Repository"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {editing ? "Update your repository details." : "Create a new repository for your project."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 text-xl text-slate-500 hover:bg-slate-800 hover:text-white"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Repository Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="my-project"
              autoFocus
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Description</label>
            <textarea
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder="Describe your repository..."
              rows="5"
              className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 hover:bg-blue-500"
            >
              {editing ? "Save Changes" : "Create Repository"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RepositoryModal;
