#!/usr/bin/env python3
""" log stats """
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['logs']
collection = db['nginx']

# Get the total number of documents
total_logs = collection.count_documents({})
print(f"{total_logs} logs")

# Get the count of each HTTP method
print("Methods:")
methods = ["GET", "POST", "PUT", "PATCH", "DELETE"]
for method in methods:
    count = collection.count_documents({"method": method})
    print(f"\t{count}")

# Get the count of documents with method=GET and path=/status
count = collection.count_documents({"method": "GET", "path": "/status"})
print(f"\t{count}")