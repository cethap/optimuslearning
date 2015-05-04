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

(function(){

  angular.module('ol', ['chart.js'])
  .value('Entorno', {ClaseElegida:false,NombreClaseElegida:''})

  .directive('ngProgramas', function() {
    return {
      restrict: 'EA',
      scope: {
        ngModel: '=',     // Bind the ngModel to the object given
        //onSend: '&',      // Pass a reference to the method 
        //fromName: '@'     // Store the string associated by fromName
      },      
      templateUrl: 'tmpl/programas.html'
    }
  })

  .directive('ngLecciones', function() {
    return {
      restrict: 'EA',scope: {ngModel: '=',},templateUrl: 'tmpl/lecciones.html',

    }
  })

  .directive('ngEstadisticas', function() {
    return {
      restrict: 'EA',scope: {ngModel: '=',},templateUrl: 'tmpl/estadisticas.html'
    }
  })

  .directive('ngConstancia', function() {
    return {
      restrict: 'EA',scope: {ngModel: '=',},templateUrl: 'tmpl/constancia.html'
    }
  })

  .directive('ngPerfil', function() {
    return {
      restrict: 'EA',scope: {ngModel: '=',},templateUrl: 'tmpl/perfil.html'
    }
  })

  .directive('ngMenu', function() {
    return {
      restrict: 'EA',scope: {ngModel: '=',},templateUrl: 'tmpl/menu.html'
    }
  })

  .directive('ngLoginModal', function() {
    return {
      restrict: 'EA',scope: {ngModel: '=',},templateUrl: 'tmpl/loginmodal.html'
    }
  })

  .directive('ngLeccionModal', function() {
    return {
      restrict: 'EA',scope: {ngModel: '=',},templateUrl: 'tmpl/leccionmodal.html'
    }
  })


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

    $scope.salir = function(){
      if(confirm("Esta seguro de Salir de Optimus Learning")){
        // var gui = require('nw.gui');
        // gui.Window.get().close(true);
        win.close();
      }
    };

  }])

  .controller('ClasesController', ['Entorno','$rootScope',function(Entorno,$rootScope) {

    var clase = this;
    clase.activaClase = function($event,nombre,color){
      Entorno.NombreClaseElegida = nombre;
      var contenedor = $($event.target).parents(".hvr-underline-reveal");
      $("#p2 .bannerTitle img").attr("src",$("img",contenedor).attr("src"));
      $rootScope.$broadcast('ClaseElegida', {ClaseElegida:true});
      $("#p2 .bannerTitle").css({"background":color})
    };
  }])

  .controller('SessionController', ['$scope',function($scope) {

    $("#loginModal").modal({show:true, keyboard:false, backdrop: false});
    $('#loginModal').on('hidden.bs.modal', function (event) {
      $(".initBlur").removeClass("initBlur");
    });

    $scope.iniciar = function($event){
      $event.preventDefault();
      $("#loginModal").modal('hide');
    };

    $scope.iniciarUsuarioSel = function(){
      $("#loginModal").modal('hide');
    };

  }])

  .controller('TreeController', ['$scope',function($scope) {

    $('#leccionModal').on('shown.bs.modal', function (event) {
      //$("#leccionModal .modal-body").html('<embed width="100%" height="100%" name="plugin" src="swf/outlook_2010/lesson/OU10010101L.swf" type="application/x-shockwave-flash">');
      //require('child_process').execFile("main/swf/outlook_2010/lesson/OU10010101L.swf",{},{},function(){});
      //require('child_process').execFile("main/bin/container",{},{},function(){});
      //$(".modal-dialog",$(this)).css({"top":"1"});
      $("#leccionModal .modal-dialog").attr("style","top:0px");
      $("#leccionModal .modal-dialog").removeAttr('style');
    });

    $('#leccionModal').on('hidden.bs.modal', function (event) {
      $("#leccionModal .modal-body").html('');
    });

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

  location.hash="#t1";

})();