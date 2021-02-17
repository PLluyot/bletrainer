import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tarjeta',
  templateUrl: './tarjeta.component.html',
  styleUrls: ['./tarjeta.component.scss'],
})
export class TarjetaComponent implements OnInit {
  @Input('textup') textup : string;
  @Input('textdown') textdown : string;
  @Input('url') url : string;
  @Input('value') value : string;
  @Input('valueIndication') valueIndication : string;

  constructor() { 
   
  }

  ngOnInit() {}

}
