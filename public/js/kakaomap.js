const container = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스
const options = {
  //지도를 생성할 때 필요한 기본 옵션
  center: new kakao.maps.LatLng(37.32051830845997, 127.12622272670754), //지도의 중심좌표.
  level: 3, //지도의 레벨(확대, 축소 정도)
};

const map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

kakao.maps.event.addListener(map, "click", function (mouseEvent) {
  // 클릭한 위도, 경도 정보를 가져옵니다
  let latlng = mouseEvent.latLng;
  let message = "클릭한 위치의 위도는 " + latlng.La + " 이고, ";
  message += "경도는 " + latlng.Ma + " 입니다";

  let resultDiv = document.getElementById("result");
  resultDiv.innerHTML = message;
});

// control button
const mapTypeControl = new kakao.maps.MapTypeControl();

// 지도에 컨트롤을 추가해야 지도위에 표시됩니다
// kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
const zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
// info and marker
const markerPosition = new kakao.maps.LatLng(
  37.32051830845997,
  127.12622272670754
);

// 마커를 생성합니다
const marker = new kakao.maps.Marker({
  position: markerPosition,
});

// 마커가 지도 위에 표시되도록 설정합니다
marker.setMap(map);

const iwContent =
    '<div style="padding:5px; height: auto;">단국대학교2공학관 <br><a href="https://map.kakao.com/link/map/단국대학교 제2공학관,33.450701,126.570667" style="color:blue" target="_blank">큰지도보기</a> <a href="https://map.kakao.com/link/to/단국대학교 제2공학관,37.32051830845997,127.12622272670754" style="color:blue" target="_blank">길찾기</a></div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
  iwPosition = new kakao.maps.LatLng(37.32051830845997, 127.12622272670754); //인포윈도우 표시 위치입니다

// 인포윈도우를 생성합니다
const infowindow = new kakao.maps.InfoWindow({
  position: iwPosition,
  content: iwContent,
});

// 마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다
infowindow.open(map, marker);

const roadviewContainer = document.getElementById("roadview"); //로드뷰를 표시할 div
const roadview = new kakao.maps.Roadview(roadviewContainer); //로드뷰 객체
const roadviewClient = new kakao.maps.RoadviewClient(); //좌표로부터 로드뷰 파노ID를 가져올 로드뷰 helper객체

const position = new kakao.maps.LatLng(37.32051830845997, 127.12622272670754);

// 특정 위치의 좌표와 가까운 로드뷰의 panoId를 추출하여 로드뷰를 띄운다.
roadviewClient.getNearestPanoId(position, 50, function (panoId) {
  roadview.setPanoId(panoId, position); //panoId와 중심좌표를 통해 로드뷰 실행
});
