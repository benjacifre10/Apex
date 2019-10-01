import { Injectable } from '@angular/core';

// add imports
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

const ApiRoutes = {
  question: 'question'
};

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private env = environment;

  constructor(
    private http: HttpClient
  ) { }

  public getQuestions() {
    const uri = `${this.env.api_url}/${ApiRoutes.question}`;
    return this.http.get<Array<any>>(uri);
  }
}
