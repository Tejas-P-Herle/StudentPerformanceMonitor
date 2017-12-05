from sql import SQLFuncs

SQL = SQLFuncs()
exams = ['FA1', 'FA2', 'FA3', 'FA4', 'SA1', 'SA2']

def getLeaderboard(grade, section, exam='', ranks=10):
    totals = {}
    leaderboard = []
    stdntsData = SQL.getUid(grade, section)
    if exam and type(exam) != list:
        exam = [exam]
    for stdnt in stdntsData:
        uid = stdnt[0]
        total = 0
        if type(exam) == list:
            for exm in exam:
                total += getTotal(uid, exm)
        else:
            total = getTotal(uid)
            
        if not total in totals:
            totals.update({total: uid})
        else:
            temp = totals[total]
            if type(temp) != list:
                totals.update({total: [temp, uid]})
            else:
                temp.append(uid)
                totals.update({total: temp})

    for ttl in sorted(totals.keys())[:-(ranks + 1):-1]:
        leaderboard.append(totals[ttl])
    return leaderboard

def getTotal(uid, exam=''):
    if not exam:
        marks = 0
        for exm in exams:
            marks += sum(SQL.getMarks(uid, exm))
        return marks
    return sum(SQL.getMarks(uid, exam))

def getBest(grade, section, exam=''):
    return getTotal(getLeaderboard(grade, section, exam, 1)[0], exam)

def calcSubjPercentage(uid, exam=''):
    marks = SQL.getMarks(uid, exam)
    subjPercentages = []
    totalMarks = sum(marks)
    NUMBER_OF_SUBJECTS = 6
    for i in range(NUMBER_OF_SUBJECTS):
        subjMarks = marks[i*2] + marks[i*2+1]
        subjPercentages.append(subjMarks / totalMarks * 100)
    return subjPercentages
