import sys
sys.path.insert(0, 'C:\\Users\\Tejas. P. Herle\\Programming\\Web\\StudentPerformanceMonitor\\libs\\')

from flask import Flask, render_template, request, jsonify
from libs.library import *

app = Flask(__name__)
SQL = SQLFuncs()

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/login')
def login():
    return "TODO"

@app.route('/leaderboard')
def leaderboard():
    exam = request.args.get('exam')
    stndrd = request.args.get('stndrd')
    section = request.args.get('section')

    if not (stndrd or section):
        return 'Please provide a standard and a section'

    if exam in [None, 'all', 'select']: exam = ''
    
    stats = list(Grade(stndrd, section).getStats(10, exam))

    stdntData = []
    for i in range(len(stats[0])):
        if type(stats[0][i]) != list:
            stdntData.append([stats[0][i], i + 1, stats[1][i], stats[2][i], stats[3][i], stats[4][i]])
        else:
            for j in range(len(stats[0][i])):
                stdntData.append([stats[0][i][j], i + 1, stats[1][i][j], stats[2][i][j], stats[3][i][j], stats[4][i][j]])
    return render_template('leaderboard.html', stdntData=stdntData + [exam])

@app.route('/getClassMarks')
def getClassMarks():
    stndrd = request.args.get('stndrd')
    section = request.args.get('section')
    names, percents = Grade(stndrd, section).getClassMarks()
    return jsonify({'name': names, 'percent': percents})

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

    chngPercent = chngPertile = 0
    exmObj = Exams(uid)
    if exam:
        exmTotal = exmObj[exam]['total']
    else:
        exmTotal = exmObj['total']

    exams = ['FA1', 'FA2', 'SA1', 'FA3', 'FA4', 'SA2']

    if not exam in ['', 'FA1']:
        index = exams.index(exam)
        prevPercent = exmObj.calcPercentage(exam)
        currPercent = exmObj.calcPercentage(exams[index - 1])
        chngPercent = round(prevPercent - currPercent, 2)
        prevPertile = exmObj.calcPercentile(exam)
        currPertile = exmObj.calcPercentile(exams[index - 1])
        chngPertile = round(prevPertile - currPertile, 2)
    return render_template('student.html', uid=uid, exam=exam, name=name, chngPercent=chngPercent, chngPertile=chngPertile, exmTotal=exmTotal)

if __name__ == '__main__':
    app.run('0.0.0.0', 5000, debug=True)
