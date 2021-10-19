import sqlite3 as sql3
import json
import datetime

class Database:

    conn = None

    def __init__(self,db):
        self.conn = sql3.connect(db)
        self.create_tables()

    def create_tables(self):
        self.create_login_details()
        self.conn.commit()

    def create_login_details(self):
        sql = '''
            CREATE TABLE IF NOT EXISTS `login-details` (
                `bid`	TEXT NOT NULL,
                `bname`	TEXT,
                `hname`	TEXT,
                `mname`	TEXT,
                PRIMARY KEY(`bid`)
            );
        '''
        self.conn.execute(sql)

    def get_login_details(self):
        sql = "select * from `login-details` limit 1;"
        cursor = self.conn.execute(sql)
        t = cursor.fetchone()
        d = {
            #'bid':str(t[0]),
            'bname':str(t[1]),
            'hname':str(t[2]),
            'mname':str(t[3])
        }
        #print('data : ',d)
        y = json.dumps(d)
        return y

    def get_branchId(self):
        sql = "select bid from `login-details` limit 1;"
        cursor = self.conn.execute(sql)
        t = cursor.fetchone()
        y = str(t[0])
        return y
        

    def register_login_details(self,data):
        sql = 'insert or replace into `login-details` values(?,?,?,?)'
        cur = self.conn.cursor()
        cur.execute(sql,data)
        self.conn.commit()


if __name__ == "__main__":
    d = Database("eniwas_test.db")
    #d.get_login_details()
    d.get_branchId()