class ErrorObj{
    constructor (errorNo, div) {
        if (!(errorNo && div)) {
            throw('Insufficient Parameters');
        }
        this.div = '#' + div;
        this.options = new Options(this.div);
        this.errorDictionary = {
            'ER01': {'page': 'leaderboard', 'func': {'01': this.ER0101}},
            'ER02': {'page': 'student', 'func': {'01': this.ER0201, '02': this.ER0202}},
        };
        this.setErrorPage(errorNo);
    }

    setErrorPage(errorNo) {
        this.error = this.errorDictionary[errorNo.slice(0, 4)];
        this.options.page = this.error.page
        this.errorFunc = this.error.func[errorNo.slice(4, 6)];
        this.errorFunc();
    }

    ER0101() {
        this.options.setGradeOptions();
        this.options.setExamOptions();
        this.options.renderSubmitButton();
    }

    ER0201() {
        let webArgsRaw = location.search.substr(1).split('&');
        let webArgs = [];
        let options = this.options;
        webArgsRaw.forEach(function(webArg) {
            let arg = webArg.split('=');
            webArgs[arg[0]] = arg[1];
        });
        $.ajax({
            url: '/getStudents' + location.search.substr(0),
            async: false,
            success: function(response) {
                let students = response;
                options.setStudentOptions(students);
            }
        })
        options.setExamOptions();
        options.renderSubmitButton();
    }

    ER0202() {
        this.options.setGradeOptions();
        this.options.renderSubmitButton();
    }
}