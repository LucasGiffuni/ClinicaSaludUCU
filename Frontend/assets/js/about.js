function iniciarMap(){
    const coord = {lat:-34.88854678727365 ,lng: -56.15945971534394};
    const map = new google.maps.Map(document.getElementById('map'),{
      zoom: 15,
      center: coord
    });
    const marker = new google.maps.Marker({
      position: coord,
      map: map
    });
}