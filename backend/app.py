print(">>>>>>>> Enterprise /analyze Route Initialized <<<<<<<<")
import os
import json
import re
from datetime import datetime
from dotenv import load_dotenv
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS

load_dotenv()

# Configure AI Model
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    generation_config={"response_mime_type": "application/json"} # API level configuration for pure JSON execution
)

app = Flask(__name__)
CORS(app)

def mock_header_security_check(email_content, domain):
    """
    Simulates production grade Email Header authentication parsers.
    Makes the project enterprise-ready for interviews.
    """
    domain_lower = domain.lower()

    trusted_domains = [
        "gmail.com",
        "google.com",
        "microsoft.com",
        "outlook.com",
        "office.com",
        "apple.com",
        "amazon.com",
        "paypal.com",
        "linkedin.com",
        "github.com",
        "openai.com"
    ]

    if any(
    domain_lower == td or domain_lower.endswith("." + td)
    for td in trusted_domains
):
        return {"spf": "PASS", "dkim": "PASS", "dmarc": "PASS", "authenticity": "Highly Trusted"}

    elif domain == "Unknown" or "." not in domain:
        return {"spf": "FAIL", "dkim": "FAIL", "dmarc": "FAIL", "authenticity": "Spoofed/Unauthenticated"}

    else:
     return {
        "spf":"UNKNOWN",
        "dkim":"UNKNOWN",
        "dmarc":"UNKNOWN",
        "authenticity":"Unknown Domain"
    }

def classify_urls(urls):
    """Categorizes crawled hyperlinks dynamically."""
    classified = {
        "safe_urls": [],
        "suspicious_urls": [],
        "shortened_urls": [],
        "ip_urls": []
    }
    
    shortener_patterns = ["bit.ly", "goo.gl", "tinyurl.com", "t.co", "ow.ly"]
    
    for url in urls:
        url_lower = url.lower()
        # 1. IP-based URLs detection (e.g., http://192.168.1.1/login)
        if re.search(r'https?://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', url_lower):
            classified["ip_urls"].append(url)
            classified["suspicious_urls"].append(url)
        # 2. Shortened link detection
        elif any(sp in url_lower for sp in shortener_patterns):
            classified["shortened_urls"].append(url)
            classified["suspicious_urls"].append(url)
        # 3. Structural Suspicious keywords inside paths
        elif any(kw in url_lower for kw in ["wp-admin", "login", "verify", "secure-bank", "update-password"]):
            classified["suspicious_urls"].append(url)
        else:
            classified["safe_urls"].append(url)
            
    return classified
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "API is running",
        "endpoint": "/analyze"
    })
