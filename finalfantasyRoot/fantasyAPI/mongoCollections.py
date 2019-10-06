from connections import MDBclient

class FantasyCollections:

    def __init__(self):
        #default client is localhost
        self.mongoClient = MDBclient()
    
    def setCollection(self, collection):
        self.collection = self.mongoClient[collection]

    def insert(self, **kwargs):
        pass

    def update(self, **kwargs):
        pass

    def delete(self, **kwargs):
        pass

    def query(self, **kwargs):
        pass