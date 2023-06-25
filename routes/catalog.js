const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const itemController = require ("../controllers/itemController");

// GET catalog home page.
router.get("/", categoryController.index);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get("/category/create", categoryController.category_create_get);

// POST request for creating Book.
router.post("/category/create", categoryController.category_create_post);

// GET request to delete Book.
router.get("/category/:id/delete", categoryController.category_delete_get);

// POST request to delete Book.
router.post("/category/:id/delete", categoryController.category_delete_post);

// GET request to update Book.
router.get("/category/:id/update", categoryController.category_update_get);

// POST request to update Book.
router.post("/category/:id/update", categoryController.category_update_post);

// GET request for one Book.
router.get("/category/:id", categoryController.category_detail);

// GET request for list of all Book items.
router.get("/categories", categoryController.category_list);

/// AUTHOR ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get("/item/create", itemController.item_create_get);

// POST request for creating Author.
router.post("/item/create", itemController.item_create_post);

// GET request to delete Author.
router.get("/item/:id/delete", itemController.item_delete_get);

// POST request to delete Author.
router.post("/item/:id/delete", itemController.item_delete_post);

// GET request to update Author.
router.get("/item/:id/update", itemController.item_update_get);

// POST request to update Author.
router.post("/item/:id/update", itemController.item_update_post);

// GET request for one Author.
router.get("/item/:id", itemController.item_detail);

// GET request for list of all Authors.
router.get("/item_list", itemController.item_list);

module.exports = router;