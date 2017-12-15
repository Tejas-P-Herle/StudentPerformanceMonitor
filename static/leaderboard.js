function setup() {
	$('#previous').hide();
	main();
}

function main(){
	let marks;
	let classPercent;
	let classPertile;
	let classPercentImpr;
	let classPertileImpr;
	let curr;
	let examParam = window.location.search.substr(1).split('&');
	examParam = examParam.find(function(param) { return param.slice(0, 4) == 'exam' });
	examParam = examParam ? examParam.replace('exam=', '') : null;
	examParam = examParam == 'All' ? null : examParam;

	leaderboardOptions('options');
	var resizeId;
	$(window).resize(function() {
		clearTimeout(resizeId);
		resizeId = setTimeout(resized, 49);
	});
	
	function loading() {
		setLoading('graphDiv');
		centerLoading();
	}
	
	function getClassPercent(plot=true) {	
		loading();
		if (!classPercent) {
			$.ajax({
				url: "/getClassPercent" + window.location.search.substr(0),
				async: false,
				success: function(response){ classPercent = response; }
			});
		}
		if (plot) { 
			curr = 'percent';
			drawGraph('line', classPercent, isSubj=examParam); 
		}
	}

	function getClassPertile(plot=true) {
		loading();
		if (!classPertile) {
			$.ajax({
				url: "/getClassPertile" + window.location.search.substr(0),
				async: false,
				success: function(response){ classPertile = response; }
			});
		} 
		if (plot) { 
			curr = 'pertile';
			drawGraph('line', classPertile, isSubj=examParam); 
		}
	}

	function getClassPercentImpr(plot=true) {
		loading();
		if (!classPercentImpr) {
			$.ajax({
				url: "/getClassPercentImpr" + window.location.search.substr(0),
				async: false,
				success: function(response){ classPercentImpr = response; }
			});
		}
		if (plot) { 
			curr = 'percentImpr'; 
			drawGraph('line', classPercentImpr, isSubj=examParam); 
		}
	}

	function getClassPertileImpr(plot=true) {
		loading();
		if (!classPertileImpr) {
			$.ajax({
				url: "/getClassPertileImpr" + window.location.search.substr(0),
				async: false,
				success: function(response){ classPertileImpr = response; }
			});
		}
		if (plot) { 
			curr = 'pertileImpr';
			drawGraph('line', classPertileImpr, isSubj=examParam);
		}
	}

	if (examParam == 'FA1') {
		$('.dotImpr').remove();
		['percentImpr', 'pertileImpr'].forEach(function(element) {
			let graphIndex = gs.currList.indexOf(element);
			gs.graphFuncs.splice(graphIndex, 1);
			gs.currList.splice(graphIndex, 1);
		});
	}
	
	function resized () {
		gs.centerBtns();
		gs.replot();
		if ($('#loading')) {
			centerLoading();
		}
	}
	
	getClassPertile(false);
	if (examParam != 'FA1') {
		getClassPercentImpr(false);
		getClassPertileImpr(false);
	}
	gs = new GraphSwitcher();
	gs.graphFuncs = [getClassPercent, getClassPertile, getClassPercentImpr, getClassPertileImpr];
	gs.currList = ['percent', 'pertile', 'percentImpr', 'pertileImpr'];
	gs.setup();
}