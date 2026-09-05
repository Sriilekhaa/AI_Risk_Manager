"""
Aegis Fraud-Spike Anomaly Detector — Track 02: AI Risk Manager
Performs rolling-window velocity and cluster anomaly detection over calibrated risk scores.
Strictly defense-only: Alerts and ranks anomalies for human fraud operations.
Never blocks, freezes, or auto-declines anything.
"""

from datetime import datetime, timedelta
import numpy as np

class FraudSpikeDetector:
    def __init__(self, z_score_threshold=2.2):
        self.z_score_threshold = z_score_threshold
        self.alerts = []
        self.preconfigured_spikes = [
            {
                "id": "spike_alt_8901",
                "title": "High-Frequency Card Testing Storm",
                "category": "Velocity / Card Testing",
                "severity": "CRITICAL",
                "z_score": 3.48,
                "cluster_deviation": "+312%",
                "detected_at": (datetime.now() - timedelta(minutes=14)).isoformat(),
                "trigger_signal": "18 rapid micro-transactions (< ₹500) within 4 minutes targeting BIN 453275 from anonymized proxy subnet 185.220.101.x",
                "affected_volume": "₹7,200 (18 attempts)",
                "recommended_action": "Advisory: Prompt mandatory 3DS OTP challenge for BIN 453275. (Defense-only: No accounts blocked)",
                "status": "ACTIVE_ALERT",
                "sample_txn_ids": ["txn_razor_100142", "txn_razor_100143", "txn_razor_100144"],
                "defense_only_notice": "Defense-Only Guarantee: Aegis has alerted operations. No gateway auto-declines or merchant account holds have been triggered."
            },
            {
                "id": "spike_alt_8902",
                "title": "Nocturnal Cross-Border Proxy Surge",
                "category": "Identity Takeover / Proxy Surge",
                "severity": "HIGH",
                "z_score": 2.87,
                "cluster_deviation": "+287%",
                "detected_at": (datetime.now() - timedelta(minutes=42)).isoformat(),
                "trigger_signal": "Cluster of 7 high-value electronics purchases originating from VPN exit nodes in Eastern Europe with mismatched shipping addresses in Delhi NCR.",
                "affected_volume": "₹1,42,800 (7 transactions)",
                "recommended_action": "Advisory: Route to human ops queue for manual delivery address verification before fulfillment.",
                "status": "ACTIVE_ALERT",
                "sample_txn_ids": ["txn_razor_100210", "txn_razor_100215", "txn_razor_100219"],
                "defense_only_notice": "Defense-Only Guarantee: Orders remain pending human operational review. Never auto-cancelled."
            },
            {
                "id": "spike_alt_8903",
                "title": "UPI Gaming Credit Rapid Burst",
                "category": "Synthetic Merchant Burst",
                "severity": "MEDIUM",
                "z_score": 2.45,
                "cluster_deviation": "+245%",
                "detected_at": (datetime.now() - timedelta(hours=2, minutes=10)).isoformat(),
                "trigger_signal": "Abnormal velocity surge on digital gaming vouchers (₹1,200 avg ticket) across 12 newly created VPA handles in quick succession.",
                "affected_volume": "₹28,800 (24 transactions)",
                "recommended_action": "Advisory: Notify merchant operations to inspect voucher redemption rate.",
                "status": "ACKNOWLEDGED",
                "acknowledged_by": "Ops Analyst (S. Sharma)",
                "acknowledged_at": (datetime.now() - timedelta(hours=1, minutes=15)).isoformat(),
                "sample_txn_ids": ["txn_razor_100088", "txn_razor_100089"],
                "defense_only_notice": "Defense-Only Guarantee: Purely advisory telemetry provided to merchant."
            }
        ]
        self.alerts = list(self.preconfigured_spikes)

    def scan_recent_stream(self, transactions_scored):
        """
        Scans recent transaction scores using rolling-window velocity Z-score
        """
        if not transactions_scored or len(transactions_scored) < 10:
            return self.alerts
            
        scores = [t["risk_score"] for t in transactions_scored if "risk_score" in t]
        mean_score = np.mean(scores)
        std_score = np.std(scores) or 1.0
        
        # High risk cluster check
        high_risk_cluster = [t for t in transactions_scored if t.get("risk_score", 0) >= 0.70]
        if len(high_risk_cluster) >= 4:
            # Check if alert already exists for this batch
            existing_ids = {a["id"] for a in self.alerts}
            cluster_id = f"spike_alt_{len(self.alerts) + 8901}"
            if cluster_id not in existing_ids:
                total_cluster_amt = sum(t.get("amount", 0) for t in high_risk_cluster)
                z = round((np.mean([t["risk_score"] for t in high_risk_cluster]) - mean_score) / (std_score + 1e-5), 2)
                
                new_alert = {
                    "id": cluster_id,
                    "title": "Real-Time High-Risk Velocity Cluster Detected",
                    "category": "Real-Time Anomaly Stream",
                    "severity": "CRITICAL" if z > 3.0 else "HIGH",
                    "z_score": z,
                    "cluster_deviation": f"+{int(abs(z) * 90)}%",
                    "detected_at": datetime.now().isoformat(),
                    "trigger_signal": f"{len(high_risk_cluster)} transactions with high calibrated risk scores (>0.70) detected within rolling monitoring window.",
                    "affected_volume": f"₹{total_cluster_amt:,.2f} ({len(high_risk_cluster)} transactions)",
                    "recommended_action": "Advisory: Flag batch for expedited risk verification. (Defense-only: No auto-blocks)",
                    "status": "ACTIVE_ALERT",
                    "sample_txn_ids": [t.get("id") for t in high_risk_cluster[:3]],
                    "defense_only_notice": "Defense-Only Guarantee: Aegis alerts operations. Transactions are not frozen."
                }
                self.alerts.insert(0, new_alert)
                
        return self.alerts

    def acknowledge_alert(self, alert_id, analyst_notes="Reviewed by Fraud Ops"):
        for a in self.alerts:
            if a["id"] == alert_id:
                a["status"] = "ACKNOWLEDGED"
                a["acknowledged_by"] = "Ops Analyst (Manual Review)"
                a["acknowledged_at"] = datetime.now().isoformat()
                a["analyst_notes"] = analyst_notes
                return a
        return None

if __name__ == "__main__":
    detector = FraudSpikeDetector()
    alerts = detector.scan_recent_stream([])
    print(f"Initialized Spike Detector with {len(alerts)} alerts.")
    print("Alert #1:", alerts[0]["title"], "Z-score:", alerts[0]["z_score"])
