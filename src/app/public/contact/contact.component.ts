import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Email } from '../../models/email';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  baseUrl = 'https://domainname.com/api/';
  domainName = 'domainname.com';
  recipientPhone = '744-222-3344';  //For SMS notification to registered phone number

  //Email settings
  emailSubject = 'Message from ' + this.domainName;
  recipientEmail = 'admin@domainname.com,admin2@domainname.com';
  recipientName = 'Company Name'; //NB: This will not be displayed cos i have not set the field in the api method.
  emailPattern = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';

  emailModel = new Email('', '', '', '', false, this.emailSubject, this.recipientEmail, this.recipientName);
  submitted = false;
  errorMsg = '';
  successMsg = '';

  constructor(private _http: HttpClient, private _router: Router) { }

  //Send Email
  emailSubmit() {
    //Send form if email and name are valid
    if (!this.emailPattern.match(this.emailModel.SenderEmail) && this.emailModel.SenderName != '') {
      this.submitted = true;
      if (this.emailModel.SenderSubscribe) {
        this.emailModel.SenderMessage += ' [Sender Requested Promotional Offers!]';
      }

      console.log(this.emailModel);
      //`https://localhost:12345/api/email/`
      this._http.post(this.baseUrl + 'email/',
        {
          sender_email: this.emailModel.SenderEmail,
          sender_name: this.emailModel.SenderName,
          sender_phone: this.emailModel.SenderPhone,
          sender_message: this.emailModel.SenderMessage,
          email_subject: this.emailModel.emailsubject,
          recipient_email: this.emailModel.recipientemail,
          recipient_name: this.emailModel.recipientname
        }).subscribe(
          response => console.log('Success!', response),
          error => this.errorMsg = error.statusText
        )

      if (this.errorMsg == '' || this.submitted) {
        this.sendSMS();
        this.successMsg = 'Message sent successfully. Thanks you.';
        this.emailModel = new Email('', '', '', '', false, this.emailSubject, this.recipientEmail, this.recipientName);
      }

    } //
    else {
      this.errorMsg = 'We are unable to send your inquiry! Please complete all required fields correctly and try again.';
    }

    //setTimeout(() => {
    //  this._router.navigate(['']);
    //}, 5000);

  }

  ngOnInit() {
    //this.submitted = false;
  }

  //Send SMS Notification
  sendSMS() {
    this._http.post(this.baseUrl + 'sms/',
      {
        textMessage: 'You got email message at ' + this.domainName + ' website. Check: ' + this.recipientEmail,
        toPhoneNum: this.recipientPhone
      }).subscribe(
        response => console.log('Success!', response),
        error => this.errorMsg = error.statusText
      )
  }

}
