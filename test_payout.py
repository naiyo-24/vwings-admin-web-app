import urllib.request, json
req = urllib.request.Request('http://localhost:8000/api/commissions/payouts/generate', method='POST', headers={'Content-Type': 'application/json'}, data=json.dumps({'counsellor_id': 'COUNS-472', 'payment_method': 'Cash', 'reference_no': ''}).encode())
try:
    print(urllib.request.urlopen(req).read().decode())
except Exception as e:
    print(e.read().decode())
