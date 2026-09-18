function DirectoryTree({ files, onFileSelect }) {
  return (
    <div className="mb-4">
      <h3 className="mb-2 text-lg font-semibold">Directory</h3>

      {files.length === 0 ? (
        <p className="text-sm text-gray-500">No files available</p>
      ) : (
        <div className="space-y-1">
          {files.map((file) => (
            <button
              key={file.id}
              type="button"
              onClick={() => onFileSelect(file)}
              className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100"
            >
              📄 {file.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default DirectoryTree;
