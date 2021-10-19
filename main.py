import eel
import time
import os,sys
import json, ast
from app.backend import Database

def on_close(page, sockets):
	print(page,'closed')
	print('Still have sockets open to',sockets)

def main():
    global d
    eel.init('web')
    eel.start('templates/index.html',jinja_templates='templates',size=(1216, 739))    # Start

@eel.expose
def getTime(data):
    print("i recieved it",data)
    return "success"

@eel.expose
def storeBranch(bid,bname,hname,mname):
    d = Database("./app/eniwas_test.db")
    data = (bid,bname,hname,mname)
    d.register_login_details(data)

@eel.expose
def get_login_details():
    d = Database("./app/eniwas_test.db")
    return d.get_login_details()

@eel.expose
def get_branchId():
    d = Database("./app/eniwas_test.db")
    return d.get_branchId()

if __name__=="__main__":
    main()