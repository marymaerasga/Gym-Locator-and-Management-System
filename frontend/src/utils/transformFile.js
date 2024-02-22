const transformFile = (file) => {
  const reader = new FileReader();

  if (file) {
    reader.readAsDataUrl(file);
    reader.onloadend = () => {
      setProductImg(reader.result);
    };
  } else {
    setProductImg("");
  }
};

export default transformFile;
