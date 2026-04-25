import axiosInstance from "../utils/axiosInstance";

/**
 * Uploads a file to the server.
 * @param {File} file - The file object to upload.
 * @param {string} folderName - Optional folder name to store the file in.
 * @returns {Promise<Object>} - The server response containing the file URL.
 */
export const uploadFile = async (file, folderName = "uploads") => {
  const formData = new FormData();
  formData.append("File", file);
  formData.append("FolderName", folderName);

  try {
    const response = await axiosInstance.post("/Files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
};

/**
 * Lists files from the server.
 * @param {string} prefix - Optional prefix to filter files.
 * @returns {Promise<Object>} - The server response containing the list of files.
 */
export const getFiles = async (prefix = null) => {
  try {
    const response = await axiosInstance.get("/Files", {
      params: { prefix },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch files:", error);
    throw error;
  }
};

/**
 * Deletes a file from the server.
 * @param {string} fileUrl - The URL of the file to delete.
 * @returns {Promise<Object>} - The server response.
 */
export const deleteFile = async (fileUrl) => {
  try {
    const response = await axiosInstance.delete("/Files", {
      params: { fileUrl },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to delete file:", error);
    throw error;
  }
};
