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
    d = Database("./app/eniwas_test.db")
    eel.init('web')
    eel.start('templates/index.html',jinja_templates='templates',mode='chrome', 
                        host='localhost', 
                        port=27000)    # Start

@eel.expose
def getTime(data):
    print("i recieved it",data)
    return "success"

@eel.expose
def storeBranch(bid,bname,hname,mname):
    data = (bid,bname,hname,mname)
    d.register_login_details(data)

@eel.expose
def get_login_details():
    return d.get_login_details()

@eel.expose
def get_branchId():
    return d.get_branchId()

if __name__=="__main__":
    main()