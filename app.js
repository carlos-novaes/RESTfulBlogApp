const express = require("express"),
   methodOveride = require("method-override"),
   mongoose = require("mongoose"),
   expressSanitizer = require("express-sanitizer"),
   bodyParser = require("body-parser"),
   app = express()

// app cconfig
mongoose.connect("mongodb://localhost/restful_blog_app", {
   useNewUrlParser: true
})
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({
   extended: true
}))
app.use(expressSanitizer())
app.use(methodOveride("_method"))


// mongoose/model config
let blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {
      type: Date,
      default: Date.now
   }
})
let Blog = mongoose.model("Blog", blogSchema)

// Blog.create({
//    title: "Test",
//    image: "https://image.freepik.com/free-vector/watercolor-winter-landscape-background_23-2147987033.jpg",
//    body: "This is a blog post"
// }, (err, blog) => {
//    if (err) {
//       console.log(err)
//    } else {
//       console.log(blog)
//    }
// })

// RESTful routes
app.get("/", (req, res) => {
   res.redirect("/blogs")
})
// ---------> INDEX ROUTE
app.get("/blogs", (req, res) => {
   Blog.find({}, (err, blogs) => {
      if (err) {
         console.log(err)
      } else {
         res.render("index", {
            blogs: blogs
         })
      }
   })
})
// ---------> NEW ROUTE
app.get("/blogs/new", (req, res) => {
   res.render("new")
})

app.post("/blogs", (req, res) => {
   req.body.blog.body = req.sanitize(req.body.blog.body)
   Blog.create(req.body.blog, (err, newBlog) => {
      if (err) {
         res.render("new")
      } else {
         res.redirect("/blogs")
      }
   })
})
// ---------> SHOW ROUTE
app.get("/blogs/:id", (req, res) => {
   Blog.findById(req.params.id, (err, foundBlog) => {
      if (err) {
         res.redirect("/blogs")
      } else {
         res.render("show", {
            blog: foundBlog
         })
      }
   })
})
// ---------> EDIT ROUTE
app.get("/blogs/:id/edit", (req, res) => {
   Blog.findById(req.params.id, (err, foundBlog) => {
      if (err) {
         res.redirect("/blogs")
      } else {
         res.render("edit", {
            blog: foundBlog
         })
      }
   })
})
// ---------> UPDATE ROUTE
app.put("/blogs/:id", (req, res) => {
   req.body.blog.body = req.sanitize(req.body.blog.body)
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
      if (err) {
         res.redirect("/blogs")
      } else {
         res.redirect("/blogs/" + req.params.id)
      }
   })
})
// ---------> UPDATE ROUTE
app.delete("/blogs/:id", (req, res) => {
   Blog.findByIdAndDelete(req.params.id, err => {
      if (err) {
         res.redirect("/blogs")
      } else {
         res.redirect("/blogs")
      }
   })
})

app.listen(3000, () => {
   console.log("Server running")
})