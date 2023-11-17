<template>
    <div>
      <v-row ref="searchFilter">
      <v-col :cols="12">
      <kcard>
          <cardBody>
            <v-row>
            <v-col :cols="3">
              <InputText
                label="검색어"
                :searchOption="true"
                :labelCols="4"
                :textCols="8"
                :dataNm="'keyword'"
                :boxWidth="'90%'"
                @input-text-set="searchKeywordSet"
              />
            </v-col>
            <v-col :cols="3">
              <InputText
                label="주소"
                :searchOption="true"
                :labelCols="4"
                :textCols="8"
                :dataNm="'address'"
                :boxWidth="'90%'"
                @input-text-set="searchAddressSet"
              />
            </v-col>
            <v-col :cols="3">
              <v-row class="search-box" align="center" no-gutters>
                <v-col :cols="4">
                  <Label>
                    <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                    카테고리
                  </Label>
                </v-col>
                <v-col :cols="8">
                  <DropDownList ref="selectBox"
                                :style="{ width: '90%'}" 
                                :data-items='codeList'
                                :default-value="codeList[0]"
                                :text-field="'text'"
                                :value="value"
                                :rounded="'large'"
                                :fill-mode="'outline'"
                                @change="selectCodeList"
                                >
                  </DropDownList>
                </v-col>
              </v-row>
            </v-col>
            <!-- <v-col :cols="3">
              <kbutton :theme-color="'primary'" @click="search">조회</kbutton>
            </v-col> -->
            </v-row>
          </cardBody>
        </kcard>
        </v-col>
        </v-row>
        <v-row ref="contents">
        <v-col :cols="12">
        <kcard style="width:100%;height:100%;">
          <cardBody style="width:100%;height:100%;">
            <div id="map" style="width:100%;height:95%;"></div>
            <div>
            <span>{{message}}</span>
            </div>
            <div>
            <span>{{clickRaodAddress}}</span>
            </div>
            <div>
            <span>{{clickAddress}}</span>
            </div>
          </cardBody>
        </kcard>
        </v-col>
        </v-row>
    </div>
  </template>
  
  <script>
  import mixinGlobal from "@/mixin/global.js";
  import Utility from "~/plugins/utility";
  import { Card, CardBody, CardTitle, CardActions } from "@progress/kendo-vue-layout";
  import { Button } from "@progress/kendo-vue-buttons";
  import InputText from "@/components/common/input/InputText";
  import { DropDownList } from '@progress/kendo-vue-dropdowns';
