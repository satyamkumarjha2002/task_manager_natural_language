AI Meeting Minutes to Task Converter
Objective:
Build an AI-powered transcript parser section in the same web app.
Allow users to paste an entire meeting transcript like:
“Aman you take the landing page by 10pm tomorrow. Rajeev you take care of client follow-up by Wednesday. Shreya please review the marketing deck tonight.”

Functionality Requirements:
Auto-extract all tasks with:
Task Description
Assignee
Deadline
Default priority P3 unless specified
Display all tasks in the same task board/list UI.
Example Output:
Task	Assigned To	Due Date/Time	Priority
Take the landing page	Aman	10:00 PM, Tomorrow	P3
Client follow-up	Rajeev	Wednesday	P3
Review the marketing deck	Shreya	Tonight	P3


backend 

Authentication - firebase auth
Databse - firestore databse

Fireabse deails

{
    "project_info": {
      "project_number": "306645366653",
      "project_id": "noteskeeping-30144",
      "storage_bucket": "noteskeeping-30144.firebasestorage.app"
    },
    "client": [
      {
        "client_info": {
          "mobilesdk_app_id": "1:306645366653:android:1ba75d8749f4142a2ffe14",
          "android_client_info": {
            "package_name": "com.yourcompany.noteskeeping"
          }
        },
        "oauth_client": [],
        "api_key": [
          {
            "current_key": "AIzaSyDBrruLHVVpao5uIeZYmDXkTKgcusGigv8"
          }
        ],
        "services": {
          "appinvite_service": {
            "other_platform_oauth_client": []
          }
        }
      }
    ],
    "configuration_version": "1"
  }