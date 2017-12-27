"""
SQL.py

Programmer: Tejas. P. Herle

Description: This file contains basic functions with respect to marks and 
             basic SQL functions

             SQLCnxn Object:
                Initialy setus up a connection to MSSQL database using pyodbc
                and helps in insertion, deletion and selection of records from
                the SQL database.
                This are accompanied by the __init__ and the closeCnxn methods
                to open and close the connects respectively.
                    
"""
import pyodbc
from libs.restrictIO import print_
print_('File-sql.py Importing-Complete')
print_('File-sql.py Starting Setup')

class SQLCnxn():
    def __init__(self):
        # Connecting to MSSQL(to Students DB) and initializing a cursor
        self.cnxn = pyodbc.connect('DRIVER={SQL Server};SERVER=Balaram-THINK;\
                                    DATABASE=Students;UID=sa;PWD=SQLTeja0207')
        self.cursor = self.cnxn.cursor()

    def execute(self, command, commit=False):
        '''
        Executes the given command directly without any formatting
        '''
        
        try:
            self.cursor.execute(command)
            if commit:
                self.cursor.commit()
            return 0
        except Exception as e:
            return e

    def insert(self, data, table='marks'):
        # Segregating data into keys and values
        keys = []
        vals = []
        for key, val in data.items():
            keys.append(key)
            vals.append(val)
            
        keys = str(tuple(keys)).replace("'", '"')
        vals = str(tuple(vals))
        
        # Trying to insert into MSSQL and returning error if caught
        try:
            command = "INSERT INTO {} {} VALUES {}".format(table, keys, vals)
            self.cursor.execute(command)
            self.cursor.commit()
            return 0
        except Exception as e:
            return e

    def select(self, keys='*', table='marks', conditions=None):

        # If keys are given, turn them into a string suitable for SQL Query
        if keys:
            if not type(keys) == str:
                klist = ""
                for key in keys:
                    klist += key + ', '
                keys = klist[:-2]

        keys.replace("'", '').replace('"', '')

        # Format the conditions to be suitable for SQL Query 
        if conditions:
            condStr = ""   
            for key, val in conditions.items():
                if key == 'uid' or key == 'eid':
                    condStr += key + ' = ' + str(val)
                else:
                    condStr += key + " = '" + str(val) + "' AND "
            if not (conditions.__contains__('uid') or
                    conditions.__contains__('eid')):
                condStr = condStr[:-5]
        else:
            condStr = "1=1"

        # Get data from SQL
        try:
            command = "SELECT {} FROM {} WHERE {}"\
                      .format(keys, table, condStr)
            self.cursor.execute(command)
            return self.cursor.fetchall()
        except Exception as e:
            print('Command: ', command)
            # On error return error message
            raise(e)

    def update(self, uid, data):
        pass #TODO
            
    def closeCnxn(self):
        # Closing Connection to MSSQL database
        self.cursor.close()
        self.cnxn.close()

class SQLFuncs():
    def __init__(self):
        self.SQL = SQLCnxn()

    def getEid(self, uid, exam):
        return self.SQL.select('eid_' + exam, 'examID', {'uid': uid})[0][0]

    def getMarks(self, uid, exam):
        eid = self.getEid(uid, exam.upper())
        return self.SQL.select(conditions= {'eid': eid})[0][1:]
    
    def getSection(self, uid):
        return self.SQL.select('section', 'credentials', {'uid': uid})[0][0]

    def getGrade(self, uid):
        return self.SQL.select('grade', 'credentials', {'uid': uid})[0][0]

    def getClass(self, uid):
        return self.SQL.select(['grade', 'section'], 'credentials',
                               {'uid': uid})[0]

    def getStudents(self, grade, section):
        return self.SQL.select(['uid', 'name'], 'credentials',
                               {'grade': grade, 'section': section})

    def getUids(self, grade, section):
        return self.SQL.select('uid', 'credentials',
                               {'grade': grade, 'section': section})
    def getUid(self, name):
        return self.SQL.select('uid', 'credentials', {'name': name})
    
    def getName(self, uid):
        return self.SQL.select('name', 'credentials', {'uid': uid})[0][0]


print_('File-sql.py Setup-Complete')
