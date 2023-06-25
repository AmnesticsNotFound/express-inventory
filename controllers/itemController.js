const Item = require("../models/item");
const Category = require("../models/category")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");



exports.item_list = asyncHandler(async (req,res,next) => {
    const allItems = await Item.find().sort({name:1}).exec();
    res.render("item_list",
    {
        title: "All Items",
        allItems: allItems       
    })
})

exports.item_detail = asyncHandler(async (req, res, next) => {
    // Get details of author and all their books (in parallel)
    const [item] = await Promise.all([
      Item.findById(req.params.id).populate("category").exec(),
    ]);
  
    if (item === null) {
      // No results.
      const err = new Error("Item not found");
      err.status = 404;
      return next(err);
    }
  
    res.render("item_detail", {
      title: "Item Detail",
      item: item,
    });
  });

  exports.item_create_get = (async(req, res, next) => {
    const [allCategories] = await Promise.all([
      Category.find().exec(),
    ])
    res.render("item_form", {
    title: "Create Item",
    allCategories:allCategories, });
  });
  
  exports.item_create_post = [
    // Validate and sanitize fields.
    body("name")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Item name must be specified.")
      .isAlphanumeric()
      .withMessage("Name has non-alphanumeric characters."),
    body("description")
      .isLength({ min: 1 })
      .escape()
      .withMessage("Description must be specified."),
    body("stock")
      .isLength({ min: 1 })
      .escape()
      .withMessage("Stock must be specified."),
    body("price") 
      .isLength({ min: 5 })
      .escape()
      .withMessage("Price must be specified."),
    body("category")
      .isLength({ min: 1 })
      .escape()
      .withMessage("Category must be specified."),
  
    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create Author object with escaped and trimmed data
      const item = new Item({
        name: req.body.name,
        description: req.body.description,
        stock: req.body.stock,
        price: req.body.price,
        category: req.body.category,
        
      });
  
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        res.render("item_form", {
          title: "Create Item",
          item: item,
          errors: errors.array(),
        });
        return;
      } else {
        // Data from form is valid.
  
        // Save author.
        await item.save();
        // Redirect to new author record.
        res.redirect(item.url);
      }
    }),
  ];

  exports.item_delete_get = asyncHandler(async (req, res, next) => {
    // Get details of author and all their books (in parallel)
    const [item] = await Promise.all([
      Item.findById(req.params.id).exec(),
    ]);
  
    if (item === null) {
      // No results.
      res.redirect("/catalog/item");
    }
  
    res.render("item_delete", {
      title: "Delete Item",
      item: item,
    });
  });

  exports.item_delete_post = asyncHandler(async (req, res, next) => {
    // Get details of author and all their books (in parallel)
    const [item] = await Promise.all([
      Item.findById(req.params.id).exec(),
    ]);
  
  
    
      // Author has no books. Delete object and redirect to the list of authors.
      await Item.findByIdAndRemove(req.body.itemid);
      res.redirect("/catalog/item_list");
    
  });

  exports.item_update_get = asyncHandler(async (req, res, next) => {
    // Get book, authors and genres for form.
    const [item, allCategories] = await Promise.all([
      Item.findById(req.params.id).populate("category").exec(),
      Category.find().exec(),
    ])

  
    if (item === null) {
      // No results.
      const err = new Error("Item not found");
      err.status = 404;
      return next(err);
    }
  
    
  
    res.render("item_form", {
      title: "Update Item",
      item:item,
      allCategories: allCategories,
      require: 'false',
    });
  });

  exports.item_update_post = [
    // Validate and sanitize fields.
    body("name")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Name must be specified."),
    body("description")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Description must be specified."),
      body("stock")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Stock must be specified."),
      body("price")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Price must be specified."),
      body("category")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Category must be specified."),

    
  
    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
      
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create Author object with escaped and trimmed data (and the old id!)
      const item = new Item({
        name: req.body.name,
        description: req.body.description,
        stock: req.body.stock,
        price: req.body.price,
        category: req.body.category,
        _id: req.params.id,
      });
  
      if (!errors.isEmpty()) {
        const [allCategories] = await Promise.all([
      
          Category.find().exec()]);
        // There are errors. Render the form again with sanitized values and error messages.
        res.render("item_form", {
          title: "Update item",
          item: item,
          errors: errors.array(),
          allCategories: allCategories,
        });
        return;
      } else {
        // Data from form is valid. Update the record.
        const theItem = await Item.findByIdAndUpdate(req.params.id, item, {});
        console.log(req.params)
        res.redirect(theItem.url);
      }
    }),
  ];