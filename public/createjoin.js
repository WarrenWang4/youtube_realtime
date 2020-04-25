function creategroup()
{
    let cpass = "" + document.getElementById("createGroupPass").value;
    console.log(cpass);
    location.href = "addvideos.html";
    //once you create you jump to a load videos page
    //this should direct to another page(video player?) and input value should be written to database
}

function joingroup()
{
    let jpass = "" + document.getElementById("joinGroupPass").value;
    console.log(jpass);
    //this should direct to another page(video player?)
}