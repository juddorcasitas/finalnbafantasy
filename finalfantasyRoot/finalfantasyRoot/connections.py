#!/usr/bin/env python3
from pymongo import MongoClient
from .hosts import mongodbHost as HOST
from .hosts import mongodbPort as PORT

class MDBclient:
    

    def __init__(self):
        self.client = MongoClient(HOST, PORT)
        print("Client up") #debug

    #@staticmethod
    def getClient(self):
        if self.client == None:
            print("No Client") #debug
            try:
                self.client = MongoClient(HOST, PORT)
            except:
                # set to log in future
                print("Could not connect to mongodb client")
                self.client = None
        else:
            print("Cleint up") #debug
            return self.client
    
    #@staticmethod
    def closeClient(self):
        if self.client == None:
            # set to log in future
            print("nothing to close")
            return 1
        self.client.close()
        return 1
    
        

