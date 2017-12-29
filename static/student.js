let htmlParams = new Object;
function setup(inParams) {
	htmlParams = inParams;
	main();
}

function main() {
	let isExam = false;
	let imprmnt = null;
	let uid = htmlParams.uid;
	let exam = htmlParams.exam;
	$('#percent').html(htmlParams.totalPercent);
	$('#pertile').html(htmlParams.totalPertile);
	let percents = htmlParams.percents;

	let options = new Options('options', 'student');
	options.setGradeOptions();
	options.renderSubmitButton();

	let exams = ['FA1', 'FA2', 'SA1', 'FA3', 'FA4', 'SA2'];
	let gsTitleZero = (exam == '') ? "Student's Exams Performance" : "Student's Subject Strength";
    let gsTextListReplace = (exam == '') ? " subjects" : " exams";

	gs.graphFuncs = [getBarStdntPercent, getStdntPosPercent, getStdntPosPertile, setImprmnt];
	gs.currList = ['barStdntPercent', 'stdntPosPercent', 'stdntPosPertile', 'imprmnt'];
	gs.currTitleList = [gsTitleZero, "Student's Relative Percent", "Student's Relative Percentile", "Student's Percentage and Percentile Improvement"];
    gs.currTextList = htmlParams.card1Doc.replace(/&#34;/g, '"').replace(/&#39;/g, "'").split('.').slice(0, -1);
    ([0, 1, 2]).forEach(function(index) {
        gs.currTextList[index] = gs.currTextList[index].replace(gsTextListReplace, '');
    });

	gs2.graphFuncs = [getStdntPosILan, getStdntPosIILan, getStdntPosIIILan, getStdntPosMaths, getStdntPosScience, getStdntPosSocial];
	gs2.currList = ['stdntPosILan', 'stdntPosIILan', 'stdntPosIIILan', 'stdntPosMaths', 'stdntPosScience', 'stdntPosSocial'];
	gs2.currTitleList = ["Student's I Language Performance", "Student's II Language Performance", "Student's III Language Performance",
						 "Student's Maths Performance", "Student's Science Performance", "Student's Social Performance"];
    gs2.currTextList = htmlParams.card2Doc.replace(/&#34;/g, '"').replace(/&#39;/g, "'").split('.').slice(0, -1);

	let chngPercent = htmlParams.chngPercent;
	let chngPertile = htmlParams.chngPertile;
	let stdntPosPercent;
	let stdntPosPertile;
	let stdntPosSubj;
	let currVar;
	let stdntPos = {'name': ['Best', htmlParams.name, 'Average', 'Least']};

	let prevPercents = htmlParams.prevPercents;
	let prevPertiles = htmlParams.prevPertiles;
	barStdntPercent = prevPercents;
	prevPercents = prevPercents != '[]' 
				   ? prevPercents.slice(1, -1).split(', ').map(parseFloat)
				   : null;
	prevPertiles = prevPertiles != '[]' 
				   ? prevPertiles.slice(1, -1).split(', ').map(parseFloat)
				   : null;

	percents = percents != '[]'
				   ? percents.slice(1, -1).split(', ').map(parseFloat)
				   : null;

	if (exam == '') {
		$('#exam').html('All');
		isExam = true;
	}
	else {
		$('#exam').html(exam);
		$('.imprmntDot').remove();
		gs2.currList = null;
		gs2.graphFuncs = null;
		gs2 = null;
		gs.graphFuncs.pop();
		gs.currList.pop();
		gs.currTitleList.pop();
        $('#graphEntity2').remove();
	}

    if (chngPercent == 0) {
        $('.change_tr').remove()
    }
	if (parseFloat(chngPercent) > 0) {
		let text = $('#chngPercent').text()
		$('#chngPercent').text('+' + text)
	}
	if (parseFloat(chngPertile) > 0) {
		let text = $('#chngPertile').text()
		$('#chngPertile').text('+' + text)
	}
	
	function loading(graphObj) {
		setLoading(graphObj);
		centerLoading('#' + graphObj);
	}
	
	function plotBarGraph(curr, graphObj) {
		if (!currVar) { return -1; }
		gsObj = graphObj == 'graphDiv' ? gs : gs2;
		gsObj.curr = curr;
		drawGraph('bar', currVar, !isExam, false, graphObj);
	}
	
	function plotLineGraph(curr, graphObj) {
		if (!currVar) { return -1; }
		gsObj = (graphObj == 'graphDiv') ? gs : gs2;
		gsObj.curr = curr;
		drawGraph('line', currVar, !isExam, false, graphObj);
	}

	function ajaxFunc(url, callback) {
	    $.ajax({
	        url: url,
	        success: function(response) { callback(response) }
	    });
	}
	
	function getBarStdntPercent(graphObj) {
		loading(graphObj);
		currVar = exam ? percents : prevPercents;
		plotBarGraph('barStdntPercent', graphObj);
	}

	currListIndex = ['I_Lan', 'II_Lan', 'III_Lan', 'Maths', 'Science', 'Social'];

	function plotStdntPos(graphObj, percent, pertile, subj) {
	    if (!(percent || pertile || subj)) return -1;
	    stdntPos.percent = percent;
	    stdntPos.pertile = pertile;
	    stdntPos.subj = subj;
	    currVar = stdntPos;
	    gsObj = (graphObj == 'graphDiv') ? gs : gs2;
	    if (subj) currListVar = gsObj.currList[currListIndex.indexOf(subj)];
	    else currListVar = percent ? 'stdntPosPercent' : 'stdntPosPertile';
	    plotLineGraph(currListVar, graphObj)
	}

	function getStdntPosPercent(graphObj) {
		if (graphObj) loading(graphObj);
		function plot() { if (graphObj) plotStdntPos(graphObj, stdntPosPercent, null, null); }
		if (graphObj && stdntPosPercent) return plot();
        ajaxFunc('/getStdntPosPercent' + location.search.substr(0), function(response) {
            stdntPosPercent = response.percent;
            plot();
        });
	}

	function getStdntPosPertile(graphObj) {
		if (graphObj) loading(graphObj);
		function plot() { if (graphObj) plotStdntPos(graphObj, null, stdntPosPertile, null); }
		if (graphObj && stdntPosPertile) return plot();
		ajaxFunc('/getStdntPosPertile' + location.search.substr(0), function(response) {
			stdntPosPertile = response.pertile;
		    plot();
		});
	}

	function getStdntPosSubj(callback) {
		if (!stdntPosSubj) {
		    ajaxFunc('/getStdntPosSubj' + location.search.substr(0), function(response) {
					stdntPosSubj = response;
					callback();
			});
		}
	}
	
	function stdntPosSubjPlot(graphObj, subj) {
	    loading(graphObj);
	    function plot() { if (graphObj) plotStdntPos(graphObj, stdntPosSubj[subj], null, subj) }
		if (graphObj && stdntPosSubj) return plot();
		getStdntPosSubj(plot);
	}

	function getStdntPosILan(graphObj) { stdntPosSubjPlot(graphObj, 'I_Lan') }
	function getStdntPosIILan(graphObj) { stdntPosSubjPlot(graphObj, 'II_Lan') }
	function getStdntPosIIILan(graphObj) { stdntPosSubjPlot(graphObj, 'III_Lan') }
	function getStdntPosMaths(graphObj) { stdntPosSubjPlot(graphObj, 'Maths') }
	function getStdntPosScience(graphObj) { stdntPosSubjPlot(graphObj, 'Science') }
	function getStdntPosSocial(graphObj) { stdntPosSubjPlot(graphObj, 'Social') }

	function setImprmnt(graphObj) {
		loading(graphObj);
		if (prevPercents && prevPertiles) {
			imprmnt = new Object();
			imprmnt.percent = prevPercents;
			imprmnt.pertile = prevPertiles;
			currVar = imprmnt;
			plotLineGraph(currVar, graphObj);
		}
	}


	function resized() {
		gs.replot();
		if (gs2) {
		    gs2.replot();
		}
	}

	var resizeId;
	$(window).resize(function() {
		clearTimeout(resizeId);
		resizeId = setTimeout(resized, 49);
	});
	gs.setup();
	getStdntPosPertile();
	getStdntPosPercent();
	if (gs2) {
	    gs2.setup();
	}
}