import { Label } from "@progress/kendo-vue-labels";
  let myTitle;
  let myMenuId;
  export default {
    mixins: [mixinGlobal],
    async asyncData(context) {
      const myState = context.store.state;
      myMenuId = context.route.query.menuId;
      await context.store.commit("setActiveMenuInfo", myState.menuData[myMenuId]);
      myTitle = await myState.activeMenuInfo.menuNm;
    },
    meta: {
      title: () => {
        return myTitle;
      },
      menuId: myMenuId,
      closable: true
    },
    components: {
      Button,
      CardBody, 
      CardTitle, 
      CardActions,
      "kbutton": Button,
      "kcard" : Card,
      InputText,
      DropDownList,
      Label
    },
    data() {
      return {
        message : "",
        keyword : "",
        address : "",
        clickAddress : "",
        clickRaodAddress : "",
        infowindow : null,
        codeList : [
          { id : 'MT1', text : '대형마트'},
          { id : 'CS2', text : '편의점'},
          { id : 'PS3', text : '어린이집, 유치원'},
          { id : 'SC4', text : '학교'},
          { id : 'AC5', text : '학원'},
          { id : 'PK6', text : '주차장'},
          { id : 'OL7', text : '주유소, 충전소'},
          { id : 'SW8', text : '지하철역'},
          { id : 'BK9', text : '은행'},
          { id : 'CT1', text : '문화시설'},
          { id : 'AG2', text : '중개업소'},
          { id : 'PO3', text : '공공기관'},
          { id : 'AT4', text : '관광명소'},
          { id : 'AD5', text : '숙박'},
          { id : 'FD6', text : '음식점'},
          { id : 'CE7', text : '카페'},
          { id : 'HP8', text : '병원'},
          { id : 'PM9', text : '약국'},
        ],
        markers: [],
        value: {}
      };
    },
    computed: {
    },
    watch: {
    },
    beforeCreate() {
    },
    mounted() {
      if (window.kakao && window.kakao.maps) {
        this.initMap();
      } else {
        const script = document.createElement("script");
        /* global kakao */
        script.onload = () => kakao.maps.load(this.initMap);
        script.src =
          "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=c1766eaf36b97770b6bdca993e2b6592&libraries=services";
        document.head.appendChild(script);
      }
    },
    methods: {
      initMap() {
        let _this = this;
        const container = document.getElementById("map");
        const options = {
          center: new kakao.maps.LatLng(37.52797516963126, 126.96777439547579),
          level: 2,
        };
        this.map = new kakao.maps.Map(container, options);

        var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png', // 마커이미지의 주소입니다    
            imageSize = new kakao.maps.Size(64, 69), // 마커이미지의 크기입니다
            imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
            markerPosition  = new kakao.maps.LatLng(37.52797516963126, 126.96777439547579); 

        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
            position: markerPosition,
            image: markerImage
        });

        marker.setMap(this.map);
        // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
        var mapTypeControl = new kakao.maps.MapTypeControl();

        // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
        // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
        this.map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

        // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
        var zoomControl = new kakao.maps.ZoomControl();
        var geocoder = new kakao.maps.services.Geocoder();
        this.map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

        kakao.maps.event.addListener(this.map, 'click', function(mouseEvent) {        
            var latlng = mouseEvent.latLng;
            geocoder.coord2Address(latlng.getLng(), latlng.getLat(), function(result, status) {
              var detailRaodAddress = !!result[0].road_address ? "도로명 주소 : " + result[0].road_address.address_name : "";
              var detailAddress = "지번 주소 : " + result[0].address.address_name;
              _this.clickAddress = detailRaodAddress;
              _this.clickRaodAddress = detailAddress
            });
            marker.setPosition(latlng);
            _this.message = '위도 : ' + latlng.getLat() + ' 경도 : ' + latlng.getLng();
            if(_this.infowindow){
              _this.infowindow.close();
            }
        });
      },
      searchKeywordSet(nm, val){
        this[nm] = val;
        this.searchKeyword();
      },
      searchAddressSet(nm, val){
        this[nm] = val;
        this.searchAddress();
      },
      searchKeyword(){
        var ps = new kakao.maps.services.Places();
        if(this.keyword != ""){
          ps.keywordSearch(this.keyword, this.placesSearchCB);
        }
      },
      searchAddress(){
        var geocoder = new kakao.maps.services.Geocoder();
        if(this.address != ""){
          geocoder.addressSearch(this.address, this.addressSearchCB)
        }
      },
      placesSearchCB (data, status, pagination) {
        if(this.infowindow){
          this.infowindow.close();
        }
        for ( var i = 0; i < this.markers.length; i++ ) {
            this.markers[i].setMap(null);
        }   
        this.markers = [];
        if (status === kakao.maps.services.Status.OK) {

            // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
            // LatLngBounds 객체에 좌표를 추가합니다
            var bounds = new kakao.maps.LatLngBounds();

            for (var i=0; i<data.length; i++) {
                this.displayMarker(data[i]);    
                bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
            }       

            // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
            this.map.setBounds(bounds);
        } 
      },
      displayMarker(place) {
        let _this = this;
        _this.infowindow = new kakao.maps.InfoWindow({zIndex:1});
        // 마커를 생성하고 지도에 표시합니다
        var marker = new kakao.maps.Marker({
            map: this.map,
            position: new kakao.maps.LatLng(place.y, place.x) 
        });
        this.markers.push(marker);
        var content ='<div class="wrap">' + 
            '    <div class="infoMap">' + 
            '        <div class="title">' + place.place_name +
            '        </div>' + 
            '        <div class="body">' + 
            '            <div class="img">' +
            '                <img src="https://d585tldpucybw.cloudfront.net/sfimages/default-source/labs/kendo/2020-revamp/vue-kendoka-bottom.png" width="73" height="70">' +
            '           </div>' + 
            '            <div class="desc">' + 
            '                <div class="ellipsis">'+place.road_address_name+'</div>' + 
            '                <div class="jibun ellipsis">'+place.phone+'</div>' + 
            '                <div class="jibun ellipsis">'+place.category_name+'</div>' + 
            '                <div><a href="'+place.place_url+'" target="_blank" class="link">장소정보</a></div>' + 
            '            </div>' + 
            '        </div>' + 
            '    </div>' +    
            '</div>'
        kakao.maps.event.addListener(marker, 'click', function() {
          _this.infowindow.setContent(content);
          _this.infowindow.open(_this.map, marker);
        });
      },
      addressSearchCB(result, status){
        if(this.infowindow){
          this.infowindow.close();
        }
        for ( var i = 0; i < this.markers.length; i++ ) {
            this.markers[i].setMap(null);
        }   
        this.markers = [];
        if (status === kakao.maps.services.Status.OK) {
        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        // 결과값으로 받은 위치를 마커로 표시합니다
        var marker = new kakao.maps.Marker({
            map: this.map,
            position: coords
        });
        this.markers.push(marker)

        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        this.map.setCenter(coords);
        } 
      },
      selectCodeList(val){
        this.value = {text: val.value.text, id:val.value.id}
        if(this.infowindow){
          this.infowindow.close();
        }
        for ( var i = 0; i < this.markers.length; i++ ) {
            this.markers[i].setMap(null);
        }   
        this.markers = [];
        var ps = new kakao.maps.services.Places(this.map); 
        // 카테고리로 은행을 검색합니다
        ps.categorySearch(val.value.id, this.placesCodeSearchCB, {useMapBounds:true});
      },
      placesCodeSearchCB (data, status, pagination) {
        if (status === kakao.maps.services.Status.OK) {
            for (var i=0; i<data.length; i++) {
                this.displayCodeMarker(data[i]);    
            }       
        }
      },
      displayCodeMarker(place) {
        let _this = this;
        _this.infowindow = new kakao.maps.InfoWindow({zIndex:1});
        // 마커를 생성하고 지도에 표시합니다
        var marker = new kakao.maps.Marker({
            map: this.map,
            position: new kakao.maps.LatLng(place.y, place.x) 
        });
        this.markers.push(marker)
        // 마커에 클릭이벤트를 등록합니다.
        var content ='<div class="wrap">' + 
            '    <div class="infoMap">' + 
            '        <div class="title">' + place.place_name +
            '        </div>' + 
            '        <div class="body">' + 
            '            <div class="img">' +
            '                <img src="https://d585tldpucybw.cloudfront.net/sfimages/default-source/labs/kendo/2020-revamp/vue-kendoka-bottom.png" width="73" height="70">' +
            '           </div>' + 
            '            <div class="desc">' + 
            '                <div class="ellipsis">'+place.road_address_name+'</div>' + 
            '                <div class="jibun ellipsis">'+place.phone+'</div>' + 
            '                <div class="jibun ellipsis">'+place.category_name+'</div>' + 
            '                <div><a href="'+place.place_url+'" target="_blank" class="link">장소정보</a></div>' + 
            '            </div>' + 
            '        </div>' + 
            '    </div>' +    
            '</div>'
        kakao.maps.event.addListener(marker, 'click', function() {
            // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
            _this.infowindow.setContent(content);
            _this.infowindow.open(_this.map, marker);
        });
      }
    }
  };
  
  </script>
  <style lang="scss">
