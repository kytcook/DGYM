var container = document.getElementById("map");
var options = {
  center: new kakao.maps.LatLng(37.499011, 127.032819),
  level: 3,
};
var map = new kakao.maps.Map(container, options);
var mapContainer = document.getElementById("map"), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(37.499011, 127.032819), // 지도의 중심좌표
    level: 3, // 지도의 확대 레벨
  };
var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
var markerPosition = new kakao.maps.LatLng(37.499011, 127.032819);
var marker = new kakao.maps.Marker({
  position: markerPosition,
});
marker.setMap(map);
var mapContainer = document.getElementById("map"), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(37.499011, 127.032819), // 지도의 중심좌표
    level: 3, // 지도의 확대 레벨
  };
var mapTypeControl = new kakao.maps.MapTypeControl();

map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
