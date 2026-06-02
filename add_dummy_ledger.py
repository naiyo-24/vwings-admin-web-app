import sys
sys.path.append('d:/VWings24x7-App-Backend')
from db import SessionLocal
from models.commission.commission_models import CommissionLedger, Payout
from models.auth.counsellor_models import Counsellor
import uuid

db = SessionLocal()
# Create dummy counsellor if not exists
c = db.query(Counsellor).filter_by(counsellor_id="COUNS-472").first()

if c:
    l = CommissionLedger(
        id=str(uuid.uuid4()),
        counsellor_id="COUNS-472",
        student_id="DUMMY",
        payment_id="DUMMY",
        commission_rate=10,
        commission_amount=100,
        status="Approved"
    )
    db.add(l)
    db.commit()
    print("Added dummy ledger")
else:
    print("Counsellor not found")
