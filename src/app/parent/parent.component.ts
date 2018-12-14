import { Component, OnInit } from '@angular/core';
import { SimpleService } from '../simple.service';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css'],
  providers: [SimpleService]
})
export class ParentComponent implements OnInit {

  constructor(private simpleService: SimpleService) { }

  ngOnInit() {
  }

}
