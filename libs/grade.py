print('File-grade.py Importing')
from student import Student
from sql import SQLFuncs
from leaderboard import getLeaderboard, getExmTotal, getExmBest, getSubjBest
print('File-grade.py Importing-Complete')
print('File-grade.py Setup Started')
SQL = SQLFuncs()

exams = ['FA1', 'FA2', 'SA1', 'FA3', 'FA4', 'SA2']
subjs = ['I_Lan', 'II_Lan', 'III_Lan', 'Maths', 'Science', 'Social']

class Grade():
    def __init__(self, grade, section):
        '''
        Helps in making calculations on the marks of a whole class(ie. 10A, 10B)
        Calculations like getting the class best, class avarage etc which would
        be otherwise difficult to manage
        '''
        print('Grade method: __init__')
        self.section = section
        self.grade = grade

    def getClassPercent(self, exm):
        print('Grade method: getClassPercent')
        stdnts = SQL.getStudents(self.grade, self.section)
        names = [s[1] for s in stdnts] 
        percents = [self.getExmPercent(s[0], exm) for s in stdnts]
        print('Grade method: getClassMarks-Complete')
        return names, percents

    def getClassPertile(self, exm):
        print('Grade method: getClassPertile')
        stdnts = SQL.getStudents(self.grade, self.section)
        names = [s[1] for s in stdnts] 
        pertiles = [self.getExmPertile(s[0], exm) for s in stdnts]
        print('Grade method: getClassPertile-Complete')
        return names, pertiles

    # TODO: Get each students each subjects percent for 2 exms and display
    def getClassPercentImpr(self, exm):
        print('Grade method: getClassPercentImpr')
        if exm:
            names, percents = self.getClassPercent(exm)
            index = exams.index(exm) - 1
            if index < 0:
                raise IndexError('No exam prior to FA1')
            _, prevPercents = self.getClassPercent(exams[index])
            percentImprs = []
            for i in range(len(names)):
                stdntPercentImpr = []
                for j in range(len(subjs)):
                    stdntPercentImpr.append(percents[i][j] - prevPercents[i][j])
                percentImprs.append(stdntPercentImpr)
            return names, percentImprs
        names, percents = self.getClassPercent('')
        percentImprs = []
        for stdntPercent in percents:
            stdntPercentImpr = [0]
            for i in range(1, len(stdntPercent)):
                stdntPercentImpr.append(stdntPercent[i] - stdntPercent[i - 1])
            percentImprs.append(stdntPercentImpr)
        print('Grade method: getClassPercentImpr-Complete')
        return names, percentImprs

    def getClassPertileImpr(self, exm): 
        print('Grade method: getClassPertileImpr')
        if exm:
            names, pertiles = self.getClassPertile(exm)
            _, prevPertiles = self.getClassPertile(exams[exams.index(exm) - 1])
            pertileImprs = []
            for i in range(len(names)):
                stdntPertileImpr = []
                for j in range(len(subjs)):
                    stdntPertileImpr.append(pertiles[i][j] - prevPertiles[i][j])
                pertileImprs.append(stdntPertileImpr)
            return names, pertileImprs
        names, pertiles = self.getClassPertile(exm)
        pertileImprs = []
        for stdntPertile in pertiles:
            stdntPertileImpr = [0]
            for i in range(1, len(stdntPertile)):
                stdntPertileImpr.append(stdntPertile[i] - stdntPertile[i - 1])
            pertileImprs.append(stdntPertileImpr)
        print('Grade method: getClassPertileImpr-Complete')
        return names, pertileImprs
    
    def getExmPercent(self, uid, exam):
        print('Grade method: getExmPercent')
        if exam:
            sa = True if exam[0] =='S' else False
            return self.calcPercent(SQL.getMarks(uid, exam), sa)
        percents = []
        for exam in exams:
            maxMarks = 300 if exam[0] == 'F' else 625
            total = sum(SQL.getMarks(uid, exam))
            percents.append(round(total / maxMarks * 100, 2))
        print('Grade method: getExmPercent-Complete')
        return percents

    def getExmPertile(self, uid, exam):
        print('Grade method: getExmPertile')
        if exam:
            return self.calcPertile(SQL.getMarks(uid, exam), exam)
        pertiles = []
        for exam in exams:
            maxMarks = getExmBest(self.grade, self.section, exam)
            total = sum(SQL.getMarks(uid, exam))
            pertiles.append(round(total / maxMarks * 100, 2))
        print('Grade method: getExmPertile-Complete')
        return pertiles

    def getSubjTotal(self, marks):
        print('Grade method: getSubjTotal')
        totals = []
        for i in range(0, len(marks), 2):
            totals.append(marks[i] + marks[i + 1])
        print('Grade method: getSubjTotal-Complete')
        return totals

    def calcPercent(self, marks, sa):
        print('Grade method: calcPercent')
        totals = self.getSubjTotal(marks)
        percents = []
        maxMarks = 50
        if sa:
            maxMarks = 100
            percents.append(round(totals.pop(0) / 125 * 100, 2))
        for score in totals:
            percents.append(round(score / maxMarks * 100, 2))
        print('Grade method: calcPercent-Complete')
        return percents

    def calcPertile(self, marks, exam):
        print('Grade method: calcPertile')
        totals = self.getSubjTotal(marks)
        pertiles = []
        for i in range(len(totals)):
            maxMarks = getSubjBest(self.grade, self.section, exam, subjs[i])
            pertiles.append(round(totals[i] / maxMarks * 100, 2))
        print('Grade method: calcPertile-Complete')
        return pertiles
        
    def getStats(self, ranks, exam=''):
        print('Grade method: getStats')
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
            ttls.append(getExmTotal(u, exam))
        print('Grade method: getStats-Complete')
        return uids, names, ttls, ptages, ptiles
print('File-grade.py Setup-Complete')
