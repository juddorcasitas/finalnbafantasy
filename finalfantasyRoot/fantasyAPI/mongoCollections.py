from finalfantasyRoot import connections

mdb = connections.MDBclient()

def isConnected():
    if mdb.getClient() == None:
        return False
    return True
    #
    
def update_one(db, collection, query):
    if isConnected():
        mdb.client[db][collection]
        mdb.update_one(query)
    
def insert_one(db, collection, query):
    if isConnected():
        mdb.client[db][collection]
        mdb.insert_one(query)
    
def delete_one(db, collection, query):
    if isConnected():
        mdb.client[db][collection]
        mdb.delete_one(query)


