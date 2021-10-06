import sqlite3 as sql3
import json
import datetime

class Database:

    conn = None

    def __init__(self,db):
        self.conn = sql3.connect("./app/"+db)
        #self.conn = sql3.connect(db)
        self.create_tables()

    def create_tables(self):
        self.create_owner_table()
        self.create_building_table()
        self.conn.commit()

    def create_owner_table(self):
        sql = '''
            CREATE TABLE IF NOT EXISTS `owner` (
                `oid`	INTEGER PRIMARY KEY AUTOINCREMENT,
                `oname`	TEXT,
                `olabel`	TEXT,
                `odob`	TEXT,
                `ogen`	INTEGER,
                `ofather`	TEXT,
                `oaddr`	TEXT
            );     
        '''
        self.conn.execute(sql)

    def create_building_table(self):
        sql = '''
            CREATE TABLE IF NOT EXISTS `building` (
                `bid`	INTEGER PRIMARY KEY AUTOINCREMENT,
                `bname`	TEXT,
                `baddress`	TEXT,
                `bpic`	TEXT,
                `oid`	INTEGER
            );
        '''
        self.conn.execute(sql)

    def dict_format(self,data):
        d = {}
        d["bname"] = data[0]
        d["baddr"] = data[1]
        d["oname"] = data[2]
        d["odob"] = data[3]
        t = [int(i) for i in data[3].split("-")]
        t.reverse()
        dob = datetime.date(t[0],t[1],t[2])
        today = datetime.date.today()
        age = today.year - dob.year
        d["oage"] = age
        d["ogen"] = "Male" if data[4]==1 else "Female"
        d["odad"] = data[5]
        d["oaddr"] = data[6]
        d["bpic"] = data[7]
        d["bid"] = data[8]
        d["oid"] = data[9]
        return d

    def get_buildings_frontend(self):
        sql = "select b.bname,b.baddress,o.oname,o.odob,o.ogen,o.ofather,o.oaddr,bpic,b.bid,o.oid from owner o,building b where o.oid=b.oid;"
        cursor = self.conn.execute(sql)
        l = []
        for row in cursor:
            j = self.dict_format(row)
            y = json.dumps(j)
            l.append(y)
        return l

if __name__ == "__main__":
    d = Database("test_db.db")
    d.get_buildings_frontend()