import base64
import json
import hashlib
import requests
from django.conf import settings
from decimal import Decimal
from datetime import datetime, timedelta


class PhonePePayment:
    def __init__(self):
        self.client_id = settings.PHONEPE_CLIENT_ID
        self.client_secret = settings.PHONEPE_CLIENT_SECRET
        self.merchant_id = settings.PHONEPE_MERCHANT_ID
        self.api_url = settings.PHONEPE_API_URL
        self.redirect_url = settings.PHONEPE_REDIRECT_URL
        self.callback_url = settings.PHONEPE_CALLBACK_URL
        self._access_token = None
        self._token_expiry = None
    
    def get_access_token(self):
        if self._access_token and self._token_expiry and datetime.now() < self._token_expiry:
            return self._access_token
        
        try:
            if not self.client_id or not self.client_secret:
                raise Exception("PhonePe credentials not configured. Please check CLIENT_ID and CLIENT_SECRET in .env file")
            
            auth_url = f"{self.api_url}/v1/oauth/token"
            headers = {
                "Content-Type": "application/x-www-form-urlencoded"
            }
            
            data = {
                "grant_type": "client_credentials",
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "client_version": "1"
            }
            
            print(f"[PhonePe OAuth] Requesting token from: {auth_url}")
            print(f"[PhonePe OAuth] Client ID: {self.client_id[:20]}...")
            print(f"[PhonePe OAuth] Client Secret: {'SET' if self.client_secret else 'MISSING'}")
            
            response = requests.post(auth_url, headers=headers, data=data, timeout=10)
            print(f"[PhonePe OAuth] Response status: {response.status_code}")
            
            if response.status_code != 200:
                try:
                    error_data = response.json()
                    print(f"[PhonePe OAuth] Error response: {error_data}")
                    error_msg = error_data.get("message", error_data.get("error", response.text))
                except:
                    error_msg = response.text
                raise Exception(f"OAuth token request failed ({response.status_code}): {error_msg}")
            
            result = response.json()
            
            if not result.get("access_token"):
                raise Exception(f"No access token in response: {result}")
            
            self._access_token = result.get("access_token")
            expires_in = result.get("expires_in", 3600)
            self._token_expiry = datetime.now() + timedelta(seconds=expires_in - 60)
            
            print(f"[PhonePe OAuth] Token retrieved successfully")
            return self._access_token
        except requests.exceptions.RequestException as e:
            error_msg = f"Failed to get access token: {str(e)}"
            if hasattr(e, 'response') and e.response is not None:
                try:
                    error_data = e.response.json()
                    error_msg += f" - {error_data}"
                except:
                    error_msg += f" - {e.response.text[:200]}"
            print(f"[PhonePe OAuth] Error: {error_msg}")
            raise Exception(error_msg)
    
    def verify_callback(self, callback_body, authorization_header, username, password):
        try:
            if not authorization_header:
                return False
            callback_data = json.loads(callback_body)
            return callback_data is not None
        except Exception:
            return False
    
    def create_payment_request(self, transaction_id, amount, user_id, order_id):
        access_token = self.get_access_token()
        
        if isinstance(amount, Decimal):
            amount = int(amount * 100)
        elif isinstance(amount, float):
            amount = int(amount * 100)
        else:
            amount = int(amount)
        
        payload = {
            "merchantId": self.merchant_id,
            "merchantTransactionId": transaction_id,
            "merchantUserId": str(user_id),
            "amount": amount,
            "redirectUrl": self.redirect_url,
            "redirectMode": "REDIRECT",
            "callbackUrl": self.callback_url,
            "paymentInstrument": {
                "type": "PAY_PAGE"
            }
        }
        
        if not self.merchant_id:
            raise Exception("PhonePe Merchant ID not configured. Please check PHONEPE_MERCHANT_ID in .env file")
        
        print(f"[PhonePe] Creating payment request:")
        print(f"  API URL: {self.api_url}/checkout/v2/pay")
        print(f"  Merchant ID: {self.merchant_id}")
        print(f"  Transaction ID: {transaction_id}")
        print(f"  Amount: {amount} paise")
        print(f"  Redirect URL: {self.redirect_url}")
        print(f"  Callback URL: {self.callback_url}")
        print(f"  Payload: {json.dumps(payload, indent=2)}")
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/json"
        }
        
        try:
            api_endpoint = f"{self.api_url}/checkout/v2/pay"
            print(f"[PhonePe] Making request to: {api_endpoint}")
            
            response = requests.post(
                api_endpoint,
                json=payload,
                headers=headers,
                timeout=10
            )
            
            print(f"[PhonePe] Response status: {response.status_code}")
            print(f"[PhonePe] Response headers: {dict(response.headers)}")
            
            try:
                result = response.json()
                print(f"[PhonePe] Response body: {result}")
            except:
                print(f"[PhonePe] Response text: {response.text[:500]}")
            
            response.raise_for_status()
            result = response.json()
            
            if result.get("success") and result.get("data"):
                payment_url = result["data"].get("redirectUrl") or result["data"].get("redirect_url")
                if not payment_url:
                    print(f"[PhonePe] Warning: No redirectUrl in response data: {result.get('data')}")
                return {
                    "success": True,
                    "payment_url": payment_url,
                    "transaction_id": transaction_id
                }
            else:
                error_msg = result.get("message", result.get("error", "Payment request failed"))
                print(f"[PhonePe] Payment creation failed: {error_msg}")
                print(f"[PhonePe] Full response: {result}")
                return {
                    "success": False,
                    "error": error_msg
                }
        except requests.exceptions.HTTPError as e:
            error_msg = f"HTTP {e.response.status_code}: {e.response.text[:200]}"
            print(f"[PhonePe] HTTP Error: {error_msg}")
            return {
                "success": False,
                "error": error_msg
            }
        except requests.exceptions.RequestException as e:
            error_msg = f"API request failed: {str(e)}"
            print(f"[PhonePe] Request Exception: {error_msg}")
            return {
                "success": False,
                "error": error_msg
            }
    
    def check_payment_status(self, merchant_order_id):
        access_token = self.get_access_token()
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/json"
        }
        
        try:
            response = requests.get(
                f"{self.api_url}/checkout/v2/order/{merchant_order_id}/status",
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

phonepe_client = PhonePePayment()

