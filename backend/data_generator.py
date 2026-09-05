"""
Aegis Data Generator — Track 02: AI Risk Manager
Generates realistic Indian BFSI transactions with ground-truth labels
and a strictly held-out test split (25%) unseen by threshold tuning.
"""

import random
import time
from datetime import datetime, timedelta
import numpy as np

INDIAN_CITIES = ["Mumbai", "Bengaluru", "Delhi NCR", "Hyderabad", "Pune", "Chennai", "Kolkata", "Ahmedabad", "Jaipur", "Kochi"]
FOREIGN_CITIES = ["Lagos", "Bucharest", "Shenzhen", "St. Petersburg", "Minas Gerais", "Kyiv"]
MERCHANTS = [
    {"name": "NovaElectronics India", "category": "Electronics", "avg_ticket": 18500},
    {"name": "UrbanVibe Fashion", "category": "Fashion", "avg_ticket": 3200},
    {"name": "NexusPay Credits", "category": "Digital Gaming", "avg_ticket": 1200},
    {"name": "FlyBharat Airways", "category": "Travel & Flights", "avg_ticket": 12500},
    {"name": "QuickBite Mart", "category": "Quick Commerce", "avg_ticket": 650},
    {"name": "CloudScale Cloud Hosting", "category": "SaaS", "avg_ticket": 8400},
]
PAYMENT_METHODS = ["UPI_PHONEPE", "UPI_GPAY", "UPI_PAYTM", "RUPAY_CARD", "VISA_CARD", "MASTERCARD", "NETBANKING_HDFC", "NETBANKING_ICICI"]
DISPOSABLE_DOMAINS = ["tempmail.ninja", "dispostable.com", "trashmail.io", "guerrillamail.biz", "10minutemail.cfd"]
TRUSTED_DOMAINS = ["gmail.com", "yahoo.co.in", "outlook.com", "icloud.com", "tcs.com", "infosys.com"]

FIRST_NAMES = [
    "Aarav", "Vihaan", "Aditya", "Sai", "Reyansh", "Arjun", "Rohan", "Kabir", "Vivaan", "Ishaan",
    "Sanya", "Ananya", "Diya", "Aadhya", "Pari", "Isha", "Meera", "Pooja", "Kavya", "Sneha"
]
LAST_NAMES = ["Sharma", "Verma", "Patel", "Reddy", "Nair", "Iyer", "Mehta", "Deshmukh", "Choudhury", "Bose"]

