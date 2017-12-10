let subjs = ['I_Language', 'II_Language', 'III_Language', 'Maths', 'Science', 'Social'];
let exams = ['FA1', 'FA2', 'FA3', 'FA4', 'SA1', 'SA2'];

function drawGraph(graph, marks, isSubj=false, options=null) {
	if (graph == "bar") {
		google.charts.load("current", {packages:["bar"]});
		google.charts.setOnLoadCallback(function() {
			title='';
			barGraph(barMTDT(marks, isSubj), title, options);
		});
	} else if (graph == "pie") {
		google.charts.load("current", {packages:["corechart"]});
		google.charts.setOnLoadCallback(function() {
			pieGraph(pieMTDT(marks, isSubj), options);
		});
	} else if (graph == "line") {
		google.charts.load('current', {'packages':['corechart']});
		google.charts.setOnLoadCallback(function() {
			lineGraph(lineMTDT(marks, isSubj), options);
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
	let params = isSubj ? subjs : exams;
	let Param = 
	data.addColumn('string', 'Exams');
		
	for (let i=0; i < marks.name.length; i++) {
		data.addColumn('number', marks.name[i]);
	}
	data.addRows(6);
	for (let j=0; j < 6; j++) {
		data.setCell(j, 0, params[j]);
		for (let i=0; i < marks.name.length; i++) {
			data.setCell(j, i + 1, marks.percent[i][j]);
		}
	}
	return data;
}

function barMTDT(marks, isExam) {
	if (marks.ppt && marks.activity && marks.total) {
		let ppt = marks.ppt;
		let activity = marks.activity;
		let total = marks.total;
		if (isExam) {
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
	else if (marks.name && marks.total) {
		let data = new google.visualization.DataTable();
		data.addColumn('string', 'Name');
		data.addColumn('string', 'Total');
		
		
		for (let i=marks.name.length - 1; i > -1 ; i--) {
			data.addRow([marks.name[i], marks.total[i]]);
		}
		return data;
	}
	else if (marks.name && marks.percent) {
		let data = new google.visualization.DataTable();
		data.addColumn('string', 'Name');
		data.addColumn('string', 'Percentage');
		
		for (let i=0; i < marks.name.length; i++) {
			data.addRow([marks.name[i], String(marks.percent[i])]);
		}
		return data;
	}
}

function pieGraph(data, options) {
	if (!options) {
		 options = {
			title: 'Wheel of Performance',
		};
	}

	var chart = new google.visualization.PieChart(document.getElementById('graph_div'));
	chart.draw(data, options);
}
function barGraph(data, title, options, subtitle='') {
	$("#graph_div").html("")
	$("#graph_div").attr("id", "loading");
	if (!options) {
		options = {
			hAxis: {
				slantedText:true,
				slantedTextAngle:90,
			}
		};	
	}
	$("#loading").attr("id", "graph_div");
	$("#graph_div").html("");
	$("#graph_div").height(window.innerHeight / 3);
	var chart = new google.charts.Bar(document.getElementById('graph_div'));
	chart.draw(data, google.charts.Bar.convertOptions(options));
}

function lineGraph(data, options) {
    if (!options) {
		options = {
		title: 'Class Performance',
		curveType: 'function',
		legend: { position: 'bottom' }
		};
	}
	
	var chart = new google.visualization.LineChart(document.getElementById('graph_div'));
	chart.draw(data, options);
}

//
// ---------------------
// END OF GRAPH SECTION
// ---------------------
//

function submit() {
	let options = ['stndrd', 'section', 'exam'];
	let params = {'stndrd': null, 'section': null, 'exam': null};
	$.each(options, function (_, option) {
		params[option] = $('#' + option).val();
	});
	if (!params.exam) {
		params.exam = 'all';
	}
	if (!(params.stndrd && params.section)) {
		console.log('Please provide both standard and section');
	}
	else {
		location.href = '?stndrd=' + params.stndrd + '&section=' + params.section + '&exam=' + params.exam
	}
}

function strtsWithStndrd(getParam) {
	return getParam.slice(0, 6) == 'stndrd';
}
function strtsWithSection(getParam) {
	return getParam.slice(0, 7) == 'section';
}
function strtsWithExam(getParam) {
	return getParam.slice(0, 4) == 'exam';
}

function leaderboardOptions(div) {
	let options = {'stndrd': 'Standard', 'section': 'Section', 'exam': 'Exam'};
	getParams = location.search.substr(1).split('&');
	
	let stndrd = getParams.find(strtsWithStndrd)
	if (stndrd) {
		stndrd = stndrd.replace('stndrd=', '');
	}
	else {
		stndrd = '10';
	}

	let section = getParams.find(strtsWithSection)
	if (section) {
		section = section.replace('section=', '');
	}
	else {
		section = 'A';
	}
	let exam = getParams.find(strtsWithExam)
	if (exam) {
		exam = exam.replace('exam=', '');
	}
	else {
		exam = 'All';
	}
	
	let html = "Standard: <select id='stndrd'><option selected>" + stndrd  + "</option></select>";
	html += "Section: <select id='section'><option selected>"+ section + "</option></select>";
	html += "Exam: <select id='exam'><option selected>" + exam + "</option></select>";
	html += "<button id=submit onClick=submit()>Submit</button>"
	$('#' + div).html(html);

	let stndrds = ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
	let sections = ['A', 'B', 'C'];
	let exams = ['All', 'FA1', 'FA2', 'SA1', 'FA3', 'FA4', 'SA2'];
	
	stndrds.splice(stndrds.indexOf(stndrd), 1);
	sections.splice(sections.indexOf(section), 1);
	exams.splice(exams.indexOf(exam), 1);

	$.each(stndrds, function (_, stndrd) {
		$('#stndrd').append($('<option>', {
			value: stndrd,
			text: stndrd
		}));
	});

	$.each(sections, function (_, section) {
			$('#section').append($('<option>', { 
				value: section,
				text : section 
			}));
	});

	$.each(exams, function (_, exam) {
			$('#exam').append($('<option>', { 
				value: exam,
				text : exam 
			}));
	});
}
