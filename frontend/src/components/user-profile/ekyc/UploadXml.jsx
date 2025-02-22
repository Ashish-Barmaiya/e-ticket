import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const UploadXML = () => {
  const [file, setFile] = useState(null);
  const [sharePhrase, setSharePhrase] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      // Validate file extension (case-insensitive)
      const fileName = selectedFile.name;
      const fileExtension = fileName.split(".").pop().toLowerCase();

      if (fileExtension !== "xml") {
        setError("Please upload an XML file.");
        setFile(null);
      } else {
        setError("");
        setFile(selectedFile);
      }
    }
  };

  const handleSharePhraseChange = (event) => {
    setSharePhrase(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Please select an XML file to upload.");
      return;
    }

    if (!sharePhrase) {
      setError("Please provide your share phrase.");
      return;
    }

    const formData = new FormData();
    formData.append("aadhaarXmlFile", file);
    formData.append("aadhaarXmlFilePassword", sharePhrase);

    try {
      const response = await fetch("/api/user/profile/ekyc", {
        // Replace with your backend endpoint URL
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setError(`Upload failed: ${response.statusText}`);
        return;
      }

      const data = await response.json();
      setMessage("File uploaded successfully!");
      router.push("/user/profile/ekyc/verify-phone-number");
      toast.success("File uploaded successfully", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (err) {
      console.error("Error during upload:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="max-w-md py-4">
        <label htmlFor="xmlUpload" className="block mb-2">
          Upload XML File:
        </label>
        <input
          id="xmlUpload"
          type="file"
          accept=".xml,text/xml"
          onChange={handleFileChange}
          className="mb-2"
        />
        <label htmlFor="sharePhrase" className="block mb-0">
          Share Phrase:
        </label>
        <input
          id="sharePhrase"
          type="password"
          value={sharePhrase}
          onChange={handleSharePhraseChange}
          className="mb-2 mr-2 border border-neutral-500 rounded"
        />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {message && <p className="text-green-500 mb-2">{message}</p>}
        <button
          type="submit"
          className="px-4 py-1 tracking-wider bg-teal-600 text-white rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default UploadXML;
