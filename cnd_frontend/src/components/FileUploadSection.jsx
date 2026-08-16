import { useState, useRef, useEffect } from "react";

function FileUploadSection({ handleFileUploadToServer, field }) {
  const [uploadBoxOpen, setUploadBoxOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    console.log(files);
  },[files])

  // When files are selected
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const fileData = selectedFiles.map((file) => ({
      file,
      newName: file.name, // Default name (without extension)
    }));
    setFiles(fileData);
  };

  // Update name before uploading
  const handleNameChange = (index, newName) => {
    const updatedFiles = [...files];
    updatedFiles[index].newName = newName;
    setFiles(updatedFiles);
  };

  // Upload to server
  const handleFileUpload = (f) => {
    console.log("⚙️ Upload started...");
  console.log("files array:", files);
    const formData = new FormData();
    if (!files || files.length === 0) {
    console.warn("⚠️ No files selected!");
    return;
  }
    files.forEach((f, index) => {
        if (!f.file) {
      console.warn(`⚠️ Missing file object at index ${index}`, f);
      return;
    }
        console.log("fileItem : ",f);
        

      const renamedFile = new File([f.file], `${f.newName}`, {
        type: f.file.type,
      });

      console.log("renamedFile",renamedFile);
      
      formData.append("files", renamedFile);
      console.log("✅ Checking FormData contents:");
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value?.name || value);
  }

  // Optionally, check FormData with spread
  console.log("FormData as array:", [...formData.entries()]);
    });

    const filesToUpload = [...formData.entries()].map((f) => f[1])

    console.log("form:  : ,", filesToUpload)
    handleFileUploadToServer(filesToUpload, f);
    setUploadBoxOpen(false);
    setFiles([]);
  };

  return (
    <div className="w-full text-center mt-6">
      {/* Upload Toggle Button */}
      <button
        onClick={() => setUploadBoxOpen(!uploadBoxOpen)}
        className={`${
          uploadBoxOpen ? "bg-[#f65d37]" : "bg-[#02AB6A]"
        } text-white px-6 py-2 mt-4 rounded-lg font-medium ${
          uploadBoxOpen ? "hover:bg-[#943821]" : "hover:bg-[#027348]"
        } transition w-1/3`}
      >
        {uploadBoxOpen ? "Cancel Upload" : "Upload Files"}
      </button>

      {/* Upload Box */}
      {uploadBoxOpen && (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Upload Files
          </h2>

          {/* Choose File + Upload Button */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <label className="flex items-center justify-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition w-full sm:w-1/2">
              <span className="text-gray-700 font-medium">Choose Files</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>

            <button
              onClick={() => handleFileUpload(field)}
              className="bg-[#02AB6A] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#027348] transition w-full sm:w-1/2"
              disabled={files.length === 0}
            >
              Upload Files
            </button>
          </div>

          {/* File List with Rename Inputs */}
          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Files to Upload
              </h3>

              <div className="space-y-3">
                {files.map((f, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
                  >
                    <input
                      type="text"
                      value={f.newName}
                      onChange={(e) => handleNameChange(i, e.target.value)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <span className="text-sm text-gray-500 mt-2 sm:mt-0 sm:ml-3">
                      {(f.file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FileUploadSection;
