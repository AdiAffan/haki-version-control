import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          HAKI
        </h1>

        <p className="mt-3 text-slate-400 text-lg">
          Version Control System
        </p>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          System initialized
        </div>
      </div>
    </div>
  )
}



export default App
