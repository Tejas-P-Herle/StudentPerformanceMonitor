from student import Student
from sql import SQLFuncs
from leaderboard import getLeaderboard, getTotal
 
SQL = SQLFuncs()

exams = ['FA1', 'FA2', 'FA3', 'FA4', 'SA1', 'SA2']

class Grade():
    def __init__(self, grade, section):
        '''
        Helps in making calculations on the marks of a whole class(ie. 10A, 10B)
        Calculations like getting the class best, class avarage etc which would
        be otherwise difficult to manage
        '''
        self.section = section
        self.grade = grade

    def getClassMarks(self):
        percents = []
        names = []
        for student in SQL.getStudents(self.grade, self.section):
            names.append(student[1])
            exmPercent = []
            for exam in exams:
                total = sum(SQL.getMarks(student[0], exam))
                if exam[0] == 'F':
                    exmPercent.append(round(total / 300 * 100, 2))
                else:
                    exmPercent.append(round(total / 625 * 100, 2))
            percents.append(exmPercent)
        return names, percents

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
