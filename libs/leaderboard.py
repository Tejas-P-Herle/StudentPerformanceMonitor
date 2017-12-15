from sql import SQLFuncs

SQL = SQLFuncs()
exams = ['FA1', 'FA2', 'FA3', 'FA4', 'SA1', 'SA2']
subjs = ['I_Lan', 'II_Lan', 'III_Lan', 'Maths', 'Science', 'Social']

def getLeaderboard(grade, section, exam='', ranks=10):
    totals = {}
    leaderboard = []
    stdntsData = SQL.getUids(grade, section)
    if exam and type(exam) != list:
        exam = [exam]
    for stdnt in stdntsData:
        uid = stdnt[0]
        total = 0
        if type(exam) == list:
            for exm in exam:
                total += getExmTotal(uid, exm)
        else:
            total = getExmTotal(uid)
            
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

def getSubjLeaderboard(grade, section, exam, subj, ranks=10):
    totals = {}
    leaderboard = []
    stdntData = SQL.getUids(grade, section)
    for stdnt in stdntData:
        uid = stdnt[0]
        total = getSubjTotal(uid, exam, subj)
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
                
def getSubjTotal(uid, exam, subj):
    marks = SQL.getMarks(uid, exam)
    return sum(marks[subjs.index(subj) * 2: subjs.index(subj) * 2 + 2])

def getSubjBest(grade, section, exam, subj):
    best = getSubjLeaderboard(grade, section, exam, subj, 1)[0]
    uid = best[0] if type(best) == list else best
    return getSubjTotal(uid, exam, subj)

def getExmTotal(uid, exam=''):
    if not exam:
        marks = 0
        for exm in exams:
            marks += sum(SQL.getMarks(uid, exm))
        return marks
    return sum(SQL.getMarks(uid, exam))

def getExmBest(grade, section, exam=''):
    best = getLeaderboard(grade, section, exam, 1)[0]
    uid = best[0] if type(best) == list else best
    return getExmTotal(uid, exam)

def calcSubjPercentage(uid, exam=''):
    marks = SQL.getMarks(uid, exam)
    subjPercentages = []
    totalMarks = sum(marks)
    NUMBER_OF_SUBJECTS = 6
    for i in range(NUMBER_OF_SUBJECTS):
        subjMarks = marks[i*2] + marks[i*2+1]
        subjPercentages.append(subjMarks / totalMarks * 100)
    return subjPercentages
