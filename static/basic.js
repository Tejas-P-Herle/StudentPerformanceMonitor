function drawGraph(graph, marks, exams=false) {
	if (graph == "bar") {
		google.charts.load("current", {packages:["bar"]});
		google.charts.setOnLoadCallback(function() {
			data = barMTDT(marks);
			title='';
			barGraph(data, title);
		});
	} else if (graph == "pie") {
		google.charts.load("current", {packages:["corechart"]});
		google.charts.setOnLoadCallback(function() {
			pieGraph(pieMTDT(marks, exams));
		});
	} else if (graph == "line") {
		google.charts.load('current', {'packages':['corechart']});
		google.charts.setOnLoadCallback(function() {
			lineGraph(lineMTDT(marks));
		});
	}
}

// MTDT: Marks To DataTable

function pieMTDT(marks, exams) {
	let data = new google.visualization.DataTable();
	let params;
	let titles;
	if (!exams) {
		params = ['I_Language', 'II_Language', 'III_Language', 'Maths', 'Science', 'Social'];
		titles = ['Subjects', 'Strength'];
	}
	else {
		params = ['FA1', 'FA2', 'FA3', 'FA4', 'SA1', 'SA2'];
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


function lineMTDT(marks) {
	let data = new google.visualization.DataTable();
	let exams = ['FA1', 'FA2', 'SA1', 'FA3', 'FA4', 'SA2'];
	data.addColumn('string', 'Exams');
		
	for (let i=0; i < marks.name.length; i++) {
		data.addColumn('number', marks.name[i]);
	}
	data.addRows(6);
	for (let j=0; j < 6; j++) {
		data.setCell(j, 0, exams[j]);
		for (let i=0; i < marks.name.length; i++) {
			data.setCell(j, i + 1, marks.percent[i][j]);
		}
	}
	return data;
}

function barMTDT(marks) {
	if (marks.ppt && marks.activity && marks.total) {
		let ppt = marks.ppt;
		let activity = marks.activity;
		let total = marks.total;
		if (exams) {
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
		let data = new google.visualization.DataTable()
		data.addColumn('string', 'Name');
		data.addColumn('string', 'Total');
		
		
		for (let i=marks.name.length - 1; i > -1 ; i--) {
			data.addRow([marks.name[i], marks.total[i]]);
		}
		return data;
	}
}

function pieGraph(data) {
	var options = {
	  title: 'Wheel of Performance',
	};

	var chart = new google.visualization.PieChart(document.getElementById('graph_div'));
	chart.draw(data, options);
}
function barGraph(data, title='', subtitle='') {
	$("#graph_div").html("")
	$("#graph_div").attr("id", "loading");

	var options = {
		hAxis: {
			slantedText:true,
			slantedTextAngle:90,
		}
	};
	$("#loading").attr("id", "graph_div");
	$("#graph_div").html("");
	$("#graph_div").height(window.innerHeight / 3);
	var chart = new google.charts.Bar(document.getElementById('graph_div'));
	chart.draw(data, google.charts.Bar.convertOptions(options));
}

function lineGraph(data) {
    var options = {
      title: 'Class Performance',
      curveType: 'function',
      legend: { position: 'bottom' }
    };

	var chart = new google.visualization.LineChart(document.getElementById('graph_div'));
	chart.draw(data, options);
}
