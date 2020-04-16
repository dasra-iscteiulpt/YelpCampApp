var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");

var seeds = [
    {
        name: "Clube de Campismo e Caravanismo de Torres Vedras ",
        image: "https://images.unsplash.com/photo-1497900304864-273dfb3aae33?ixlib=rb-1.2.1&auto=format&fit=crop&w=1388&q=80",
        description: "O Clube de Campismo e Caravanismo de Torres Vedras dispõe de uma área de 180.000m2 completamente vedada e com vigilância noturna e controlo de entradas e saídas 24 horas por dia. É dotado de boas infraestruturas, serviços e vários edifícios de apoio à atividade que desenvolve."
    },
    {
        name: "Parque de Campismo do CCL - Costa Nova",
        image: "https://images.unsplash.com/photo-1526491109672-74740652b963?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
        description: "Parque com localização conveniente, quer para visitar Lisboa, quer para usufruir de praia. Este parque tem um ambiente muito especial, pois encontra-se no meio de baixos pinheiros e por detrás das dunas do Guincho. O parque tem piscina, serviços comerciais de apoio e bungalows. A praia possui um extenso areal e é ideal para a prática de windsurf."
    },
    {
        name: "Ericeira Camping & Bungalows",
        image: "https://images.unsplash.com/photo-1534187886935-1e1236e856c3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1535&q=80",
        description: "Situado a menos de dois minutos da típica vila piscatória da Ericeira, nas proximidades de uma das melhores praias da Europa para a prática das modalidades do surf e do bodyboard, o Parque de Campismo de Mil Regos apresenta-se como um espaço de eleição para o lazer e para o contacto com a natureza."
    }
]

/* function seedDB() {
    //Remove all campgrounds
    Campground.deleteOne({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("removed campgrounds!");
       /*  Comment.remove({}, function (err) {
            if (err) {
                console.log(err);
            }
            console.log("removed comments!"); 
            //add a few campgrounds
            data.forEach(function (seed) {
                Campground.create(seed, function (err, campground) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("added a campground");
                        //create a comment
                         Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, function (err, comment) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment");
                                }
                            }); 
                    }
                });
            });
        });
    });
    //add a few comments
} */

//Callbacks with Async + Await
//Async declares an asynchronous function
async function seedDB() {
    try {
        //Remove all campgrounds
        //Await - pauses the execution of async functions
        await Campground.deleteMany({});
        console.log("removed campgrounds!");
        await Comment.deleteMany({});
        console.log("removed comments!");
        for (const seed of seeds) {
            let campground = await Campground.create(seed);
            console.log("added a campground");
            let comment = await Comment.create(
                {
                    text: "This place is great, but I wish there was internet",
                    author: "Homer"
                })
                console.log("Created new comment");
            campground.comments.push(comment);
            campground.save();
            console.log("Comment added to campground"); 
        }
    }
    catch (err) {
        console.log(err);
    }

}

module.exports = seedDB;