import os.path
import libs.setup
from libs.restrictIO import print_
from libs.sql import SQLFuncs
from libs.exams import Exams
from libs.grade import Grade
from libs.leaderboard import *
from libs.student import Student
from libs.getConfig import Config
from flask import Flask, render_template, request, jsonify, redirect, send_from_directory
from flask_compress import Compress
import sys

sys.path.__add__(['C:\\Users\\Tejas. P. Herle\\Programming\\Web\\StudentPerformanceMonitor\\libs\\'])
print_('File-application.py Importing-Complete')
print_('File-application.py Starting Setup')
app = Flask(__name__)
Compress().init_app(app)
SQL = SQLFuncs()
exams = ['FA1', 'FA2', 'SA1', 'FA3', 'FA4', 'SA2']


@app.route('/')
def index():
    return redirect("/home")


@app.route('/home')
def home():
    return render_template('home.html')


@app.route('/leaderboard')
def leaderboard():
    exam = request.args.get('exam')
    standard = request.args.get('standard')
    section = request.args.get('section')

    if not (standard and section):
        errorMsg = 'Please provide a standard and a section'
        errorTitle = 'Leaderboard-Selection'
        errorNo = 'ER0101'
        return render_template('error.html', errorTitle=errorTitle, errorMsg=errorMsg, errorNo=errorNo)

    if exam in [None, 'All']:
        exam = ''

    stats = list(Grade(standard, section).getStats(10, exam))

    stdntData = []
    for i in range(len(stats[0])):
        if type(stats[0][i]) != list:
            stdntData.append([stats[0][i], i + 1, stats[1][i], stats[2][i], stats[3][i], stats[4][i]])
        else:
            for j in range(len(stats[0][i])):
                stdntData.append([stats[0][i][j], i + 1, stats[1][i][j], stats[2][i], stats[3][i], stats[4][i]])
    with open(os.path.join(app.root_path, 'documentation') + '\\leaderboard\\card1Doc.txt', 'r') as file:
        card1Doc = file.read().replace('\n', '')
    return render_template('leaderboard.html', stdntData=stdntData + [exam], card1Doc=card1Doc)


@app.route('/getStdntPosPercent')
def getStdntPosPercent():
    uid = int(request.args.get('uid'))
    exam = request.args.get('exam')
    standard, section = SQL.getClass(uid)
    if exam in [None, 'All']:
        exam = ''
    percents = Grade(standard, section).getStdntPosPercent(uid, exam)
    return jsonify({'percent': percents})


@app.route('/getStdntPosPertile')
def getStdntPosPertile():
    uid = int(request.args.get('uid'))
    exam = request.args.get('exam')
    if exam in [None, 'All']:
        exam = ''
    standard, section = SQL.getClass(uid)
    pertiles = Grade(standard, section).getStdntPosPertile(uid, exam)
    return jsonify({'pertile': pertiles})


@app.route('/getStdntPosSubj')
def getStdntPosSubj():
    uid = int(request.args.get('uid'))
    exam = request.args.get('exam')
    if exam not in [None, 'All', '']:
        return jsonify({})
    standard, section = SQL.getClass(uid)
    stdtnPosSubj = Grade(standard, section).getStdntPosSubj(uid)
    return jsonify(stdtnPosSubj)


@app.route('/getClassPercent')
def getClassPercent():
    standard = request.args.get('standard')
    section = request.args.get('section')
    exam = request.args.get('exam')
    if exam in [None, 'All']:
        exam = ''
    names, percents = Grade(standard, section).getClassPercent(exam)
    return jsonify({'name': names, 'percent': percents})


@app.route('/getClassPertile')
def getClassPertile():
    standard = request.args.get('standard')
    section = request.args.get('section')
    exam = request.args.get('exam')
    if exam in [None, 'All']:
        exam = ''
    names, pertiles = Grade(standard, section).getClassPertile(exam)
    return jsonify({'name': names, 'pertile': pertiles})


@app.route('/getClassPercentImpr')
def getClassPercentImpr():
    standard = request.args.get('standard')
    section = request.args.get('section')
    exam = request.args.get('exam')
    if exam in [None, 'All']:
        exam = ''
    names, percentImprs = Grade(standard, section).getClassPercentImpr(exam)
    return jsonify({'name': names, 'percentImpr': percentImprs})


