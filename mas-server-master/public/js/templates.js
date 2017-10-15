const hogan = require("hogan.js");
const fs = require("fs");
class templates {
    static index()
    {
        foods = JSON.parse(fs.readFileSync("../dummy_data/data.json"));
        foodList = "<div id='template'><ul>{{#foods}}<li>{{name}}</li>{{/foods}}</ul></div>";
        template = hogan.compile(foodList);
        return template({
            foods: foods
        });
        ;
    }
}