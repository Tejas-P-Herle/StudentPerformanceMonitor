function setup(htmlParams) {
	$('#previous').hide();
	main(htmlParams);
}

function main(htmlParams){
	let marks;
	let classPercent;
	let classPertile;
	let classPercentImpr;
	let classPertileImpr;
	let currVar;
	let examParam = window.location.search.substr(1).split('&');
	examParam = examParam.find(function(param) { return param.slice(0, 4) == 'exam' });
	examParam = examParam ? examParam.replace('exam=', '') : null;
	examParam = (examParam == 'All') ? null : examParam;
	let gsTextListReplace = (!examParam) ? " a given exam" : " all exams";

    gs.graphFuncs = [getClassPercent, getClassPertile, getClassPercentImpr, getClassPertileImpr];
	gs.currList = ['percent', 'pertile', 'percentImpr', 'pertileImpr'];
	gs.currTitleList = ['Class Performance - Percent', 'Class Performance - Percentile',
	                    'Class Performance - Percent Improvement', 'Class Performance - Percentile Improvement'];
	gs.currTextList = htmlParams.card1Doc.replace(/&#34;/g, '"').replace(/&#39;/g, "'").split('.').slice(0, -1);
	([0, 1]).forEach(function(index) {
        gs.currTextList[index] = gs.currTextList[index].replace(gsTextListReplace, '');
    });
	let options = new Options('options', 'leaderboard');
	options.setGradeOptions();
	options.setExamOptions();
	options.renderSubmitButton();
	var resizeId;
	$(window).resize(function() {
		clearTimeout(resizeId);
		resizeId = setTimeout(resized, 49);
	});
	
	function loading() {
		setLoading();
		centerLoading();
	}
	
	function plotLineGraph(graphObj, curr) {
		if (!currVar) { return -1; }
		gs.curr = curr;
		drawGraph('line', currVar, examParam, true, graphObj);
	}

	function plotGraph(graphObj, currIn, currVarIn) {
	    if (graphObj) {
	        currVar = currVarIn;
	        plotLineGraph(graphObj, currIn);
	    }
	}

	function ajaxFunc(url, callback) {
	    $.ajax({
            url: url,
            success: function (response) { callback(response); }
        });
	}

	function plotClassMarks(graphObj, param, value) {
	    currVar = value;
	    plotLineGraph(graphObj, param);
	}
	
	function getClassPercent(graphObj) {
		loading();
		function plot() { if (graphObj) plotClassMarks(graphObj, 'percent', classPercent); }
		if (classPercent) return plot();
        ajaxFunc("/getClassPercent" + window.location.search.substr(0), function(response){
            classPercent = response;
            plot();
        });
	}

	function getClassPertile(graphObj) {
		loading();
		function plot() { if (graphObj) plotClassMarks(graphObj, 'pertile', classPertile); }
		if (classPertile) return plot();
        ajaxFunc("/getClassPertile" + window.location.search.substr(0), function(response){
            classPertile = response;
            plot();
        });
	}

	function getClassPercentImpr(graphObj) {
		loading();
		function plot() { if (graphObj) plotClassMarks(graphObj, 'percentImpr', classPercentImpr); }
		if (classPercentImpr) return plot();
        ajaxFunc("/getClassPercentImpr" + window.location.search.substr(0), function(response){
            classPercentImpr = response;
            plot();
        });
	}

	function getClassPertileImpr(graphObj) {
		loading();
		function plot() { if (graphObj) plotClassMarks(graphObj, 'pertileImpr', classPertileImpr); }
		if (classPertileImpr) return plot();
        ajaxFunc("/getClassPertileImpr" + window.location.search.substr(0), function(response){
            classPertileImpr = response;
            plot();
        });
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
		centerLoading();
	}
	
	getClassPertile('');
	if (examParam != 'FA1') {
		getClassPercentImpr('');
		getClassPertileImpr('');
	}
	gs.setup();
}