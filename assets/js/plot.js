

var container = document.getElementById('visualization');

$.getJSON('/sensor/all')
  .done(function(data){
    Plotly.plot(container, data);
  });


