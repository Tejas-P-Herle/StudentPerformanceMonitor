from sql import SQLFuncs
from exams import Exams

SQL = SQLFuncs()

def getUid(name):
    return SQL.getUid(name)

class Student(dict):
    def __init__(self, uid):
        self.uid = uid

    def initExam(self):
        self.exams = Exams(self.uid)

    def getName(self):
        return SQL.getName(self.uid)

    def getGrade(self):
        return SQL.getGrade(self.uid)

    def getSection(self):
        return SQL.getSection(self.uid)
    
    def getEid(self, exam):
        return SQL.getEid(self.uid, exam)

    def getMarks(self, exam):
        return SQL.getMarks(self.uid, exam)

    def getClass(self):
        grade, stdntClass = SQL.getClass(self.uid)
        return grade + stdntClass
