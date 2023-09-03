Admission
http://localhost:8000/api/v1/admission?\_id=64e47d85cc73eac1d1016f1f
http://localhost:8000/api/v1/admission (post and get all)

Student
http://localhost:8000/api/v1/student (post and get all)
http://localhost:8000/api/v1/student?\_id=64e6307353f048bcf4fa4cb9 (update get) using any field like studentId=20231

Mail Send
http://localhost:8000/api/v1/email
{
"email" : "mdpulokhasan@gmail.com",
"subject": "Testing purpose",
"text": "My message",
"html": "<b>Demo<b>"
}
