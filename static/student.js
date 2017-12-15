let htmlParams = new Object;
function setup(inParams) {
	htmlParams = inParams;
	main();
}

function main() {
	let stdntMarks;
	let curr;
	let isExam = false;
	let imprmnt = null;
	let uid = htmlParams.uid;
	let exam = htmlParams.exam;
	let graphFuncs = [getStdntMarks, setImprmnt];
	let currList = ['stdntMarks', 'imprmnt'];
	gs.graphFuncs = graphFuncs;
	gs.currList = currList;
	let prevPercents = htmlParams.prevPercents;
	let prevPertiles = htmlParams.prevPertiles;
	let chngPercent = htmlParams.chngPercent;
	let chngPertile = htmlParams.chngPertile;
	prevPercents = prevPercents != '[]' 
				   ? prevPercents.slice(1, -1).split(', ').map(parseFloat)
				   : null;
	prevPertiles = prevPertiles != '[]' 
				   ? prevPertiles.slice(1, -1).split(', ').map(parseFloat)
				   : null;

	if (exam == '') {
		$('#exam').html('All');
		isExam = true;
	}
	else {
		$('#exam').html(exam);
	}
	if (parseFloat(chngPercent) > 0) {
		let text = $('#chngPercent').text()
		$('#chngPercent').text('+' + text)
	}
	if (parseFloat(chngPertile) > 0) {
		let text = $('#chngPertile').text()
		$('#chngPertile').text('+' + text)
	}
	function getStdntMarks(plot=true) {
		if (!stdntMarks){
			$.ajax({
				url: 'getMarks?uid=' + uid + '&exam=' + exam,
				async: false,
				success: function(result){
					stdntMarks = result.total;
					if (isExam) {
						for (let i=0; i < 4; i++) {
							stdntMarks[i] = stdntMarks[i] / 300 * 100;
						}
						for (let i=4; i < 6; i++) {
							stdntMarks[i] = stdntMarks[i] / 625 * 100;
						}
					}
					else if (exam[0] == 'S') {
						stdntMarks[0] = stdntMarks[0] / 125 * 100;
					}
				}
			});
		}
		if (plot) {
			drawGraph('bar', stdntMarks, !isExam);
		}
	}

	if (!(prevPercents && prevPertiles)) {
		$('#imprmntDot').remove();
		$('#next').hide();
		let graphIndex = gs.currList.indexOf('imprmnt');
		graphFuncs.splice(graphIndex, 1);
		gs.currList.splice(graphIndex, 1);
	}
	function setImprmnt() {
		if (prevPercents && prevPertiles) {
			imprmnt = new Object();
			imprmnt.percents = prevPercents;
			imprmnt.pertiles = prevPertiles;
			drawGraph('line', imprmnt);
		}
		curr = 'imprmnt';
	}


	function resized() {
		drawGraph('bar', stdntMarks, !isExam);
		if (imprmnt) {
			drawGraph('line', imprmnt);
		}
	}

	var resizeId;
	$(window).resize(function() {
		clearTimeout(resizeId);
		resizeId = setTimeout(resized, 49);
	});
	gs.setup();
}