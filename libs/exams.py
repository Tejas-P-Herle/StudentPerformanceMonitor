from libs.sql import SQLFuncs
from libs.leaderboard import getExmBest
from libs.restrictIO import print_
print_('File-exams.py Importing-Complete')
print_('File-exams.py Starting Setup')

SQL = SQLFuncs()


class Exams(dict):
    def __init__(self, uid):
        FA = {'FA1': None, 'FA2': None, 'FA3': None, 'FA4': None}
        SA = {'SA1': None, 'SA2': None}
        self.update({'uid': uid})
        self.update(FA)
        self.update(SA)
        self.update({'total': None})
        self.populateMarks()

    def populateMarks(self):
        '''
        Gets the marks of all the exams of the given student and stores it
        '''
        
        exams = ['FA1', 'FA2', 'FA3', 'FA4', 'SA1', 'SA2']
        total = 0
        
        for exam in exams:
            marks = SQL.getMarks(self['uid'], exam)

            totalPPT = sum(marks[::2])

            totalActivity = sum(marks[1::2])

            exmTotal = totalPPT + totalActivity
            
            self[exam] = {'PPT': totalPPT,\
                          'activity': totalActivity,\
                          'total': exmTotal}

            # Adds the exam total to the grand total
            total += exmTotal

        # Stores the grand total
        self['total'] = total

    def calcPercentage(self, exam=''):
        '''
        Calculates the percentage of the students for the given exam or all
        the exams
        '''

        FA = ['FA1', 'FA2', 'FA3', 'FA4']
        SA = ['SA1', 'SA2']

        # Makes the exam to all capital letters to avoid errors and to give
        # flexibility
        examUpper = exam.upper()

        # Sets the max marks depending on the exam
        if examUpper in FA:
            maxMarks = 300
        elif examUpper in SA:
            maxMarks = 625
        else:
            maxMarks = 2450
            return round((self['total'] / maxMarks) * 100, 2)

        # Calculates the students percentage and returns the value
        return round((self[examUpper]['total'] / maxMarks) * 100, 2)

    def calcPercentile(self, exam=''):
        '''
        Calculates the percentile of the students for the given exam or all
        the exams
        '''

        # Gets the students grade and section
        grade, section = SQL.getClass(self['uid'])

        # Calculates the percentile and returns it
        best = getExmBest(grade, section, exam)
        if exam:
            return round((self[exam.upper()]['total'] / best) * 100, 2)
        return round((self['total'] / best) * 100, 2)


print_('File-exams.py Setup-Complete')
