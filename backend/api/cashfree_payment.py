import requests
import json
from django.conf import settings
from decimal import Decimal
from datetime import datetime


class CashfreePayment:
    def __init__(self):
        self.app_id = settings.CASHFREE_APP_ID
        self.secret_key = settings.CASHFREE_SECRET_KEY
        self.api_url = settings.CASHFREE_API_URL
        self.redirect_url = settings.CASHFREE_REDIRECT_URL
        self.callback_url = settings.CASHFREE_CALLBACK_URL
    
    def get_headers(self):
        return {
            "Content-Type": "application/json",
            "x-api-version": "2022-09-01",
            "x-client-id": self.app_id,
            "x-client-secret": self.secret_key
        }
    
    def create_payment_session(self, order_id, amount, customer_details, order_meta=None):
        if isinstance(amount, Decimal):
            amount_paise = int(amount * 100)
        elif isinstance(amount, float):
            amount_paise = int(amount * 100)
        else:
            amount_paise = int(amount * 100)
        
        payload = {
            "order_id": order_id,
            "order_amount": amount_paise,
            "order_currency": "INR",
            "customer_details": {
                "customer_id": customer_details.get("customer_id", ""),
                "customer_name": customer_details.get("name", ""),
                "customer_email": customer_details.get("email", ""),
                "customer_phone": customer_details.get("phone", "")
            },
            "order_meta": order_meta or {
                "return_url": self.redirect_url + f"?order_id={order_id}",
                "notify_url": self.callback_url
            }
        }
        
        headers = self.get_headers()
        
        try:
            response = requests.post(
                f"{self.api_url}/pg/orders",
                json=payload,
                headers=headers,
                timeout=10
            )
            response.raise_for_status()
            result = response.json()
            
            if result.get("payment_session_id"):
                return {
                    "success": True,
                    "payment_session_id": result["payment_session_id"],
                    "order_id": order_id,
                    "payment_url": result.get("payment_link", "")
                }
            else:
                return {
                    "success": False,
                    "error": result.get("message", "Payment session creation failed")
                }
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": f"API request failed: {str(e)}"
            }
    
    def get_payment_status(self, order_id):
        headers = self.get_headers()
        
        try:
            response = requests.get(
                f"{self.api_url}/pg/orders/{order_id}",
                headers=headers,
                timeout=10
            )
            response.raise_for_status()
            result = response.json()
            
            return {
                "success": True,
                "data": result
            }
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": f"Status check failed: {str(e)}"
            }
    
    def verify_webhook_signature(self, order_id, order_amount, reference_id, tx_status, payment_message, signature):
        try:
            message = f"{order_id}{order_amount}{reference_id}{tx_status}{payment_message}"
            import hmac
            import hashlib
            
            expected_signature = hmac.new(
                self.secret_key.encode(),
                message.encode(),
                hashlib.sha256
            ).hexdigest()
            
            return expected_signature == signature
        except Exception:
            return False


cashfree_client = CashfreePayment()









