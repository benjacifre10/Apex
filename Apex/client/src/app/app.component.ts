import { Component, OnInit } from '@angular/core';

// add imports
import { QuestionService } from './services/question.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public questions: Array<any> = [];
  public time: string;
  public show: boolean = false;

  constructor(
    private questionServ: QuestionService
  ) {}

  async ngOnInit() {
    try {
      const result: Array<any> = await this.questionServ.getQuestions().toPromise();
      const resultado: any = result;
      this.questions = resultado;
      this.time = this.questions.message.updated;
      this.show = true;
    } catch (error) {
      console.log('error', error);
      this.show = false;
    }
  }

}
