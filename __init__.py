import sys
sys.path.insert(0, 'C:\\Users\\Tejas. P. Herle\\Programming\\Web\\StudentPerformanceMonitor\\libs\\')

from flask import Flask, render_template, request, jsonify, redirect
from libs.library import *

app = Flask(__name__)
SQL = SQLFuncs()

@app.route('/')
def index():
    return redirect("/leaderboard")

@app.route('/login')
def login():
    return "TODO"

@app.route('/leaderboard')
def leaderboard():
    exam = request.args.get('exam')
    stndrd = request.args.get('stndrd')
    section = request.args.get('section')

    if not (stndrd and section):
        errorMsg = 'Please provide a standard and a section'
        errorPage = 'Leaderboard'
        errorNo = 'ER0101'
        return render_template('error.html', errorPage=errorPage, errorMsg=errorMsg, errorNo=errorNo)

    if exam in [None, 'All']: exam = ''
    
    stats = list(Grade(stndrd, section).getStats(10, exam))

    stdntData = []
    for i in range(len(stats[0])):
        if type(stats[0][i]) != list:
            stdntData.append([stats[0][i], i + 1, stats[1][i], stats[2][i], stats[3][i], stats[4][i]])
        else:
            for j in range(len(stats[0][i])):
                stdntData.append([stats[0][i][j], i + 1, stats[1][i][j], stats[2][i], stats[3][i], stats[4][i]])
    return render_template('leaderboard.html', stdntData=stdntData + [exam])

@app.route('/getClassPercent')
def getClassPercent():
    stndrd = request.args.get('stndrd')
    section = request.args.get('section')
    exam = request.args.get('exam')
    if exam in [None, 'All']: exam = ''
    names, percents = Grade(stndrd, section).getClassPercent(exam)
    return jsonify({'name': names, 'percent': percents})

@app.route('/getClassPertile')
def getClassPertile():
    stndrd = request.args.get('stndrd')
    section = request.args.get('section')
    exam = request.args.get('exam')
    if exam in [None, 'All']: exam = ''
    names, pertiles = Grade(stndrd, section).getClassPertile(exam)
    return jsonify({'name': names, 'pertile': pertiles})

@app.route('/getClassPercentImpr')
def getClassPercentImpr():
    stndrd = request.args.get('stndrd')
    section = request.args.get('section')
    exam = request.args.get('exam')
    if exam in [None, 'All']: exam = ''
    names, percentImprs = Grade(stndrd, section).getClassPercentImpr(exam)
    return jsonify({'name': names, 'percentImpr': percentImprs})

@app.route('/getClassPertileImpr')
def getClassPertileImpr():
    stndrd = request.args.get('stndrd')
    section = request.args.get('section')
    exam = request.args.get('exam')
    if exam in [None, 'All']: exam = ''
    names, pertileImprs = Grade(stndrd, section).getClassPertileImpr(exam)
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
        for param in ['FA1', 'FA2', 'FA3', 'FA4', 'SA1', 'SA2']:
            ppt = marks[param]['PPT']
            activity = marks[param]['activity']
            info['ppt'].append(ppt)
            info['activity'].append(activity)
            info['total'].append(ppt + activity)
    return jsonify(info)   
        
@app.route('/student')
def student():
    uid = request.args.get('uid')
    exam = request.args.get('exam')
    name = Student(uid).getName()
    if exam in [None, 'All']: exam = ''

    chngPercent = chngPertile = 0
    exmObj = Exams(uid)
    if exam:
        exmTotal = exmObj[exam]['total']
    else:
        exmTotal = exmObj['total']

    exams = ['FA1', 'FA2', 'SA1', 'FA3', 'FA4', 'SA2']

    prevPercents = []
    prevPertiles = []
    if not exam in ['', 'FA1']:
        index = exams.index(exam)
        currPercent = exmObj.calcPercentage(exam)
        prevPercent = exmObj.calcPercentage(exams[index - 1])
        chngPercent = round(currPercent - prevPercent, 2)
        currPertile = exmObj.calcPercentile(exam)
        prevPertile = exmObj.calcPercentile(exams[index - 1])
        chngPertile = round(currPertile - prevPertile, 2)
        for i in range(index - 1):
            prevPercents.append(exmObj.calcPercentage(exams[i]))
            prevPertiles.append(exmObj.calcPercentile(exams[i]))
        prevPercents += [prevPercent, currPercent]
        prevPertiles += [prevPertile, currPertile]
    return render_template('student.html', uid=uid, exam=exam, name=name,
                           chngPercent=chngPercent, chngPertile=chngPertile,
                           exmTotal=exmTotal, prevPercents=prevPercents,
                           prevPertiles=prevPertiles)

if __name__ == '__main__':
    app.run('0.0.0.0', 5000, debug=True)
