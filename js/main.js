var route = [];
$(function() {
  loadYear();
  clickHandlers.addAddress();
  clickHandlers.addLABZ();
  clickHandlers.calculateRoute();
  clickHandlers.printMap();
});

function loadYear() {
  $("#date").text(new Date().getFullYear());
};

var clickHandlers = {

  addLABZ: function() {
    $("#addLabz").on('click', labz.readLABZ);
  },
  addAddress: function() {
    $("#addAddress").on('click', addressList.addAddress);
  },
  calculateRoute: function() {
    $("#calculate").on('click', handleAddresses);
  },
  printMap: function() {
    $("#print").on('click', printMap);
  }
};

var addressList = {
  addAddress: function() {
    addToRoute((route.length+1), $("#route").val() + ' ' + $("#street_number").val() + ' ' + $("#locality").val() + ' ' + $("#country").val());
  },

  updateList: function() {
    $("#address_input :input").val('');
    $("#addresses tbody").empty();
    route.forEach(function(address) {
      $("#addresses tbody").append('<tr><td>' + address.orderNr + '</td><td>' + address.street + '</td><td>' + address.number + '</td><td>' + address.place + '</td></tr>');
    });
  }
};

var printMap = function() {
  var body = $('body');
  var addressOverview = $('#addresses');
  var addressOverviewParent = $('#addresses').parent();
  var mapContainer = $('#map');
  var mapContainerParent = mapContainer.parent();
  var printContainer = $('<div>');

  printContainer
    .addClass('print-container')
    .css({
      "position": "relative",
      "color": "white"
    })
    .height(mapContainer.height())
    .append(mapContainer)
    .append(addressOverview)
    .prependTo(body);

  var content = body
    .children()
    .not('script')
    .not(printContainer)
    .detach();

  // Patch for some Bootstrap 3.3.x `@media print` styles. :|
  var patchedStyle = $('<style>')
    .attr('media', 'print')
    .text('img { max-width: none !important; }' +
      'a[href]:after { content: ""; }')
    .appendTo('head');

  window.print();

  body.prepend(content);
  mapContainerParent.prepend(mapContainer);
  addressOverviewParent.prepend(addressOverview);

  printContainer.remove();
  patchedStyle.remove();
}
