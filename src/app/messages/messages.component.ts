import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  @Input() buttonName: string = '';
  constructor(public messageService: MessageService) {}

  ngOnInit(): void {}
}
