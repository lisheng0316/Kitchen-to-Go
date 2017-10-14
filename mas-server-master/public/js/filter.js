function filter() {
  // Declare variables
  console.log("Calling filter()");
  var input, filter, list, li, name, type, i;
  input = document.getElementById("filter");
  filter = input.value.toUpperCase();
  list = document.getElementById("foodlist");
  li = list.getElementsByTagName("li");
  console.log(li);

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
	  console.log("Looping");
    name = li[i].innerHTML;
	type = li[i].innerHTML;
    if (name && type) {
      if (name.toUpperCase().indexOf(filter) > -1
		  || type.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    } 
  }
}