// (c) 2013 Don Coleman
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* global mainPage, deviceList, refreshButton */
/* global detailPage, tempFahrenheit, tempCelsius, closeButton */
/* global rfduino, alert */
'use strict';

var arrayBufferToFloat = function (ab) {
    var a = new Float32Array(ab);
    return a[0];
};

var num = 5.56789;
var lastValue=num.toFixed(2);
var lastlat ='';
var lastlong ='';

// geolocation getCurrentPosition Callback

//   This method accepts a `Position` object, which contains
//   the current GPS coordinates
//
var onSuccess = function(position) {
    lastlat = position.coords.latitude.toFixed(6);
    lastlong = position.coords.longitude.toFixed(6);
   
};

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}


// the app part
var app = {
    initialize: function() {
        this.bindEvents();
        detailPage.hidden = true;
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        refreshButton.addEventListener('touchstart', this.refreshDeviceList, false);
        closeButton.addEventListener('touchstart', this.disconnect, false);
         sendButton.addEventListener('touchstart', this.send, false);
        deviceList.addEventListener('touchstart', this.connect, false); // assume not scrolling
    },
    onDeviceReady: function() {
        app.refreshDeviceList();
    },
    refreshDeviceList: function() {
        deviceList.innerHTML = ''; // empties the list
        rfduino.discover(5, app.onDiscoverDevice, app.onError);
    },
    onDiscoverDevice: function(device) {
        var listItem = document.createElement('li'),
            html = '<b>' + device.name + '</b><br/>' +
                'RSSI: ' + device.rssi + '&nbsp;|&nbsp;' +
                'Advertising: ' + device.advertising + '<br/>' +
                device.uuid;

        listItem.setAttribute('uuid', device.uuid);
        listItem.innerHTML = html;
        deviceList.appendChild(listItem);
    },
    connect: function(e) {
        var uuid = e.target.getAttribute('uuid'),
            onConnect = function() {
                rfduino.onData(app.onData, app.onError);
                app.showDetailPage();
            };

        rfduino.connect(uuid, onConnect, app.onError);
    },
    onData: function(data) {
        console.log(data);
        var celsius = arrayBufferToFloat(data)/1000,
            fahrenheit = celsius * 1.8 + 32;
//laroche original : var celsius = arrayBufferToFloat(data),
        tempCelsius.innerHTML = celsius.toFixed(3);
        tempFahrenheit.innerHTML = fahrenheit.toFixed(3);
       
    },
    
    send: function() {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    
        var xhReq = new XMLHttpRequest();
      
        var urldata = "http://openrad.agoralogie.fr/post.php?mesure="+tempCelsius.innerHTML+"&lat="+lastlat+"&long="+lastlong;
        xhReq.open("GET", urldata, false);
        xhReq.send(null);
        var serverResponse = xhReq.responseText; 
    },
    
    
    disconnect: function() {
        rfduino.disconnect(app.showMainPage, app.onError);
    },
    
   
    
    showMainPage: function() {
        mainPage.hidden = false;
        detailPage.hidden = true;
    },
    showDetailPage: function() {
        mainPage.hidden = true;
        detailPage.hidden = false;
    },
    onError: function(reason) {
        alert(reason); // real apps should use notification.alert
    }
};
