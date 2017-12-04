print('Start')
try:
    from libs.student import Student
    from libs.sql import SQLFuncs
    from libs.leaderboard import getLeaderboard, getTotal
except:
    print('Importing(B Set)')
    from student import Student
    print('Student imported')
    from sql import SQLFuncs
    print('SQL imported')
    from leaderboard import getLeaderboard, getTotal
    print('Leaderboard imported')

print('Importing Done')
    
SQL = SQLFuncs()

print('SQLFuncs obj created')

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
            if type(uid) != list:
                stdnt = Student(uid)
                names.append(stdnt.getName())
                ptages.append(stdnt.exams.calcPercentage(exam))
                ptiles.append(stdnt.exams.calcPercentile(exam))
                ttls.append(getTotal(uid, exam))
            else:
                for u in uid:
                    stdnt = Student(u)
                    names.append(stdnt.getName())
                    ptages.append(stdnt.exams.calcPercentage(exam))
                    ptiles.append(stdnt.exams.calcPercentile(exam))
                    ttls.append(getTotal(u, exam))
        return uids, names, ttls, ptages, ptiles
    
print('Setup complete')
