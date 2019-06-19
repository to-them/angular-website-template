export class Email {
  constructor(
    public SenderName: string,
    public SenderEmail: string,
    public SenderPhone: string,
    public SenderMessage: string,
    public SenderSubscribe: boolean,
    public emailsubject: string, //set this once 
    public recipientemail: string, //set this once
    public recipientname: string //set this once
  ) { }
}
