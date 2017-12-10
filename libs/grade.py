print('Importing')
from student import Student
from sql import SQLFuncs
from leaderboard import getLeaderboard, getTotal
print('Importing Complete')
SQL = SQLFuncs()

exams = ['FA1', 'FA2', 'FA3', 'FA4', 'SA1', 'SA2']

def calcPercent(marks, sa=False):
    totals = []
    for i in range(0, len(marks), 2):
        totals.append(marks[i] + marks[i + 1])
    percents = []
    maxMarks = 50
    if sa:
        maxMarks = 100
        percents.append(round(totals.pop(0) / 125 * 100, 2))
    for score in totals:
        percents.append(round(score / maxMarks * 100, 2))
    return percents

class Grade():
    def __init__(self, grade, section):
        '''
        Helps in making calculations on the marks of a whole class(ie. 10A, 10B)
        Calculations like getting the class best, class avarage etc which would
        be otherwise difficult to manage
        '''
        self.section = section
        self.grade = grade

    def getClassMarks(self, exm):
        stdnts = SQL.getStudents(self.grade, self.section)
        names = [s[1] for s in stdnts] 
        percents = [self.getExmPercent(s[0], exm) for s in stdnts]
        return names, percents

    def getExmPercent(self, uid, exam):
        if exam:
            sa = True if exam[0] =='S' else False
            return calcPercent(SQL.getMarks(uid, exam), sa)
        percents = []
        for exam in exams:
            maxMarks = 300 if exam[0] == 'F' else 625
            total = sum(SQL.getMarks(uid, exam))
            percents.append(round(total / maxMarks * 100, 2))
        return percents
    def getStats(self, ranks, exam=''):
        uids = getLeaderboard(self.grade, self.section, exam, ranks)
        names = []
        ptages = []
        ptiles = []
        ttls = []
        for uid in uids:
            stdnt = None
            if type(uid) == list:
                lclNames = []
                for u in uid:
                    stdnt = Student(u)
                    lclNames.append(stdnt.getName())
                names.append(lclNames)
            else:
                stdnt = Student(uid)
                names.append(stdnt.getName())
            u = stdnt.uid
            stdnt.initExam()
            ptages.append(stdnt.exams.calcPercentage(exam))
            ptiles.append(stdnt.exams.calcPercentile(exam))
            ttls.append(getTotal(u, exam))
        return uids, names, ttls, ptages, ptiles
