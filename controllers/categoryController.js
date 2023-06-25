const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of books, book instances, authors and genre counts (in parallel)
  const [
    numCategories,
    numItems,
  ] = await Promise.all([
     Category.countDocuments({}).exec(),
     Item.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Local Library Home",
    numCategories: numCategories,
    numItems: numItems,
    
  });
});

exports.category_list = asyncHandler(async (req,res,next) => {
    const allCategories = await Category.find().sort({name:1}).exec();
    res.render("category_list",
    {
        title: "All Categories",
        categories: allCategories        
    })
})

exports.category_detail = asyncHandler(async (req, res, next) => {
    // Get details of author and all their books (in parallel)
    const [category, allitems] = await Promise.all([
      Category.findById(req.params.id).exec(),
      Item.find({ category: req.params.id }, "name description").exec(),
    ]);
  
    if (category === null) {
      // No results.
      const err = new Error("Category not found");
      err.status = 404;
      return next(err);
    }
  
    res.render("category_detail", {
      title: "Category Detail",
      category: category,
      allItems: allitems,
    });
  });

  exports.category_create_get = (req, res, next) => {
    res.render("category_form", { title: "Create Category",require: 'true', });
  };
  
  exports.category_create_post = [
    // Validate and sanitize fields.
    body("name")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Category name must be specified.")
      .isAlphanumeric()
      .withMessage("Name has non-alphanumeric characters."),
    body("description")
      .isLength({ min: 1 })
      .escape()
      .withMessage("Description must be specified."),
  
    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create Author object with escaped and trimmed data
      const category = new Category({
        name: req.body.name,
        description: req.body.description
        
      });
  
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        res.render("category_form", {
          title: "Create Category",
          category: category,
          errors: errors.array(),
        });
        return;
      } else {
        // Data from form is valid.
  
        // Save author.
        await category.save();
        // Redirect to new author record.
        res.redirect(category.url);
      }
    }),
  ];

  exports.category_delete_get = asyncHandler(async (req, res, next) => {
    // Get details of author and all their books (in parallel)
    const [category, itemsByCategory] = await Promise.all([
      Category.findById(req.params.id).exec(),
      Item.find({ category: req.params.id }, "title summary").exec(),
    ]);
  
    if (category === null) {
      // No results.
      res.redirect("/catalog/category");
    }
  
    res.render("category_delete", {
      title: "Delete Category",
      category: category,
      category_items: itemsByCategory,
    });
  });

  exports.category_delete_post = asyncHandler(async (req, res, next) => {
    // Get details of author and all their books (in parallel)
    const [category, itemsByCategory] = await Promise.all([
      Category.findById(req.params.id).exec(),
      Item.find({ category: req.params.id }, "title summary").exec(),
    ]);
  
  
    if (itemsByCategory.length > 0) {
      // Author has books. Render in same way as for GET route.
      res.render("category_delete", {
        title: "Delete Category",
        category: category,
        itemsbyCategory: itemsByCategory,
      });
      return;
    } else {
      // Author has no books. Delete object and redirect to the list of authors.
      await Category.findByIdAndRemove(req.body.categoryid);
      res.redirect("/catalog/categories");
    }
  });

  exports.category_update_get = asyncHandler(async (req, res, next) => {
    // Get book, authors and genres for form.
    const [category] = await Promise.all([
      Category.find().exec()]);
  
    if (category === null) {
      // No results.
      const err = new Error("Category not found");
      err.status = 404;
      return next(err);
    }
  
    
  
    res.render("category_form", {
      title: "Update Category",
      category:category,
      require: 'false',
    });
  });

  exports.category_update_post = [
    // Validate and sanitize fields.
    body("name")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("First name must be specified.")
      .isAlphanumeric()
      .withMessage("First name has non-alphanumeric characters."),
    body("description")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Description must be specified."),

    
  
    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create Author object with escaped and trimmed data (and the old id!)
      const category = new Category({
        name: req.body.name,
        description: req.body.description,
        _id: req.params.id,
      });
  
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values and error messages.
        res.render("category_form", {
          title: "Update category",
          category: category,
          errors: errors.array(),
        });
        return;
      } else {
        // Data from form is valid. Update the record.
        await Category.findByIdAndUpdate(req.params.id, category);
        res.redirect(category.url);
      }
    }),
  ];