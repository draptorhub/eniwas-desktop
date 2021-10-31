import eel
import time
import os,sys
import json, ast
from app.backend import Database
from app.bill_generator import Generate_Bill

def main():
    global d
    dir_name = os.path.expanduser("~")+'\\AppData\\Local\\'
    db_name = 'eniwas_test.db'
    print('dbnameloc',dir_name+db_name)
    d = Database(dir_name+db_name)
    eel.init('web')
    eel.start('templates/index.html',jinja_templates='templates',port=0)    # Start

@eel.expose
def getTime(data):
    print("i recieved it",data)
    return "success"

@eel.expose
def storeBranch(bid,bname,hname,mname,haddr):
    data = (bid,bname,hname,mname,haddr)
    d.register_login_details(data)

@eel.expose
def get_login_details():
    return d.get_login_details()

@eel.expose
def generate_bill(data):
    hotel = d.get_hotel_details()
    dt = dict(data)
    dt["hname"] = hotel["hname"]
    dt["haddr"] = hotel["haddr"]

    print("dict : ",dt)

    g = Generate_Bill(dt)
    g.printBill()

@eel.expose
def delete_login():
    return d.del_login()

@eel.expose
def get_branchId():
    return d.get_branchId()

if __name__=="__main__":
    main()
