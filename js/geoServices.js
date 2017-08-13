var autocomplete, map, geo, bounds;

var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};

function initGoogleServices() {

  var options = {
    types: ['geocode'],
    componentRestrictions: {
      country: 'be'
    }
  };

  $.getScript("js/markerWithLabel.js", function(data, textStatus, jqxhr) {});


  autocomplete = new google.maps.places.Autocomplete((document.getElementById('address')), options);

  geo = new google.maps.Geocoder();

  bounds = new google.maps.LatLngBounds();

  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 50.850340,
      lng: 4.351710
    },
    zoom: 9
  });

  map.setOptions({
    styles: mapOptions
  });

  autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
  var place = autocomplete.getPlace();

  for (var component in componentForm) {
    document.getElementById(component).value = '';
    document.getElementById(component).disabled = false;
  }

  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];

    if (componentForm[addressType]) {
      var val = place.address_components[i][componentForm[addressType]];
      document.getElementById(addressType).value = val;
    }
  }
}

var addToRoute = function(oNr, address) {
  geo.geocode({
    'address': address
  }, function(data, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      var myylocation = data[0].geometry.location;
      var locationDetails = data[0].address_components;
      latitude = myylocation.lat();
      longtitude = myylocation.lng();

      completeAddress = {
        orderNr: oNr,
        street: locationDetails[1].long_name,
        number: locationDetails[0].long_name,
        place: locationDetails[2].long_name,
        state: locationDetails[3].long_name,
        country: locationDetails[5].long_name,
        postal_code: locationDetails[6].long_name,
        location: new google.maps.LatLng(latitude, longtitude)
      }
      route.push(completeAddress);
      addressList.updateList();
    }
  });
}

function handleAddresses() {

  //hook for route optimisation
  //optimizeRoute();
  setmarkers();
}

//shortest path with params, who can provide this?
function optimizeRoute() {
  $.ajax({
    url: "http://routesavvytest.cloudapp.net/Premium.ashx?operation=findsequence.json&token=2483d5dcfb4d4c4185ac068180d43849",
    type: 'GET',
    dataType: 'jsonp',
    data: {

    }
  }).done(function(data) {
    console.log(data);
  });

}

function setmarkers() {

  var icon = {
    url: 'img/pak.svg',
    scaledSize: new google.maps.Size(25, 25),
  };

  var startIcon = {
    url: 'https://assets.aftership.com/couriers/svg/bpost.svg',
    scaledSize: new google.maps.Size(30, 30),
  };


  new google.maps.Marker({
    position: {
      lat: 51.225580,
      lng: 2.926755
    },
    map: map,
    icon: startIcon
  });

  bounds.extend(new google.maps.LatLng(51.225580, 2.926755));

  route.forEach(function(marker) {
    bounds.extend(marker.location);

    var m = new MarkerWithLabel({
      position: marker.location,
      map: map,
      icon: icon,
      clickable: true,
      labelContent: "" + marker.orderNr,
      labelAnchor: new google.maps.Point(4, 23),
      labelClass: "mapIconLabel"
    });

    var infowindow = new google.maps.InfoWindow({
      content: 'straat: ' + marker.street + '<br>nummer: ' + marker.number
    });

    google.maps.event.addListener(m, 'click', function() {
      infowindow.open(map, m);
    });
  });

  map.fitBounds(bounds);
}
