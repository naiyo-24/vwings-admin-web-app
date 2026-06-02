import sys
sys.path.append('d:/VWings24x7-App-Backend')
from db import SessionLocal
from models.commission.commission_models import CommissionLedger
from models.fees.fees_models import Fee
from models.auth.student_models import Student
import uuid

db = SessionLocal()
s = db.query(Student).first()
f = db.query(Fee).first()

if s and f:
    l = CommissionLedger(
        id=str(uuid.uuid4()),
        counsellor_id="COUNS-472",
        student_id=s.student_id,
        payment_id=f.fee_id,
        commission_rate=10,
        commission_amount=100,
        status="Approved"
    )
    db.add(l)
    db.commit()
    print("Added valid ledger")
else:
    print("No student or fee found")
