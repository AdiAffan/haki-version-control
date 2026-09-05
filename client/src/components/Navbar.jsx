function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            HAKI
          </h1>

          <p className="text-xs text-slate-500">
            Version Control System
          </p>
        </div>

        <div className="text-sm text-slate-400">
          College Minor Project
        </div>
      </div>
    </header>
  );
}

export default Navbar;