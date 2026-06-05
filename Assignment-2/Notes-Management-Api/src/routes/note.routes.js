const router=require("express").Router();

const note=require("../controllers/note.controller");

router.post("/bulk",note.createBulkNotes);
router.delete("/bulk",note.deleteBulkNotes);

router.get("/category/:category",note.getNotesByCategory);
router.get("/status/:isPinned",note.getNotesByStatus);

router.get("/filter",note.filterNotes);
router.get("/filter/date-range",note.filterByDateRange);

router.get("/paginate",note.paginateNotes);

router.get("/sort",note.sortNotes);

router.post("/",note.createNote);

router.get("/",note.getAllNotes);

router.get("/:id/summary",note.getNoteSummary);

router.get("/:id",note.getNoteById);

router.put("/:id",note.replaceNote);

router.patch("/:id",note.updateNote);

router.delete("/:id",note.deleteNote);

router.get("/filter/pinned", note.getPinnedNotes);

router.get("/filter/category", note.filterByCategory);

router.get(
"/paginate/category/:category",
note.paginateByCategory
);

router.get(
"/sort/pinned",
note.sortPinnedNotes
);

module.exports=router;