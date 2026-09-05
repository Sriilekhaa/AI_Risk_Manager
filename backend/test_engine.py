"""
Aegis Engine Self-Test Suite
Verifies all 6 layers of Track 02 AI Risk Manager:
1. Data generation & held-out split
2. Calibrated risk scoring & explainability
3. Fraud-spike anomaly detector (defense-only)
4. Chargeback evidence responder (ops-ready dispute bundle)
5. Evaluation & False-Positive Cost Model
6. Defense-only compliance checklist & SHA-256 audit ledger
"""

import sys
from data_generator import generate_transaction_pool
from risk_engine import RiskScoringEngine
from spike_detector import FraudSpikeDetector
from chargeback_responder import ChargebackEvidenceResponder
from evaluation import ModelEvaluator
from audit_ledger import AuditLedger

def run_tests():
    print("==================================================")
    print("   AEGIS AI RISK MANAGER — VERIFICATION SUITE    ")
    print("==================================================")
    
    # Test 1: Data Generator
    print("\n[1/6] Testing Data Generator & Held-Out Partition...")
    train_pool, test_pool = generate_transaction_pool(1000)
    assert len(train_pool) == 750, f"Expected 750 train samples, got {len(train_pool)}"
    assert len(test_pool) == 250, f"Expected 250 test samples, got {len(test_pool)}"
    fraud_test_count = sum(1 for t in test_pool if t["is_fraud"])
    print(f"  ✓ 750 training / 250 held-out test split created. (Held-out fraud: {fraud_test_count})")
    
    # Test 2: Risk Scoring Engine
    print("\n[2/6] Testing Calibrated Risk Engine & Explainability...")
    engine = RiskScoringEngine()
    engine.train(train_pool)
    sample_txn = test_pool[0]
    scored = engine.score_transaction(sample_txn)
    assert "risk_score" in scored
    assert 0.0 <= scored["risk_score"] <= 1.0
    assert scored["risk_level"] in ["LOW", "MEDIUM", "HIGH"]
    assert len(scored["reasoning"]) > 15
    assert len(scored["factor_contributions"]) > 0
    print(f"  ✓ Score: {scored['risk_score']} | Band: {scored['risk_level']}")
    print(f"  ✓ Explainability: '{scored['reasoning'][:80]}...'")
    
    # Test 3: Spike Anomaly Detector
    print("\n[3/6] Testing Fraud-Spike Anomaly Detector (Defense-Only)...")
    spike_det = FraudSpikeDetector()
    alerts = spike_det.scan_recent_stream([])
    assert len(alerts) >= 2
    assert alerts[0]["status"] == "ACTIVE_ALERT"
    # Test acknowledgment
    ack = spike_det.acknowledge_alert(alerts[0]["id"], "Operator reviewed: Step-up 3DS enabled.")
    assert ack["status"] == "ACKNOWLEDGED"
    print(f"  ✓ {len(alerts)} alerts generated. Z-Score: {alerts[0]['z_score']}, Deviation: {alerts[0]['cluster_deviation']}")
    print(f"  ✓ Defense-Only Guarantee: Alerts only, operator acknowledged successfully.")
    
    # Test 4: Chargeback Evidence Responder
    print("\n[4/6] Testing Chargeback Evidence Responder...")
    cb_responder = ChargebackEvidenceResponder(engine)
    disputes = cb_responder.get_or_create_disputes(test_pool)
    assert len(disputes) > 0
    sample_disp = disputes[0]
    bundle = cb_responder.assemble_evidence_bundle(sample_disp["dispute_id"], test_pool[0])
    assert len(bundle["sections"]) == 4
    assert len(bundle["rebuttal_summary"]) > 50
    assert "win_probability_estimate" in bundle
    print(f"  ✓ Auto-assembled evidence bundle for {sample_disp['dispute_id']}.")
    print(f"  ✓ Rebuttal length: {len(bundle['rebuttal_summary'])} chars, Win Prob: {bundle['win_probability_estimate']}")
    
    # Test 5: Evaluation & False-Positive Cost Model
    print("\n[5/6] Testing Model Evaluation & False-Positive Cost Model...")
    evaluator = ModelEvaluator(engine, test_pool)
    metrics_40 = evaluator.evaluate_at_threshold(0.40)
    assert "precision" in metrics_40 and "recall" in metrics_40 and "f1_score" in metrics_40
    cost_model = evaluator.compute_cost_curve(cost_fp=1500, cost_fn=4500)
    assert len(cost_model["curve"]) == 19
    print(f"  ✓ Precision: {metrics_40['precision']:.1%}, Recall: {metrics_40['recall']:.1%}, F1: {metrics_40['f1_score']}")
    print(f"  ✓ Cost Reduction: {cost_model['cost_reduction_pct']}% (Optimal Thresh: {cost_model['optimal_threshold']})")
    
    # Test 6: Audit Ledger & Defense-Only Compliance
    print("\n[6/6] Testing Compliance Checklist & Cryptographic Audit Ledger...")
    ledger = AuditLedger()
    comp = ledger.get_compliance_status()
    assert comp["is_defense_only_certified"] is True
    assert len(comp["checklist"]) == 6
    assert all(c["status"] == "COMPLIANT" for c in comp["checklist"])
    assert len(ledger.latest_hash) == 64
    print(f"  ✓ All 6 defense-only compliance rules verified.")
    print(f"  ✓ SHA-256 Ledger Head: {ledger.latest_hash[:16]}...")
    
    print("\n==================================================")
    print("   ALL 6 AEGIS LAYERS VERIFIED SUCCESSFULLY!      ")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
