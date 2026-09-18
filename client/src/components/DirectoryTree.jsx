import { useMemo, useState } from "react";

function DirectoryTree({ files, selectedFileId, onFileSelect }) {
  const [expandedFolders, setExpandedFolders] = useState({});

  const tree = useMemo(() => {
    const root = { folders: {}, files: [] };

    files.forEach((file) => {
      const filePath = file.path || file.name || "";
      const parts = filePath.split("/").filter(Boolean);
      const fileName = file.name || parts.pop() || "Unnamed file";
      const folderParts = parts.slice(0, -1);
      let current = root;

      folderParts.forEach((folderName) => {
        if (!current.folders[folderName]) {
          current.folders[folderName] = { folders: {}, files: [] };
        }
        current = current.folders[folderName];
      });

      current.files.push({ ...file, displayName: fileName });
    });

    return root;
  }, [files]);

  function toggleFolder(folderPath) {
    setExpandedFolders((current) => ({
      ...current,
      [folderPath]: !current[folderPath],
    }));
  }

  function renderNode(node, parentPath = "", depth = 0) {
    const folderEntries = Object.entries(node.folders).sort(([a], [b]) => a.localeCompare(b));
    const sortedFiles = [...node.files].sort((a, b) => a.displayName.localeCompare(b.displayName));

    return (
      <div className="space-y-1">
        {folderEntries.map(([folderName, folderNode]) => {
          const folderPath = parentPath ? `${parentPath}/${folderName}` : folderName;
          const isExpanded = expandedFolders[folderPath] ?? true;

          return (
            <div key={folderPath}>
              <button
                type="button"
                onClick={() => toggleFolder(folderPath)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-900 hover:text-white"
                style={{ paddingLeft: `${12 + depth * 16}px` }}
              >
                <span>{isExpanded ? "📂" : "📁"}</span>
                <span className="truncate">{folderName}</span>
                <span className="ml-auto text-xs text-slate-600">{isExpanded ? "−" : "+"}</span>
              </button>

              {isExpanded && (
                <div>{renderNode(folderNode, folderPath, depth + 1)}</div>
              )}
            </div>
          );
        })}

        {sortedFiles.map((file) => (
          <button
            key={file.id}
            type="button"
            onClick={() => onFileSelect(file)}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
              selectedFileId === file.id
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
            style={{ paddingLeft: `${12 + depth * 16}px` }}
          >
            <span>{file.displayName.toLowerCase().endsWith(".svg") ? "🖼️" : "📄"}</span>
            <span className="truncate">{file.displayName}</span>
          </button>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return <p className="px-3 py-4 text-sm text-slate-600">No files available</p>;
  }

  return <div className="space-y-1">{renderNode(tree)}</div>;
}

export default DirectoryTree;
