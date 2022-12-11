const ex = require('express')
const bd = require('body-parser')
const app = ex()
const mongoose = require('mongoose')
mongoose.set('strictQuery', true)

mongoose.connect("mongodb+srv://admin-nikhil:CHINTU%406791@cluster0.jqv2l5l.mongodb.net/?retryWrites=true&w=majority")

const itemschema = new mongoose.Schema({
  item: {
    type: String,
    required: [true, "can't be null"]
  }
});

const items = new mongoose.model("item", itemschema)
const work_items = new mongoose.model("work_item", itemschema)

app.use(bd.urlencoded({
  extended: true
}))
app.set('view engine', 'ejs')
app.use(ex.static("views"))

var x = new Date();
var options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
};
var day = x.toLocaleDateString("en-US", options)
var head = ""

app.get("/", function(req, res) {

  head = "home"

  items.find(function(err, x1) {
    if (err) {
      console.log("err")
    } else {
      res.render('list', {
        head: head,
        day: day,
        new1: x1
      })
      x1.forEach(function(y) {
        console.log(y.item)
      });

    }
  });

});

app.post("/", function(req, res) {
  console.log(req.body)
  if (req.body.butt === "home") {
    var item = req.body.add
    var vitem = new items({
      item: item
    });
    vitem.save(function(err) {
      if (err) {
        console.log(err);
      }
    });
    res.redirect("/")
  } else {
    var item = req.body.add
    var vitem = new work_items({
      item: item
    });
    vitem.save(function(err) {
      if (err) {
        console.log(err);
      }
    });
    res.redirect("/work")
  }
  console.log("yes" + req.body.add)

});

app.get("/work", function(req, res) {
      head = "work";
      work_items.find(function(err, x1) {
            if (err) {
              console.log("err")
            } else {
              res.render('list', {
                head: head,
                day: day,
                new1: x1
              });
              x1.forEach(function(y) {
                console.log(y.item)
              });
            }});
});

app.post("/delete",function(req,res){
  const del = req.body.tobedel
  const myArray = del.split(",");
  if(myArray[1]==="home"){
    items.deleteOne({_id:myArray[0]},function(err){
    if(err)
    {
      console.log("error")
    }
    else{
      console.log("Success in deleting")
      res.redirect("/")
    }
  });
  }
  else{
    work_items.deleteOne({_id:myArray[0]},function(err){
    if(err)
    {
      console.log("error")
    }
    else{
      console.log("Success in deleting")
      res.redirect("/work")
    }
    });
  }



})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port,function(err){
  if(err){
    console.log("error")
  }
});
