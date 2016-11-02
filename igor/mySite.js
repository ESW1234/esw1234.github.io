var links = ['<a href="bl2index.html">DEFAULT WIDGET</a>', '<a href="bl2NoPrechat.html">NO PRECHAT</a>', '<a href="bl2Hidden.html">HIDDEN BUTTON</a>', '<a href="bl2NoWidget.html">NO WIDGET</a>', '<a href="bl2CustomText.html">CUSTOM BUTTON TEXT</a>', '<a href="bl2CustomCSS.html">CUSTOM STYLING</a>', '<a href="bl2Button2.html">BUTTON 2</a>', '<a href="bl2Link.html">BUTTON AS A LINK</a>', '<a href="bl2NoPrechatWithExtraPrechatFormDetails.html">NO PRECHAT WITH EXTRA PRECHAT FORM DETAILS</a>'];

function openNav() {
    document.getElementById("sideNav").style.width = "250px";
    document.getElementById("text").style.marginLeft = "250px";
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
}
