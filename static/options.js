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
	
	let titleClass = "<div class='params'>";
	let selectClass = "class='select'";
	let html = titleClass + "Standard: <select id='stndrd'" + selectClass + "><option selected>" + stndrd  + "</option></select></div>";
	html += titleClass + "Section: <select id='section'" + selectClass + "><option selected>"+ section + "</option></select></div>";
	html += titleClass + "Exam: <select id='exam'" + selectClass + "><option selected>" + exam + "</option></select></div>";
	html += "<a id='submit' class='button' onClick=submit()>Submit</a>"
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
