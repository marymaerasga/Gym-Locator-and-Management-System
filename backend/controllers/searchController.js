import asyncHandler from "express-async-handler";
import Search from "../models/searchQueryModel.js";

// desc     Search query player profile
// route    GET /api/search
// @access  Public
const getPlayerProfile = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query } = req.query;

  // // Verify if the search query is empty
  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  // Calculate skip and limit values for MongoDB query
  const skip = (page - 1) * limit;

  // Create a MongoDB query to retrieve a specific page of results
  const searchQuery = {
    $or: [
      { ID_No: { $regex: query, $options: "i" } },
      { SURNAME: { $regex: query, $options: "i" } },
      { NAME: { $regex: query, $options: "i" } },
    ],
  };

  try {
    const results = await Search.find(searchQuery)
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

export { getPlayerProfile };
