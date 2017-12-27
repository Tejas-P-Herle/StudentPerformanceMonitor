let subjs = ['I_Language', 'II_Language', 'III_Language', 'Maths', 'Science', 'Social'];
let exams = ['FA1', 'FA2', 'SA1', 'FA3', 'FA4', 'SA2'];
let testElem;
function setLoading(graphObj='graphDiv') {
    let id = (graphObj == 'graphDiv') ? 'loading' : 'loading2';
	$('#' + graphObj).html('<div id="' + id + '" class="loading"></div>');
}

function centerLoading(graphObj='#graphDiv') {
    let loading = (graphObj == '#graphDiv') ? '#loading' : '#loading2';
	$(loading).css('top', ($(graphObj).height() / 2) - 46);
	$(loading).css('left', ($(graphObj).width() / 2) - 46);
}

function drawGraph(graph, marks, isSubj=false, highLightLine=false, graphObj='graphDiv') {
	if (graph == "bar") {
		google.charts.load("current", {packages:["bar"]});
		google.charts.setOnLoadCallback(function() {
			barGraph(barMTDT(marks, isSubj), graphObj);
		});
	} else if (graph == "line") {
		google.charts.load('current', {'packages':['corechart']});
		google.charts.setOnLoadCallback(function() {
			data = lineMTDT(marks, isSubj);
			lineGraph(data, graphObj, highLightLine);
		});
	}
}

// MTDT: Marks To DataTable

function pieMTDT(marks, isExam) {
	let data = new google.visualization.DataTable();
	let params;
	let titles;
	if (!isExam) {
		params = subjs;
		titles = ['Subjects', 'Strength'];
	}
	else {
		params = exams;
		titles = ['Exams', 'Performance'];
	}
	return google.visualization.arrayToDataTable([
		[titles[0], titles[1]],
		[params[0], marks[0]],
		[params[1], marks[1]],
		[params[2], marks[2]],
		[params[3], marks[3]],
		[params[4], marks[4]],
		[params[5], marks[5]]
	]);
}


function lineMTDT(marks, isSubj) {
	let data = new google.visualization.DataTable();
	if (marks.name) {
		let params = isSubj ? subjs : exams;
		let title = isSubj ? 'Subject' : 'Exams';
		data.addColumn('string', title);
			
		for (let i=0; i < marks.name.length; i++) {
			data.addColumn('number', marks.name[i]);
		}
		if (!marks.subj) {
			data.addRows(6); // Change 6 to exams.length
		}
		if (marks.subj) {
			for (let i=0; i < marks.percent.length; i++) {
				data.addRow([exams[i]].concat(marks.percent[i]));
			}
			return data
		}
		else if (marks.percent) {
			for (let j=0; j < 6; j++) {
				data.setCell(j, 0, params[j]);
				for (let i=0; i < marks.name.length; i++) {
					data.setCell(j, i + 1, marks.percent[i][j]);
				}
			}
			return data;
		}
		else if (marks.pertile) {
			for (let j=0; j < 6; j++) {
				data.setCell(j, 0, params[j]);
				for (let i=0; i < marks.name.length; i++) {
					data.setCell(j, i + 1, marks.pertile[i][j]);
				}
			}
			return data;
		}
		else if (marks.percentImpr) {
			for (let j=0; j < 6; j++) {
				data.setCell(j, 0, params[j]);
				for (let i=0; i < marks.name.length; i++) {
					data.setCell(j, i + 1, marks.percentImpr[i][j]);
				}
			}
			return data;
		}
		else if (marks.pertileImpr) {
			for (let j=0; j < 6; j++) {
				data.setCell(j, 0, params[j]);
				for (let i=0; i < marks.name.length; i++) {
					data.setCell(j, i + 1, marks.pertileImpr[i][j]);
				}
			}
			return data;
		}
	}
	data.addColumn('string', 'Exams');
	data.addColumn('number', 'Percentage');
	data.addColumn('number', 'Percentile');
	
	for (let i=0; i < marks.percent.length; i++) {
		data.addRow([exams[i], marks.percent[i], marks.pertile[i]]);
	}
	return data;
}

