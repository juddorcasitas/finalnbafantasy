from pymongo import MongoClient


class MDBclient:

    def __init__ (self, host="localhost", port = 8000):
        self.host = host
        self.port = port
        self.client = 0
    
    def createClient(self):
        try:
            client = MongoClient(self.host, self.port)
            self.client = client
        except:
            # set to log in future
            print("Could not connect to mongodb client")
        return self.client

    def closeClient(self):
        if self.client != 0:
            print("nothing to close")
            return
        self.client.close()
    
        

