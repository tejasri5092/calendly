import { Component, Pipe, PipeTransform } from '@angular/core';


export class CalendarDay {
  public date: Date;
  public title: any;
  public isInputDate: boolean;
  public isToday1: any ;


  public getDateString() {
    return this.date.toISOString().split("T")[0]
  }

  constructor(d: Date) {
    this.date = d;
    this.isInputDate = false;
  }

}

@Pipe({
  name: 'chunk'
})
export class ChunkPipe implements PipeTransform {

  transform(calendarDaysArray: any, chunkSize: number): any {
    let calendarDays:any=[];
    let weekDays:any=[];

    calendarDaysArray.map((day:any,index:any) => {
        weekDays.push(day);
        if (++index % chunkSize  === 0) {
          calendarDays.push(weekDays);
          weekDays = [];
        }
    });
    return calendarDays;
  }
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'calendly';
  public calendar: CalendarDay[] = [];
  public timeSlots:any;

  public monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  public weekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  public displayMonth: any;
  public displayDate: any;

  private monthIndex: number = 0;

  ngOnInit(): void {
    this.generateCalendarDays(this.monthIndex);
    
  }

  private generateCalendarDays(monthIndex: number): void {
    // we reset our calendar
    this.calendar = [];
    // we set the date 
    let day: Date = new Date(new Date().setMonth(new Date().getMonth() + monthIndex));
    let day1:Date=new Date();
   //this.displayDate=day1.getDay()+' '+this.monthNames[day1.getMonth()+1]+' '+day1.getDate()

    // set the dispaly month for UI
    this.displayMonth = this.monthNames[day.getMonth()+1];

    let startingDateOfCalendar = this.getStartDateForCalendar(day);

    let dateToAdd = startingDateOfCalendar;

    for (var i = 0; i < 42; i++) {
      this.calendar.push(new CalendarDay(new Date(dateToAdd)));
      dateToAdd = new Date(dateToAdd.setDate(dateToAdd.getDate() + 1));
    }
    let response={
      "slots": [
      {
      "date": "06-April-2021",
      "timeSlots": ["09:00", "09:30", "10:00", "18:00", "19:00"]
      },
      {
      "date": "07-April-2021",
      "timeSlots": ["10:00", "11:30", "17:00", "18:00", "19:00"]
      },
      {
      "date": "10-May-2021",
      "timeSlots": ["08:00", "08:30", "10:00", "18: 00", "20:00"]
      },
      {
      "date": "20-May-2021",
      "timeSlots": ["10:15", "10:30", "17:15", "18:30", "19:45"]
      },
      {
      "date": "15-May-2021",
      "timeSlots": ["07:10", "08:30", "12:00", "14:00", "15:00"]
      },
      {
      "date": "06-June-2021",
      "timeSlots": ["11:15", "11:30", "13:30", "18:45", "15:00"]
      },
      {
      "date": "16-June-2021",
      "timeSlots": ["09:00", "09:30", "10:00", "18:00", "19:00"]
      },
      {
      "date": "19-June-2021",
      "timeSlots": ["10:15", "10:30", "17:15", "18: 30", "19:45"]
      },
      {
      "date": "26-June-2021",
      "timeSlots": ["06:00", "06:45", "09:15", "12:45", "05:45"]
      },
      {
      "date": "01-July-2021",
      "timeSlots": ["07:20", "08:30", "12:15", "14:45", "15:30"]
      },
      {
      "date": "06-July-2021",
      "timeSlots": ["11:20", "11:50", "13:30", "18:00", "16:30"]
      },
      {
      "date": "30-July-2021",
      "timeSlots": ["10:00", "11:30", "17:00", "18:00", "19:00"]
      }
      ]
      }
      console.log(response.slots.length);
      let impDays:any=[];
      let impTime:any=[];

       for(var i=0;i<response.slots.length-1;i++){

        let mydate = response.slots[i]['date'].split('-');
        const date1 = new Date( mydate[1]+" "+ mydate[0]+" "+ mydate[2]);
        this.displayMonth = this.monthNames[day.getMonth()+1];
        if(day.getMonth()+1==date1.getMonth()){
         impDays.push(date1);
         impTime.push(response.slots[i]['timeSlots']);
        }
       }
       for(var j=0;j<impDays.length;j++){
       for (var i = 0; i < 42; i++) {
         console.log(this.calendar[i]['date']);
       if(this.calendar[i]['date'].setHours(0, 0, 0, 0) == impDays[j].setHours(0, 0, 0, 0)){
        this.calendar[i]['isInputDate']=true;
        this.calendar[i]['isToday1']=impTime[j];
        }
      }
    }
  }

  private getStartDateForCalendar(selectedDate: Date){

    // for the day we selected let's get the previous month last day
    let lastDayOfPreviousMonth = new Date(selectedDate.setDate(0));


    // start by setting the starting date of the calendar same as the last day of previous month
    let startingDateOfCalendar: Date = lastDayOfPreviousMonth;

    // but since we actually want to find the last Monday of previous month
    // we will start going back in days intil we encounter our last Monday of previous month
    if (startingDateOfCalendar.getDay() != 1) {
      do {
        startingDateOfCalendar = new Date(startingDateOfCalendar.setDate(startingDateOfCalendar.getDate() - 1));
      } while (startingDateOfCalendar.getDay() != 1);
    }
    return startingDateOfCalendar;

  }

   public increaseMonth() {
    this.monthIndex++;
    this.generateCalendarDays(this.monthIndex);
  }

  public decreaseMonth() {
    this.monthIndex--
    this.generateCalendarDays(this.monthIndex);
  }

  public setCurrentMonth() {
    this.monthIndex = 0;
    this.generateCalendarDays(this.monthIndex);
  }
  public cons(c:any) {
    this.displayDate=this.weekDays[c.date.getDay()]+', '+this.monthNames[c.date.getMonth()]+' '+c.date.getDate()
    this.timeSlots=c.isToday1
  }
  public cons1(row:any) {
    alert("Selected slot "+this.displayDate+ " at "+row)
  }
}