function barMTDT(marks, isSubj) {
	if (marks.ppt && marks.activity && marks.total) {
		let ppt = marks.ppt;
		let activity = marks.activity;
		let total = marks.total;
		if (isSubj) {
			return google.visualization.arrayToDataTable([
				['Exams', 'PPT', 'Activity', 'Total'],
				['FA1', ppt[0], activity[0], total[0]],
				['FA2', ppt[1], activity[1], total[1]],
				['FA3', ppt[2], activity[2], total[2]],
				['FA4', ppt[3], activity[3], total[3]],
				['SA1', ppt[4], activity[4], total[4]],
				['SA2', ppt[5], activity[5], total[5]]
			]);
		}
		return google.visualization.arrayToDataTable([
			['Subjects', 'PPT', 'Activity', 'Total'],
			['I Lan', ppt[0], activity[0], total[0]],
			['II Lan', ppt[1], activity[1], total[1]],
			['III Lan', ppt[2], activity[2], total[2]],
			['Math', ppt[3], activity[3], total[3]],
			['Science', ppt[4], activity[4], total[4]],
			['Social', ppt[5], activity[5], total[5]]
		]);
	}
	else if (marks.name) {
		let data = new google.visualization.DataTable();
		data.addColumn('string', 'Name');
		if (marks.total) {
			data.addColumn('string', 'Total');
		
			for (let i=marks.name.length - 1; i > -1 ; i--) {
				data.addRow([marks.name[i], marks.total[i]]);
			}
		}
		else if (marks.percent) {
			data.addColumn('string', 'Percentage');
		
			for (let i=0; i < marks.name.length; i++) {
				data.addRow([marks.name[i], String(marks.percent[i])]);
			}
		}
		return data;
	}
	else {
		let data = new google.visualization.DataTable();
		if (isSubj) { data.addColumn('string', 'Subjects'); }
		else { data.addColumn('string', 'Exams'); }
		data.addColumn('number', 'Marks');
		if (isSubj) {
			for (let i=0; i < marks.length; i++) {
				data.addRow([subjs[i], marks[i]]);
			}
		}
		else {
			for (let i=0; i < marks.length; i++) {
				data.addRow([exams[i], marks[i]]);
			}
		}
		return data;
	}
}

function barGraph(data, graphObj, options) {
	options = {
		hAxis: {
			slantedText:true,
			slantedTextAngle:90,
		},
		legend: {position: 'none'}
	};	
	var chart = new google.charts.Bar(document.getElementById(graphObj));
	chart.draw(data, google.charts.Bar.convertOptions(options));
}

function lineGraph(data, graphObj, highLightLine) {
    let graph = (graphObj == 'graphDiv') ? 'graphEntity1' : 'graphEntity2';
	let options = {
		curveType: 'function',
		legend: {'position': 'bottom'},
		chartArea: {width: $('#' + graph).width() - 100, left:50, top:50},
		series: {},
	};
	for (let i=0; i < data.ng.length - 1; i++) {
		options.series[i] = {lineWidth: 2};
	}

	if ((data.getNumberOfColumns() - 1) == 4) {
		options.colors = ['#109618', '#FF9900', '#3366CC', '#DC3912'];
	}
	let chart = new google.visualization.LineChart(document.getElementById(graphObj));
	if (highLightLine) {
	    let prevSel = null;
        let selLineWidth = '7';
        let gElemIndex;
        let lines;
        let linesParent;
        google.visualization.events.addListener(chart, 'select', function() {
            let sel = chart.getSelection();
            if (sel.length > 0) {
                sel = sel[0];
                if (sel.row == null) {
                    chart.setSelection();
                    if (prevSel != null) {
                        lines[lines.length - 1].remove();
                    }
                    if (prevSel != sel.column - 1) {
                        let temp = lines[sel.column - 1].children[3];
                        linesParent.append(temp);
                        lines[lines.length - 1].attributes[2].nodeValue = selLineWidth;
                        prevSel = sel.column - 1;
                    } else { prevSel = null; }
                }
                else if (prevSel != null) {
                    lines[lines.length - 1].remove();
                    prevSel = null;
                }
            }
        });

        chart.draw(data, options);
        let gLen = $('g').length;
        for (let i=0; i<gLen; i++) {
            if ($('g')[i].childNodes.length == data.getNumberOfColumns() - 1) {
                lines = $('g')[i].children;
                testElem = lines;
                if ($(lines).parents('div#' + graphObj).length == 0) { continue; }
                if ($(lines).has('rect').length == 1) { continue; }
                linesParent = $('g')[i];
                break;
            }
        }
    }
    else { chart.draw(data, options); }
}