def generate_transaction_pool(total_count=1000, seed=42):
    random.seed(seed)
    np.random.seed(seed)
    
    transactions = []
    base_time = datetime.now() - timedelta(days=5)
    
    for i in range(total_count):
        txn_id = f"txn_razor_{100000 + i}"
        cust_first = random.choice(FIRST_NAMES)
        cust_last = random.choice(LAST_NAMES)
        cust_name = f"{cust_first} {cust_last}"
        cust_id = f"cust_{hash(cust_name) % 90000 + 10000}"
        
        merchant = random.choice(MERCHANTS)
        pay_method = random.choice(PAYMENT_METHODS)
        
        # Decide if this transaction is simulated fraud (target ~10% fraud rate)
        is_fraud = random.random() < 0.10
        
        # Incremental timestamp over 5 days
        minutes_offset = int((i / total_count) * 5 * 24 * 60) + random.randint(0, 15)
        txn_time = base_time + timedelta(minutes=minutes_offset)
        hour = txn_time.hour
        is_nocturnal = 1 <= hour <= 4
        
        if is_fraud:
            # Pick a fraud typology
            fraud_archetype = random.choice(["velocity_botnet", "high_ticket_mismatch", "proxy_takeover", "friendly_fraud_ring", "low_profile_evader"])
            
            if fraud_archetype == "velocity_botnet":
                amount = round(random.uniform(200, 1500), 2)
                velocity_1h = random.randint(6, 24)
                velocity_24h = velocity_1h + random.randint(5, 30)
                is_device_known = False
                is_proxy_or_vpn = True
                is_ip_mismatch = True
                ip_city = random.choice(FOREIGN_CITIES)
                shipping_city = random.choice(INDIAN_CITIES)
                billing_city = random.choice(INDIAN_CITIES)
                email = f"{cust_first.lower()}.{random.randint(10,99)}@{random.choice(DISPOSABLE_DOMAINS)}"
                device_fp = f"dev_anon_{random.randint(1000, 9999)}"
                card_bin = "453275"
                historical_dispute_count = random.randint(0, 1)
                dispute_eligible = True
                dispute_reason = "UNAUTHORIZED_TRANSACTION"

            elif fraud_archetype == "high_ticket_mismatch":
                amount = round(merchant["avg_ticket"] * random.uniform(2.5, 4.5), 2)
                velocity_1h = random.randint(2, 5)
                velocity_24h = velocity_1h + random.randint(3, 8)
                is_device_known = False
                is_proxy_or_vpn = random.random() < 0.65
                is_ip_mismatch = True
                ip_city = random.choice(INDIAN_CITIES)
                shipping_city = random.choice(INDIAN_CITIES)
                billing_city = random.choice([c for c in INDIAN_CITIES if c != shipping_city])
                email = f"{cust_first.lower()}_{cust_last.lower()}@{random.choice(DISPOSABLE_DOMAINS)}"
                device_fp = f"dev_new_{random.randint(1000, 9999)}"
                card_bin = "521456"
                historical_dispute_count = random.randint(1, 3)
                dispute_eligible = True
                dispute_reason = "GOODS_NOT_RECEIVED"

            elif fraud_archetype == "proxy_takeover":
                amount = round(random.uniform(8000, 35000), 2)
                velocity_1h = random.randint(3, 8)
                velocity_24h = velocity_1h + random.randint(4, 12)
                is_device_known = False
                is_proxy_or_vpn = True
                is_ip_mismatch = True
                ip_city = random.choice(FOREIGN_CITIES)
                shipping_city = random.choice(INDIAN_CITIES)
                billing_city = shipping_city
                email = f"{cust_first.lower()}{random.randint(100,999)}@{random.choice(TRUSTED_DOMAINS)}"
                device_fp = f"dev_proxy_{random.randint(1000, 9999)}"
                card_bin = "402400"
                historical_dispute_count = random.randint(0, 2)
                dispute_eligible = True
                dispute_reason = "UNAUTHORIZED_TRANSACTION"

            elif fraud_archetype == "low_profile_evader":
                # Stealthy fraudster: normal amount, normal email, single attempt, subtle geo mismatch
                amount = round(merchant["avg_ticket"] * random.uniform(0.9, 1.6), 2)
                velocity_1h = 1
                velocity_24h = 1
                is_device_known = False
                is_proxy_or_vpn = False
                is_ip_mismatch = True
                ip_city = random.choice(INDIAN_CITIES)
                shipping_city = random.choice([c for c in INDIAN_CITIES if c != ip_city])
                billing_city = shipping_city
                email = f"{cust_first.lower()}{random.randint(10,99)}@{random.choice(TRUSTED_DOMAINS)}"
                device_fp = f"dev_evd_{random.randint(1000, 9999)}"
                card_bin = "550000"
                historical_dispute_count = 0
                dispute_eligible = True
                dispute_reason = "UNAUTHORIZED_TRANSACTION"

            else: # friendly_fraud_ring
                amount = round(random.uniform(4000, 18000), 2)
                velocity_1h = 1
                velocity_24h = random.randint(1, 3)
                is_device_known = True
                is_proxy_or_vpn = False
                is_ip_mismatch = False
                ip_city = random.choice(INDIAN_CITIES)
                shipping_city = ip_city
                billing_city = ip_city
                email = f"{cust_first.lower()}.{cust_last.lower()}@{random.choice(TRUSTED_DOMAINS)}"
                device_fp = f"dev_usr_{cust_id}"
                card_bin = "607152"
                historical_dispute_count = random.randint(2, 4)
                dispute_eligible = True
                dispute_reason = "FRIENDLY_FRAUD"

        else:
            # Clean legitimate transaction
            # Some legitimate users travel or purchase gifts with shipping != billing (edge cases)
            is_gift_or_travel = random.random() < 0.05
            amount = round(merchant["avg_ticket"] * (random.uniform(0.6, 1.5) if not is_gift_or_travel else random.uniform(1.8, 3.2)), 2)
            velocity_1h = 1 if random.random() < 0.88 else (2 if not is_gift_or_travel else 3)
            velocity_24h = velocity_1h + (1 if random.random() < 0.25 else 0)
            is_device_known = random.random() < 0.90 if not is_gift_or_travel else False
            is_proxy_or_vpn = False if not is_gift_or_travel else (random.random() < 0.4)
            city = random.choice(INDIAN_CITIES)
            ip_city = city if not is_gift_or_travel else random.choice(INDIAN_CITIES)
            shipping_city = city
            billing_city = city if not is_gift_or_travel else random.choice(INDIAN_CITIES)
            is_ip_mismatch = (ip_city != shipping_city)
            email = f"{cust_first.lower()}.{cust_last.lower()}{random.randint(1,99)}@{random.choice(TRUSTED_DOMAINS)}"
            device_fp = f"dev_usr_{cust_id}" if is_device_known else f"dev_new_{random.randint(1000,9999)}"
            card_bin = random.choice(["411111", "550000", "607152", "652150"])
            historical_dispute_count = 0
            dispute_eligible = random.random() < 0.02
            dispute_reason = "GOODS_NOT_RECEIVED" if dispute_eligible else None

        txn = {
            "id": txn_id,
            "timestamp": txn_time.isoformat(),
            "customer_id": cust_id,
            "customer_name": cust_name,
            "customer_email": email,
            "merchant_name": merchant["name"],
            "merchant_category": merchant["category"],
            "payment_method": pay_method,
            "amount": amount,
            "currency": "INR",
            "ip_city": ip_city,
            "billing_city": billing_city,
            "shipping_city": shipping_city,
            "device_fingerprint": device_fp,
            "card_bin": card_bin,
            "velocity_1h": velocity_1h,
            "velocity_24h": velocity_24h,
            "is_device_known": is_device_known,
            "is_ip_mismatch": is_ip_mismatch,
            "is_proxy_or_vpn": is_proxy_or_vpn,
            "is_nocturnal": is_nocturnal,
            "historical_dispute_count": historical_dispute_count,
            "is_fraud": is_fraud, # Ground-truth label
            "dispute_eligible": dispute_eligible,
            "dispute_reason": dispute_reason,
            "dispute_status": "CHARGEBACK_INITIATED" if dispute_eligible and random.random() < 0.6 else ("NONE" if not dispute_eligible else "EVIDENCE_SUBMITTED"),
            "delivery_status": "DELIVERED" if not is_fraud else ("IN_TRANSIT" if random.random() < 0.5 else "DELIVERED"),
            "courier_partner": random.choice(["Delhivery", "BlueDart", "Shadowfax", "EcomExpress"]),
            "courier_tracking_id": f"DEL-{random.randint(10000000, 99999999)}",
            "three_ds_auth": "SUCCESS" if (is_fraud and pay_method.startswith("UPI")) or not is_fraud else "BYPASSED_SUSPECT"
        }
        transactions.append(txn)
    
    # Strictly split into 75% training/tuning set and 25% held-out test set
    split_index = int(total_count * 0.75)
    train_pool = transactions[:split_index]
    held_out_test_pool = transactions[split_index:]
    
    return train_pool, held_out_test_pool

if __name__ == "__main__":
    train_data, test_data = generate_transaction_pool(1000)
    print(f"Generated {len(train_data)} train/tuning transactions and {len(test_data)} strictly held-out test transactions.")
    fraud_train = sum(1 for t in train_data if t['is_fraud'])
    fraud_test = sum(1 for t in test_data if t['is_fraud'])
    print(f"Train fraud count: {fraud_train} ({fraud_train/len(train_data):.1%}), Test fraud count: {fraud_test} ({fraud_test/len(test_data):.1%})")
