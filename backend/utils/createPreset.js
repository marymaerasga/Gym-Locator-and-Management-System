import cloudinary from "./cloudinary.js";

const createPreset = async (presetName) => {
  try {
    const presetOptions = {
      name: presetName,
      unsigned: false, // Set to true if you're using unsigned uploads
      transformation: [
        { width: 200, height: 200, crop: "fit", gravity: "center" },
      ],
    };

    const result = await cloudinary.api.create_upload_preset(presetOptions);
    console.log(result);
  } catch (error) {
    console.error("Error creating preset:", error);
  }
};

export default createPreset;
