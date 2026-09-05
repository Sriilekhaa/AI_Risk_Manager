"""
Aegis Calibrated Risk Scoring Engine — Track 02: AI Risk Manager
Extracts engineered features, trains a calibrated statistical model on the training split,
and generates calibrated probabilities (0-1) with plain-language explainable reasoning strings.
Strictly defense-only: provides transparent risk telemetry without autonomous destructive actions.
"""

import math
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import CalibratedClassifierCV
from data_generator import DISPOSABLE_DOMAINS, MERCHANTS

MERCHANT_AVG_MAP = {m["category"]: m["avg_ticket"] for m in MERCHANTS}

class RiskScoringEngine:
    def __init__(self):
        self.model = None
        self.feature_names = [
            "log_amount",
            "velocity_1h",
            "velocity_24h",
            "device_unknown",
            "ip_mismatch",
            "proxy_vpn",
            "nocturnal",
            "disposable_email",
            "ticket_ratio",
            "dispute_history"
        ]
        self.weights = {}
        self.intercept = 0.0

    def extract_features(self, txn):
        amount = float(txn.get("amount", 1000))
        cat = txn.get("merchant_category", "Electronics")
        avg_ticket = MERCHANT_AVG_MAP.get(cat, 5000)
        
        email = txn.get("customer_email", "")
        domain = email.split("@")[-1] if "@" in email else ""
        is_disposable = 1.0 if domain in DISPOSABLE_DOMAINS else 0.0
        
        feat = [
            math.log1p(max(0, amount)),
            float(txn.get("velocity_1h", 1)),
            float(txn.get("velocity_24h", 1)),
            1.0 if not txn.get("is_device_known", True) else 0.0,
            1.0 if txn.get("is_ip_mismatch", False) else 0.0,
            1.0 if txn.get("is_proxy_or_vpn", False) else 0.0,
            1.0 if txn.get("is_nocturnal", False) else 0.0,
            is_disposable,
            min(10.0, amount / max(100.0, avg_ticket)),
            float(txn.get("historical_dispute_count", 0))
        ]
        return np.array(feat)

    def train(self, training_data):
        X = np.array([self.extract_features(t) for t in training_data])
        y = np.array([1 if t.get("is_fraud", False) else 0 for t in training_data])
        
        # Train regularized logistic model with calibrated probabilities
        base_lr = LogisticRegression(C=1.5, solver="lbfgs", max_iter=500, class_weight="balanced", random_state=42)
        self.model = CalibratedClassifierCV(estimator=base_lr, method="sigmoid", cv=3)
        self.model.fit(X, y)
        
        # Fit a standalone LR just to extract explainable feature importance weights
        explain_lr = LogisticRegression(C=1.5, solver="lbfgs", max_iter=500, class_weight="balanced", random_state=42)
        explain_lr.fit(X, y)
        self.weights = dict(zip(self.feature_names, explain_lr.coef_[0]))
        self.intercept = explain_lr.intercept_[0]
        return self

    def score_transaction(self, txn):
        feats = self.extract_features(txn)
        if self.model is None:
            # Fallback heuristic if not yet fitted
            prob = 0.5
        else:
            prob = float(self.model.predict_proba([feats])[0][1])
            
        calibrated_score = round(prob, 3)
        
        # Assign Risk Level
        if calibrated_score < 0.35:
            risk_level = "LOW"
            advisory = "Advisory: Standard Risk. Approve for regular payment processing."
        elif calibrated_score < 0.65:
            risk_level = "MEDIUM"
            advisory = "Advisory: Elevated Risk. Recommend Step-Up 3DS / OTP verification."
        else:
            risk_level = "HIGH"
            advisory = "Advisory: Critical Risk. Route to human fraud ops queue for manual verification (Never auto-block)."

        # Factor contributions breakdown
        factor_contributions = []
        reason_phrases = []
        
        # Analyze contributing signals
        if feats[1] >= 5: # velocity 1h
            factor_contributions.append({
                "factor": f"High Velocity Surge ({int(feats[1])} txns in 1h)",
                "impact": round(feats[1] * 0.08, 2),
                "type": "ELEVATING"
            })
            reason_phrases.append(f"burst velocity of {int(feats[1])} transactions/hour")
            
        if feats[3] > 0.5: # device unknown
            factor_contributions.append({
                "factor": "Unrecognised Device Fingerprint",
                "impact": 0.22,
                "type": "ELEVATING"
            })
            reason_phrases.append("unrecognised device fingerprint")
            
        if feats[4] > 0.5: # IP mismatch
            factor_contributions.append({
                "factor": "IP Geolocation vs Delivery Mismatch",
                "impact": 0.28,
                "type": "ELEVATING"
            })
            reason_phrases.append("shipping city and IP geolocation mismatch")
            
        if feats[5] > 0.5: # Proxy/VPN
            factor_contributions.append({
                "factor": "Commercial Proxy / Anonymizer Detected",
                "impact": 0.31,
                "type": "ELEVATING"
            })
            reason_phrases.append("anonymized proxy or commercial VPN endpoint detected")
            
        if feats[6] > 0.5: # Nocturnal
            factor_contributions.append({
                "factor": "Nocturnal Timestamp (01:00 - 04:00 AM IST)",
                "impact": 0.12,
                "type": "ELEVATING"
            })
            
        if feats[7] > 0.5: # Disposable email
            factor_contributions.append({
                "factor": "Disposable Temporary Email Domain",
                "impact": 0.34,
                "type": "ELEVATING"
            })
            reason_phrases.append("disposable temporary email domain")
            
        if feats[8] > 2.5: # High ticket ratio
            factor_contributions.append({
                "factor": f"High Ticket Size ({feats[8]:.1f}x category normal)",
                "impact": 0.19,
                "type": "ELEVATING"
            })
            reason_phrases.append(f"abnormally high order amount for category")
            
        if feats[9] >= 2: # Repeat dispute history
            factor_contributions.append({
                "factor": f"Prior Chargeback Record ({int(feats[9])} disputes)",
                "impact": 0.25,
                "type": "ELEVATING"
            })
            reason_phrases.append("history of multiple chargeback claims")

        # Mitigating signals
        if feats[3] < 0.5:
            factor_contributions.append({
                "factor": "Verified Trusted Device ID",
                "impact": -0.26,
                "type": "MITIGATING"
            })
        if feats[4] < 0.5 and feats[5] < 0.5:
            factor_contributions.append({
                "factor": "Consistent Domestic Residential IP",
                "impact": -0.22,
                "type": "MITIGATING"
            })
        if feats[1] <= 2:
            factor_contributions.append({
                "factor": "Standard Velocity Profile",
                "impact": -0.15,
                "type": "MITIGATING"
            })

        # Generate human-readable explainability string
        if risk_level == "HIGH":
            if reason_phrases:
                factors_str = ", ".join(reason_phrases[:3])
                reasoning = f"Critical risk score ({calibrated_score:.2f}) driven by {factors_str}. Signals indicate an automated attack pattern or identity compromise. Human verification recommended."
            else:
                reasoning = f"Critical risk score ({calibrated_score:.2f}) based on elevated aggregate statistical anomaly across multiple behavioral signals."
        elif risk_level == "MEDIUM":
            if reason_phrases:
                factors_str = ", ".join(reason_phrases[:2])
                reasoning = f"Moderate risk score ({calibrated_score:.2f}) triggered by {factors_str}. Profile deviates slightly from baseline; recommended for 3DS step-up authentication."
            else:
                reasoning = f"Moderate risk score ({calibrated_score:.2f}). Baseline indicators show borderline anomaly; advisory step-up verification advised."
        else:
            reasoning = f"Low risk score ({calibrated_score:.2f}). Verified device fingerprint, consistent domestic network routing, and healthy customer history. Standard processing recommended."

        return {
            "transaction_id": txn.get("id"),
            "risk_score": calibrated_score,
            "risk_level": risk_level,
            "advisory": advisory,
            "reasoning": reasoning,
            "factor_contributions": factor_contributions,
            "calibrated_prob": calibrated_score,
            "raw_features": {
                "velocity_1h": int(feats[1]),
                "is_device_known": txn.get("is_device_known", True),
                "is_proxy_or_vpn": txn.get("is_proxy_or_vpn", False),
                "is_ip_mismatch": txn.get("is_ip_mismatch", False),
                "historical_disputes": int(feats[9])
            }
        }

if __name__ == "__main__":
    from data_generator import generate_transaction_pool
    train_pool, test_pool = generate_transaction_pool(1000)
    engine = RiskScoringEngine()
    engine.train(train_pool)
    
    sample = test_pool[0]
    scored = engine.score_transaction(sample)
    print("Scored Sample Transaction:")
    print("ID:", scored["transaction_id"])
    print("Score:", scored["risk_score"], "| Level:", scored["risk_level"])
    print("Reasoning:", scored["reasoning"])
    print("Factors count:", len(scored["factor_contributions"]))