@app.route('/getClassPertileImpr')
def getClassPertileImpr():
    standard = request.args.get('standard')
    section = request.args.get('section')
    exam = request.args.get('exam')
    if exam in [None, 'All']:
        exam = ''
    names, pertileImprs = Grade(standard, section).getClassPertileImpr(exam)
    return jsonify({'name': names, 'pertileImpr': pertileImprs})


@app.route('/getMarks')
def getMarks():
    uid = request.args.get('uid')
    exam = request.args.get('exam')

    info = {'ppt': [], 'activity': [], 'total': []}
    if exam:
        marks = SQL.getMarks(uid, exam)
        info['ppt'] = marks[0::2]
        info['activity'] = marks[1::2]
        for i in range(6):
            info['total'].append(info['ppt'][i] + info['activity'][i])
    else:
        marks = Exams(uid)
        del marks['total'], marks['uid']
        for param in exams:
            ppt = marks[param]['PPT']
            activity = marks[param]['activity']
            info['ppt'].append(ppt)
            info['activity'].append(activity)
            info['total'].append(ppt + activity)
    return jsonify(info)


@app.route('/getStudents')
def getStudents():
    standard = request.args.get('standard')
    section = request.args.get('section')

    if not (standard or section):
        errorMsg = 'Please provide a grade and a section'
        errorTitle = 'Student-Selection'
        errorNo = 'ER0202'
        return render_template('error.html', errorTitle=errorTitle, errorMsg=errorMsg, errorNo=errorNo)

    return jsonify(dict(SQL.getStudents(standard, section)))


@app.route('/student')
def student():
    uid = request.args.get('uid')
    exam = request.args.get('exam')

    if not uid:
        standard = request.args.get('standard')
        section = request.args.get('section')
        if not (standard and section):
            return redirect('/getStudents')
        errorMsg = 'Please provide a student name and an exam'
        errorTitle = 'Student-Selection'
        errorNo = 'ER0201'
        return render_template('error.html', errorTitle=errorTitle, errorMsg=errorMsg, errorNo=errorNo)

    name = Student(uid).getName()
    if exam in [None, 'All']:
        exam = ''

    chngPercent = chngPertile = 0
    exmObj = Exams(uid)
    if exam:
        exmTotal = exmObj[exam]['total']
    else:
        exmTotal = exmObj['total']

    prevPercents = []
    prevPertiles = []
    for e in exams:
        prevPercents.append(exmObj.calcPercentage(e))
        prevPertiles.append(exmObj.calcPercentile(e))
    if exam not in ['', 'FA1']:
        examIndex = exams.index(exam)
        chngPercent = round(prevPercents[examIndex] - prevPercents[examIndex - 1], 2)
        chngPertile = round(prevPertiles[examIndex] - prevPertiles[examIndex - 1], 2)
    totalPercent = exmObj.calcPercentage('') if exam == '' else prevPercents[exams.index(exam)]
    totalPertile = exmObj.calcPercentile('') if exam == '' else prevPertiles[exams.index(exam)]

    with open(os.path.join(app.root_path, 'documentation') + '\\student\\card1Doc.txt', 'r') as file1:
        card1Doc = file1.read().replace('\n', '')

    with open(os.path.join(app.root_path, 'documentation') + '\\student\\card2Doc.txt', 'r') as file2:
        card2Doc = file2.read().replace('\n', '')

    return render_template('student.html', uid=uid, exam=exam, name=name, chngPercent=chngPercent,
                           chngPertile=chngPertile, exmTotal=exmTotal, prevPercents=prevPercents,
                           prevPertiles=prevPertiles, totalPercent=totalPercent, totalPertile=totalPertile,
                           card1Doc=card1Doc, card2Doc=card2Doc)


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/png')


@app.route('/logo.png')
def logo():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'logo.png', mimetype='image/png')


if __name__ == '__main__':
    # default = input('Use Default? <Y/N> ')
    # config = Config('config.ini', default[0].lower() == 'y')
    config = Config('config.ini')
    print_('File-application.py Setup-Complete')
    print_('File-application.py Compressing App')
    print_('File-application.py App Compressed')
    app.run(config.host, config.port, debug=config.debug)
