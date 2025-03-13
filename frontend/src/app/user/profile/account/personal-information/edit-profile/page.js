// EDIT PROFILE PAGE //

"use client";

import { useState } from "react";
import { z } from "zod";

// Define a Zod schema for image file validation
const imageFileSchema = z
  .instanceof(File)
  .refine(
    (file) => {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/avif"];
      return validTypes.includes(file.type);
    },
    {
      message: "Only valid image files are allowed (.jpg, .jpeg, .png, .avif).",
    }
  )
  .refine((file) => file.size < 2 * 1024 * 1024, {
    message: "File size should be less than 2MB.",
  });

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl("");
      return;
    }
    try {
      // Validate the file using Zod
      imageFileSchema.parse(file);
      setErrorMessage("");
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrorMessage(error.errors[0].message);
      } else {
        setErrorMessage("File validation error.");
      }
      setSelectedFile(null);
      setPreviewUrl("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage("Please select a valid image file.");
      return;
    }
    const formData = new FormData();
    formData.append("profilePic", selectedFile);

    try {
      const response = await fetch(
        "/api/user/profile/account/personal-information/edit-profile",
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        setUploadMessage(
          errorData.message || "Upload failed. Please try again."
        );
      } else {
        const data = await response.json();
        setUploadMessage("Upload successful! URL: " + data.data.secure_url);
      }
    } catch (error) {
      setUploadMessage("Upload failed. Please try again.");
    }
  };

  return (
    <div className="mx-auto mt-12 px-10">
      <div className="mb-10">
        <h1 className="text-3xl">Edit Profile</h1>
      </div>

      <h2>Upload Profile Picture</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/jpeg, image/jpg, image/png"
          onChange={handleFileChange}
        />
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        {previewUrl && (
          <div>
            <p>Image Preview:</p>
            <img
              src={previewUrl}
              alt="Selected Preview"
              style={{
                width: "200px",
                height: "auto",
                border: "1px solid #ccc",
              }}
            />
          </div>
        )}
        <button
          type="submit"
          className="bg-teal-500 text-white/90 px-4 py-1 rounded-lg "
        >
          Upload
        </button>
      </form>
      {uploadMessage && <p>{uploadMessage}</p>}
    </div>
  );
};

export default ImageUpload;