.wrap {position: absolute;left: 75px;bottom: -33px;width: 288px;height: 132px;margin-left: -144px;text-align: left;overflow: hidden;font-size: 12px;font-family: 'Malgun Gothic', dotum, '돋움', sans-serif;line-height: 1.5;}
    .wrap * {padding: 0;margin: 0;}
    .wrap .infoMap {width: 286px;height: 120px;border-radius: 5px;border-bottom: 2px solid #ccc;border-right: 1px solid #ccc;overflow: hidden;background: #fff;}
    .wrap .infoMap:nth-child(1) {border: 0;box-shadow: 0px 1px 2px #888;}
    .infoMap .title {color:#000 !important;height: 30px;background: #eee;border-bottom: 1px solid #ddd;font-size: 18px;font-weight: bold;}
    .infoMap .close {position: absolute;top: 10px;right: 10px;color: #888;width: 17px;height: 17px;background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/overlay_close.png');}
    .infoMap .close:hover {cursor: pointer;}
    .infoMap .body {position: relative;overflow: hidden;}
    .infoMap .desc {position: relative;margin: 13px 0 0 90px;height: 75px;}
    .desc .ellipsis {color:#000 !important; overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
    .desc .jibun {font-size: 11px;color: #888;margin-top: -2px;}
    .infoMap .img {position: absolute;top: 6px;left: 5px;width: 73px;height: 71px;border: 1px solid #ddd;color: #888;overflow: hidden;}
    .infoMap:after {content: '';position: absolute;margin-left: -12px;left: 50%;bottom: 0;width: 22px;height: 12px;background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png')}
    .infoMap .link {color: #5085BB !important;}
  </style>