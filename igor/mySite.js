var links = ['<a href="index.html">DEFAULT WIDGET</a>', '<a href="noPrechat.html">NO PRECHAT</a>', '<a href="hidden.html">HIDDEN BUTTON</a>', '<a href="noWidget.html">NO WIDGET</a>', '<a href="customText.html">CUSTOM BUTTON TEXT</a>', '<a href="customCSS.html">CUSTOM STYLING</a>', '<a href="button2.html">BUTTON 2</a>', '<a href="link.html">BUTTON AS A LINK</a>', '<a href="noPrechatWithExtraPrechatFormDetails.html">NO PRECHAT WITH EXTRA PRECHAT FORM DETAILS</a>'];

function openNav() {
    document.getElementById("sideNav").style.width = "195px";
    document.getElementById("text").style.marginLeft = "198px";
    document.getElementById("link1").innerHTML = links[0];
    document.getElementById("link2").innerHTML = links[1];
    document.getElementById("link3").innerHTML = links[2];
    document.getElementById("link4").innerHTML = links[3];
    document.getElementById("link5").innerHTML = links[4];
    document.getElementById("link6").innerHTML = links[5];
    document.getElementById("link7").innerHTML = links[6];
    document.getElementById("link8").innerHTML = links[7];
    document.getElementById("link9").innerHTML = links[8];
}

function closeNav() {
    document.getElementById("sideNav").style.width = "0";
    document.getElementById("text").style.marginLeft = "0";
}
