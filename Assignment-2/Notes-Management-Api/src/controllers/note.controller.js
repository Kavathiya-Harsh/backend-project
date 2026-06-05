const mongoose = require("mongoose");
const Note = require("../models/note.model");

// CREATE SINGLE NOTE
exports.createNote = async (req, res) => {
  try {
    const { title, content, category, isPinned } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
        data: null,
      });
    }

    const note = await Note.create({
      title,
      content,
      category,
      isPinned,
    });

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: note,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

// CREATE BULK NOTES
exports.createBulkNotes = async (req, res) => {
  try {
    const { notes } = req.body;

    if (!notes || notes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "notes array is required and cannot be empty",
        data: null,
      });
    }

    const createdNotes = await Note.insertMany(notes);

    res.status(201).json({
      success: true,
      message: `${createdNotes.length} notes created successfully`,
      data: createdNotes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

// GET ALL NOTES
exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();

    res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      count: notes.length,
      data: notes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

// GET NOTE BY ID
exports.getNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
        data: null,
      });
    }

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Note fetched successfully",
      data: note,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

// REPLACE NOTE (PUT)
exports.replaceNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        overwrite: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Note replaced successfully",
      data: note,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

// UPDATE NOTE (PATCH)
exports.updateNote = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided to update",
        data: null,
      });
    }

    const note = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: note,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

// DELETE SINGLE NOTE
exports.deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

// DELETE BULK NOTES
exports.deleteBulkNotes = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "ids array is required and cannot be empty",
        data: null,
      });
    }

    const deleted = await Note.deleteMany({
      _id: { $in: ids },
    });

    res.status(200).json({
      success: true,
      message: `${deleted.deletedCount} notes deleted successfully`,
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

// CATEGORY PARAM
exports.getNotesByCategory = async (req, res) => {
  try {
    const category = req.params.category;

    const allowed = ["work", "personal", "study"];

    if (!allowed.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category. Allowed: work, personal, study",
        data: null,
      });
    }

    const notes = await Note.find({ category });

    res.status(200).json({
      success: true,
      message: `Notes fetched for category: ${category}`,
      count: notes.length,
      data: notes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

// STATUS PARAM
exports.getNotesByStatus = async (req, res) => {
  try {
    const value = req.params.isPinned;

    if (value !== "true" && value !== "false") {
      return res.status(400).json({
        success: false,
        message: "isPinned must be true or false",
        data: null,
      });
    }

    const notes = await Note.find({
      isPinned: value === "true",
    });

    res.status(200).json({
      success: true,
      message: "Fetched all notes",
      count: notes.length,
      data: notes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

// NOTE SUMMARY
exports.getNoteSummary = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .select("title category isPinned createdAt");

    res.status(200).json({
      success: true,
      message: "Note summary fetched successfully",
      data: note,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

// FILTER NOTES
exports.filterNotes = async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.isPinned !== undefined) {
      filter.isPinned = req.query.isPinned === "true";
    }

    const notes = await Note.find(filter);

    res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      count: notes.length,
      data: notes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

// DATE RANGE FILTER
exports.filterByDateRange = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: "Both 'from' and 'to' query params are required",
        data: null,
      });
    }

    const notes = await Note.find({
      createdAt: {
        $gte: new Date(from),
        $lte: new Date(to),
      },
    });

    res.status(200).json({
      success: true,
      message: `Notes fetched between ${from} and ${to}`,
      count: notes.length,
      data: notes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

// PAGINATION
exports.paginateNotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;

    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const total = await Note.countDocuments();

    const notes = await Note.find()
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      data: notes,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

// SORTING
exports.sortNotes = async (req, res) => {
  try {
    const allowed = [
      "title",
      "createdAt",
      "updatedAt",
      "category",
    ];

    const sortBy = req.query.sortBy || "createdAt";

    if (!allowed.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sortBy",
        data: null,
      });
    }

    const order =
      req.query.order === "asc"
        ? 1
        : -1;

    const notes = await Note.find().sort({
      [sortBy]: order,
    });

    res.status(200).json({
      success: true,
      message: "Sorted successfully",
      count: notes.length,
      data: notes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

// FILTER PINNED NOTES
exports.getPinnedNotes = async (req, res) => {
  try {
    const filter = {
      isPinned: true,
    };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const notes = await Note.find(filter);

    res.status(200).json({
      success: true,
      message: "Pinned notes fetched successfully",
      count: notes.length,
      data: notes,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });

  }
};


// FILTER CATEGORY QUERY PARAM
exports.filterByCategory = async (req, res) => {
  try {

    const { name } = req.query;

    if (!name) {

      return res.status(400).json({
        success: false,
        message: "Query param 'name' is required",
        data: null,
      });

    }

    const notes = await Note.find({
      category: name,
    });

    res.status(200).json({
      success: true,
      message: `Notes filtered by category: ${name}`,
      count: notes.length,
      data: notes,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });

  }
};


// PAGINATION BY CATEGORY
exports.paginateByCategory = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;

    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const filter = {
      category: req.params.category,
    };

    const total = await Note.countDocuments(filter);

    const notes = await Note.find(filter)
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      message: `Notes fetched for category: ${req.params.category}`,
      data: notes,

      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },

    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });

  }
};


// SORT PINNED NOTES
exports.sortPinnedNotes = async (req, res) => {
  try {

    const allowed = [
      "title",
      "createdAt",
      "updatedAt",
      "category",
    ];

    const sortBy =
      req.query.sortBy || "createdAt";

    if (!allowed.includes(sortBy)) {

      return res.status(400).json({
        success: false,
        message: "Invalid sortBy",
        data: null,
      });

    }

    const order =
      req.query.order === "asc"
        ? 1
        : -1;

    const notes = await Note.find({
      isPinned: true,
    }).sort({
      [sortBy]: order,
    });

    res.status(200).json({
      success: true,
      message: `Pinned notes sorted by ${sortBy}`,
      count: notes.length,
      data: notes,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });

  }
};