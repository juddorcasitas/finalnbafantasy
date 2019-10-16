#!/usr/bin/env python3
from pymongo import MongoClient
from .hosts import mongodbHost as HOST
from .hosts import mongodbPort as PORT

class MDBclient(object):
    
    def __init__(self):
        self.client = MongoClient(HOST, PORT)
        print("Client up: {}".format(self.client)) #debug

    def getClient(self):
        if self.client == None:
            print("No Client") #debug
            try:
                self.client = MongoClient(HOST, PORT)
                return self.client
            except:
                # set to log in future
                print("Could not connect to mongodb client")
                self.client = None
        else:
            print("Cleint up") #debug
            return self.client
    
    def closeClient(self):
        if self.client == None:
            # set to log in future
            print("nothing to close")
        self.client.close()
    
    def insert_one(self, db, collection, query):
        mydb = self.client[db]
        mycol = mydb[collection]
        mycol.insert_one(query)
        pass

    def update_one(self, db, collection, query):
        mydb = self.client[db]
        mycol = mydb[collection]
    
    def delete_one(self, db, collection, query):
        mydb = self.client[db]
        mycol = mydb[collection]

    def find(self, db, collection, query, applyFilter):
        mydb = self.client[db]
        mycol = mydb[collection]
        return mycol.find(query, applyFilter)