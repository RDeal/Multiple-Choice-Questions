import { Component, HostListener, ViewChild, OnInit, ElementRef } from '@angular/core';
import data from './data/ausbilderschein.json';
import { Question } from './models/question.model';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  questions: Question[] = <Question[]> data;
  currentIndex: number = 0;
  currentQuestion: Question;
  checkedBoxes: Array<string> = [];
  answerString: string = "";
  answerStringColor: string = "green";
  searchString: string = "";
  controlsDisabled: boolean = false;

  @ViewChild('prevButton') prevButton: ElementRef;
  @ViewChild('nextButton') nextButton: ElementRef;

  constructor() {
    this.shuffleQuestions();
    this.currentQuestion = this.questions[this.currentIndex];
  }

  ngOnInit() {
    this.prevButton.nativeElement.setAttribute("disabled", "true");
  }

  @HostListener('document:keydown', ['$event'])
  private handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.controlsDisabled) return;
    let optionId = null;
    switch (event.keyCode) {
      case 13: { // Enter
        this.showAnswers();
        break;
      }
      case 37: { // Arrow Key Left
        this.prev();
        break;
      }
      case 39: { // Arrow Key Right
        this.next();
        break;
      }
      case 49: { // 1
        optionId = "a";
        break;
      }
      case 50: { // 2
        optionId = "b";
        break;
      }
      case 51: { // 3
        optionId = "c";
        break;
      }
      case 52: { // 4
        optionId = "d";
        break;
      }
      case 53: { // 5
        optionId = "e";
        break;
      }
      default: {
        break;
      }
    }
    if (optionId == null || !this.optionExist(optionId)) return;
    this.checkHtmlElement(optionId);
    this.check(optionId);
  }

  private optionExist(optionId: string): boolean {
    return this.currentQuestion.o.filter(option => option.id == optionId).length > 0;
  }

  private checkHtmlElement(optionId: string): void {
    var myElement = document.querySelector('#option' + optionId);
    if (this.checkedBoxes.indexOf(optionId) > -1) {
      myElement.removeAttribute("checked");
    } else {
      myElement.setAttribute("checked", "true");
    }
  }

  private check(optionId: string): void {
    if (this.checkedBoxes.indexOf(optionId) > -1) {
      this.checkedBoxes = this.checkedBoxes.filter(o => o != optionId);
    } else {
      this.checkedBoxes.push(optionId);
    }
  }

  private showAnswers(): void {
    this.answerStringColor = "green";
    if (!this.currentQuestion.textonly) {
      var missing = this.currentQuestion.c.filter(c => this.checkedBoxes.indexOf(c) < 0);
      var wrong = this.checkedBoxes.filter(c => this.currentQuestion.c.indexOf(c) < 0);

      if (wrong.length === 0 && missing.length === 0) {
        this.answerString = "Alles Richtig! ";
      }
      else {
        this.answerStringColor = "red";
        var mstring = "Es fehl"
          + (missing.length == 1 ? "t " : "en ")
          + missing.toString();

        var wstring = wrong.toString() + " " + (wrong.length == 1 ? "stimmt" : "stimmen");

        this.answerString = "Falsch! " +
          (missing.length != 0 ?
            mstring + (wrong.length != 0 ? " und " : "")
            : "") +
          (wrong.length == 0 ? "! " : wstring + " nicht! ");
      }
    }
    this.answerString += this.currentQuestion.a;
  }

  private prev(): void {
    if (this.currentIndex == 0) return;
    if (this.nextButton.nativeElement.hasAttribute('disabled')) {
      this.nextButton.nativeElement.removeAttribute('disabled');
    }
    if (this.currentIndex == 1) {
      this.prevButton.nativeElement.setAttribute('disabled', 'true');
    }
    this.currentQuestion = this.questions[--this.currentIndex];
    this.clear();
  }

  private next(): void {
    if (this.currentIndex >= this.questions.length - 1) return;
    if (this.prevButton.nativeElement.hasAttribute('disabled')) {
      this.prevButton.nativeElement.removeAttribute('disabled');
    }
    if (this.currentIndex >= this.questions.length - 2) {
      this.nextButton.nativeElement.setAttribute("disabled", "true");
    }
    this.currentQuestion = this.questions[++this.currentIndex];
    this.clear();
  }

  private clear(): void {
    this.answerString = "";
    this.checkedBoxes = [];
  }

  private shuffleQuestions(): void {
    var currentIndex = this.questions.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = this.questions[currentIndex];
      this.questions[currentIndex] = this.questions[randomIndex];
      this.questions[randomIndex] = temporaryValue;
    }
  }

  private search(): void {
    this.prevButton.nativeElement.setAttribute("disabled", "true");
    this.questions = <Question[]> data;
    this.questions = this.questions.filter(question => (question.id == this.searchString || question.q.toLowerCase().includes(this.searchString.toLowerCase())));
    if (this.questions.length == 1) {
      this.nextButton.nativeElement.setAttribute("disabled", "true");
    } else {
      if (this.nextButton.nativeElement.hasAttribute('disabled')) {
        this.nextButton.nativeElement.removeAttribute('disabled');
      }
    }
    if (this.questions.length > 0) {
      this.currentIndex = 0
      this.currentQuestion = this.questions[this.currentIndex];
    }
    this.clear();
  }

  private clearSearch(): void {
    this.searchString = "";
  }
}
