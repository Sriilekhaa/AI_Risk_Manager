"""
Aegis Backend Server Runner
Starts uvicorn ASGI server on port 8001.
"""

import uvicorn

if __name__ == "__main__":
    print("Starting Aegis AI Risk Manager Backend on http://localhost:8001 ...")
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
