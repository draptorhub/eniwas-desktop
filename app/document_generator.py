from __future__ import print_function
from mailmerge import MailMerge
from datetime import date
import os
import datetime
from num2words import num2words
import calendar
from babel.numbers import format_currency

#print(document.get_merge_fields())

class Generate_Agreement:

    templates = {"multiple":"Templates\\Template_V1.docx","single":"Templates\\Template_V2.docx"}
    document = ""
    data = ""
    tenant = ""

    def __init__(self):
        os.chdir("./app")
        print('working directory:',os.getcwd())

    def set_tempdata(self,template,data,tenant):
        self.document = MailMerge(self.templates[template])
        self.data = data
        self.tenant = tenant
        print(self.document.get_merge_fields())
        
    def return_age(self,sdob):
        t = [int(i) for i in sdob.split("-")]
        dob = datetime.date(t[0],t[1],t[2])
        today = datetime.date.today()
        age = today.year - dob.year
        return str(age)

    def return_date(self,date):
        t = [int(i) for i in date.split("-")]
        s = str(num2words(t[2], to='ordinal_num'))+" day of " + calendar.month_name[t[1]] + ", "+str(t[0])
        return s

    def merge_tenant(self):
        self.document.merge(
            tenant_name = str(self.tenant["tname"]),
            sod = str(self.tenant["trel"]),
            tenant_father = str(self.tenant["tfath"]),
            tenant_age = self.return_age(str(self.tenant["tdob"])),
            tenant_address = str(self.tenant["tpaddr"]),
            tenant_mobile = str(self.tenant["tmob"]),
            doc_num = str(self.tenant["tdocnum"]),
        )

    def merge_tenants(self):
        print("Multiple Tenant",self.tenant)
        l = []
        s = 0
        for key in self.tenant:
            s+=1
            d = {
                "sl_no":str(s),
                "tenant_name":str(self.tenant[key][0]),
                "identity_number":str(self.tenant[key][1])
            }
            l.append(d)
        self.document.merge_rows('sl_no', l)

    def generate_agreement(self,single):
        self.document.merge(

            owner_name = str(self.data["oname"]),
            osod = ("S/o" if str(self.data["osod"])=="Male" else "D/o"),
            owner_father = str(self.data["odad"]),
            owner_age = str(self.data["oage"]),
            owner_address = str(self.data["oaddr"]), 
            building_address = str(self.data["baddr"]),

            doc_type = "Aadhar Number" if str(self.data["tnatn"]) else "Passporst Number:",

            agreement_date = self.return_date(str(self.data["rdate"])),
            rent_in_number = format_currency(int(self.data["rrent"]), 'INR', locale='en_IN'),
            rent_in_words = num2words(int(str(self.data["rrent"])), lang='en_IN').capitalize(),
            deposit_in_numbers = format_currency(int(self.data["radv"]), 'INR', locale='en_IN'),
            deposit_in_words = num2words(int(str(self.data["radv"])), lang='en_IN').capitalize(),
            maint_in_numbers = format_currency(int(self.data["rmaint"]), 'INR', locale='en_IN'),
            maint_in_words = num2words(int(str(self.data["rmaint"])), lang='en_IN').capitalize(),
            premises = str(self.data["rprem"]),
            
            )

        if single:
            self.merge_tenant()
        else:
            self.merge_tenants()

        file_name = "C:\\Users\\srini\\Rental_Agreements\\"+str(self.data["aname"])+"_"+str(self.data["rnum"])+".docx"
        self.document.write(file_name)
        return file_name


if __name__ == "__main__":
    g = Generate_Agreement("single")