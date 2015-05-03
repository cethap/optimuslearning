var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/pp', function(req, res, next) {

	require('fs').realpath('main/bin', function (err, resolvedPath) {
		if (err) throw err;
		require('child_process').exec(resolvedPath+'\\boxcutter\\boxcutter.exe  -f "'+resolvedPath+'\\tmp'+'\\'+(new Date()).getTime()+'.png"',function(a,b,c){
			res.send({accion:"sigua",acction:[a,b,c]});
		});
	});

});

module.exports = router;
