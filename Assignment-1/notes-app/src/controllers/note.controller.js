const mongoose = require("mongoose");
const Note = require("../models/note.model");

exports.createNote = async (req, res) => {
  try {
    const { title, content, category, isPinned } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content required",
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

exports.bulkCreate = async (req, res) => {
  try {
    const { notes } = req.body;

    if (!notes || notes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Notes array required",
        data: null,
      });
    }

    const created = await Note.insertMany(notes);

    res.status(201).json({
      success: true,
      message: `${created.length} notes created successfully`,
      data: created,
    });

  } catch (error) {
    res.status(500).json({
      success:false,
      message:error.message,
      data:null
    });
  }
};

exports.getNotes = async (req,res)=>{
try{

const notes=await Note.find();

res.json({
success:true,
message:"Notes fetched successfully",
data:notes
});

}catch(error){

res.status(500).json({
success:false,
message:error.message,
data:null
});

}
};

exports.getNote = async (req,res)=>{

try{

const {id}=req.params;

if(!mongoose.Types.ObjectId.isValid(id)){

return res.status(400).json({
success:false,
message:"Invalid ID",
data:null
});

}

const note=await Note.findById(id);

if(!note){

return res.status(404).json({
success:false,
message:"Note not found",
data:null
});

}

res.json({
success:true,
message:"Note fetched successfully",
data:note
});

}catch(error){

res.status(500).json({
success:false,
message:error.message,
data:null
});

}
};

exports.replaceNote=async(req,res)=>{

try{

const note=await Note.findByIdAndUpdate(
req.params.id,
req.body,
{
new:true,
overwrite:true,
runValidators:true
}
);

res.json({
success:true,
message:"Note replaced successfully",
data:note
});

}catch(error){

res.status(500).json({
success:false,
message:error.message,
data:null
});

}
};

exports.updateNote=async(req,res)=>{

try{

if(Object.keys(req.body).length===0){

return res.status(400).json({
success:false,
message:"No fields provided to update",
data:null
});

}

const note=await Note.findByIdAndUpdate(
req.params.id,
req.body,
{
new:true,
runValidators:true
}
);

res.json({
success:true,
message:"Note updated successfully",
data:note
});

}catch(error){

res.status(500).json({
success:false,
message:error.message,
data:null
});

}
};

exports.deleteNote=async(req,res)=>{

await Note.findByIdAndDelete(req.params.id);

res.json({
success:true,
message:"Note deleted successfully",
data:null
});

};

exports.bulkDelete=async(req,res)=>{

const {ids}=req.body;

if(!ids || ids.length===0){

return res.status(400).json({
success:false,
message:"IDs required",
data:null
});

}

const result=await Note.deleteMany({
_id:{$in:ids}
});

res.json({
success:true,
message:`${result.deletedCount} notes deleted successfully`,
data:null
});

};