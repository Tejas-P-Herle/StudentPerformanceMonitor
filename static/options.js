class Options{
    constructor(div, page) {
        if (div.charAt(0) != '#') {
            div = '#' + div;
        }
        this.div = div;
        this.page = page;
        this.examList = ['Exams', 'exam'];
        this.params = [];
        this.selected = [];
    }

    renderSubmitButton() {
        let html = "<button id='submit' class='btn btn-primary btn-block optionsBtn'>Submit</button>";
        $(this.div).append(html);
        let params = this.params;
        let selected = this.selected;
        let page = this.page;
        $('#submit').click(function() {
            params.forEach(function(param) {
                selected.push($('#' + param).val());
            });
            let webArgs = '?';
            for (let i=0; i < params.length; i++) {
                webArgs += params[i] + '=' + selected[i] + '&';
            }
            location.href = page + webArgs.slice(0, -1);
        });
    }

    renderSelect(label, id) {
        let optionsContOpen = "<div class='optionsCont'>";
        let optionsLabel = "<label for='" + id + "'>" + label + "</div>";
        let optionsSelect = "<select id='" + id + "' class='form-control'></select>";
        let optionsContClose = "</div>";
        let html = optionsContOpen + optionsLabel + optionsSelect + optionsContClose;
        $(this.div).append(html);
    }

    addSelectOptions(options, id) {
        id = '#' + id;
        try {
            options.forEach(function (opt) {
                $(id).append($('<option>', {
                    value: opt,
                    text: opt
                }));
            });
        }
        catch(e) {
            $.each(options, function(uid, name) {
                $(id).append($('<option>', {
                    value: uid,
                    text: name
                }));
            });
        }
    }

    setExamOptions() {
        this.params.push('exam');
        this.renderSelect(this.examList[0], this.examList[1]);
        this.addSelectOptions(['All'].concat(exams), 'exam');
    }

    setStudentOptions(students) {
        this.params.push('uid');
        let studentList = ['Student', 'uid'];
        this.renderSelect(studentList[0], studentList[1]);
        this.addSelectOptions(students, 'uid');
    }

    setStandardOptions() {
        this.params.push('standard');
        let standardList = ['Standard', 'standard'];
        this.renderSelect(standardList[0], standardList[1]);
        let standards = ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
        this.addSelectOptions(standards, 'standard');
    }

    setSectionOptions() {
        this.params.push('section');
        let sections = ['A', 'B', 'C'];
        let sectionList = ['Section', 'section'];
        this.renderSelect(sectionList[0], sectionList[1]);
        this.addSelectOptions(sections, 'section');
    }

    setGradeOptions() {
        this.setStandardOptions();
        this.setSectionOptions();
    }
}