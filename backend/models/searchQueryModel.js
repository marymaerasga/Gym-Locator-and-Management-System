import mongoose from "mongoose";

const searchSchema = mongoose.Schema({
  ID_No: String,
  SURNAME: String,
  NAME: String,
});

const Search = mongoose.model("Novembers", searchSchema);

export default Search;
