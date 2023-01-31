
express = require("express");

const bodyParser = require("body-parser");

const app = express();

const mongoose = require("mongoose");

const date = require(__dirname+"/date.js");

const _ = require("lodash");

mongoose.connect("mongodb://0.0.0.0:27017/tdlDB");

app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine','ejs');

app.use(express.static("public"));

// Creating a Schema
const itemsSchema = { name :String};

// Creating a Model
const Item = mongoose.model("Item", itemsSchema);

// Creating Document

const item1 = new Item({
  name : "To Eat.."
});

const item2 = new Item({
  name : "To Code.."
});

const item3 = new Item({
  name : "To Sleep.."
});

const defaultItem = [item1,item2,item3];

//Creating a new Schema for customTopicName("localhost/work or Home or etc..")
const listSchema = {
  name:String,
  items:[itemsSchema]
};

// Creating model for that listschema
const List = mongoose.model("List",listSchema);

app.get("/",function(req,res){
  const day = date.getDay();

  //Displaying the added itmes in Item Model using find()

  Item.find({},function(err, foundItems) {

    if(foundItems.length === 0){
      Item.insertMany(defaultItem, function(err){
        if(err){
          console.log(err);
        }
        else {
          console.log("Successfully updated");
        }
      });
      res.redirect("/");
    }
    else {
      res.render("list",{listTitle : day, newItemList: foundItems}); // This Line will display the output in webdite
    }

  })


})

app.post("/",(req,res)=>{
  const day = date.getDay();

  const itemName = req.body.newItem; // this is the input from the user..
  const listName = req.body.list;

  const item = new Item({  // document for newly adding item..
    name : itemName
  });

  // if block will execute/display the added items in home-route page
  if( listName === day){
    item.save();            // added item will be saved to collection of items
    res.redirect("/");
  }
  // else block will execute/display the added items in different pages based on customTopicName..
  else {
    List.findOne({name:listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    })
  }

})

app.post("/delete", function(req,res){
  const day = date.getDay();

  const deletedItem = req.body.checkbox; // checking which item is deleted based on it's _id
  const listName = req.body.listName;   // here the listName is Work/Home/School(customTopicName)

  if(listName == day){
    Item.findByIdAndRemove(deletedItem, function(err) {
      if(!err){
        console.log("Successfully Deleted");
        res.redirect("/");
      }
    });
  }
  else{
    List.findOneAndUpdate({name : listName}, {$pull: {items: {_id:deletedItem}}}, function(err, foundList){
      if(!err){
        res.redirect("/"+ listName);
      }

    })
  }

});

app.get("/:customTopicName",function(req,res){

  const customTopicName = _.capitalize(req.params.customTopicName);

  List.findOne({name : customTopicName}, function(err, foundList){
    if(!err){
      if(!foundList){
        const list = new List({
          name: customTopicName,
          items: defaultItem
        });
        list.save();
        res.redirect("/" + customTopicName);
      }
      else {
        res.render("list",{listTitle : foundList.name, newItemList: foundList.items});
      }
    }
  })


});

app.get("/about",function(req,res){
  res.render("about");
});

app.listen(3000,function(req,res){
  console.log("Server-started")
});
