// Load native UI library
var gui = require('nw.gui');
//or global.window.nwDispatcher.requireNwGui() (see https://github.com/rogerwang/node-webkit/issues/707)
// Get the current window
var win = gui.Window.get();
//win.showDevTools();

// var nStore = require('nstore');
// var qnStore = nStore.extend(require('nstore/query')());
var low = require('lowdb');
//var db = low('db.json');
var UsuariosDB = low('usuarios.json', {
  autosave: false, // automatically save database on change (default: true)
  async: true     // asyncrhonous write (default: true)
});

var perfiles = UsuariosDB('perfiles');
var app = express();

app.get('/clase', function(req, res){
  res.send('swf/OU10010102L.swf');
});

app.listen(3000);

// var store = qnStore.new('main/bin/bd/outlook/contenido.db', function (a,b,c) {
//   store.find("",function(a,b,c){
//     for(variable in b){
//       db('contenido').push(b[variable]);
//     }
//   });
// });

// var pp = db('contenido')
//   .chain()
//   .where({ Leccion: 'OU10010100' })
//   .value();

// console.log(pp);

(function(){

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

  location.hash="#t1";

  angular.module('ol', [])
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
    return {restrict: 'E',templateUrl: 'tmpl/lecciones.html',}
  })
  .directive('ngProgreso', function() {
    return {restrict: 'E',templateUrl: 'tmpl/progreso.html'}
  })
  .directive('ngPerfil', function() {
    return {restrict: 'E',templateUrl: 'tmpl/perfil.html'}
  })
  .directive('ngMenu', function() {
    return {restrict: 'E',templateUrl: 'tmpl/menu.html'}
  })
  .directive('ngLoginModal', function() {
    return {restrict: 'E',templateUrl: 'tmpl/loginmodal.html'}
  })
  .directive('ngLeccionModal', function() {
    return {restrict: 'E',templateUrl: 'tmpl/leccionmodal.html'}
  })

  .value("currentUser",{})

  .controller('MenuController', ['Entorno','$scope','$rootScope',function(Entorno,$scope,$rootScope) {

    $scope.ClaseElegida = Entorno.ClaseElegida;

    $scope.$on('ClaseElegida', function(event, mass) {
      Entorno.ClaseElegida = mass.ClaseElegida;
      $scope.ClaseElegida = mass.ClaseElegida;
    });

    $scope.inicio = function(){
      Entorno.ClaseElegida = false;
      $rootScope.activeclass = false;
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
      $("#p2 .bannerTitle").css({"background":color});
      $rootScope.activeclass = true;
    };
  }])

  .controller('SessionController', ['$scope','$rootScope',function($scope,$rootScope) {

    $("#loginModal").modal({show:true, keyboard:false, backdrop: false});
    $('#loginModal').on('hidden.bs.modal', function (event) {
      $(".initBlur").removeClass("initBlur");
    });

    var usuariosList = perfiles.chain().value();

    $scope.usuariosList = JSON.parse(
      JSON.stringify(usuariosList, function (key, val) {
       if (key == '$$hashKey') {
         return undefined;
       }
       return val;
      })
    );

    $scope.iniciar = function($event){
      $event.preventDefault();
      if($scope.usuariosList.length < 5){
        $scope.fr["CursosCompletados"] = [];
        perfiles.push($scope.fr);
        UsuariosDB.save();
        $("#loginModal").modal('hide');
      }else{
        alert("El limite de usuarios es de 5")
      }
      //perfiles
    };

    $scope.iniciarUsuarioSel = function(user){
      $("#loginModal").modal('hide');
      $rootScope.currentUser = user;
    };

  }])

  .controller('PerfilController', ['$scope','$rootScope',function($scope,$rootScope) {

    $scope.iniciar = function($event){
      $event.preventDefault();
      console.log(perfiles.chain().where({Id:$rootScope.currentUser.Id}).value());
    };


  }])

  .controller('TreeController', ['$scope','$rootScope','Entorno',function($scope,$rootScope,Entorno) {

    var leccionesDB = null;
    var contenido = null;
    $rootScope.activeclass = false;

    $rootScope.$watch('activeclass', function(newValue, oldValue) {
      if(newValue){  
        if(contenido === null){        
          leccionesDB = low('db.json', {
            autosave: false, // automatically save database on change (default: true)
            async: true     // asyncrhonous write (default: true)
          });
          contenido = leccionesDB('contenido');
        }  

        $scope.searchLccion = "";
        $scope.cntndo = contenido.chain().where({Titulo:"",Subtema:"",Prgrma:Entorno.NombreClaseElegida}).sortBy("Leccion").value();
        $rootScope.crrntLccion = "";
      }
    });


    $('#leccionModal').on('shown.bs.modal', function (event) {

      $("#leccionModal .modal-body").html('<embed width="100%" height="100%" name="plugin" src="bin/swf/outlook_2010/lesson/'+$rootScope.crrntLccion+'L.swf" type="application/x-shockwave-flash">');
      
      var CursosCompletados = perfiles.chain().where({Id:$rootScope.currentUser.Id})
      .value()[0].CursosCompletados
      var found = false;
      for (var i = 0; i < CursosCompletados.length; i++) {
        if(CursosCompletados[i] == $rootScope.crrntLccion){
          found = true;
        }
      }

      if(!found){
        CursosCompletados.push($rootScope.crrntLccion);
        $rootScope.currentUser.CursosCompletados.push($rootScope.crrntLccion);
        $rootScope.$apply();
      }

      UsuariosDB.save();

      $("#leccionModal .modal-dialog").attr("style","top:0px");
      $("#leccionModal .modal-dialog").removeAttr('style');
    });

    $scope.getcntndo = function(tma){
      var nvl1 = tma.Leccion.substring(0,6);
      var arr1 = [];
      //var nvl2 = parseInt(tma.split("OU")[1].substring(4,8),10);
      var cntndo1 = contenido.chain().where({Titulo:"",Tema:"",Prgrma:Entorno.NombreClaseElegida}).sortBy("Leccion").value();
      for(io in cntndo1){
        if(cntndo1[io].Leccion.indexOf(nvl1)>-1){
          arr1.push(cntndo1[io]);
        }
      }
      return arr1;
    };

    $scope.getcntndo2 = function(tma){
      var nvl1 = tma.Leccion.substring(0,8);
      var arr1 = [];
      var cntndo1 = contenido.chain().where({Tema:"",Subtema:"",Prgrma:Entorno.NombreClaseElegida}).sortBy("Leccion").value();
      for(io in cntndo1){
        if(cntndo1[io].Leccion.indexOf(nvl1)>-1){
          arr1.push(cntndo1[io]);
        }
      }

      var crsoscmpltdos = $rootScope.currentUser.CursosCompletados;

      for (var i = 0; i < arr1.length; i++) {
        for (var y = 0; y <  crsoscmpltdos.length; y++) {
          if(crsoscmpltdos[y] === arr1[i].Leccion){
            arr1[i].ready = 1;
          }
        }
      }

      return arr1;
    };


    $scope.getcntndobsqda = function(){
      var cntndo1 = contenido.chain().where({Tema:"",Subtema:"",Prgrma:Entorno.NombreClaseElegida}).sortBy("Leccion").value();
      return cntndo1;
    };

    $rootScope.porcentaje = function(){
      var counter = 0;
      var cntndo1 = contenido.chain()
      .where({Tema:"",Subtema:"",Prgrma:Entorno.NombreClaseElegida}).sortBy("Leccion").value().length;
      //cntndo1 = cntndo1 - $(".completeLeccion:visible").length;
      //console.log($(".completeLeccion:visible").length);
      $(".completeLeccion").each(function(){
          if($(this).attr("data-status") == 1){
            counter++;
          }
      });
      cntndo1 = Math.trunc(((counter*100)/cntndo1));
      return cntndo1;
    };

    $rootScope.getcntndobsqdaCurrent = function(leccion){
      var cntndo1 = contenido.chain().where({Tema:"",Subtema:"",Prgrma:Entorno.NombreClaseElegida}).sortBy("Leccion").value();
      var obj = {};
      var foundlccion = 0;
      for (var i = 0; i < cntndo1.length; i++) {
        if(cntndo1[i].Leccion === leccion){
          foundlccion = i;
          break;
        }
      }
      if(cntndo1.length){
        if(foundlccion > 0 && foundlccion < cntndo1.length-1){
          obj["aLeccion"] = cntndo1[foundlccion-1].Leccion;
          obj["sLeccion"] = cntndo1[foundlccion+1].Leccion;
        }else if(foundlccion === 0){
          obj["sLeccion"] = cntndo1[foundlccion+1].Leccion;
        }else if(foundlccion === cntndo1.length-1){
          obj["aLeccion"] = cntndo1[foundlccion-1].Leccion;
        }
        obj["nmbreLeccion"] = cntndo1[foundlccion].Titulo;
        return obj;
      }else{
        return null;
      }

    };

    $('#leccionModal').on('hidden.bs.modal', function (event) {
      $("#leccionModal .modal-body").html('');
    });

    $rootScope.getLeccionGlobal = function(lccion) {
      $("#leccionModal").modal('hide');

      setTimeout(function(){      
        $rootScope.crrntLccion = lccion;
        $rootScope.crrntOptLccion =  $rootScope.getcntndobsqdaCurrent(lccion);
        $("#leccionModal").modal({show:true, keyboard:false});
        $rootScope.$apply();
      }, 500);

    };

    $scope.getLeccion = function(lccion) {
      $rootScope.crrntLccion = lccion;
      $rootScope.crrntOptLccion =  $rootScope.getcntndobsqdaCurrent(lccion);
      $("#leccionModal").modal({show:true, keyboard:false});
    };

    $scope.expand = function($event,l) {
      $scope.l = l;
      var childtable = $($event.target).parents(".childtable");
      if(childtable.length){
        $(".childtable tbody").addClass("hide");
        $("tbody",childtable).removeClass("hide");
      }
    };

  }])

  .controller("ProgresoCtrl", ['$scope',function ($scope) {
  }]);
})();