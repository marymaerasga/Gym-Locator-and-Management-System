export const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (file.type === "image/jpeg" || file.type === "image/webp") {
    const base64 = await convertBase64(file);
    imageUploadRef.current.value = "";
    updateImage(base64);
  } else {
    toast({
      position: "bottom-right",
      title: "Profile image only accepts jpeg, jpg or webp",
      status: "error",
      duration: 4000,
    });
  }
};