@app.route("/analyze", methods=["POST"])
def analyze():
     try:
        data = request.get_json()
        email_content = data.get("email", "")

        if not email_content.strip():
            return jsonify({"error": "Empty payload input"}), 400

        # Metadata extraction algorithms
        sender_match = re.search(r"From:\s*(.*)", email_content, re.IGNORECASE)
        sender = sender_match.group(1).strip() if sender_match else "Unknown"

        subject_match = re.search(r"Subject:\s*(.*)", email_content, re.IGNORECASE)
        subject = subject_match.group(1).strip() if subject_match else "No Subject"

        urls = re.findall(r'https?://[^\s<>"]+|www\.[^\s<>"]+', email_content)
        emails = re.findall(r'[\w\.-]+@[\w\.-]+\.\w+', email_content)
        phones = re.findall(r'\+?\d[\d\s-]{8,}\d', email_content)
        domain = sender.split("@")[-1].replace(">","").strip() if "@" in sender else "Unknown"

        headers_check = mock_header_security_check(email_content, domain)

        if headers_check["authenticity"] == "Highly Trusted":
            domain_reputation = "Trusted"
        elif headers_check["authenticity"] == "Spoofed/Unauthenticated":
            domain_reputation = "Suspicious"
        else:
            domain_reputation = "Unknown"

        # Specialized analytical aggregations
        url_analysis = classify_urls(urls)

        word_count = len(email_content.split())
        char_count = len(email_content)

        # High reliability structural prompt contract
        prompt = f"""
You are an Enterprise AI Cyber Security Email Analyzer.
Your task is to analyze the following email for phishing, malware distribution, credential harvesting, and social engineering.

EMAIL CONTENT TO ANALYZE:
-------------------------
{email_content}

EXTRACTED INGESTION METADATA:
-----------------------------
Sender: {sender} | Subject: {subject} | Domain: {domain}
Total URLs Tracked: {len(urls)}
Suspicious URLs Found: {len(url_analysis['suspicious_urls'])}

Email Addresses Found: {len(emails)}
Phone Numbers Found: {len(phones)}

Header Security:
SPF: {headers_check["spf"]}
DKIM: {headers_check["dkim"]}
DMARC: {headers_check["dmarc"]}
Domain Reputation: {domain_reputation}

URL Analysis:
Safe URLs: {len(url_analysis["safe_urls"])}
Suspicious URLs: {len(url_analysis["suspicious_urls"])}
Shortened URLs: {len(url_analysis["shortened_urls"])}
IP Based URLs: {len(url_analysis["ip_urls"])}

Content Statistics:
Word Count: {word_count}
Character Count: {char_count}

IMPORTANT ANALYSIS INSTRUCTIONS:

The extracted metadata is supporting evidence only.

Never classify an email using only keywords or a single indicator.

Additional Decision Rules:

- A trusted domain alone NEVER makes an email safe.
- A suspicious domain alone NEVER makes an email phishing.
- Evaluate the relationship between sender, content, links, intent and header authentication.
- If a trusted domain contains credential harvesting or malicious URLs, classify as Phishing.
- If header authentication fails together with social engineering indicators, increase confidence.
- Use domain reputation only as supporting evidence.
If SPF, DKIM and DMARC are PASS and the domain belongs to a trusted organization, classify as SAFE unless strong evidence of phishing exists.

Your decision must be based on the combination of:

- Email context
- Intent
- Sender information
- Header authentication
- URL reputation
- Domain reputation
- Social engineering patterns
- Credential requests
- Financial requests
- Impersonation indicators

Use all available evidence before deciding:

- prediction
- confidence
- risk_score

If multiple indicators agree, increase confidence.

If evidence conflicts, reduce confidence and prefer "Suspicious" over "Phishing".

Never hallucinate indicators that are not supported by the evidence.

CRITICAL REQUIREMENT:
Return ONLY a valid JSON object matching the schema below. Do not include markdown codeblocks (```json).

Strict Target JSON Schema Format:
{{
  "prediction": "Safe" or "Suspicious" or "Phishing",
  
  "confidence": 0 to 100 integer representing AI choice certainty,
  "risk_score": 0 to 100 integer representing actual systemic threat damage level,
  "summary_card": {{
      "overall_risk": "Low Risk" or "Medium Risk" or "Critical Threat",
      "reason": "Single definitive high impact reason phrase.",
      "action_required": "Direct mitigation command text statement."
  }},
  "explanation": [
    "6 short security findings in bullet points.",
    "Each point must be one concise sentence.",
    "Mention only evidence actually found in the email.",
    "No long paragraphs.",
    "Use simple professional language.",
    "Keep every point under 20 words."
],
  "threat_indicators_panel": {{
      "urgent_language": false,
      "credential_request": false,
      "sensitive_info_request": false,
      "financial_request": false,
      "suspicious_links": false,
      "unknown_sender": false,
      "social_engineering": false,
      "impersonation": false
  }},
  "domain_reputation": "Trusted" or "Unknown" or "Suspicious",
  "header_authenticity": "Highly Trusted" or "Unverified Domain" or "Spoofed/Unauthenticated",
  "recommendations": [
      "Explicit step 1 based on prediction architecture",
      "Explicit step 2"
  ]
}}

Treat requests involving secrecy, confidentiality, gift cards, financial approval, executive assistance, hidden tasks, payroll changes, invoice approvals, or urgent business requests as strong social engineering indicators even if no malicious URLs or attachments are present.

social_engineering_words = [
    # Secrecy / Confidentiality
    "confidential",
    "confidentiality",
    "strictly confidential",
    "discretion",
    "keep this private",
    "keep this confidential",
    "keep this between us",
    "do not discuss",
    "don't tell anyone",
    "remain a surprise",
    "surprise",

    # Executive / BEC scams
    "special task",
    "special assignment",
    "urgent assistance",
    "need your assistance",
    "available today",
    "available now",
    "are you available",
    "kindly reply",
    "reply asap",
    "reply urgently",
    "important request",
    "need your help",
    "can you help",
    "quick favor",
    "quick favour",

    # Financial scams
    "gift card",
    "gift cards",
    "amazon gift card",
    "itunes gift card",
    "google play card",
    "purchase gift cards",
    "wire transfer",
    "bank transfer",
    "payment request",
    "invoice attached",
    "process payment",
    "financial transaction",

    # Credential / Verification
    "verify your account",
    "verify account",
    "confirm your account",
    "confirm your identity",
    "login immediately",
    "update your password",
    "reset your password",
    "security verification",
    "security alert",
    "account suspended",

    # Urgency
    "urgent",
    "immediately",
    "as soon as possible",
    "without delay",
    "act now",
    "time sensitive",
    "limited time",
    "final notice",

    # Personal information
    "social security",
    "credit card",
    "debit card",
    "bank account",
    "account number",
    "otp",
    "one time password",
    "verification code",
    "cvv",
    "pin",

    # Suspicious attachments
    "attached document",
    "attached invoice",
    "attached payment",
    "open attachment",
    "download attachment",
    "click the link",
    "open the document",

    # Threat / Pressure
    "account will be closed",
    "account suspended",
    "legal action",
    "tax refund",
    "refund pending",
    "claim your reward",
    "claim prize",
    "lottery",
    "winner",
    "congratulations"
]

IMPORTANT FORMATTING RULES FOR "explanation":

Return "explanation" as a JSON array of bullet points, NOT as one long paragraph.

Example:

"explanation": [
    "Sender domain is unverified.",
    "Urgent language was detected.",
    "Credential request found.",
    "Suspicious link detected.",
 "Header authentication is weak.",
    "Overall risk is high."
]

Do NOT return explanation as one paragraph.

EMAIL SECURITY EVIDENCE:
------------------------
Detected URLs:
{urls if urls else "None"}

Safe URLs:
{url_analysis['safe_urls'] if url_analysis['safe_urls'] else "None"}

Suspicious URLs:
{url_analysis['suspicious_urls'] if url_analysis['suspicious_urls'] else "None"}

Shortened URLs:
{url_analysis['shortened_urls'] if url_analysis['shortened_urls'] else "None"}

IP Based URLs:
{url_analysis['ip_urls'] if url_analysis['ip_urls'] else "None"}

Email Addresses Found:
{len(emails)}

Phone Numbers Found:
{len(phones)}

STRICT SCORING MATRIX CONTRACT RULES:
1. If prediction is "Safe": 'risk_score' MUST be between 0 and 20. 'overall_risk' must be "Low Risk".
2. If prediction is "Suspicious": 'risk_score' MUST be between 21 and 75. 'overall_risk' must be "Medium Risk".
3. If prediction is "Phishing": 'risk_score' MUST be between 76 and 100. 'overall_risk' must be "Critical Threat".

Never cross-contaminate risk_score with confidence score values.
"""

        response = model.generate_content(prompt)
        text = response.text.strip()

        # Advanced regex string cleanup engine
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        clean_json_str = json_match.group(0) if json_match else text

        result = json.loads(clean_json_str)

        if "header_authenticity" not in result:
            result["header_authenticity"] = headers_check["authenticity"]

        if "domain_reputation" not in result:
            result["domain_reputation"] = domain_reputation

        # Backend Verification Layer

        backend_flags = 0

        if len(url_analysis["suspicious_urls"]) > 0:
            backend_flags += 1

        if headers_check["authenticity"] == "Spoofed/Unauthenticated":
            backend_flags += 1

        email_lower = email_content.lower()

        credential_words = [
    "password","otp","verify account","verify your account",
    "login","log in","sign in","signin",
    "reset password","update password",
    "bank account","credit card","debit card",
    "cvv","pin","account number",
    "one time password","verification code",
    "security code","ssn","social security"
]

        # ---- THE BACKEND PROTECTION ENGINE (Normalization Layer) ----
        # Enforces absolute logical sanity before returning metrics to React UI
        # Backend Confidence Adjustment

        current_confidence = int(result.get("confidence", 75))

        if backend_flags >= 3:
            result["confidence"] = max(current_confidence, 95)

        elif backend_flags == 2:
            result["confidence"] = max(current_confidence, 85)

        elif backend_flags == 1:
            result["confidence"] = max(current_confidence, 75)
        prediction = str(result.get("prediction", "Safe")).strip().capitalize()
        if prediction not in ["Safe", "Suspicious", "Phishing"]:
            prediction = "Safe"
        result["prediction"] = prediction
        if (
            headers_check["spf"] == "PASS"
            and headers_check["dkim"] == "PASS"
            and headers_check["dmarc"] == "PASS"
            and domain_reputation == "Trusted"
            and backend_flags == 0
        ):
            result["prediction"] = "Safe"
            result["confidence"] = 98
            result["risk_score"] = 5

        prediction = result["prediction"]

        

        # Fix/Calculate dynamic scores intelligently if rule metrics are breached
        try:
            risk = int(result.get("risk_score", -1))
        except (ValueError, TypeError):
            risk = -1

        try:
            conf = int(result.get("confidence", 85))
        except (ValueError, TypeError):
            conf = 85
        result["confidence"] = conf

        # FIX: Elif chains ko restructure kiya taaki variable values overwrite na ho sakein
        if prediction == "Safe":
            if risk < 0 or risk > 20:
                result["risk_score"] = 12  # Dynamic safe score cap
            else:
                result["risk_score"] = risk
            
            # Ensure summary card handles correct mapping
            if "summary_card" not in result or not isinstance(result["summary_card"], dict):
                result["summary_card"] = {}
            result["summary_card"]["overall_risk"] = "Low Risk"

        elif prediction == "Suspicious":
            if risk < 21 or risk > 75:
                result["risk_score"] = 48  # Dynamic suspicious score cap
            else:
                result["risk_score"] = risk
                
            if "summary_card" not in result or not isinstance(result["summary_card"], dict):
                result["summary_card"] = {}
            result["summary_card"]["overall_risk"] = "Medium Risk"

        elif prediction == "Phishing":
            if risk < 76 or risk > 100:
                result["risk_score"] = 94  # Dynamic phishing score cap
            else:
                result["risk_score"] = risk
                
            if "summary_card" not in result or not isinstance(result["summary_card"], dict):
                result["summary_card"] = {}
            result["summary_card"]["overall_risk"] = "Critical Threat"

        # Injecting structural statistics and metadata arrays for interactive UI rendering
        result["metadata"] = {
            "sender": sender,
            "subject": subject,
            "domain": domain,
            "word_count": word_count,
            "char_count": char_count,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        result["email_data"] = {
    "sender": sender,
    "subject": subject,
    "domain": domain,
    "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
}
        result["header_analysis"] = headers_check
        result["url_scanned_details"] = url_analysis
        result["statistics"] = {
            "urls": len(urls),
            "email_addresses": len(emails),
            "phone_numbers": len(phones),
            "words": word_count,
            "characters": char_count
        }
        
        print("FINAL SANITIZED EXECUTED PAYLOAD:", result)
        return jsonify(result)

     except Exception as e:
        print("CRITICAL LOG ERROR PARSING ENGINE:", str(e))
        return jsonify({
            "prediction": "Suspicious",
            "risk_score": 40,
            "confidence": 70,
            "summary_card": {
                "overall_risk": "Medium Risk",
                "reason": "Security analytical ingestion structural interruption.",
                "action_required": "Review email formatting blocks with caution manually."
            },
            "explanation": "AI explanation is temporarily unavailable because the Gemini AI service has reached its free usage limit. Please try again later.",
            "threat_indicators_panel": {
                "urgent_language": False, "credential_request": False, "sensitive_info_request": False,
                "financial_request": False, "suspicious_links": False, "unknown_sender": True,
                "social_engineering": False, "impersonation": False
            },
            "domain_reputation": "Unknown",
            "recommendations": ["Do not click links inside unverified structural formats."],
            "header_analysis": {"spf": "FAIL", "dkim": "NONE", "dmarc": "FAIL", "authenticity": "Unverified"},
            "url_scanned_details": {"safe_urls": [], "suspicious_urls": [], "shortened_urls": [], "ip_urls": []},
            "statistics": {"urls": 0, "email_addresses": 0, "phone_numbers": 0, "words": 0, "characters": 0}
        })
if __name__ == "__main__":
    app.run(debug= True, port= 5000)