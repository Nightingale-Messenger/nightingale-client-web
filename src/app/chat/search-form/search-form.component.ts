import { Component} from '@angular/core';
import {ChatControlService} from '../chat-control.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import Timeout = NodeJS.Timeout;

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent {
  public form: FormGroup;
  // @ts-ignore
  private searchTimeout: Timeout;
  private searchTimeoutMs = 400;

  constructor(private chatCtrl: ChatControlService) {
    this.form = new FormGroup({
      search: new FormControl('', Validators.required)
    });
  }

  public Submit(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(this.search.bind(this), this.searchTimeoutMs);
  }

  private search(): void {
    this.chatCtrl.Search(this.form.value.search.trim());
  }
}
