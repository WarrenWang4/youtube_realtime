let count = 1;

function addInput()
{
    console.log("dog");
    count++;

    var x = document.getElementById("myBR");

    var i = document.createElement("input"); //input element, text
    i.setAttribute('type',"text");
    i.setAttribute('id',"link" + count);
    i.setAttribute('placeholder', "YouTube link");
    document.body.appendChild(i);
    
}