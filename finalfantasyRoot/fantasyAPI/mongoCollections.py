from finalfantasyRoot.connections import MDBclient

class connections(object):

        conn = None
        print("MBD_INIT: {}".format(hex(id(conn)))) #debug testing if MBD is unqite

        # def __new__(cls,*args,**kwds):
        #         if cls.conn is None:
        #                 cls.conn=connections.MDBclient()
        #         return cls.conn
        
        
        @classmethod
        def isConnected(cls):
                if cls.conn == None:
                        print("MBD_cls.conn == None: {}".format(hex(id(cls.conn)))) #debug
                        cls.conn = MDBclient()      
                        print("MBD_cls.conn == None 2: {}".format(hex(id(cls.conn)))) #debug 
                        return True
                print("MBD_isConnected: {}".format(hex(id(cls.conn)))) #debug
                return True
        
        @classmethod
        def update_one(cls, db, collection, query):
                if cls.isConnected():
                        cls.conn.client[db][collection]
                        cls.conn.update_one(query)

        @classmethod
        def insert_one(cls, db, collection, query):
                print("MBD_insert_one: {}".format(hex(id(cls.conn)))) #debug
                if cls.isConnected():
                        cls.conn.insert_one(db, collection, query)

        @classmethod
        def delete_one(cls, db, collection, query):
                if cls.isConnected():
                        cls.conn.insert_one(db, collection, query)

        @classmethod
        def find(cls, db, collection, query, applyFilter = {}):
                if cls.isConnected():
                        return cls.conn.find(db, collection, query, applyFilter)
