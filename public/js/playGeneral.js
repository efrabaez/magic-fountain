var isMobile = {
	Android: function() {
			return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
	},
	any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
};

if(!isMobile.iOS()){
	document.getElementById("iosPermisos").hidden = true;
}else{
	if(localStorage.getItem("IOS") == 'true'){
		document.getElementById("iosPermisos").hidden = true;
	}
}


function askIOS() {
	if (typeof DeviceOrientationEvent.requestPermission === 'function') {
		DeviceOrientationEvent.requestPermission()
			.then(permissionState => {
				if (permissionState === 'granted') {
					window.addEventListener('deviceorientation', () => {});
					document.getElementById("iosPermisos").hidden = true;
					localStorage.setItem("IOS", 'true');
				}
			})
			.catch(console.error);
	} else {
		// handle regular non iOS 13+ devices
	}
}



function filterFunction() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  ul = document.getElementById("myUL");
  li = ul.getElementsByTagName("li");
  for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "";
      } else {
          li[i].style.display = "none";
      }
  }
}

function changeColor(_id){
	if(_id == 1){
		document.getElementById("headingOne").style.backgroundColor= "#7065FE";
		document.getElementById("headingTwo").style.backgroundColor= "#fe6474";
		document.getElementById("headingThree").style.backgroundColor= "#fe6474";
	} else if(_id == 2){
		document.getElementById("headingOne").style.backgroundColor= "#fe6474";
		document.getElementById("headingTwo").style.backgroundColor= "#7065FE";
		document.getElementById("headingThree").style.backgroundColor= "#fe6474";
	}else{
		document.getElementById("headingOne").style.backgroundColor= "#fe6474";
		document.getElementById("headingTwo").style.backgroundColor= "#fe6474";
		document.getElementById("headingThree").style.backgroundColor= "#7065FE";
	}
}

