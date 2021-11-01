from __future__ import print_function
from mailmerge import MailMerge
from datetime import date
import os
import datetime
from num2words import num2words
import calendar
from babel.numbers import format_currency

#print(document.get_merge_fields())

class Generate_Bill:

    document = None
    data = None

    def __init__(self,data):
        self.document = MailMerge("web\\static\\bill_template.docx");
        self.data = data
        print("data r: ",str(self.data["payMode"]))
        #print(self.document.get_merge_fields())

    def printBill(self):
        self.document.merge(
            cidatetime=str(self.data["checkin"]),
            paidAmt=str(self.data["paidAmt"]),
            codatetime=str(self.data["checkout"]),
            hotelAddr=str(self.data["haddr"]),
            rtarrif=str(self.data["roomTarrif"]),
            rtype=str(self.data["roomType"]),
            payMode=str(self.data["payMode"]),
            hotelName=str(self.data["hname"]),
            totAmt=str(self.data["totAmt"]),
            billnum=str(self.data["billNum"]),
            custDetails=str(self.data["custDetails"]),
            roomnum=str(self.data["roomNum"]),
            guestnum=str(self.data["guestNum"]),
            totWords=num2words(self.data["totAmt"], lang='en_IN').capitalize(),
            numdays=str(self.data["staydays"]),
            dueAmt=str(self.data["dueAmt"])
        )
        self.document.merge_rows('rdate',self.data["dtable"])
        dirName = os.path.expanduser("~")+'\\Documents\\'
        fileName  = str(self.data["billNum"])+".docx"
        print(dirName+fileName)
        self.document.write(dirName+fileName)
        os.startfile(dirName+fileName)

if __name__=='__main__':
    sample_data = {
        "checkin":"07-04-2021 12:33",
        "checkout":"09-04-2021 12:33",
        "paidAmt":200,
        "roomTarrif":900,
        "roomType":"Classic 2X",
        "totAmt":2100,
        "billNum":"00003",
        "custDetails":"Anirudh K",
        "roomNum":"102",
        "guestNum":2,
        "staydays":2,
        "dueAmt":"1900",
        "hname":"Srinidhi",
        "haddr":"Kalyan Nagar,Bangalore - 43",
        "dtable":[
            {"rsubtotal":"900","rtax":"0","rdate":"07-04-2021","rdesc":"Description 1"},
            {"rsubtotal":"900","rtax":"0","rdate":"08-04-2021","rdesc":"Description 2"},
            {"rsubtotal":"50","rtax":"0","rdate":"07-04-2021","rdesc":"Description 3"},
            {"rsubtotal":"100","rtax":"0","rdate":"08-04-2021","rdesc":"Description 4"},
            {"rsubtotal":"150","rtax":"0","rdate":"07-04-2021","rdesc":"Description 4"},
            {"rsubtotal":"-200","rtax":"0","rdate":"07-04-2021","rdesc":"Description 5"},
        ]
    }
    g = Generate_Bill(sample_data)
    g.printBill()
