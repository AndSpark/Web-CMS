var ipdb = require('./index')
function testCity() {
    var city = new ipdb.City('./ipipfree.ipdb');
    var m = city.findMap("118.28.1.1", "CN");
    console.log(m);
}

testCity();