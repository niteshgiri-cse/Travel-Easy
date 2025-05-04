const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing");
const path =require("path");
const methodOverride=require("method-override");
const  ejsMate=require("ejs-mate");
//for database we write a function 
// mongoose url
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";


main().then(()=>{       //here we call the main function
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));  //use to params id
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

// for Join directory
app.use(express.static(path.join(__dirname,"/public")));


//create for  defult API derfult response
app.get("/",(req,res)=>{
    res.send("Hi,I am rooot");
});

app.get("/listings",async(req, res)=>{
  const allListings= await Listing.find({});
  res.render("./listings/index.ejs",{allListings});
    
});


//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
    });
    
//show  Route
app.get("/listings/:id", async(req, res)=>{
    let {id}=req.params;
   const listing=await Listing.findById(id);
   res.render("listings/show.ejs",{listing});
})

//Create Route
app.post("/listings",async(req,res)=>{
    // let{title,description,image, price,country,location}=req.body; /// one way to collect data from html form but another way exist besically use make listing object 
    // let listing=req.body.listing;
    //  use second method to eter data directally in dataBase
 const newListing= new Listing(req.body.listing);
await newListing.save();
    res.redirect("/listings");
});
//Edit Route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
   const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});
//update Route 
// app.put("/listings/:id",async(req, res)=>{
//     let{id}=req.params;
//   await  Listing.findByIdAndUpdate(id,{ ...req.body.Listing});
//   res.redirect (`/listings/${id}`);
// })

//Update Route 
app.put("/listings/:id", async (req, res) => {
    // console.log("Request Body:", req.body);
    let { id } = req.params;
    const listingData = req.body.listing;

    if (!listingData.image) {
        listingData.image = "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60";
    }

    await Listing.findByIdAndUpdate(id, { ...listingData });
    res.redirect(`/listings/${id}`);
});


app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});
//Delete Route
app.delete("/listings/:id", async(req, res)=>{
    let{id}=req.params;
    let deletedList= await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    res.redirect("/listings");

})


//Create for check database  no need this at a time 

// app.get("/testListing", async(req,res)=>{
//     let sampleListing = new Listing({
//         title:"My New Villa ",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute Goa",
//         country:"India"
//     });
//   await  sampleListing.save();
//   console.log("sample was save");
//   res.send("successfull testing");
// })

