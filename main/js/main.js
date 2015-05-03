(function(){

  angular.module('ol', ['chart.js'])
  .value('Entorno', {ClaseElegida:false,NombreClaseElegida:''})

  .controller('MenuController', ['Entorno','$scope',function(Entorno,$scope) {

    $scope.ClaseElegida = Entorno.ClaseElegida;

    $scope.$on('ClaseElegida', function(event, mass) {
      Entorno.ClaseElegida = mass.ClaseElegida;
      $scope.ClaseElegida = mass.ClaseElegida;
    });

    $scope.inicio = function(){
      Entorno.ClaseElegida = false;
      Entorno.NombreClaseElegida = '';
      $scope.ClaseElegida = false;      
    };

  }])

  .controller('ClasesController', ['Entorno','$rootScope',function(Entorno,$rootScope) {

    var clase = this;
    clase.activaClase = function(nombre){
      Entorno.NombreClaseElegida = nombre;
      $rootScope.$broadcast('ClaseElegida', {ClaseElegida:true});
    };

  }])

  .controller('SessionController', ['$scope',function($scope) {

    $scope.iniciar = function($event){
      $event.preventDefault();
      $("#loginModal").modal('hide');
    };

    $scope.iniciarUsuarioSel = function(){
      $("#loginModal").modal('hide');
    };

  }])

  .controller('TreeController', ['$scope',function($scope) {

    $scope.list = [{
      "id": 1,
      "title": "1. dragon-breath",
      "items": []
    }, {
      "id": 2,
      "title": "2. moiré-vision",
      "items": [{
        "id": 21,
        "title": "2.1. tofu-animation",
        "items": [{
          "id": 211,
          "title": "2.1.1. spooky-giraffe",
          "items": []
        }, {
          "id": 212,
          "title": "2.1.2. bubble-burst",
          "items": []
        }],
      }, {
        "id": 22,
        "title": "2.2. barehand-atomsplitting",
        "items": []
      }],
    }, {
      "id": 3,
      "title": "3. unicorn-zapper",
      "items": []
    }, {
      "id": 4,
      "title": "4. romantic-transclusion",
      "items": []
    }];

    $scope.selectedItem = {};

    $scope.options = {
    };

    $scope.getLeccion = function($event) {
      $("#leccionModal").modal({show:true, keyboard:false});
    };

    $scope.expand = function($event) {
      var childtable = $($event.target).parents(".childtable");
      if(childtable.length){
        $(".childtable tbody").addClass("hide");
        $("tbody",childtable).removeClass("hide");
      }
    };

  }])

  .controller("BarCtrl", ['$scope',function ($scope) {

    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Series A', 'Series B'];
    $scope.data = [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ];
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };

  }]);
     




  $("#loginModal").modal({show:true, keyboard:false, backdrop: false});
  $('#loginModal').on('hidden.bs.modal', function (event) {
    $(".initBlur").removeClass("initBlur");
  });

  location.hash="#t1";

  // Load native UI library
  var gui = require('nw.gui'); 
  //or global.window.nwDispatcher.requireNwGui() (see https://github.com/rogerwang/node-webkit/issues/707)
  // Get the current window
  var win = gui.Window.get();

  document.onkeydown = function (e) {    
    e.stopPropagation();

    if ((e.keyCode==8) &&
      (e.target.tagName != "TEXTAREA") && 
      (e.target.tagName != "INPUT")) {
      location.reload();
      return false;
    }

    if ((e.keyCode==13) &&
      (e.target.tagName != "TEXTAREA") && 
      (e.target.tagName != "INPUT")) {
      win.showDevTools();
      return false;
    }

  };

})();