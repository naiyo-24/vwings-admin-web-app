import sqlite3
import sys

try:
    conn = sqlite3.connect('d:/VWings24x7-App-Backend/vwings.db')
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(payouts);")
    columns = cursor.fetchall()
    print("Payouts columns:", [c[1] for c in columns])
except Exception as e:
    print(e)
