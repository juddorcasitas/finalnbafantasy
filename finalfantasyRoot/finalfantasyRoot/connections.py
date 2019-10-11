#!/usr/bin/env python3
from pymongo import MongoClient
from .hosts import mongodbHost as HOST
from .hosts import mongodbPort as PORT

class MDBclient:
    client = None

    @staticmethod
    def getClient():
        if MDBclient.client == None:
            try:
                MDBclient.client = MongoClient(HOST, PORT)
            except:
                # set to log in future
                print("Could not connect to mongodb client")
                MDBclient.client = None
        return MDBclient.client
    
    @staticmethod
    def closeClient():
        if MDBclient.client == None:
            # set to log in future
            print("nothing to close")
            return 1
        MDBclient.client.close()
        return 1
    
        

