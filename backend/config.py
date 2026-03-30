from pymongo import MongoClient

client = MongoClient(
    "mongodb+srv://samriddhishrivastav19:sam123@cluster0.qmc3wul.mongodb.net/?retryWrites=true&w=majority",
    tls=True,
    tlsAllowInvalidCertificates=True
)

db = client["waste_management"]