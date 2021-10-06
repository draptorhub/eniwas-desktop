import eel
import time
import os,sys
import json, ast
from app.backend import Database
from app.document_generator import Generate_Agreement

d=""
g=""

def main():
    global g,d
    eel.init('web')
    d = Database("test_db.db")
    g = Generate_Agreement()
    eel.start('templates/index.html', jinja_templates='templates')    # Start

@eel.expose
def getTime(data):
    print("i recieved it",data)
    return "success"

if __name__=="__main__":
    main()